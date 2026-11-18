"""Review ZIP must be deterministic and reject hostile metadata before reading."""
from pathlib import Path
from tempfile import TemporaryDirectory
import hashlib
import stat
import unittest
import warnings
import zipfile
from scripts.p1.registry import load_registry
from scripts.p1.build_staging_archive import build_review_zip, validate_review_zip
from test_stage_audit import make_b07

ROOT = Path(__file__).resolve().parents[2]
SPECS = load_registry(ROOT / "docs/architecture/skill-and-subskill-registry-v0.5.md",
                      ROOT / "docs/architecture/capability-register-v0.5.md")
B07 = next(x for x in SPECS if x.id == "B07")
PREFIX = "p1-domain-skills/"
EXPECTED = frozenset(PREFIX + x for x in
                     ["skills/rf-engineering/SKILL.md"] +
                     [p.relative_path for p in B07.procedures])

class StageArchiveTests(unittest.TestCase):
    def test_deterministic_review_only_four_file_bundle(self):
        with TemporaryDirectory() as tmp:
            root=Path(tmp); stage=root/"stage"; stage.mkdir()
            make_b07(stage)
            a=build_review_zip(stage,root/"a.zip",SPECS,frozenset({"B07"}))
            b=build_review_zip(stage,root/"b.zip",SPECS,frozenset({"B07"}))
            self.assertEqual(hashlib.sha256(a.read_bytes()).digest(),hashlib.sha256(b.read_bytes()).digest())
            with zipfile.ZipFile(a) as archive:
                self.assertEqual({x.filename for x in archive.infolist()},EXPECTED)
                self.assertEqual(len(archive.infolist()),4)
            self.assertEqual(validate_review_zip(a,EXPECTED),[])

    def test_no_empty_real_staging_archive(self):
        with TemporaryDirectory() as tmp:
            with self.assertRaises(ValueError):
                build_review_zip(Path(tmp)/"absent",Path(tmp)/"empty.zip",SPECS,frozenset())

    def assert_bad_zip(self, records):
        with TemporaryDirectory() as tmp:
            path=Path(tmp)/"bad.zip"
            with zipfile.ZipFile(path,"w",zipfile.ZIP_DEFLATED) as archive:
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore",UserWarning)
                    for name,data,mode in records:
                        info=zipfile.ZipInfo(name)
                        info.create_system=3
                        info.external_attr=(mode << 16)
                        info.compress_type=zipfile.ZIP_DEFLATED
                        archive.writestr(info,data)
            self.assertTrue(validate_review_zip(path,EXPECTED))

    def test_reject_path_escape_and_secret(self):
        self.assert_bad_zip([("../secret","bad",stat.S_IFREG|0o644)])
        self.assert_bad_zip([("p1-domain-skills/.env","TOKEN=secret",stat.S_IFREG|0o644)])

    def test_reject_duplicate_member(self):
        name=next(iter(EXPECTED))
        self.assert_bad_zip([(name,"first",stat.S_IFREG|0o644),(name,"second",stat.S_IFREG|0o644)])

    def test_reject_symlink_metadata(self):
        self.assert_bad_zip([(next(iter(EXPECTED)),"target",stat.S_IFLNK|0o777)])

    def test_reject_zip_bomb_and_oversize_entry(self):
        self.assert_bad_zip([(next(iter(EXPECTED)),"A"*12000,stat.S_IFREG|0o644)])
        self.assert_bad_zip([(next(iter(EXPECTED)),"A"*1_048_577,stat.S_IFREG|0o644)])
