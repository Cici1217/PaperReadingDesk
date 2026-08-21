"""Fast PDF text ordering with an OCR fallback only for image-only files.

The normal path invokes Poppler once and orders its existing text blocks.  OCR
is deliberately outside that path so searchable PDFs do not become slower.
"""

from __future__ import annotations

import math
import re
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path


LAYOUT_MODES = frozenset({"auto", "single", "double"})
_INVALID_XML_CHARACTERS = re.compile(
    r"[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\U00010000-\U0010FFFF]"
)


@dataclass(frozen=True)
class TextExtraction:
    text: str
    detected_layout: str
    source: str


def _join_words(words: list[str]) -> str:
    value = " ".join(word.strip() for word in words if word.strip())
    value = re.sub(r"\s+([,.;:!?%)\]])", r"\1", value)
    value = re.sub(r"([([])\s+", r"\1", value)
    return value.strip()


def _block_text(block: ET.Element) -> str:
    lines: list[str] = []
    for line in block.findall("./{*}line"):
        value = _join_words([word.text or "" for word in line.findall("./{*}word")])
        if value:
            lines.append(value)
    result = ""
    for line in lines:
        if result.endswith("-") and line[:1].islower():
            result = result[:-1] + line
        else:
            result = f"{result} {line}".strip()
    return result


def _number(element: ET.Element, name: str) -> float:
    try:
        return float(element.attrib.get(name, "0"))
    except ValueError:
        return 0.0


def _page_blocks(page: ET.Element) -> tuple[float, float, list[dict[str, object]]]:
    width, height = _number(page, "width"), _number(page, "height")
    blocks: list[dict[str, object]] = []
    for block in page.findall(".//{*}block"):
        text = _block_text(block)
        if len(text) < 2:
            continue
        blocks.append({
            "text": text,
            "x0": _number(block, "xMin"), "x1": _number(block, "xMax"),
            "y0": _number(block, "yMin"), "y1": _number(block, "yMax"),
        })
    return width, height, blocks


def _is_double_column(width: float, height: float, blocks: list[dict[str, object]]) -> bool:
    if width <= 0 or height <= 0:
        return False
    candidates = [
        block for block in blocks
        if float(block["x1"]) - float(block["x0"]) < width * 0.62
        and len(str(block["text"])) >= 12
    ]
    left = [block for block in candidates if (float(block["x0"]) + float(block["x1"])) / 2 < width * 0.46]
    right = [block for block in candidates if (float(block["x0"]) + float(block["x1"])) / 2 > width * 0.54]
    if sum(len(str(block["text"])) for block in left) < 180 or sum(len(str(block["text"])) for block in right) < 180:
        return False
    left_range = (min(float(block["y0"]) for block in left), max(float(block["y1"]) for block in left))
    right_range = (min(float(block["y0"]) for block in right), max(float(block["y1"]) for block in right))
    overlap = min(left_range[1], right_range[1]) - max(left_range[0], right_range[0])
    return overlap >= height * 0.16


def _order_band(blocks: list[dict[str, object]], middle: float) -> list[dict[str, object]]:
    left = [block for block in blocks if (float(block["x0"]) + float(block["x1"])) / 2 < middle]
    right = [block for block in blocks if block not in left]
    key = lambda block: (float(block["y0"]), float(block["x0"]))
    return [*sorted(left, key=key), *sorted(right, key=key)]


def _order_blocks(width: float, height: float, blocks: list[dict[str, object]], mode: str) -> tuple[str, list[dict[str, object]]]:
    detected = "double" if _is_double_column(width, height, blocks) else "single"
    effective = detected if mode == "auto" else mode
    if effective == "single" or width <= 0:
        return detected, sorted(blocks, key=lambda block: (float(block["y0"]), float(block["x0"])))

    middle = width / 2
    spanning = sorted(
        [
            block for block in blocks
            if float(block["x1"]) - float(block["x0"]) >= width * 0.62
            or (float(block["x0"]) < middle - width * 0.18 and float(block["x1"]) > middle + width * 0.18)
        ],
        key=lambda block: (float(block["y0"]), float(block["x0"])),
    )
    column_blocks = [block for block in blocks if block not in spanning]
    ordered: list[dict[str, object]] = []
    cursor = -1.0
    for span in spanning:
        above = [block for block in column_blocks if cursor <= float(block["y0"]) < float(span["y0"])]
        ordered.extend(_order_band(above, middle))
        ordered.append(span)
        cursor = max(cursor, float(span["y1"]))
    ordered.extend(_order_band([block for block in column_blocks if float(block["y0"]) >= cursor], middle))
    # Overlapping blocks can fall outside a band; retain them once at the end
    # rather than silently losing source text.
    ordered_ids = {id(block) for block in ordered}
    ordered.extend(block for block in column_blocks if id(block) not in ordered_ids)
    return detected, ordered


def _remove_repeated_margins(pages: list[tuple[float, float, list[dict[str, object]]]]) -> None:
    if len(pages) < 3:
        return
    keys: Counter[str] = Counter()
    for _width, height, blocks in pages:
        seen: set[str] = set()
        for block in blocks:
            if float(block["y1"]) <= height * 0.08 or float(block["y0"]) >= height * 0.92:
                key = re.sub(r"\d+", "#", re.sub(r"\s+", " ", str(block["text"])).strip().casefold())
                if 2 <= len(key) <= 120:
                    seen.add(key)
        keys.update(seen)
    threshold = max(3, math.ceil(len(pages) * 0.55))
    repeated = {key for key, count in keys.items() if count >= threshold}
    if not repeated:
        return
    for _width, height, blocks in pages:
        blocks[:] = [
            block for block in blocks
            if not (
                (float(block["y1"]) <= height * 0.08 or float(block["y0"]) >= height * 0.92)
                and re.sub(r"\d+", "#", re.sub(r"\s+", " ", str(block["text"])).strip().casefold()) in repeated
            )
        ]


def _native_text(pdf_path: Path, mode: str) -> TextExtraction:
    result = subprocess.run(
        ["pdftotext", "-enc", "UTF-8", "-bbox-layout", str(pdf_path), "-"],
        capture_output=True, timeout=150, check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.decode("utf-8", "replace").strip() or "pdftotext failed")
    try:
        # Some embedded PDF fonts map unrecognized glyphs to C0 control
        # characters.  Poppler can emit those bytes verbatim inside a <word>,
        # but XML 1.0 rejects them (for example U+0013).  Discard only XML-
        # illegal code points before parsing; legible adjacent symbols and all
        # layout coordinates remain unchanged.
        xml_text = _INVALID_XML_CHARACTERS.sub(
            "", result.stdout.decode("utf-8", "replace")
        )
        root = ET.fromstring(xml_text)
    except ET.ParseError as error:
        raise RuntimeError(f"Could not parse PDF text layout: {error}") from error
    pages = [_page_blocks(page) for page in root.findall(".//{*}page")]
    _remove_repeated_margins(pages)
    output: list[str] = []
    detected_modes: list[str] = []
    for width, height, blocks in pages:
        detected, ordered = _order_blocks(width, height, blocks, mode)
        detected_modes.append(detected)
        output.append("\n\n".join(str(block["text"]) for block in ordered if str(block["text"]).strip()))
    # A few diagram-heavy pages can look columnar even in a single-column
    # paper. Require a meaningful share of pages before changing the whole
    # document's text path.
    double_threshold = max(1, math.ceil(len(detected_modes) * 0.35))
    detected_layout = "double" if detected_modes.count("double") >= double_threshold else "single"
    return TextExtraction("\f".join(output), detected_layout, "native")


def _plain_text(pdf_path: Path) -> TextExtraction:
    """The original Poppler path remains authoritative for single columns."""

    result = subprocess.run(
        ["pdftotext", "-enc", "UTF-8", str(pdf_path), "-"],
        capture_output=True, timeout=120, check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.decode("utf-8", "replace").strip() or "pdftotext failed")
    return TextExtraction(result.stdout.decode("utf-8", "replace"), "single", "native")


def _ocr_text(pdf_path: Path) -> TextExtraction:
    tesseract = shutil.which("tesseract")
    if not tesseract:
        raise RuntimeError("No extractable text found. This PDF appears scanned; install Tesseract OCR to enable the automatic OCR fallback.")
    with tempfile.TemporaryDirectory(prefix="paper-ocr-") as directory:
        prefix = Path(directory) / "page"
        render = subprocess.run(
            ["pdftoppm", "-r", "220", "-jpeg", "-jpegopt", "quality=82", str(pdf_path), str(prefix)],
            capture_output=True, text=True, timeout=600, check=False,
        )
        if render.returncode != 0:
            raise RuntimeError(render.stderr.strip() or "Could not render scanned PDF for OCR")
        images = sorted(Path(directory).glob("page-*.jpg"), key=lambda path: int(path.stem.rsplit("-", 1)[-1]))
        if not images:
            raise RuntimeError("Could not render scanned PDF for OCR")

        def recognize(image: Path) -> str:
            result = subprocess.run(
                [tesseract, str(image), "stdout", "-l", "eng", "--psm", "3"],
                capture_output=True, text=True, timeout=180, check=False,
            )
            if result.returncode != 0:
                raise RuntimeError(result.stderr.strip() or f"OCR failed for {image.name}")
            return result.stdout.strip()

        with ThreadPoolExecutor(max_workers=min(2, len(images))) as executor:
            pages = list(executor.map(recognize, images))
    return TextExtraction("\f".join(pages), "single", "ocr")


def extract_pdf_text(pdf_bytes: bytes, layout_mode: str = "auto") -> TextExtraction:
    mode = layout_mode if layout_mode in LAYOUT_MODES else "auto"
    # NamedTemporaryFile remains open for the lifetime of its context manager.
    # On Windows that prevents Poppler/Tesseract subprocesses from reopening it.
    # A temporary directory gives us deterministic cleanup while allowing the
    # PDF itself to be fully closed before any external process reads it.
    with tempfile.TemporaryDirectory(prefix="paper-pdf-") as directory:
        pdf_path = Path(directory) / "source.pdf"
        pdf_path.write_bytes(pdf_bytes)
        if mode == "single":
            native = _plain_text(pdf_path)
        else:
            native = _native_text(pdf_path, mode)
            if mode == "auto" and native.detected_layout == "single":
                native = _plain_text(pdf_path)
        if sum(character.isalpha() for character in native.text) >= 20:
            return native
        return _ocr_text(pdf_path)
