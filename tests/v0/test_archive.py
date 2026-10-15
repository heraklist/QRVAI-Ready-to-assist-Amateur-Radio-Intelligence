import hashlib
import copy
from unittest.mock import patch
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


    def test_rejects_tampered_archive_with_broken_or_escaping_references(self):
        for link in ("references/missing.md", "../../private.txt", "javascript:bad"):
            with self.subTest(link=link), tempfile.TemporaryDirectory() as tmp:
                original = build_archive(ROOT / "qrvai", Path(tmp) / "original.zip")
                altered = Path(tmp) / "tampered.zip"
                with zipfile.ZipFile(original) as source, zipfile.ZipFile(altered, "w") as target:
                    for entry in source.infolist():
                        blob = source.read(entry.filename)
                        if entry.filename == "qrvai/skills/qrvai-core/SKILL.md":
                            blob = blob.replace(b"references/routing.md", link.encode("utf-8"))
                        target.writestr(entry, blob)
                errors = validate_archive(altered)
                self.assertTrue(any("reference" in x.lower() for x in errors), errors)

    def test_rejects_tampered_archive_with_non_utf8_reference(self):
        with tempfile.TemporaryDirectory() as tmp:
            original = build_archive(ROOT / "qrvai", Path(tmp) / "original.zip")
            altered = Path(tmp) / "invalid-utf8.zip"
            with zipfile.ZipFile(original) as source, zipfile.ZipFile(altered, "w") as target:
                for entry in source.infolist():
                    blob = source.read(entry.filename)
                    if entry.filename == "qrvai/skills/qrvai-core/references/routing.md":
                        blob = bytes([0xff, 0xfe])
                    target.writestr(entry, blob)
            errors = validate_archive(altered)
            self.assertTrue(any("utf-8" in x.lower() for x in errors), errors)

    def test_malformed_https_reference_in_zip_fails_closed(self):
        with tempfile.TemporaryDirectory() as tmp:
            original = build_archive(ROOT / "qrvai", Path(tmp) / "original.zip")
            altered = Path(tmp) / "malformed-link.zip"
            with zipfile.ZipFile(original) as source, zipfile.ZipFile(altered, "w") as target:
                for entry in source.infolist():
                    blob = source.read(entry.filename)
                    if entry.filename == "qrvai/skills/qrvai-core/SKILL.md":
                        blob = blob.replace(b"references/routing.md", b"https://[")
                    target.writestr(entry, blob)
            errors = validate_archive(altered)
            self.assertTrue(any("reference" in e.lower() for e in errors), errors)


    def test_tampered_skill_description_array_fails_archive_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            source_path = build_archive(ROOT / "qrvai", Path(tmp) / "baseline.zip")
            tampered = Path(tmp) / "array-description.zip"
            original = b"description: Use for broad QRVAI amateur radio assistance, capability navigation, cross-family questions, and safe routing to a Family Skill."
            with zipfile.ZipFile(source_path) as original_zip, zipfile.ZipFile(tampered, "w") as changed_zip:
                for entry in original_zip.infolist():
                    data = original_zip.read(entry.filename)
                    if entry.filename == "qrvai/skills/qrvai-core/SKILL.md":
                        self.assertIn(original, data)
                        data = data.replace(original, b"description: [not, a, string]")
                    changed_zip.writestr(entry, data)
            errs = validate_archive(tampered)
            self.assertTrue(any("description" in e.lower() for e in errs), errs)


    def test_zip_metadata_oversize_rejected_without_reading_payload(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = build_archive(ROOT / "qrvai", Path(tmp) / "valid.zip")
            with zipfile.ZipFile(path) as z:
                fake = [copy.copy(item) for item in z.infolist()]
            fake[0].file_size = 1_048_577
            with patch.object(zipfile.ZipFile, "infolist", return_value=fake):
                with patch.object(zipfile.ZipFile, "read", side_effect=AssertionError("payload read before preflight")) as reader:
                    issues = validate_archive(path)
            self.assertTrue(any("size limit" in error.lower() for error in issues), issues)
            reader.assert_not_called()

    def test_zip_bomb_ratio_rejected_without_reading_payload(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = build_archive(ROOT / "qrvai", Path(tmp) / "valid.zip")
            with zipfile.ZipFile(path) as z:
                fake = [copy.copy(item) for item in z.infolist()]
            fake[0].file_size = 500_000
            fake[0].compress_size = 1
            with patch.object(zipfile.ZipFile, "infolist", return_value=fake):
                with patch.object(zipfile.ZipFile, "read", side_effect=AssertionError("payload read before compression check")) as reader:
                    issues = validate_archive(path)
            self.assertTrue(any("compression ratio" in error.lower() for error in issues), issues)
            reader.assert_not_called()


if __name__ == "__main__":
    unittest.main()
