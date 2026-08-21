import os
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import server


class CodexConfigurationTests(unittest.TestCase):
    def test_windows_cli_environment_derives_codex_home_from_user_profile(self) -> None:
        with patch.dict(os.environ, {"USERPROFILE": r"D:\Users\reader"}, clear=True), patch.object(
            server.sys, "platform", "win32"
        ):
            environment = server.cli_subprocess_environment()

        self.assertEqual(environment["CODEX_HOME"], r"D:\Users\reader\.codex")

    def test_windows_cli_environment_preserves_custom_codex_home(self) -> None:
        with patch.dict(
            os.environ,
            {"USERPROFILE": r"D:\Users\reader", "CODEX_HOME": r"E:\codex-config"},
            clear=True,
        ), patch.object(server.sys, "platform", "win32"):
            environment = server.cli_subprocess_environment()

        self.assertEqual(environment["CODEX_HOME"], r"E:\codex-config")

    def test_windows_cli_environment_finds_existing_home_without_environment_variables(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            profile = Path(directory) / "reader"
            project = profile / "work" / "paper-desk"
            (profile / ".codex").mkdir(parents=True)
            project.mkdir(parents=True)
            with patch.dict(os.environ, {}, clear=True), patch.object(
                server.sys, "platform", "win32"
            ), patch.object(server, "ROOT", project), patch.object(
                server.Path, "home", side_effect=RuntimeError("no profile")
            ), patch.object(server.shutil, "which", return_value=None):
                environment = server.cli_subprocess_environment()

        self.assertEqual(environment["CODEX_HOME"], str(profile / ".codex"))

    def test_configuration_can_be_saved_and_verified(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            settings_path = Path(directory) / "settings.sqlite3"
            with patch.object(server, "SETTINGS_DB_PATH", settings_path):
                saved = server.save_codex_configuration("codex", "test-model", "medium")
                self.assertTrue(saved["saved"])
                self.assertFalse(saved["configured"])

                def fake_run(command, **_kwargs):
                    if "--version" in command:
                        return subprocess.CompletedProcess(command, 0, "codex-cli 1.0\n", "")
                    if "login" in command:
                        return subprocess.CompletedProcess(command, 0, "Logged in using ChatGPT\n", "")
                    return subprocess.CompletedProcess(command, 0, "CONFIG_OK\n", "")

                with patch.object(server.shutil, "which", return_value="/usr/bin/codex"), patch.object(server.subprocess, "run", side_effect=fake_run):
                    verified = server.test_codex_configuration()
                self.assertTrue(verified["configured"])
                self.assertEqual(verified["testReply"], "CONFIG_OK")

    def test_profile_is_used_only_for_runtime_probe(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            settings_path = Path(directory) / "settings.sqlite3"
            calls = []
            with patch.object(server, "SETTINGS_DB_PATH", settings_path):
                saved = server.save_codex_configuration(
                    "codex --profile research", "provider/model latest", "future-effort"
                )
                self.assertEqual(saved["command"], "codex --profile research")
                self.assertEqual(saved["model"], "provider/model latest")
                self.assertEqual(saved["reasoningEffort"], "future-effort")

                def fake_run(command, **_kwargs):
                    calls.append(command)
                    if "--version" in command:
                        return subprocess.CompletedProcess(command, 0, "codex-cli 1.0\n", "")
                    if "login" in command:
                        return subprocess.CompletedProcess(command, 0, "Logged in using ChatGPT\n", "")
                    return subprocess.CompletedProcess(command, 0, "CONFIG_OK\n", "")

                with patch.object(server.shutil, "which", return_value="/usr/bin/codex"), patch.object(
                    server.subprocess, "run", side_effect=fake_run
                ):
                    verified = server.test_codex_configuration()

            self.assertTrue(verified["configured"])
            self.assertNotIn("--profile", calls[0])
            self.assertNotIn("--profile", calls[1])
            self.assertEqual(calls[2][:4], ["/usr/bin/codex", "--profile", "research", "exec"])

    def test_invalid_or_failed_command_is_saved_and_returns_real_feedback(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            settings_path = Path(directory) / "settings.sqlite3"
            with patch.object(server, "SETTINGS_DB_PATH", settings_path):
                saved = server.save_codex_configuration('custom-wrapper "unfinished', "any model", "anything")
                self.assertTrue(saved["saved"])
                failed = server.test_codex_configuration()
                self.assertFalse(failed["configured"])
                self.assertIn("命令无法解析", failed["error"])

                server.save_codex_configuration("custom-wrapper --new-flag", "any model", "anything")

                def fake_run(command, **_kwargs):
                    if "--version" in command or "login" in command:
                        return subprocess.CompletedProcess(command, 1, "", "metadata unavailable")
                    return subprocess.CompletedProcess(command, 23, "", "the actual runtime failure")

                with patch.object(server.shutil, "which", return_value="/usr/bin/custom-wrapper"), patch.object(
                    server.subprocess, "run", side_effect=fake_run
                ):
                    failed = server.test_codex_configuration()
                self.assertFalse(failed["configured"])
                self.assertIn("退出码 23", failed["error"])
                self.assertIn("the actual runtime failure", failed["error"])


if __name__ == "__main__":
    unittest.main()
