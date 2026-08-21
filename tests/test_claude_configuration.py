import json
import io
import subprocess
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import patch

import server
from backend import claude_codex_adapter


class ClaudeConfigurationTests(unittest.TestCase):
    def test_configuration_can_be_saved_without_installed_cli(self) -> None:
        with tempfile.TemporaryDirectory() as directory, patch.object(
            server, "SETTINGS_DB_PATH", Path(directory) / "settings.sqlite3"
        ):
            saved = server.save_claude_configuration("claude", "sonnet")
            self.assertTrue(saved["saved"])
            self.assertFalse(saved["configured"])

            with patch.object(server.subprocess, "run", side_effect=FileNotFoundError()):
                failed = server.test_claude_configuration()
            self.assertFalse(failed["configured"])
            self.assertIn("npm install -g @anthropic-ai/claude-code", failed["error"])
            self.assertIn("/login", failed["error"])

    def test_real_noninteractive_probe_verifies_login_and_model(self) -> None:
        calls = []
        with tempfile.TemporaryDirectory() as directory, patch.object(
            server, "SETTINGS_DB_PATH", Path(directory) / "settings.sqlite3"
        ):
            server.save_claude_configuration("claude --flag-from-wrapper", "sonnet")

            def fake_run(command, **_kwargs):
                calls.append(command)
                if "--version" in command:
                    return subprocess.CompletedProcess(command, 0, "2.1.0 (Claude Code)\n", "")
                return subprocess.CompletedProcess(command, 0, json.dumps({"result": "CONFIG_OK"}), "")

            with patch.object(server.shutil, "which", return_value="/usr/bin/claude"), patch.object(
                server.subprocess, "run", side_effect=fake_run
            ):
                verified = server.test_claude_configuration()

            self.assertTrue(verified["configured"])
            self.assertEqual(verified["authMethod"], "claude_account")
            self.assertNotIn("--flag-from-wrapper", calls[0])
            self.assertEqual(calls[1][:2], ["/usr/bin/claude", "--flag-from-wrapper"])
            self.assertIn("-p", calls[1])
            self.assertIn("--output-format", calls[1])
            self.assertNotIn("--bare", calls[1])

    def test_verified_claude_can_be_selected_and_builds_adapter_command(self) -> None:
        with tempfile.TemporaryDirectory() as directory, patch.object(
            server, "SETTINGS_DB_PATH", Path(directory) / "settings.sqlite3"
        ):
            server.save_claude_configuration("claude", "sonnet")
            with server.connect_accounts_db() as db:
                db.execute("UPDATE machine_claude_config SET verified = 1 WHERE id = 1")
            status = server.set_active_ai_provider("claude")
            self.assertEqual(status["activeProvider"], "claude")
            command = server.ai_exec_command("--output-schema", "schema.json", "prompt")
            self.assertEqual(command[0], server.sys.executable)
            self.assertIn(str(server.CLAUDE_ADAPTER_PATH), command)
            self.assertIn("--claude-model", command)
            self.assertIn("sonnet", command)

    def test_unverified_provider_cannot_be_selected(self) -> None:
        with tempfile.TemporaryDirectory() as directory, patch.object(
            server, "SETTINGS_DB_PATH", Path(directory) / "settings.sqlite3"
        ):
            server.save_claude_configuration("claude", "sonnet")
            with self.assertRaisesRegex(ValueError, "先保存并测试 Claude Code"):
                server.set_active_ai_provider("claude")

    def test_adapter_writes_structured_output_and_normalizes_usage(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            schema_path = root / "schema.json"
            output_path = root / "result.json"
            schema_path.write_text(
                json.dumps({"type": "object", "properties": {"answer": {"type": "string"}}}),
                encoding="utf-8",
            )
            response = {
                "structured_output": {"answer": "ok"},
                "usage": {
                    "input_tokens": 10, "cache_read_input_tokens": 4,
                    "cache_creation_input_tokens": 2, "output_tokens": 3,
                },
            }

            def fake_run(command, **_kwargs):
                self.assertIn("--json-schema", command)
                self.assertIn("--no-session-persistence", command)
                self.assertNotIn("--bare", command)
                return subprocess.CompletedProcess(command, 0, json.dumps(response), "")

            stdout = io.StringIO()
            stderr = io.StringIO()
            arguments = [
                "--claude-command-json", json.dumps(["claude"]),
                "--claude-model", "sonnet", "--output-schema", str(schema_path),
                "--output-last-message", str(output_path), "prompt",
            ]
            with patch.object(claude_codex_adapter.subprocess, "run", side_effect=fake_run), patch.object(
                claude_codex_adapter.sys, "stdin", io.StringIO('{"input": true}')
            ), redirect_stdout(stdout), redirect_stderr(stderr):
                return_code = claude_codex_adapter.main(arguments)

            self.assertEqual(return_code, 0, stderr.getvalue())
            self.assertEqual(json.loads(output_path.read_text(encoding="utf-8")), {"answer": "ok"})
            usage = json.loads(stdout.getvalue())
            self.assertEqual(usage["usage"]["input_tokens"], 16)
            self.assertEqual(usage["usage"]["cached_input_tokens"], 6)


if __name__ == "__main__":
    unittest.main()
