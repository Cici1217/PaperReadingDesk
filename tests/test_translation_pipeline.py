import sqlite3
import subprocess
import tempfile
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest import mock

import server


class TranslationPipelineTests(unittest.TestCase):
    def test_inline_abstract_heading_is_translatable_front_matter(self) -> None:
        units = [
            {"page": 1, "paragraph": 0, "text": "A Paper Title", "type": "body"},
            {"page": 1, "paragraph": 1, "text": "Ada Author", "type": "body"},
            {
                "page": 1,
                "paragraph": 2,
                "text": "Abstract We present a compact method for testing merged PDF headings.",
                "type": "body",
            },
            {
                "page": 1,
                "paragraph": 2,
                "text": "It works across common scholarly document layouts.",
                "type": "body",
            },
            {"page": 2, "paragraph": 3, "text": "Introduction", "type": "body"},
        ]

        server.classify_paper_unit_types(units)

        self.assertEqual(
            [unit["type"] for unit in units],
            ["metadata", "metadata", "abstract", "abstract", "body"],
        )

    def test_title_beginning_with_abstract_is_not_an_abstract_heading(self) -> None:
        units = [
            {
                "page": 1,
                "paragraph": 0,
                "text": "Abstract Reasoning for Visual Question Answering",
                "type": "body",
            },
            {"page": 1, "paragraph": 1, "text": "Ada Author", "type": "body"},
            {
                "page": 1,
                "paragraph": 2,
                "text": "Abstract: We introduce a reliable benchmark.",
                "type": "body",
            },
            {"page": 2, "paragraph": 3, "text": "Introduction", "type": "body"},
        ]

        server.classify_paper_unit_types(units)

        self.assertEqual(
            [unit["type"] for unit in units],
            ["metadata", "metadata", "abstract", "body"],
        )

    def test_codex_jsonl_usage_sums_completed_turns_without_double_counting_subsets(self) -> None:
        output = "\n".join([
            '{"type":"thread.started","thread_id":"one"}',
            '{"type":"turn.completed","usage":{"input_tokens":100,"cached_input_tokens":60,"output_tokens":20,"reasoning_output_tokens":5}}',
            "not-json",
            '{"type":"turn.completed","usage":{"input_tokens":40,"cached_input_tokens":10,"output_tokens":8,"reasoning_output_tokens":2}}',
        ])
        usage = server.codex_usage_from_jsonl(output)
        self.assertEqual(usage, {
            "input_tokens": 140,
            "cached_input_tokens": 70,
            "output_tokens": 28,
            "reasoning_output_tokens": 7,
        })
        self.assertEqual(usage["input_tokens"] + usage["output_tokens"], 168)

    def test_translation_usage_is_exposed_in_reader_ui(self) -> None:
        frontend = Path(__file__).resolve().parents[1] / "frontend"
        html = (frontend / "papers.html").read_text(encoding="utf-8")
        script = (frontend / "papers.js").read_text(encoding="utf-8")
        server_source = (frontend.parent / "server.py").read_text(encoding="utf-8")
        self.assertIn('id="readerTranslationStats"', html)
        self.assertIn("translationStats", script)
        self.assertIn("cachedInputTokens", script)
        self.assertGreaterEqual(server_source.count('"--json"'), 3)

    def test_translation_usage_is_accumulated_atomically_per_paper(self) -> None:
        with tempfile.TemporaryDirectory() as directory, mock.patch.object(
            server, "DATA_DIR", Path(directory)
        ):
            with server.connect_db() as db:
                db.execute(
                    """CREATE TABLE papers (
                       id TEXT PRIMARY KEY,
                       translation_input_tokens INTEGER NOT NULL DEFAULT 0,
                       translation_cached_input_tokens INTEGER NOT NULL DEFAULT 0,
                       translation_output_tokens INTEGER NOT NULL DEFAULT 0,
                       translation_reasoning_output_tokens INTEGER NOT NULL DEFAULT 0,
                       updated_at TEXT NOT NULL DEFAULT ''
                    )"""
                )
                db.execute("INSERT INTO papers(id) VALUES ('paper')")
            event = '{"type":"turn.completed","usage":{"input_tokens":100,"cached_input_tokens":60,"output_tokens":20,"reasoning_output_tokens":5}}'
            server.record_translation_codex_usage("local", "paper", event)
            server.record_translation_codex_usage("local", "paper", event)
            with server.connect_db() as db:
                values = tuple(db.execute(
                    """SELECT translation_input_tokens,
                       translation_cached_input_tokens, translation_output_tokens,
                       translation_reasoning_output_tokens FROM papers WHERE id = 'paper'"""
                ).fetchone())
            self.assertEqual(values, (200, 120, 40, 10))

    def test_parallel_translation_usage_writes_do_not_lock_database(self) -> None:
        with tempfile.TemporaryDirectory() as directory, mock.patch.object(
            server, "DATA_DIR", Path(directory)
        ):
            with server.connect_db() as db:
                db.execute("PRAGMA journal_mode = WAL")
                db.execute(
                    """CREATE TABLE papers (
                       id TEXT PRIMARY KEY,
                       translation_input_tokens INTEGER NOT NULL DEFAULT 0,
                       translation_cached_input_tokens INTEGER NOT NULL DEFAULT 0,
                       translation_output_tokens INTEGER NOT NULL DEFAULT 0,
                       translation_reasoning_output_tokens INTEGER NOT NULL DEFAULT 0,
                       updated_at TEXT NOT NULL DEFAULT ''
                    )"""
                )
                db.execute("INSERT INTO papers(id) VALUES ('paper')")
            event = '{"type":"turn.completed","usage":{"input_tokens":3,"cached_input_tokens":1,"output_tokens":2,"reasoning_output_tokens":1}}'
            start = threading.Barrier(8)

            def write_usage() -> None:
                start.wait()
                for _ in range(10):
                    server.record_translation_codex_usage("local", "paper", event)

            with ThreadPoolExecutor(max_workers=8) as executor:
                list(executor.map(lambda _: write_usage(), range(8)))
            with server.connect_db() as db:
                values = tuple(db.execute(
                    """SELECT translation_input_tokens,
                       translation_cached_input_tokens, translation_output_tokens,
                       translation_reasoning_output_tokens FROM papers WHERE id = 'paper'"""
                ).fetchone())
            self.assertEqual(values, (240, 80, 160, 80))

    def test_database_connections_do_not_renegotiate_wal_mode(self) -> None:
        source = Path(server.__file__).read_text(encoding="utf-8")
        connect_body = source[source.index("def connect_db"):source.index("def connect_accounts_db")]
        self.assertNotIn("journal_mode", connect_body)
        self.assertIn("busy_timeout", connect_body)

    def test_metrics_lock_does_not_discard_successful_codex_result(self) -> None:
        completed = subprocess.CompletedProcess(["codex"], 0, stdout="{}", stderr="")
        with mock.patch.object(server.subprocess, "run", return_value=completed) as run, mock.patch.object(
            server, "record_translation_codex_usage",
            side_effect=sqlite3.OperationalError("database is locked"),
        ):
            result = server.run_translation_codex("local", "paper", ["codex"], {})
        self.assertIs(result, completed)
        self.assertEqual(run.call_args.kwargs["encoding"], "utf-8")
        self.assertIn("env", run.call_args.kwargs)

    def test_codex_command_failure_is_retried_once_without_real_translation(self) -> None:
        attempts = 0

        def fake_exec(*arguments: str) -> list[str]:
            return ["codex", *arguments]

        def fake_run(_username, _paper_id, command, _payload):
            nonlocal attempts
            attempts += 1
            if attempts == 1:
                return subprocess.CompletedProcess(command, 1, stdout="", stderr="temporary failure")
            output_index = command.index("--output-last-message") + 1
            Path(command[output_index]).write_text(
                '{"translations":[{"id":"u0","zh":"测试译文。"}]}', encoding="utf-8"
            )
            return subprocess.CompletedProcess(command, 0, stdout="", stderr="")

        rows = [{"unit_index": 0, "en_text": "Test text."}]
        with mock.patch.object(server, "codex_exec_command", side_effect=fake_exec), mock.patch.object(
            server, "run_translation_codex", side_effect=fake_run,
        ):
            translations = server.run_codex_translation("local", "paper", rows)
        self.assertEqual(translations, {"u0": "测试译文。"})
        self.assertEqual(attempts, 2)

    def test_successful_parallel_batches_are_saved_when_another_batch_fails(self) -> None:
        with tempfile.TemporaryDirectory() as directory, mock.patch.object(
            server, "DATA_DIR", Path(directory)
        ), mock.patch.object(server, "TRANSLATION_BATCH_UNITS", 1):
            with server.connect_db() as db:
                db.executescript(
                    """
                    CREATE TABLE papers (
                        id TEXT PRIMARY KEY, document_title TEXT, title TEXT,
                        unit_count INTEGER, translated_count INTEGER DEFAULT 0,
                        progress INTEGER DEFAULT 0, updated_at TEXT DEFAULT ''
                    );
                    CREATE TABLE segments (
                        id INTEGER PRIMARY KEY, paper_id TEXT, unit_index INTEGER,
                        en_text TEXT, zh_text TEXT DEFAULT ''
                    );
                    CREATE TABLE sections (
                        id TEXT PRIMARY KEY, paper_id TEXT, title TEXT, start_unit INTEGER
                    );
                    CREATE TABLE translation_memory (
                        source_hash TEXT, target_language TEXT, source_text TEXT,
                        translated_text TEXT, updated_at TEXT,
                        PRIMARY KEY(source_hash, target_language)
                    );
                    INSERT INTO papers(id, document_title, title, unit_count)
                    VALUES ('paper', 'Title', 'Title', 2);
                    INSERT INTO segments(id, paper_id, unit_index, en_text)
                    VALUES (1, 'paper', 0, 'first'), (2, 'paper', 1, 'second');
                    """
                )
                rows = db.execute(
                    "SELECT id, unit_index, en_text FROM segments ORDER BY unit_index"
                ).fetchall()

            def fake_translate(_username, _paper_id, batch, *_args):
                unit_index = int(batch[0]["unit_index"])
                if unit_index == 0:
                    raise RuntimeError("one batch failed")
                return {"u1": "第二段。"}

            with mock.patch.object(server, "run_codex_translation", side_effect=fake_translate):
                with self.assertRaisesRegex(RuntimeError, "one batch failed"):
                    server.translate_segment_rows(
                        "local", "paper", rows, "zh", content_role="body", max_workers=2
                    )
            with server.connect_db() as db:
                saved = db.execute(
                    "SELECT zh_text FROM segments WHERE unit_index = 1"
                ).fetchone()["zh_text"]
                progress = db.execute(
                    "SELECT translated_count, progress FROM papers WHERE id = 'paper'"
                ).fetchone()
            self.assertEqual(saved, "第二段。")
            self.assertEqual((progress["translated_count"], progress["progress"]), (1, 50))

    def test_body_translation_precedes_optional_structure_enrichment(self) -> None:
        source = Path(server.__file__).read_text(encoding="utf-8")
        function = source[source.index("def translate_paper"):source.index("def _translation_batches")]
        self.assertLess(function.rindex("translate_segment_rows("), function.index("enrich_paper_structure("))

    def test_exact_translation_memory_reuses_all_duplicate_segments(self) -> None:
        db = sqlite3.connect(":memory:")
        db.row_factory = sqlite3.Row
        db.executescript(
            """
            CREATE TABLE segments (
                id INTEGER PRIMARY KEY, paper_id TEXT, en_text TEXT,
                zh_text TEXT DEFAULT '', unit_type TEXT DEFAULT 'body'
            );
            CREATE TABLE translation_memory (
                source_hash TEXT, target_language TEXT, source_text TEXT,
                translated_text TEXT, updated_at TEXT,
                PRIMARY KEY(source_hash, target_language)
            );
            """
        )
        source = "The policy predicts an action."
        source_hash = server._translation_memory_hash(source)
        db.executemany(
            "INSERT INTO segments(id, paper_id, en_text) VALUES (?, 'paper', ?)",
            [(1, source), (2, source)],
        )
        db.execute(
            "INSERT INTO translation_memory VALUES (?, 'zh', ?, '该策略预测一个动作。', 'now')",
            (source_hash, source),
        )
        server.apply_translation_memory(db, "paper", "zh")
        self.assertEqual(
            [row[0] for row in db.execute("SELECT zh_text FROM segments ORDER BY id")],
            ["该策略预测一个动作。", "该策略预测一个动作。"],
        )
        db.close()

    def test_quality_check_protects_citations_decimals_and_percentages(self) -> None:
        source = "Accuracy improves from 72.5% to 81.3% [12, 13]."
        self.assertEqual(server._missing_translation_literals(source, "准确率从 72.5% 提升到 81.3% [12, 13]。"), [])
        self.assertEqual(server._missing_translation_literals(source, "准确率提升到 81.3%。"), ["72.5%", "[12, 13]"])

    def test_citation_spacing_and_dash_style_do_not_fail_translation(self) -> None:
        source = "Vision encoders [8, 9, 25] and language models [10, 23, 34– 36]."
        translated = "视觉编码器 [8,9,25] 和语言模型 [10, 23, 34-36]。"
        self.assertEqual(server._missing_translation_literals(source, translated), [])

    def test_percentage_wording_preserves_value_without_requiring_symbol(self) -> None:
        source = "OpenVLA improves absolute success rate by 16.5%."
        translated = "OpenVLA 将绝对成功率提高了 16.5 个百分点。"
        self.assertEqual(server._missing_translation_literals(source, translated), [])

    def test_batch_import_dialog_sends_one_layout_choice_for_all_files(self) -> None:
        frontend = Path(__file__).resolve().parents[1] / "frontend"
        html = (frontend / "papers.html").read_text(encoding="utf-8")
        script = (frontend / "papers.js").read_text(encoding="utf-8")
        self.assertIn('name="layoutMode" value="auto"', html)
        self.assertIn('name="layoutMode" value="single"', html)
        self.assertIn('name="layoutMode" value="double"', html)
        self.assertLess(script.index("await choosePaperImportOptions()"), script.index("for (const file of files)"))
        self.assertIn('"X-Paper-Layout": importOptions.layoutMode', script)


if __name__ == "__main__":
    unittest.main()
