"""P1.5 must preserve the 21-owner P1.4 review ZIP after staging Family D."""
from hashlib import sha256
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from tests.p1 import test_family_c_archive as inherited
from scripts.p1.audit_domain_skills import audit_stage
from scripts.p1.build_staging_archive import build_review_zip,validate_review_zip

P14_SHA = "344b7e7806406738a495d52554d686c27edf2c21c039ea66159943f18fc1076f"

class FamilyDInheritanceTests(unittest.TestCase):
    def test_p14_84_zip_copy_unchanged_with_family_d(self):
        self.assertTrue(hasattr(inherited,"copy_family_c_baseline"),
                        "Need copy_family_c_baseline to preserve prior 84-file source snapshot")
        with TemporaryDirectory() as temp:
            d=Path(temp)
            source=inherited.copy_family_c_baseline(d/"prior")
            self.assertEqual(audit_stage(source,inherited.SPEC,inherited.CUMULATIVE),[])
            archive=build_review_zip(source,d/"p14.zip",inherited.SPEC,inherited.CUMULATIVE)
            self.assertEqual(validate_review_zip(archive,inherited.SOURCE_PATHS),[])
            self.assertEqual(sha256(archive.read_bytes()).hexdigest(),P14_SHA)


from shutil import copytree
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
import stat
D_OWNERS=frozenset({"D22","D23","D24"})
ALL_OWNERS=inherited.CUMULATIVE|D_OWNERS
ALL_EXPECTED=frozenset("p1-domain-skills/"+relative for spec in inherited.SPEC if spec.id in ALL_OWNERS
    for relative in (f"skills/{spec.slug}/SKILL.md",*(p.relative_path for p in spec.procedures)))

class FamilyD96ArchiveTests(unittest.TestCase):
    def test_final_p1_96_members_are_reproducible_and_canonical(self):
        self.assertEqual(len(ALL_OWNERS),24)
        self.assertEqual(len(ALL_EXPECTED),96)
        self.assertEqual(audit_stage(inherited.CURRENT,inherited.SPEC,ALL_OWNERS),[])
        with TemporaryDirectory() as temp:
            base=Path(temp)
            first=build_review_zip(inherited.CURRENT,base/"p15-first.zip",inherited.SPEC,ALL_OWNERS)
            second=build_review_zip(inherited.CURRENT,base/"p15-second.zip",inherited.SPEC,ALL_OWNERS)
            self.assertEqual(first.read_bytes(),second.read_bytes())
            self.assertEqual(validate_review_zip(first,ALL_EXPECTED),[])
            with ZipFile(first) as z:
                files=z.namelist()
            self.assertEqual(len(files),96)
            self.assertEqual(set(files),ALL_EXPECTED)
            self.assertEqual(sum(p.endswith("/SKILL.md") for p in files),24)
            self.assertEqual(sum(p.endswith(".md") and not p.endswith("/SKILL.md") for p in files),72)

    def test_97th_member_and_zip_traversal_fail_closed(self):
        with TemporaryDirectory() as temp:
            p=Path(temp)
            archive=build_review_zip(inherited.CURRENT,p/"baseline.zip",inherited.SPEC,ALL_OWNERS)
            for add in ("p1-domain-skills/plugin.json","../secrets.txt","p1-domain-skills/skills/clubs-mentoring/.env"):
                damaged=p/"unsafe.zip"
                with ZipFile(archive) as inp,ZipFile(damaged,"w",ZIP_DEFLATED) as out:
                    for info in inp.infolist():out.writestr(info,inp.read(info))
                    record=ZipInfo(add);record.create_system=3
                    record.external_attr=(stat.S_IFREG|0o644)<<16
                    out.writestr(record,"not allowed")
                self.assertTrue(validate_review_zip(damaged,ALL_EXPECTED),add)

    def test_wrong_d24_owner_symlink_and_source_extras_rejected(self):
        with TemporaryDirectory() as temp:
            root=Path(temp)/"root"
            copytree(inherited.CURRENT,root,symlinks=True)
            f=root/"skills/clubs-mentoring/references/3-assetmentor-governance.md"
            original=f.read_text(encoding="utf8")
            self.assertIn("**Owner:** SK-D24",original)
            f.write_text(original.replace("**Owner:** SK-D24","**Owner:** SK-D22"),encoding="utf8")
            self.assertTrue(audit_stage(root,inherited.SPEC,ALL_OWNERS))
            f.unlink()
            f.symlink_to(root/"skills/radio-maker/SKILL.md")
            self.assertTrue(audit_stage(root,inherited.SPEC,ALL_OWNERS))
            f.unlink();f.write_text(original,encoding="utf8")
            (root/"skills/radio-academy/plugin.json").write_text("{}")
            self.assertTrue(audit_stage(root,inherited.SPEC,ALL_OWNERS))

    def test_source_casefold_duplicate_and_oversize_rejected(self):
        with TemporaryDirectory() as temp:
            root=Path(temp)/"root";copytree(inherited.CURRENT,root,symlinks=True)
            entry=root/"skills/radio-academy/SKILL.md"
            dup=root/"skills/radio-academy/skill.md"
            dup.write_text(entry.read_text(encoding="utf8"),encoding="utf8")
            self.assertTrue(any("case-fold duplicate" in e for e in audit_stage(root,inherited.SPEC,ALL_OWNERS)))
            dup.unlink()
            entry.write_text("Q"*1_048_577,encoding="utf8")
            self.assertTrue(any("oversize" in e for e in audit_stage(root,inherited.SPEC,ALL_OWNERS)))
