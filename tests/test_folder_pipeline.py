import unittest
from pathlib import Path

import server


ROOT = Path(__file__).resolve().parents[1]


class FolderPipelineTests(unittest.TestCase):
    def test_root_folder_button_does_not_pass_click_event_as_parent(self) -> None:
        script = (ROOT / "frontend" / "papers.js").read_text(encoding="utf-8")
        self.assertIn(
            'addFolderButton.addEventListener("click", () => addFolder())',
            script,
        )
        self.assertNotIn(
            'addFolderButton.addEventListener("click", addFolder)',
            script,
        )

    def test_optional_folder_id_rejects_json_objects(self) -> None:
        self.assertIsNone(server.normalize_optional_folder_id(None))
        self.assertIsNone(server.normalize_optional_folder_id(""))
        folder_id = "dc632201-44b0-49bc-b6ae-704c49c63601"
        self.assertEqual(server.normalize_optional_folder_id(f"  {folder_id}  "), folder_id)
        with self.assertRaisesRegex(ValueError, "string or null"):
            server.normalize_optional_folder_id({"isTrusted": True})
        with self.assertRaisesRegex(ValueError, "invalid"):
            server.normalize_optional_folder_id("not/a/folder")


if __name__ == "__main__":
    unittest.main()
