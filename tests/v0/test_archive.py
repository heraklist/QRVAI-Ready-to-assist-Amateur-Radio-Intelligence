import hashlib
import shutil
import tempfile
from pathlib import Path
import unittest
import zipfile

from scripts.v0.build_archive import expected_package_paths, build_archive, validate_archive

ROOT = Path(__file__).resolve().parents[2]


class TestArchive(unittest.TestCase):
    def test_clean_archive_has_exact_12_files(self):
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder) / "qrvai.zip"
            build_archive(ROOT / "qrvai", output)
            self.assertEqual(validate_archive(output), [])
            with zipfile.ZipFile(output) as archive:
                names = sorted(archive.namelist())
            self.assertEqual(names, sorted("qrvai/" + p for p in expected_package_paths()))
            self.assertEqual(len(names), 12)

    def test_rejects_legacy_w21_and_secret_files(self):
        with tempfile.TemporaryDirectory() as folder:
            staged = Path(folder) / "qrvai"
            shutil.copytree(ROOT / "qrvai", staged)
            injected = staged / "assets/w21/owner_images"
            injected.mkdir(parents=True)
            (injected / "legacy.jpeg").write_bytes(b"old")
            with self.assertRaises(ValueError):
                build_archive(staged, Path(folder) / "legacy.zip")
            shutil.rmtree(staged / "assets")
            (staged / ".env").write_text("API_KEY=secret", encoding="utf-8")
            with self.assertRaises(ValueError):
                build_archive(staged, Path(folder) / "secret.zip")

    def test_reproducible_archive_hash(self):
        with tempfile.TemporaryDirectory() as folder:
            out1 = Path(folder) / "a.zip"
            out2 = Path(folder) / "b.zip"
            build_archive(ROOT / "qrvai", out1)
            build_archive(ROOT / "qrvai", out2)
            self.assertEqual(hashlib.sha256(out1.read_bytes()).digest(),
                             hashlib.sha256(out2.read_bytes()).digest())

    def test_archive_no_mcp_or_external_endpoint(self):
        with tempfile.TemporaryDirectory() as folder:
            path = build_archive(ROOT / "qrvai", Path(folder) / "clean.zip")
            with zipfile.ZipFile(path) as archive:
                self.assertFalse(any("mcp.json" in x or ".app.json" in x for x in archive.namelist()))
                self.assertTrue(all("http://example.com/mcp" not in archive.read(x).decode("utf-8")
                                    for x in archive.namelist()))


if __name__ == "__main__":
    unittest.main()
