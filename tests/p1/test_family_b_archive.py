"""Additive P1.3 source archive characterization, not an installable plugin."""
from hashlib import sha256
from pathlib import Path
from tempfile import TemporaryDirectory
from shutil import copytree
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
import stat,unittest

from scripts.p1.registry import load_registry
from scripts.p1.audit_domain_skills import audit_stage
from scripts.p1.build_staging_archive import build_review_zip,validate_review_zip

ROOT=Path(__file__).resolve().parents[2]
STAGE=ROOT/"staging/p1-domain-skills"
SPECS=load_registry(ROOT/"docs/architecture/skill-and-subskill-registry-v0.5.md",ROOT/"docs/architecture/capability-register-v0.5.md")
OWNERS=frozenset({"A01","A02","A03","A04","A05","B06","B07","B08","B09","B10","B11","B12","B13"})
EXPECTED=frozenset("p1-domain-skills/"+relative for d in SPECS if d.id in OWNERS
    for relative in (f"skills/{d.slug}/SKILL.md",*(p.relative_path for p in d.procedures)))

def copy_family_b_baseline(destination: Path) -> Path:
    """Preserve P1.3 thirteen-owner 52-file staging independently of additive Family C."""
    for d in SPECS:
        if d.id in OWNERS:
            copytree(STAGE/"skills"/d.slug,destination/"skills"/d.slug,symlinks=True)
    return destination

class EngineeringArchiveTests(unittest.TestCase):
    def test_exact_52_file_stage_rebuilds_byte_identical(self):
        self.assertEqual(len(EXPECTED),52)
        with TemporaryDirectory() as tmp:
            out=Path(tmp)
            subset=copy_family_b_baseline(out/"source")
            self.assertEqual(audit_stage(subset,SPECS,OWNERS),[])
            a=build_review_zip(subset,out/"1.zip",SPECS,OWNERS)
            b=build_review_zip(subset,out/"2.zip",SPECS,OWNERS)
            self.assertEqual(sha256(a.read_bytes()).hexdigest(),sha256(b.read_bytes()).hexdigest())
            self.assertEqual(validate_review_zip(a,EXPECTED),[])
            with ZipFile(a) as z:
                self.assertEqual(len(z.namelist()),52)
                self.assertEqual(sum(n.endswith("/SKILL.md") for n in z.namelist()),13)
                self.assertEqual(sum(n.startswith("p1-domain-skills/skills/") and n.endswith(".md") and not n.endswith("SKILL.md") for n in z.namelist()),39)
                self.assertEqual(set(z.namelist()),EXPECTED)
                self.assertNotIn("plugin.json",z.namelist())

    def test_53rd_file_and_escape_are_rejected(self):
        with TemporaryDirectory() as tmp:
            d=Path(tmp);subset=copy_family_b_baseline(d/"source")
            base=build_review_zip(subset,d/"original.zip",SPECS,OWNERS)
            for bogus in ("p1-domain-skills/plugin.json","../secrets.txt"):
                dst=d/"tamper.zip"
                with ZipFile(base) as source,ZipFile(dst,"w",ZIP_DEFLATED) as target:
                    for item in source.infolist():target.writestr(item,source.read(item))
                    x=ZipInfo(bogus);x.create_system=3;x.external_attr=(stat.S_IFREG|0o644)<<16;x.compress_type=ZIP_DEFLATED
                    target.writestr(x,"not permitted")
                self.assertTrue(validate_review_zip(dst,EXPECTED),bogus)

    def test_b11_wrong_owner_symlink_and_hidden_53rd_source_rejected(self):
        with TemporaryDirectory() as tmp:
            d=Path(tmp);copy_family_b_baseline(d/"source")
            src=d/"source"
            target=src/"skills/station-integration/references/3-readonly-telemetry.md"
            original=target.read_text(encoding="utf8")
            target.write_text(original.replace("**Owner:** SK-B11","**Owner:** SK-B13"),encoding="utf8")
            self.assertTrue(audit_stage(src,SPECS,OWNERS))
            with self.assertRaises(ValueError):build_review_zip(src,d/"unsafe.zip",SPECS,OWNERS)
            target.write_text(original,encoding="utf8")
            target.unlink();target.symlink_to(src/"skills/sdr-dsp/SKILL.md")
            self.assertTrue(audit_stage(src,SPECS,OWNERS))
            target.unlink();target.write_text(original,encoding="utf8")
            (src/"skills/station-integration/plugin.json").write_text("{}")
            self.assertTrue(audit_stage(src,SPECS,OWNERS))
