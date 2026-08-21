import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.pdf_text import TextExtraction, _native_text, _order_blocks, extract_pdf_text


def block(text, x0, y0, x1, y1):
    return {"text": text, "x0": x0, "y0": y0, "x1": x1, "y1": y1}


class PdfTextPipelineTests(unittest.TestCase):
    def test_native_layout_ignores_pdf_font_control_characters(self) -> None:
        xml = b'''<?xml version="1.0" encoding="UTF-8"?>
        <doc><page width="600" height="800"><flow><block xMin="20" yMin="20" xMax="200" yMax="40">
        <line><word>Alpha</word><word>\x13</word><word>beta</word></line>
        </block></flow></page></doc>'''
        completed = type("Completed", (), {
            "returncode": 0, "stdout": xml, "stderr": b""
        })()
        with patch("backend.pdf_text.subprocess.run", return_value=completed):
            result = _native_text(Path("paper.pdf"), "double")

        self.assertEqual(result.text, "Alpha beta")

    def test_forced_double_reads_left_column_before_right(self) -> None:
        blocks = [
            block("Paper title", 40, 20, 560, 55),
            block("Right first", 330, 90, 560, 120),
            block("Left first", 40, 80, 270, 110),
            block("Right second", 330, 150, 560, 180),
            block("Left second", 40, 140, 270, 170),
        ]
        _detected, ordered = _order_blocks(600, 800, blocks, "double")
        self.assertEqual(
            [item["text"] for item in ordered],
            ["Paper title", "Left first", "Left second", "Right first", "Right second"],
        )

    def test_forced_single_uses_visual_top_to_bottom_order(self) -> None:
        blocks = [block("second", 20, 100, 200, 130), block("first", 50, 20, 300, 50)]
        _detected, ordered = _order_blocks(600, 800, blocks, "single")
        self.assertEqual([item["text"] for item in ordered], ["first", "second"])

    def test_native_text_does_not_trigger_ocr(self) -> None:
        native = TextExtraction("A searchable paper with enough alphabetic text.", "single", "native")
        with patch("backend.pdf_text._plain_text", return_value=native), patch(
            "backend.pdf_text._ocr_text"
        ) as ocr:
            result = extract_pdf_text(b"%PDF-test", "single")
        self.assertEqual(result, native)
        ocr.assert_not_called()

    def test_image_only_text_uses_ocr_fallback(self) -> None:
        native = TextExtraction("12", "single", "native")
        recognized = TextExtraction("Recognized scanned paper text", "single", "ocr")
        with patch("backend.pdf_text._plain_text", return_value=native), patch(
            "backend.pdf_text._ocr_text", return_value=recognized
        ) as ocr:
            result = extract_pdf_text(b"%PDF-test", "single")
        self.assertEqual(result.source, "ocr")
        ocr.assert_called_once()


if __name__ == "__main__":
    unittest.main()
