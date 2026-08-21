"""Normalize extracted paper content into the reader's semantic Paper IR.

This module deliberately knows nothing about HTTP or PDF extraction.  It is the
boundary between persisted extraction/model output and presentation code.
"""

from __future__ import annotations

import json
import re
from collections.abc import Callable, Iterable, Mapping
from typing import Any, TypedDict


class TextRun(TypedDict, total=False):
    type: str
    text: str
    latex: str


class PaperBlock(TypedDict, total=False):
    id: str
    type: str
    page: int
    sourceText: str
    translatedText: str
    sourceRuns: list[TextRun]
    translatedRuns: list[TextRun]
    figureRefs: list[str]
    equationRefs: list[str]


VISUAL_KIND_ALIASES: dict[str, tuple[str, ...]] = {
    "figure": ("figure", "fig"),
    "table": ("table", "tab", "tbl"),
    "algorithm": ("algorithm", "alg"),
    "listing": ("code listing", "listing"),
    "scheme": ("scheme",),
    "chart": ("chart",),
    "graph": ("graph",),
    "plate": ("plate",),
    "box": ("box",),
    "map": ("map",),
    "photo": ("photograph", "photo"),
    "image": ("image", "img"),
    "picture": ("picture", "pic"),
    "diagram": ("diagram",),
    "illustration": ("illustration", "illus"),
    "exhibit": ("exhibit",),
    "screenshot": ("screenshot",),
}
VISUAL_KIND_LABELS = {
    "figure": "Figure", "table": "Table", "algorithm": "Algorithm",
    "listing": "Listing", "scheme": "Scheme", "chart": "Chart",
    "graph": "Graph", "plate": "Plate", "box": "Box", "map": "Map",
    "photo": "Photo", "image": "Image", "picture": "Picture",
    "diagram": "Diagram", "illustration": "Illustration", "exhibit": "Exhibit",
    "screenshot": "Screenshot",
}
AMBIGUOUS_VISUAL_KINDS = frozenset({
    "chart", "graph", "box", "map", "photo", "image", "picture",
    "diagram", "illustration", "exhibit", "screenshot",
})
_ALIAS_TO_VISUAL_KIND = {
    alias.replace(".", "").lower(): kind
    for kind, aliases in VISUAL_KIND_ALIASES.items()
    for alias in aliases
}
_VISUAL_ALIAS_PATTERN = "|".join(
    re.escape(alias) for alias in sorted(_ALIAS_TO_VISUAL_KIND, key=len, reverse=True)
)
# A visual number must end at a token boundary. Without this guard,
# case-insensitive Roman numerals made ordinary prose such as "Figure can"
# and "table in" look like Figure C and Table I.
_VISUAL_NUMBER_PATTERN = r"(?:[A-Z]?\d+(?:\.\d+)*|[IVXLC]+)(?![A-Za-z0-9])"
_ASSET_LABEL_RE = re.compile(
    rf"^\s*(?P<label>{_VISUAL_ALIAS_PATTERN})(?:s)?\.?\s*"
    rf"(?P<number>{_VISUAL_NUMBER_PATTERN})(?P<subfigure>\s*\([a-z]\))?",
    re.IGNORECASE,
)
_VISUAL_REFERENCE_RE = re.compile(
    rf"\b(?P<label>{_VISUAL_ALIAS_PATTERN})(?:s)?\.?\s+"
    rf"(?P<refs>{_VISUAL_NUMBER_PATTERN}(?:\s*\([a-z]\))?"
    rf"(?:\s*(?:,|and|&|–|-|to)\s*(?:{_VISUAL_NUMBER_PATTERN}(?:\s*\([a-z]\))?|\([a-z]\)))*)",
    re.IGNORECASE,
)
_EQUATION_NUMBER_PATTERN = r"(?:[A-Z]\.?\s*)?\d+(?:\.\d+)*(?:[a-z])?|[A-Z]\d+(?:\.\d+)*"
_EQUATION_REFERENCE_RE = re.compile(
    rf"\b(?:Eq(?:uation)?s?\.?)\s*(?:\(|\[)?(?P<number>{_EQUATION_NUMBER_PATTERN})(?:\)|\])?",
    re.IGNORECASE,
)
_EXPLICIT_MATH_RE = re.compile(
    r"(?P<display>\$\$(?P<dollar_display>.+?)\$\$|\\\[(?P<bracket_display>.+?)\\\])"
    r"|(?P<inline>\$(?P<dollar_inline>[^$\n]+?)\$|\\\((?P<paren_inline>.+?)\\\))",
    re.DOTALL,
)
_LATEX_COMMAND_RE = re.compile(
    r"\\(?:mathcal|mathbb|mathbf|mathrm|mathit|operatorname|hat|bar|vec|theta|alpha|beta|gamma|"
    r"epsilon|varepsilon|tau|delta|phi|frac|sum|prod|int|left|right|cdot|times|in|leq|geq|log)\b"
)


def _value(row: Mapping[str, Any], key: str, default: Any = None) -> Any:
    try:
        value = row[key]
    except (KeyError, IndexError):
        return default
    return default if value is None else value


def _reference_numbers(match: re.Match[str]) -> list[str]:
    """Return base reference numbers, ignoring subfigure suffixes."""
    return re.findall(r"[A-Z]?\d+(?:\.\d+)*|\b[IVXLC]+\b", match.group("refs"), re.IGNORECASE)


def canonical_visual_kind(label: str) -> str | None:
    return _ALIAS_TO_VISUAL_KIND.get((label or "").replace(".", "").lower().strip())


def caption_identity(caption: str) -> tuple[str, str] | None:
    match = _ASSET_LABEL_RE.match(caption or "")
    kind = canonical_visual_kind(match.group("label")) if match else None
    if not match or not kind:
        return None
    suffix = (caption or "")[match.end() :]
    has_caption_delimiter = bool(re.match(r"\s*(?::|\.|—|–|-|\|)", suffix))
    uppercase_table = kind == "table" and match.group("label").isupper()
    return (kind, match.group("number").lower()) if has_caption_delimiter or uppercase_table else None


def _caption_content_key(text: str) -> str:
    """Normalize a caption for matching extracted assets to text units."""

    value = re.sub(r"^\s*(?:figure|fig|table|tab|tbl)\.?\s*[A-Z]?\d+(?:\.\d+)*\s*[:.\-–—]?", "", text, flags=re.I)
    return "".join(character.lower() for character in value if character.isalnum())


def visual_reference_candidates(text: str) -> list[dict[str, Any]]:
    """Return regex candidates, including confidence metadata for AI review."""
    candidates: list[dict[str, Any]] = []
    for match in _VISUAL_REFERENCE_RE.finditer(text or ""):
        kind = canonical_visual_kind(match.group("label"))
        if not kind:
            continue
        suffix_is_colon = bool(re.match(r"\s*:", (text or "")[match.end() :]))
        prefix = (text or "")[: match.start()]
        caption_like = suffix_is_colon and (
            match.group("label").lower().rstrip(".") in {"fig", "tab", "tbl", "alg", "img", "pic", "illus"}
            or not re.search(r"[A-Za-z]{2,}", prefix)
        )
        for number in _reference_numbers(match):
            candidates.append({
                "kind": kind,
                "number": number.lower(),
                "referenceId": f"{kind}_{number.lower().replace('.', '_')}",
                "ambiguous": kind in AMBIGUOUS_VISUAL_KINDS,
                "captionLike": caption_like,
            })
    return candidates


def resolve_visual_references(
    text: str,
    labels_by_kind: Mapping[str, Mapping[str, str]],
    reviewed_reference_ids: Iterable[str] | None = None,
) -> list[str]:
    resolved: list[str] = []
    has_review = reviewed_reference_ids is not None
    reviewed = set(reviewed_reference_ids or ())
    for candidate in visual_reference_candidates(text):
        if candidate["captionLike"]:
            continue
        asset_id = labels_by_kind.get(candidate["kind"], {}).get(candidate["number"])
        if not asset_id:
            continue
        # High-confidence publication labels are deterministic. Ambiguous
        # common nouns use Codex's accepted set when a review is available,
        # and otherwise retain the deterministic fallback.
        if has_review and candidate["ambiguous"] and candidate["referenceId"] not in reviewed:
            continue
        if asset_id not in resolved:
            resolved.append(asset_id)
    return resolved


def resolve_figure_references(text: str, label_to_id: Mapping[str, str]) -> list[str]:
    """Resolve obvious Fig./Figure references deterministically."""
    return resolve_visual_references(text, {"figure": label_to_id})


def resolve_table_references(text: str, label_to_id: Mapping[str, str]) -> list[str]:
    return resolve_visual_references(text, {"table": label_to_id})


def _strip_math_delimiters(value: str) -> str:
    text = value.strip()
    pairs = (("$$", "$$"), (r"\[", r"\]"), (r"\(", r"\)"), ("$", "$"))
    for opening, closing in pairs:
        if text.startswith(opening) and text.endswith(closing) and len(text) >= len(opening) + len(closing):
            return text[len(opening) : -len(closing)].strip()
    return text


def _equation_label(text: str) -> str:
    match = re.search(
        rf"(?:\\tag\{{(?P<tag>{_EQUATION_NUMBER_PATTERN})\}}|\((?P<paren>{_EQUATION_NUMBER_PATTERN})\))\s*$",
        text.strip(), re.I,
    )
    if match:
        return match.group("tag") or match.group("paren")
    leading = re.match(r"^\s*\((\d+(?:\.\d+)*)\)\s+", text)
    return leading.group(1) if leading else ""


def is_display_equation(text: str) -> bool:
    """Conservatively identify standalone display equations.

    Explicit TeX display delimiters are authoritative.  For pdftotext output,
    only short, operator-heavy blocks are classified, avoiding prose with a
    casual equals sign.
    """
    value = (text or "").strip()
    if not value:
        return False
    explicit_value = re.sub(
        rf"(?:\\tag\{{[^{{}}]+\}}|\({_EQUATION_NUMBER_PATTERN}\))\s*$", "", value,
        flags=re.I,
    ).strip()
    if (explicit_value.startswith("$$") and explicit_value.endswith("$$")) or (
        explicit_value.startswith(r"\[") and explicit_value.endswith(r"\]")
    ) or explicit_value.startswith(r"\begin{equation") or explicit_value.startswith(r"\begin{align"):
        return True
    if "=" not in value and not any(symbol in value for symbol in ("≤", "≥", "∑", "∫", "\\frac", "\\sum")):
        return False
    first_operator = min((position for position in (value.find("="), value.find("≤"), value.find("≥")) if position >= 0), default=len(value))
    prefix = value[:first_operator]
    words = re.findall(r"[A-Za-z]{3,}", value)
    prose_words = [word for word in words if word.lower() not in {"mathcal", "mathbb", "mathbf", "mathrm", "frac", "left", "right"}]
    operator_count = sum(value.count(symbol) for symbol in ("=", "+", "−", "-", "∑", "∫", "\\", "^", "_", "‖"))
    return (
        len(value) <= 700
        and len(prefix) <= 80
        and len(prose_words) <= 4
        and operator_count >= 2
        and _is_clean_inferred_formula(value)
    )


def math_to_latex(raw: str) -> str:
    """Preserve authored LaTeX and normalize common Unicode math glyphs."""
    value = _strip_math_delimiters(raw)
    value = re.sub(r"\\tag\{[^{}]+\}\s*$", "", value).strip()
    if _LATEX_COMMAND_RE.search(value):
        return value
    replacements = (
        ("−", "-"), ("×", r"\times "), ("·", r"\cdot "), ("∼", r"\sim "),
        ("∈", r"\in "), ("→", r"\to "), ("≤", r"\leq "), ("≥", r"\geq "),
        ("τ", r"\tau "), ("δ", r"\delta "), ("θ", r"\theta "),
        ("ϵ", r"\epsilon "), ("ε", r"\epsilon "), ("φ", r"\phi "),
        ("ℓ", r"\ell "), ("∑", r"\sum "), ("∫", r"\int "),
    )
    for source, target in replacements:
        value = value.replace(source, target)
    value = re.sub(r"π(\d+(?:\.\d+)?)", r"\\pi_{\1}", value)
    value = re.sub(r"vθ\b", r"v_{\\theta}", value)
    value = re.sub(r"ℓ([A-Za-z0-9]+)\b", r"\\ell_{\1}", value)
    value = re.sub(r"\b([Aasxoqv])t\+([A-Za-z0-9τδ]+)\b", r"\1_{t+\2}", value)
    value = re.sub(r"\b([Aasxoqv])t\b", r"\1_{t}", value)
    value = re.sub(r"\b([Aasxoqv])([0-9]+)\b", r"\1_{\2}", value)
    return value.strip()


def _formula_end(source: str, start: int) -> int:
    cursor = start
    while cursor < len(source) and source[cursor].isspace():
        cursor += 1
    if cursor < len(source) and source[cursor] in "[{":
        opening, closing = source[cursor], "]" if source[cursor] == "[" else "}"
        depth = 0
        for index in range(cursor, len(source)):
            if source[index] == opening:
                depth += 1
            elif source[index] == closing:
                depth -= 1
                if depth == 0:
                    return index + 1
    round_depth = square_depth = curly_depth = 0
    while cursor < len(source):
        character = source[cursor]
        if character == "(":
            round_depth += 1
        elif character == ")":
            round_depth = max(0, round_depth - 1)
        elif character == "[":
            square_depth += 1
        elif character == "]":
            square_depth = max(0, square_depth - 1)
        elif character == "{":
            curly_depth += 1
        elif character == "}":
            curly_depth = max(0, curly_depth - 1)
        elif not (round_depth or square_depth or curly_depth) and character in ";；.。!?！？":
            break
        elif not (round_depth or square_depth or curly_depth) and character in ",，":
            if re.match(r"\s*(?:where|which|and|with|corresponds|denotes|其中|式中|这里|然后|随后|并且)\b", source[cursor + 1 :], re.I):
                break
        elif not (round_depth or square_depth or curly_depth) and character.isspace():
            if re.match(r"\s*(?:where|which|corresponds|denotes|is visualized|其中|式中|这里|表示)\b", source[cursor:], re.I):
                break
        cursor += 1
    return cursor


def _is_clean_inferred_formula(value: str) -> bool:
    """Reject PDF-text guesses that have swallowed surrounding prose.

    Explicit TeX delimiters do not use this heuristic.  It only protects the
    fallback path for PDFs whose text layer contains an undelimited equality.
    """
    if re.search(r"[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]", value):
        return False
    if any(ord(character) < 32 and character not in "\t\n\r" for character in value):
        return False
    allowed_words = {
        "arg", "cos", "det", "exp", "inf", "kl", "lim", "log", "max",
        "min", "mod", "mse", "ref", "sin", "sup", "tan",
    }
    for word in re.findall(r"[A-Za-z]{3,}", value):
        if word.isupper() or word.lower() in allowed_words:
            continue
        return False
    return True


def inline_math_spans(text: str) -> list[dict[str, Any]]:
    """Annotate inline formulas so the frontend only renders normalized runs."""
    spans: list[dict[str, Any]] = []
    def add(start: int, end: int, raw: str | None = None) -> None:
        if start < 0 or end <= start or any(start < span["end"] and end > span["start"] for span in spans):
            return
        source = raw if raw is not None else (text or "")[start:end]
        spans.append({"start": start, "end": end, "latex": math_to_latex(source)})

    for match in _EXPLICIT_MATH_RE.finditer(text or ""):
        if match.group("display"):
            continue
        add(match.start(), match.end(), match.group(0))
    # Also support undelimited authored LaTeX, common in pdftotext output.
    if not spans:
        command = _LATEX_COMMAND_RE.search(text or "")
        if command:
            end = len(text)
            boundary = re.search(r"\s+(?:where|which|we then|this equation|其中|式中|这里)\b", text[command.start() :], re.I)
            if boundary:
                end = command.start() + boundary.start()
            add(command.start(), end)
    for equals in re.finditer(r"=", text or ""):
        before = text[: equals.start()]
        lhs = re.search(
            r"(?:[A-Za-zℓπτϵδεθφ][A-Za-z0-9ℓπτϵδεθφ′'_{}^\\]*(?:\s*\([^)]{0,120}\))?"
            r"(?:\s*[+−-]\s*[A-Za-z0-9ℓπτϵδεθφ′'_{}^\\]+)*)\s*$",
            before,
        )
        if lhs:
            end = _formula_end(text, equals.end())
            candidate = text[lhs.start() : end]
            # PDF text extraction frequently loses the visual boundary between
            # an inline formula and the prose that follows it.  Sending that
            # entire mixed sentence to MathJax makes ordinary words disappear
            # into products of variables.  Only promote an inferred equality
            # when it contains no prose-like word.  Explicit $...$ / \(...\)
            # spans above remain authoritative.
            if _is_clean_inferred_formula(candidate):
                add(lhs.start(), end)
    variable_patterns = (
        r"(?<![A-Za-z])(?:π\d+(?:\.\d+)?|D[rv]|Pθ|vθ|ℓt)(?![A-Za-z])",
        r"(?<![A-Za-z])(?:[AIa]τt|[AI][0-9in]t|[Aoqvasx]t|Lτ)(?:\+[A-Z0-9τδ−]+)?(?![A-Za-z])",
        r"(?<![A-Za-z])[τδθεϵφℓ](?![A-Za-z])",
    )
    for pattern in variable_patterns:
        for match in re.finditer(pattern, text or ""):
            add(match.start(), match.end())
    return sorted(spans, key=lambda span: span["start"])


def text_runs(text: str) -> list[TextRun]:
    spans = inline_math_spans(text)
    if not spans:
        return [{"type": "text", "text": text}]
    runs: list[TextRun] = []
    cursor = 0
    for span in spans:
        start, end = int(span["start"]), int(span["end"])
        if start > cursor:
            runs.append({"type": "text", "text": text[cursor:start]})
        runs.append({"type": "inline_math", "text": text[start:end], "latex": str(span["latex"])})
        cursor = end
    if cursor < len(text):
        runs.append({"type": "text", "text": text[cursor:]})
    return runs


def protect_math_for_translation(text: str) -> tuple[str, dict[str, str]]:
    """Protect formula expressions without masking ordinary academic prose.

    Rendering may annotate short variables such as ``a_t`` or short model
    identifiers. Sending a placeholder for every one of those produced many
    tokens and made model validation brittle, so translation protection is
    intentionally narrower: authored TeX and equation expressions only.
    """
    spans: list[dict[str, int]] = []

    def add(start: int, end: int) -> None:
        if start < 0 or end <= start or any(start < span["end"] and end > span["start"] for span in spans):
            return
        spans.append({"start": start, "end": end})

    for match in _EXPLICIT_MATH_RE.finditer(text or ""):
        add(match.start(), match.end())
    command = _LATEX_COMMAND_RE.search(text or "")
    if command:
        end = len(text)
        boundary = re.search(
            r"\s+(?:where|which|we then|this equation|其中|式中|这里)\b",
            text[command.start() :],
            re.I,
        )
        if boundary:
            end = command.start() + boundary.start()
        add(command.start(), end)
    for equals in re.finditer(r"=", text or ""):
        before = text[: equals.start()]
        lhs = re.search(
            r"(?:[A-Za-zℓπτϵδεθφ][A-Za-z0-9ℓπτϵδεθφ′'_{}^\\]*(?:\s*\([^)]{0,120}\))?"
            r"(?:\s*[+−-]\s*[A-Za-z0-9ℓπτϵδεθφ′'_{}^\\]+)*)\s*$",
            before,
        )
        if lhs:
            end = _formula_end(text, equals.end())
            if _is_clean_inferred_formula(text[lhs.start() : end]):
                add(lhs.start(), end)

    replacements: dict[str, str] = {}
    output: list[str] = []
    cursor = 0
    for index, span in enumerate(sorted(spans, key=lambda item: item["start"])):
        token = f"[[MATH_{index}]]"
        start, end = int(span["start"]), int(span["end"])
        output.extend((text[cursor:start], token))
        replacements[token] = text[start:end]
        cursor = end
    output.append((text or "")[cursor:])
    return "".join(output), replacements


def restore_protected_math(text: str, replacements: Mapping[str, str]) -> str:
    restored = text
    for token, formula in replacements.items():
        if token not in restored:
            raise ValueError(f"translation omitted protected formula token {token}")
        restored = restored.replace(token, formula)
    return restored


def _group_segments(segments: Iterable[Mapping[str, Any]]) -> list[dict[str, Any]]:
    groups: list[dict[str, Any]] = []
    for segment in segments:
        key = (int(_value(segment, "page_no", 0)), int(_value(segment, "paragraph_no", 0)))
        group = groups[-1] if groups else None
        if group is None or group["key"] != key:
            group = {
                "key": key,
                "page": key[0],
                "paragraph": key[1],
                "firstUnit": int(_value(segment, "unit_index", 0)),
                "lastUnit": int(_value(segment, "unit_index", 0)),
                "segments": [],
            }
            groups.append(group)
        group["lastUnit"] = int(_value(segment, "unit_index", 0))
        group["segments"].append(segment)
    return groups


def _segment_text(segment: Mapping[str, Any], language: str = "en") -> str:
    return str(_value(segment, f"{language}_text", "")).strip()


def _split_groups_at_visual_references(
    groups: Iterable[dict[str, Any]],
    labels_by_kind: Mapping[str, Mapping[str, str]],
    reviewed_by_unit: Mapping[int, Iterable[str]] | None = None,
    section_starts: set[int] | None = None,
    shared_block_anchors: set[int] | None = None,
) -> list[dict[str, Any]]:
    """Make references and shared assets exact insertion anchors.

    PDF paragraph recovery can merge several reading units (and even content
    from adjacent columns) into one large paragraph.  Keeping the individual
    sentence that first names a figure/table as its own semantic block lets the
    shared visual sit immediately below that sentence instead of at the end of
    an unrelated merged paragraph.
    """

    split_groups: list[dict[str, Any]] = []
    section_starts = section_starts or set()
    shared_block_anchors = shared_block_anchors or set()
    reviewed_by_unit = reviewed_by_unit or {}
    for group in groups:
        chunks: list[list[Mapping[str, Any]]] = []
        pending: list[Mapping[str, Any]] = []
        for segment in group["segments"]:
            unit_index = int(_value(segment, "unit_index", 0))
            if unit_index in section_starts and pending:
                chunks.append(pending)
                pending = []
            text = _segment_text(segment)
            has_reference = bool(resolve_visual_references(
                text, labels_by_kind, reviewed_by_unit.get(unit_index)
            ))
            if has_reference or unit_index in shared_block_anchors:
                if pending:
                    chunks.append(pending)
                    pending = []
                chunks.append([segment])
            else:
                pending.append(segment)
        if pending:
            chunks.append(pending)
        for chunk in chunks:
            first_unit = int(_value(chunk[0], "unit_index", 0))
            split_groups.append({
                "key": (group["page"], int(_value(chunk[0], "paragraph_no", group["paragraph"]))),
                "page": group["page"],
                "paragraph": int(_value(chunk[0], "paragraph_no", group["paragraph"])),
                "firstUnit": first_unit,
                "lastUnit": int(_value(chunk[-1], "unit_index", first_unit)),
                "segments": chunk,
            })
    return split_groups


_ABSTRACT_PREFIX_RE = re.compile(r"^\s*(?:abstract|摘要)\s*(?:[—–:.\-]+\s*)?", re.IGNORECASE)


def _paper_authors(paper: Mapping[str, Any]) -> list[str]:
    raw = _value(paper, "authors", [])
    if isinstance(raw, (list, tuple)):
        return [str(author).strip() for author in raw if str(author).strip()]
    return [author.strip() for author in re.split(r"\s*;\s*", str(raw or "")) if author.strip()]


def _make_front_matter(
    paper: Mapping[str, Any],
    groups: list[dict[str, Any]],
    sections: list[Mapping[str, Any]],
) -> tuple[dict[str, Any], set[int]]:
    """Extract title/authors/abstract from the body block stream."""

    title = str(_value(paper, "document_title", "") or _value(paper, "title", "")).strip()
    authors = _paper_authors(paper)
    has_typed_abstract = any(
        str(_value(row, "unit_type", "")) == "abstract"
        for group in groups for row in group["segments"]
    )
    abstract_start = next(
        (
            index for index, group in enumerate(groups)
            if any(str(_value(row, "unit_type", "")) == "abstract" for row in group["segments"])
            or _ABSTRACT_PREFIX_RE.match(" ".join(_segment_text(row) for row in group["segments"]))
        ),
        None,
    )
    first_section_unit = min(
        (int(_value(section, "start_unit", 10**9)) for section in sections),
        default=10**9,
    )
    excluded_units: set[int] = set()
    abstract: dict[str, Any] | None = None
    if abstract_start is not None:
        # Everything before Abstract is paper-level metadata, never ordinary
        # bilingual body prose. Abstract can span multiple recovered PDF
        # paragraphs and ends where the authored section hierarchy begins.
        for group in groups[:abstract_start]:
            excluded_units.update(int(_value(row, "unit_index", 0)) for row in group["segments"])
        abstract_groups = []
        for group in groups[abstract_start:]:
            if group["firstUnit"] >= first_section_unit:
                break
            if has_typed_abstract and abstract_groups and not any(
                str(_value(row, "unit_type", "")) == "abstract" for row in group["segments"]
            ):
                break
            abstract_groups.append(group)
        abstract_segments = [row for group in abstract_groups for row in group["segments"]]
        excluded_units.update(int(_value(row, "unit_index", 0)) for row in abstract_segments)
        source = " ".join(_segment_text(row) for row in abstract_segments).strip()
        translated_parts = [_segment_text(row, "zh") for row in abstract_segments]
        translated = "".join(translated_parts) if translated_parts and all(translated_parts) else ""
        source = _ABSTRACT_PREFIX_RE.sub("", source, count=1).strip()
        translated = _ABSTRACT_PREFIX_RE.sub("", translated, count=1).strip()
        abstract = {
            "id": "abstract",
            "type": "abstract",
            "page": abstract_groups[0]["page"] if abstract_groups else 1,
            "sourceText": source,
            "translatedText": translated,
            "sourceRuns": text_runs(source),
            "translatedRuns": text_runs(translated) if translated else [],
            "segmentIds": [f"unit_{int(_value(row, 'unit_index', 0)):05d}" for row in abstract_segments],
        }
    elif first_section_unit < 10**9:
        # Some venues omit an explicit Abstract heading. Authored PDF metadata
        # still supplies title/authors, so keep every pre-section first-page
        # unit out of the normal paragraph stream.
        for group in groups:
            if group["firstUnit"] >= first_section_unit:
                break
            if group["page"] == 1:
                excluded_units.update(int(_value(row, "unit_index", 0)) for row in group["segments"])

    return {
        "title": title,
        "titleRuns": text_runs(title),
        "translatedTitle": str(_value(paper, "document_title_zh", "")).strip(),
        "translatedTitleRuns": text_runs(str(_value(paper, "document_title_zh", "")).strip())
        if str(_value(paper, "document_title_zh", "")).strip() else [],
        "authors": authors,
        "abstract": abstract,
    }, excluded_units


def _make_assets(
    images: Iterable[Mapping[str, Any]], image_url: Callable[[int], str]
) -> tuple[list[dict[str, Any]], dict[str, dict[str, str]]]:
    assets: list[dict[str, Any]] = []
    labels_by_kind: dict[str, dict[str, str]] = {}
    counters: dict[str, int] = {}
    used_ids: set[str] = set()
    seen_labeled_assets: set[tuple[str, str]] = set()
    for image in images:
        caption = str(_value(image, "caption", ""))
        source_kind = str(_value(image, "source_kind", "figure")).lower()
        match = _ASSET_LABEL_RE.match(caption)
        matched_kind = canonical_visual_kind(match.group("label")) if match else None
        kind = matched_kind or canonical_visual_kind(source_kind) or "figure"
        counters[kind] = counters.get(kind, 0) + 1
        number = match.group("number") if match else str(counters[kind])
        label_key = (kind, number.lower())
        if match and label_key in seen_labeled_assets:
            continue
        if match:
            seen_labeled_assets.add(label_key)
        prefix = "fig" if kind == "figure" else kind
        base_id = f"{prefix}_{number.lower().replace('.', '_')}"
        asset_id = base_id
        duplicate = 2
        while asset_id in used_ids:
            asset_id = f"{base_id}_{duplicate}"
            duplicate += 1
        used_ids.add(asset_id)
        label = f"{VISUAL_KIND_LABELS.get(kind, kind.title())} {number}"
        database_id = int(_value(image, "id", 0))
        asset = {
            "id": asset_id,
            "type": kind,
            "label": label,
            "src": image_url(database_id),
            "caption": caption,
            "translatedCaption": str(_value(image, "translated_caption", "")),
            "page": int(_value(image, "page_no", 0)),
            "anchorUnit": int(_value(image, "anchor_unit", -1)),
            "topRatio": float(_value(image, "top_ratio", 0)),
            "leftRatio": float(_value(image, "left_ratio", 0)),
            "widthRatio": float(_value(image, "width_ratio", 1)),
            "heightRatio": float(_value(image, "height_ratio", 0)),
            "sourceKind": source_kind,
        }
        assets.append(asset)
        labels_by_kind.setdefault(kind, {}).setdefault(number.lower(), asset_id)
    return assets, labels_by_kind


def _make_equation_assets(
    equations: Iterable[Mapping[str, Any]], equation_url: Callable[[int], str] | None
) -> tuple[list[dict[str, Any]], dict[str, str]]:
    assets: list[dict[str, Any]] = []
    labels: dict[str, str] = {}
    for equation in equations:
        stable_id = str(_value(equation, "stable_id", ""))
        if not stable_id:
            continue
        database_id = int(_value(equation, "id", 0))
        label = str(_value(equation, "label", ""))
        number_match = re.search(
            rf"\bEquation\s+(?P<number>{_EQUATION_NUMBER_PATTERN})\b", label, re.I
        )
        number = re.sub(r"\s+", "", number_match.group("number")) if number_match else ""
        source_text = str(_value(equation, "source_text", "")).strip()
        latex_status = str(_value(equation, "latex_status", "pending"))
        stored_latex = str(_value(equation, "latex", "")).strip()
        latex = stored_latex if latex_status == "ready" else ""
        asset = {
            "id": stable_id,
            "type": "equation",
            "label": label or (f"Equation {number}" if number else "Equation"),
            "number": number,
            "src": equation_url(database_id) if equation_url else "",
            "page": int(_value(equation, "page_no", 0)),
            "anchorUnit": int(_value(equation, "anchor_unit", -1)),
            "widthRatio": float(_value(equation, "width_ratio", 1)),
            "heightRatio": float(_value(equation, "height_ratio", 0)),
            "renderMode": "latex" if latex else "source_crop",
            "sourceText": source_text,
            "latex": latex,
            "latexStatus": latex_status,
            "latexError": str(_value(equation, "latex_error", "")),
        }
        assets.append(asset)
        if number:
            labels.setdefault(number.lower(), stable_id)
    return assets, labels


def _equation_match_tokens(value: str) -> set[str]:
    """Create a conservative fingerprint from noisy PDF text or LaTeX."""

    normalized = str(value or "").lower()
    normalized = re.sub(r"\\(?:left|right|begin|end|mathrm|mathbf|mathcal|mathbb|operatorname)", " ", normalized)
    return {
        token for token in re.findall(r"[a-z]+|\d+(?:\.\d+)?|[α-ωΑ-Ω]", normalized)
        if token not in {"equation", "where", "with", "and", "the", "for", "from"}
    }


def _match_equation_assets(
    groups: Iterable[dict[str, Any]], equation_assets: Iterable[dict[str, Any]]
) -> dict[int, dict[str, Any]]:
    """Match display groups to extracted crops once, using independent evidence.

    IDs generated from flattened text are deliberately not considered: they
    can collide with stable extraction IDs.  Page, printed equation number,
    extraction anchor, and formula tokens instead produce a deterministic
    one-to-one assignment.
    """

    display_groups: list[tuple[dict[str, Any], str, str]] = []
    for group in groups:
        source = " ".join(
            str(_value(row, "en_text", "")).strip() for row in group["segments"]
        ).strip()
        if is_display_equation(source):
            display_groups.append((group, source, _equation_label(source)))

    candidates: list[tuple[float, int, int, dict[str, Any]]] = []
    assets = list(equation_assets)
    for group, source, group_number in display_groups:
        source_tokens = _equation_match_tokens(source)
        for asset_index, asset in enumerate(assets):
            if int(asset["page"]) != int(group["page"]):
                continue
            asset_number = str(asset.get("number", ""))
            if group_number and asset_number and group_number.lower() != asset_number.lower():
                continue
            anchor = int(asset.get("anchorUnit", -1))
            anchor_inside = group["firstUnit"] <= anchor <= group["lastUnit"]
            number_match = bool(
                group_number and asset_number and group_number.lower() == asset_number.lower()
            )
            asset_tokens = _equation_match_tokens(
                str(asset.get("sourceText", "")) + " " + str(asset.get("latex", ""))
            )
            overlap = len(source_tokens & asset_tokens) / max(len(source_tokens | asset_tokens), 1)
            distance = min(abs(anchor - group["firstUnit"]), abs(anchor - group["lastUnit"])) if anchor >= 0 else 10**6
            if not number_match and not anchor_inside and overlap < 0.12:
                continue
            score = overlap * 35
            if number_match:
                score += 180
            if anchor_inside:
                score += 140
            elif distance <= 4:
                score += 30 - distance * 6
            candidates.append((score, int(group["firstUnit"]), asset_index, asset))

    matched_groups: set[int] = set()
    matched_assets: set[int] = set()
    matches: dict[int, dict[str, Any]] = {}
    for _score, first_unit, asset_index, asset in sorted(
        candidates, key=lambda item: (-item[0], item[1], item[2])
    ):
        if first_unit in matched_groups or asset_index in matched_assets:
            continue
        matched_groups.add(first_unit)
        matched_assets.add(asset_index)
        matches[first_unit] = asset
    return matches


def build_paper_ir(
    paper: Mapping[str, Any],
    segments: Iterable[Mapping[str, Any]],
    sections: Iterable[Mapping[str, Any]],
    images: Iterable[Mapping[str, Any]],
    image_url: Callable[[int], str],
    equations: Iterable[Mapping[str, Any]] = (),
    equation_url: Callable[[int], str] | None = None,
    visual_reviews: Iterable[Mapping[str, Any]] = (),
) -> dict[str, Any]:
    """Build ordered semantic blocks and shared assets for one paper."""
    segment_list = list(segments)
    section_list = list(sections)
    assets, labels_by_kind = _make_assets(images, image_url)
    asset_by_id = {asset["id"]: asset for asset in assets}
    asset_by_identity = {
        identity: asset
        for asset in assets
        if (identity := caption_identity(str(asset.get("caption", ""))))
    }
    equation_assets, extracted_equation_labels = _make_equation_assets(equations, equation_url)
    reviewed_by_unit: dict[int, list[str]] = {}
    for review in visual_reviews:
        unit_index = int(_value(review, "unit_index", -1))
        raw_refs = _value(review, "refs", _value(review, "refs_json", []))
        if isinstance(raw_refs, str):
            try:
                raw_refs = json.loads(raw_refs)
            except (json.JSONDecodeError, TypeError):
                raw_refs = []
        if unit_index >= 0 and isinstance(raw_refs, list):
            reviewed_by_unit[unit_index] = [str(ref) for ref in raw_refs]
    sections_at: dict[int, list[Mapping[str, Any]]] = {}
    for section in section_list:
        sections_at.setdefault(int(_value(section, "start_unit", -1)), []).append(section)

    logical_blocks: list[dict[str, Any]] = []
    equation_labels: dict[str, str] = dict(extracted_equation_labels)
    raw_groups = _group_segments(segment_list)
    front_matter, front_matter_units = _make_front_matter(paper, raw_groups, section_list)
    body_groups = [
        group for group in raw_groups
        if not all(
            int(_value(row, "unit_index", 0)) in front_matter_units
            for row in group["segments"]
        )
    ]
    groups = _split_groups_at_visual_references(
        body_groups,
        labels_by_kind,
        reviewed_by_unit,
        set(sections_at),
        {
            int(asset["anchorUnit"])
            for asset in equation_assets
            if int(asset["anchorUnit"]) >= 0
        },
    )
    equation_assets_by_group = _match_equation_assets(groups, equation_assets)
    equation_ids: dict[int, str] = {}
    reserved_equation_ids = {str(asset["id"]) for asset in equation_assets}
    for group in groups:
        candidate = " ".join(str(_value(row, "en_text", "")).strip() for row in group["segments"]).strip()
        if not is_display_equation(candidate):
            continue
        label = _equation_label(candidate)
        source_asset = equation_assets_by_group.get(group["firstUnit"])
        equation_id = str(source_asset["id"]) if source_asset else f"eq_text_{group['firstUnit']:05d}"
        suffix = 2
        base_id = equation_id
        while not source_asset and equation_id in reserved_equation_ids:
            equation_id = f"{base_id}_{suffix}"
            suffix += 1
        reserved_equation_ids.add(equation_id)
        equation_ids[group["firstUnit"]] = equation_id
        if label and label.lower() not in equation_labels:
            equation_labels.setdefault(label.lower(), equation_id)
    for group in groups:
        for section in sections_at.get(group["firstUnit"], []):
            logical_blocks.append({
                "id": f"heading_{_value(section, 'id', group['firstUnit'])}",
                "type": "heading",
                "number": str(_value(section, "number", "")),
                "title": str(_value(section, "title", "")),
                "translatedTitle": str(_value(section, "translated_title", "")),
                "level": max(1, min(6, int(_value(section, "level", 1)))),
                "page": int(_value(section, "page_no", group["page"])),
                "startUnit": group["firstUnit"],
            })
        source_text = " ".join(str(_value(row, "en_text", "")).strip() for row in group["segments"]).strip()
        translated_parts = [str(_value(row, "zh_text", "")).strip() for row in group["segments"]]
        translated_text = "".join(translated_parts) if all(translated_parts) else ""
        unit_type = str(_value(group["segments"][0], "unit_type", "body"))
        if unit_type == "reference":
            logical_blocks.append({
                "id": f"reference_{group['firstUnit']:05d}",
                "type": "reference",
                "page": group["page"],
                "firstUnit": group["firstUnit"],
                "lastUnit": group["lastUnit"],
                "sourceText": source_text,
                "sourceRuns": [{"type": "text", "text": source_text}],
                "segmentIds": [
                    f"unit_{int(_value(row, 'unit_index', 0)):05d}"
                    for row in group["segments"]
                ],
            })
            continue
        identity = caption_identity(source_text)
        caption_asset = asset_by_identity.get(identity) if identity else None
        source_caption_key = _caption_content_key(source_text)
        asset_caption_key = _caption_content_key(str(caption_asset.get("caption", ""))) if caption_asset else ""
        # The Figure/Table block already owns both source and translated
        # captions. Do not render the same caption as a bilingual paragraph.
        # Prefix matching allows a PDF caption split across extraction units,
        # while the content threshold avoids deleting prose that merely starts
        # with a visual reference.
        if (
            caption_asset and min(len(source_caption_key), len(asset_caption_key)) >= 18
            and (
                source_caption_key.startswith(asset_caption_key[:min(len(asset_caption_key), 80)])
                or asset_caption_key.startswith(source_caption_key[:min(len(source_caption_key), 80)])
            )
        ):
            continue
        if is_display_equation(source_text):
            label = _equation_label(source_text)
            source_asset = equation_assets_by_group.get(group["firstUnit"])
            equation_id = equation_ids[group["firstUnit"]]
            equation_source = re.sub(
                rf"(?:\\tag\{{{_EQUATION_NUMBER_PATTERN}\}}|\({_EQUATION_NUMBER_PATTERN}\))\s*$",
                "",
                source_text,
                flags=re.I,
            ).strip() if label else source_text
            if label:
                equation_source = re.sub(
                    rf"^\s*\({_EQUATION_NUMBER_PATTERN}\)\s+", "", equation_source, flags=re.I
                ).strip()
            logical_blocks.append({
                "id": equation_id,
                "type": "equation",
                "latex": source_asset["latex"] if source_asset and source_asset.get("latex") else (
                    "" if source_asset else math_to_latex(equation_source)
                ),
                "label": source_asset["label"] if source_asset else (f"Equation {label}" if label else ""),
                "number": source_asset["number"] if source_asset else label,
                "page": group["page"],
                "anchorUnit": source_asset["anchorUnit"] if source_asset else group["lastUnit"],
                "sourceText": source_text,
                "src": source_asset["src"] if source_asset else "",
                "renderMode": source_asset["renderMode"] if source_asset else "latex",
                "latexStatus": source_asset.get("latexStatus", "ready") if source_asset else "ready",
                "latexError": source_asset.get("latexError", "") if source_asset else "",
            })
            continue
        visual_refs: list[str] = []
        for row in group["segments"]:
            unit_index = int(_value(row, "unit_index", 0))
            for reference_id in resolve_visual_references(
                _segment_text(row), labels_by_kind, reviewed_by_unit.get(unit_index)
            ):
                if reference_id not in visual_refs:
                    visual_refs.append(reference_id)
        figure_refs = [ref for ref in visual_refs if asset_by_id[ref]["type"] == "figure"]
        table_refs = [ref for ref in visual_refs if asset_by_id[ref]["type"] == "table"]
        equation_refs = []
        for match in _EQUATION_REFERENCE_RE.finditer(source_text):
            equation_id = equation_labels.get(match.group("number").lower())
            if equation_id and equation_id not in equation_refs:
                equation_refs.append(equation_id)
        logical_blocks.append({
            "id": f"paragraph_{group['firstUnit']:05d}",
            "type": "paragraph",
            "page": group["page"],
            "firstUnit": group["firstUnit"],
            "lastUnit": group["lastUnit"],
            "role": "metadata" if unit_type == "metadata" else "body",
            "sourceText": source_text,
            "translatedText": translated_text,
            "sourceRuns": text_runs(source_text),
            "translatedRuns": text_runs(translated_text) if translated_text else [],
            "figureRefs": figure_refs,
            "tableRefs": table_refs,
            "visualRefs": visual_refs,
            "equationRefs": equation_refs,
            "segmentIds": [f"unit_{int(_value(row, 'unit_index', 0)):05d}" for row in group["segments"]],
        })

    # Determine one reading-flow insertion point per shared visual asset.  A
    # paragraph's first explicit reference wins; extraction anchors are the
    # fallback.  Every asset is inserted at most once.
    insert_after: dict[str, list[dict[str, Any]]] = {}
    inserted: set[str] = set()
    inserted_equations = {
        block["id"] for block in logical_blocks if block["type"] == "equation"
    }
    paragraphs = [
        block for block in logical_blocks
        if block["type"] == "paragraph" and block.get("role") == "body"
    ]
    leading_assets: list[dict[str, Any]] = []
    # Cover-page visuals commonly sit after the abstract and their caption
    # units are deliberately removed from ordinary paragraphs.  They belong
    # immediately after front matter, not at the end of the whole paper.
    for asset in assets:
        if asset["anchorUnit"] in front_matter_units:
            leading_assets.append(asset)
            inserted.add(asset["id"])
    for paragraph in paragraphs:
        for asset_id in paragraph["visualRefs"]:
            if asset_id not in inserted:
                insert_after.setdefault(paragraph["id"], []).append(asset_by_id[asset_id])
                inserted.add(asset_id)
    for asset in assets:
        if asset["id"] in inserted or asset["anchorUnit"] < 0:
            continue
        anchor = next(
            (
                block for block in paragraphs
                if block["page"] == asset["page"]
                and block["firstUnit"] <= asset["anchorUnit"] <= block["lastUnit"]
            ),
            None,
        )
        if anchor:
            insert_after.setdefault(anchor["id"], []).append(asset)
            inserted.add(asset["id"])

    # Numbered formula crops not matched to a text-derived equation are still
    # first-class shared blocks.  Place each once at its extraction anchor.
    for equation in equation_assets:
        if equation["id"] in inserted_equations:
            continue
        anchor = next(
            (
                block for block in paragraphs
                if block["firstUnit"] <= equation["anchorUnit"] <= block["lastUnit"]
            ),
            None,
        )
        if anchor is None:
            same_page = [block for block in paragraphs if block["page"] == equation["page"]]
            anchor = same_page[-1] if same_page else (paragraphs[-1] if paragraphs else None)
        if anchor:
            insert_after.setdefault(anchor["id"], []).append(equation)
            inserted_equations.add(equation["id"])
    for asset in assets:
        if asset["id"] in inserted:
            continue
        same_page_before = [
            block for block in paragraphs
            if block["page"] == asset["page"] and block["lastUnit"] < asset["anchorUnit"]
        ]
        same_page_after = [
            block for block in paragraphs
            if block["page"] == asset["page"] and block["firstUnit"] > asset["anchorUnit"]
        ]
        later = [block for block in paragraphs if block["page"] > asset["page"]]
        anchor = (
            same_page_before[-1] if same_page_before
            else same_page_after[0] if same_page_after
            else later[0] if later
            else paragraphs[-1] if paragraphs else None
        )
        if anchor:
            insert_after.setdefault(anchor["id"], []).append(asset)
            inserted.add(asset["id"])

    blocks: list[dict[str, Any]] = [dict(asset) for asset in leading_assets]
    for block in logical_blocks:
        blocks.append(block)
        for asset in insert_after.get(block["id"], []):
            blocks.append(dict(asset))

    outline = ([{
        "id": "abstract", "number": "", "title": "Abstract", "translatedTitle": "摘要", "level": 1,
        "page": front_matter["abstract"]["page"], "kind": "abstract",
    }] if front_matter["abstract"] else []) + [
        {
            "id": block["id"], "number": block["number"], "title": block["title"],
            "translatedTitle": block.get("translatedTitle", ""),
            "level": block["level"], "page": block["page"],
        }
        for block in blocks if block["type"] == "heading"
    ]
    return {
        "version": 2,
        "paperId": str(_value(paper, "id", "")),
        "title": str(_value(paper, "title", "")),
        "frontMatter": front_matter,
        "language": {
            "source": "en",
            "translation": {"zh": "zh-CN", "ja": "ja", "ko": "ko"}.get(
                str(_value(paper, "target_language", "zh")), "zh-CN"
            ),
            "target": str(_value(paper, "target_language", "zh")),
        },
        "blocks": blocks,
        "assets": assets,
        "equations": equation_assets,
        "outline": outline,
    }
