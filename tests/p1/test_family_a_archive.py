"""P1.2: real 28-source review ZIP and path-integrity regression, no upload."""
from hashlib import sha256
from pathlib import Path
from shutil import copytree
from tempfile import TemporaryDirectory
import stat
import unittest
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED

from scripts.p1.registry import load_registry
from scripts.p1.audit_domain_skills import audit_stage
from scripts.p1.build_staging_archive import build_review_zip,validate_review_zip

ROOT=Path(__file__).resolve().parents[2]
STAGE=ROOT/"staging/p1-domain-skills"
SPECS=load_registry(ROOT/"docs/architecture/skill-and-subskill-registry-v0.5.md",
                    ROOT/"docs/architecture/capability-register-v0.5.md")
OWNERS=frozenset({"A01","A02","A03","A04","A05","B07","B08"})
EXPECTED=frozenset(
    "p1-domain-skills/"+rel
    for spec in SPECS if spec.id in OWNERS
    for rel in (f"skills/{spec.slug}/SKILL.md",*(p.relative_path for p in spec.procedures))
)

def copy_family_a_baseline(destination: Path) -> Path:
    """Isolate immutable seven-Skill P1.2 baseline from additive P1.3 source staging."""
    for spec in SPECS:
        if spec.id in OWNERS:
            copytree(STAGE/"skills"/spec.slug,destination/"skills"/spec.slug)
    return destination

class FamilyAArchiveTests(unittest.TestCase):
    def test_canonical_28_file_source_zip_is_deterministic(self):
        self.assertEqual(len(EXPECTED),28)
        with TemporaryDirectory() as tmp:
            out=Path(tmp)
            subset=copy_family_a_baseline(out/"baseline")
            self.assertEqual(audit_stage(subset,SPECS,OWNERS),[])
            a=build_review_zip(subset,out/"a.zip",SPECS,OWNERS)
            b=build_review_zip(subset,out/"b.zip",SPECS,OWNERS)
            self.assertEqual(sha256(a.read_bytes()).digest(),sha256(b.read_bytes()).digest())
            self.assertEqual(validate_review_zip(a,EXPECTED),[])
            with ZipFile(a) as z:
                self.assertEqual(len(z.namelist()),28)
                self.assertEqual({i.filename for i in z.infolist()},EXPECTED)
                self.assertEqual(sum(x.filename.endswith("/SKILL.md") for x in z.infolist()),7)

    def test_29th_manifest_and_path_escape_are_rejected(self):
        with TemporaryDirectory() as tmp:
            out=Path(tmp)
            subset=copy_family_a_baseline(out/"baseline")
            orig=build_review_zip(subset,out/"valid.zip",SPECS,OWNERS)
            for bogus in ("p1-domain-skills/plugin.json","../secrets.txt"):
                changed=out/"tampered.zip"
                with ZipFile(orig) as src, ZipFile(changed,"w",ZIP_DEFLATED) as target:
                    for i in src.infolist():
                        target.writestr(i,src.read(i))
                    info=ZipInfo(bogus)
                    info.create_system=3
                    info.external_attr=(stat.S_IFREG|0o644)<<16
                    info.compress_type=ZIP_DEFLATED
                    target.writestr(info,"DO NOT SHIP")
                self.assertTrue(validate_review_zip(changed,EXPECTED))

    def test_missing_a04_owner_or_symlink_fails_before_packaging(self):
        with TemporaryDirectory() as tmp:
            clone=Path(tmp)/"staged"
            copy_family_a_baseline(clone)
            source=clone/"skills/regulatory-licensing/references/2-transmission-rule-evaluation.md"
            original=source.read_text(encoding="utf8")
            source.write_text(original.replace("**Owner:** SK-A04","**Owner:** SK-A03"),encoding="utf8")
            self.assertTrue(audit_stage(clone,SPECS,OWNERS))
            with self.assertRaises(ValueError):
                build_review_zip(clone,Path(tmp)/"unsafe.zip",SPECS,OWNERS)
            source.write_text(original,encoding="utf8")
            source.unlink()
            source.symlink_to(clone/"skills/civil-protection/SKILL.md")
            self.assertTrue(audit_stage(clone,SPECS,OWNERS))
