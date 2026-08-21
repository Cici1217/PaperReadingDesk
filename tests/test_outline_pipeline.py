import subprocess
import sqlite3
import unittest
from unittest import mock

import server


class OutlinePipelineTests(unittest.TestCase):
    def test_numeric_reference_year_is_not_promoted_to_section(self) -> None:
        layout = [
            {"number": "7", "title": "Discussion", "page": 11, "line": 20, "source": "layout"},
            {"number": "2021", "title": "IEEE International Conference", "page": 12, "line": 40, "source": "layout"},
        ]
        structure = [
            {"number": "", "title": "References", "page": 11, "line": 80, "level": 1, "source": "structure"},
        ]
        with mock.patch("server.extract_pdf_bookmarks", return_value=[]), mock.patch(
            "server.extract_layout_outline", return_value=layout
        ), mock.patch("server.extract_structural_outline", return_value=structure):
            headings = server.extract_pdf_outline(b"%PDF-test")

        self.assertEqual(
            [(item["number"], item["title"]) for item in headings],
            [("7", "Discussion"), ("", "References")],
        )

    def test_numbered_headings_without_period_are_detected_before_numbered_questions(self) -> None:
        layout_text = """1    Introduction
Body text.
2   Related Work
3.1 Preliminaries: Vision-Language Models
1. How does the policy compare to prior work?
2. Can the policy be fine-tuned effectively?
"""
        completed = subprocess.CompletedProcess(
            args=[], returncode=0, stdout=layout_text.encode("utf-8"), stderr=b""
        )
        with mock.patch("server.subprocess.run", return_value=completed):
            headings = server.extract_layout_outline(b"%PDF-test")

        self.assertEqual(
            [(item["number"], item["title"]) for item in headings],
            [
                ("1", "Introduction"),
                ("2", "Related Work"),
                ("3.1", "Preliminaries: Vision-Language Models"),
            ],
        )

    def test_stored_outline_is_ordered_by_matched_source_unit(self) -> None:
        db = sqlite3.connect(":memory:")
        db.row_factory = sqlite3.Row
        db.executescript(
            """
            CREATE TABLE segments (
                paper_id TEXT, unit_index INTEGER, unit_type TEXT,
                page_no INTEGER, en_text TEXT
            );
            CREATE TABLE sections (
                id TEXT PRIMARY KEY, paper_id TEXT, number TEXT, title TEXT,
                translated_title TEXT DEFAULT '', level INTEGER, position INTEGER,
                start_unit INTEGER, page_no INTEGER
            );
            """
        )
        db.executemany(
            "INSERT INTO segments VALUES ('paper', ?, 'body', 6, ?)",
            [(161, "3.5 Infrastructure"), (167, "4 The Codebase")],
        )
        extractor_order = [
            {"number": "4", "title": "The Codebase", "page": 6, "level": 1},
            {"number": "3.5", "title": "Infrastructure", "page": 6, "level": 2},
        ]
        with mock.patch("server.extract_pdf_outline", return_value=extractor_order):
            server.store_outline(db, "paper", b"%PDF-test")

        self.assertEqual(
            [row[0] for row in db.execute(
                "SELECT number FROM sections ORDER BY position"
            )],
            ["3.5", "4"],
        )
        db.close()


if __name__ == "__main__":
    unittest.main()
