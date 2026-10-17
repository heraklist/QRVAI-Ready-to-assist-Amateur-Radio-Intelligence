"""P1.3 immutable stage remains testable after adding the eight Family C owners."""
from pathlib import Path
from tempfile import TemporaryDirectory
from hashlib import sha256
import unittest
from tests.p1 import test_family_b_archive as old
from scripts.p1.audit_domain_skills import audit_stage
from scripts.p1.build_staging_archive import build_review_zip, validate_review_zip

P13_SHA="50160a037c52de504676593f79fc87f12166ca019d8620a4f98e00e677eb5ceb"
class FamilyCInheritanceTests(unittest.TestCase):
    def test_inherited_52_file_baseline_is_copy_isolated(self):
        self.assertTrue(hasattr(old,"copy_family_b_baseline"),"P1.3 immutable 52-file snapshot needs copy_family_b_baseline")
        with TemporaryDirectory() as temp:
            root=old.copy_family_b_baseline(Path(temp)/"baseline")
            self.assertEqual(audit_stage(root,old.SPECS,old.OWNERS),[])
            z=build_review_zip(root,Path(temp)/"inherited-52.zip",old.SPECS,old.OWNERS)
            self.assertEqual(validate_review_zip(z,old.EXPECTED),[])
            self.assertEqual(sha256(z.read_bytes()).hexdigest(),P13_SHA)


from shutil import copytree
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
import stat

C_FAMILY=frozenset(f"C{i}" for i in range(14,22))
CUMULATIVE=old.OWNERS|C_FAMILY
CURRENT=old.STAGE
SPEC=old.SPECS
SOURCE_PATHS=frozenset("p1-domain-skills/"+relative for d in SPEC if d.id in CUMULATIVE
    for relative in (f"skills/{d.slug}/SKILL.md",*(p.relative_path for p in d.procedures)))

class FamilyC84FileArchiveTests(unittest.TestCase):
    def test_all_84_markdown_files_byte_identical_two_builds(self):
        self.assertEqual(len(CUMULATIVE),21)
        self.assertEqual(len(SOURCE_PATHS),84)
        self.assertEqual(audit_stage(CURRENT,SPEC,CUMULATIVE),[])
        with TemporaryDirectory() as temp:
            p=Path(temp)
            a=build_review_zip(CURRENT,p/"one.zip",SPEC,CUMULATIVE)
            b=build_review_zip(CURRENT,p/"two.zip",SPEC,CUMULATIVE)
            self.assertEqual(sha256(a.read_bytes()).hexdigest(),sha256(b.read_bytes()).hexdigest())
            self.assertEqual(validate_review_zip(a,SOURCE_PATHS),[])
            with ZipFile(a) as z:
                names=z.namelist()
                self.assertEqual(set(names),SOURCE_PATHS)
                self.assertEqual(len(names),84)
                self.assertEqual(sum(name.endswith("/SKILL.md") for name in names),21)
                self.assertEqual(sum(name.endswith(".md") and not name.endswith("/SKILL.md") for name in names),63)
                self.assertFalse(any(name.endswith("plugin.json") for name in names))

    def test_85th_member_plugin_or_path_traversal_fails_closed(self):
        with TemporaryDirectory() as temp:
            p=Path(temp);original=build_review_zip(CURRENT,p/"base.zip",SPEC,CUMULATIVE)
            for name in ("p1-domain-skills/plugin.json","../secrets.txt","p1-domain-skills/skills/contests-portable/.env"):
                dest=p/"tampered.zip"
                with ZipFile(original) as src, ZipFile(dest,"w",ZIP_DEFLATED) as out:
                    for item in src.infolist():out.writestr(item,src.read(item))
                    extra=ZipInfo(name)
                    extra.create_system=3
                    extra.external_attr=(stat.S_IFREG|0o644)<<16
                    extra.compress_type=ZIP_DEFLATED
                    out.writestr(extra,"must reject")
                self.assertTrue(validate_review_zip(dest,SOURCE_PATHS),name)

    def test_wrong_c21_owner_symlink_and_85th_source_file_rejected(self):
        with TemporaryDirectory() as temp:
            root=Path(temp)
            dest=root/"source"
            copytree(CURRENT,dest,symlinks=True)
            target=dest/"skills/contests-portable/references/3-field-operations-review.md"
            original=target.read_text(encoding="utf8")
            target.write_text(original.replace("**Owner:** SK-C21","**Owner:** SK-C20"),encoding="utf8")
            self.assertTrue(audit_stage(dest,SPEC,CUMULATIVE))
            target.write_text(original,encoding="utf8")
            target.unlink()
            target.symlink_to(dest/"skills/operating-dx/SKILL.md")
            self.assertTrue(audit_stage(dest,SPEC,CUMULATIVE))
            target.unlink()
            target.write_text(original,encoding="utf8")
            (dest/"skills/contests-portable/plugin.json").write_text("{}")
            self.assertTrue(audit_stage(dest,SPEC,CUMULATIVE))

    def test_casefold_duplicate_and_oversize_stage_rejected(self):
        with TemporaryDirectory() as tmp:
            target=Path(tmp)/"source"
            copytree(CURRENT,target,symlinks=True)
            source=target/"skills/operating-dx/SKILL.md"
            duplicate=target/"skills/operating-dx/skill.md"
            duplicate.write_text(source.read_text(encoding="utf8"),encoding="utf8")
            errors=audit_stage(target,SPEC,CUMULATIVE)
            self.assertTrue(any("case-fold duplicate" in e for e in errors),errors)
            duplicate.unlink()
            source.write_text("A"*1_048_577,encoding="utf8")
            errors=audit_stage(target,SPEC,CUMULATIVE)
            self.assertTrue(any("oversize" in e for e in errors),errors)

    def test_zip_ratio_guard_rejects_highly_compressible_modified_member(self):
        with TemporaryDirectory() as tmp:
            p=Path(tmp);baseline=build_review_zip(CURRENT,p/"baseline.zip",SPEC,CUMULATIVE)
            edited=p/"ratio.zip"
            with ZipFile(baseline) as inp,ZipFile(edited,"w",ZIP_DEFLATED,compresslevel=9) as out:
                for info in inp.infolist():
                    data=b"A"*60_000 if info.filename=="p1-domain-skills/skills/operating-dx/SKILL.md" else inp.read(info)
                    out.writestr(info,data)
            errors=validate_review_zip(edited,SOURCE_PATHS)
            self.assertTrue(any("compression ratio" in e for e in errors),errors)
