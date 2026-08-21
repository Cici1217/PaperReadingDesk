import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class HomeLanguageTests(unittest.TestCase):
    def test_home_exposes_all_interface_languages(self) -> None:
        home = (ROOT / "frontend" / "index.html").read_text(encoding="utf-8")
        script = (ROOT / "frontend" / "config-home.js").read_text(encoding="utf-8")

        for language in ("zh", "ja", "en", "ko"):
            self.assertIn(f'data-lang="{language}"', home)
            self.assertIn(f"  {language}: {{", script)
        self.assertIn('data-home-i18n="heroTitle"', home)
        self.assertIn('const HOME_LANGUAGE_KEY = "selfPage.language.v1"', script)
        self.assertIn("setHomeLanguage(homeLanguage)", script)


if __name__ == "__main__":
    unittest.main()
