"""P1.0: stage auditor tests use disposable fake Skills, never real packages."""
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from scripts.p1.registry import load_registry
from scripts.p1.audit_domain_skills import audit_stage

ROOT = Path(__file__).resolve().parents[2]
SPECS = load_registry(ROOT / "docs/architecture/skill-and-subskill-registry-v0.5.md",
                      ROOT / "docs/architecture/capability-register-v0.5.md")
B07 = next(x for x in SPECS if x.id == "B07")

def make_b07(root: Path):
    skill = root / "skills/rf-engineering/SKILL.md"
    skill.parent.mkdir(parents=True, exist_ok=True)
    links = "\n".join(f"- [{p.id}]({p.relative_path.split('rf-engineering/')[1]})" for p in B07.procedures)
    skill.write_text(
        "---\nname: rf-engineering\ndescription: Use for bounded offline RF calculation guidance.\n---\n"
        "# SK-B07 RF engineering\n"
        "**Trigger:** bounded RF numerical calculation\n"
        "**Required context:** power with typed units\n"
        "**Output contract:** checked formula and units\n"
        "**Refusal/stop condition:** no claimed live measurements, TX or certification\n" + links + "\n", encoding="utf-8")
    for p in B07.procedures:
        dest = root / p.relative_path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(
            f"# {p.id} {p.title}\n**Owner:** SK-B07\n**Responsibility:** {p.responsibility}\n"
            "**Required input:** typed numbers with units\n**Procedure:** validate, calculate, report\n"
            "**Output:** bounded educational result\n**Error/stop:** refuse missing data or unsafe TX\n",
            encoding="utf-8")
    return skill

class StageAuditTests(unittest.TestCase):
    def test_empty_stage_is_valid_only_when_no_owners_are_required(self):
        with TemporaryDirectory() as tmp:
            missing = Path(tmp) / "stage-not-created"
            self.assertEqual(audit_stage(missing, SPECS, frozenset()), [])
            self.assertTrue(audit_stage(missing, SPECS, frozenset({"B07"})))
            self.assertFalse(missing.exists())

    def test_valid_canonical_b07_fixture(self):
        with TemporaryDirectory() as tmp:
            stage = Path(tmp)
            make_b07(stage)
            self.assertEqual(audit_stage(stage, SPECS, frozenset({"B07"})), [])

    def test_reject_missing_reference(self):
        with TemporaryDirectory() as tmp:
            root=Path(tmp); make_b07(root)
            (root / B07.procedures[1].relative_path).unlink()
            self.assertTrue(audit_stage(root,SPECS,frozenset({"B07"})))

    def test_reject_extra_manifest(self):
        with TemporaryDirectory() as tmp:
            root=Path(tmp); make_b07(root)
            (root/"plugin.json").write_text("{}",encoding="utf8")
            self.assertTrue(audit_stage(root,SPECS,frozenset({"B07"})))

    def test_reject_unsafe_link(self):
        with TemporaryDirectory() as tmp:
            root=Path(tmp); file=make_b07(root)
            file.write_text(file.read_text()+"\n[secret](../../../../elsewhere.md)\n")
            self.assertTrue(audit_stage(root,SPECS,frozenset({"B07"})))

    def test_reject_wrong_name_and_missing_stop(self):
        with TemporaryDirectory() as tmp:
            root=Path(tmp); file=make_b07(root)
            content=file.read_text()
            file.write_text(content.replace("name: rf-engineering","name: radio-transmit"))
            self.assertTrue(audit_stage(root,SPECS,frozenset({"B07"})))
            file.write_text(content.replace("**Refusal/stop condition:** no claimed live measurements, TX or certification",""))
            self.assertTrue(audit_stage(root,SPECS,frozenset({"B07"})))

    def test_reject_symlink_and_orphan(self):
        with TemporaryDirectory() as tmp:
            root=Path(tmp); make_b07(root)
            target=root / B07.procedures[0].relative_path
            target.unlink()
            target.symlink_to(root / "absent.md")
            self.assertTrue(audit_stage(root,SPECS,frozenset({"B07"})))
            target.unlink()
            make_b07(root)
            (root/"skills/rf-engineering/references/orphan.md").write_text("bad")
            self.assertTrue(audit_stage(root,SPECS,frozenset({"B07"})))
