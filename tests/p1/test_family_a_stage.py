"""P1.2 staged A-family packages are isolated, canonical and training-safe."""
from pathlib import Path
from shutil import copytree
from tempfile import TemporaryDirectory
import unittest
from scripts.p1.registry import load_registry
from scripts.p1.audit_domain_skills import audit_stage

ROOT=Path(__file__).resolve().parents[2]
STAGE=ROOT/"staging/p1-domain-skills"
SPECS=load_registry(ROOT/"docs/architecture/skill-and-subskill-registry-v0.5.md",
                    ROOT/"docs/architecture/capability-register-v0.5.md")

def isolated_audit(domain_id, mutate=None):
    spec=next(x for x in SPECS if x.id==domain_id)
    with TemporaryDirectory() as tmp:
        dest=Path(tmp)/"skills"/spec.slug
        copytree(STAGE/"skills"/spec.slug,dest,symlinks=True)
        if mutate: mutate(dest)
        return audit_stage(Path(tmp),SPECS,frozenset({domain_id}))

class FamilyAStagingTests(unittest.TestCase):
    def test_a01_civil_protection_exact_four_files(self):
        d=next(x for x in SPECS if x.id=="A01")
        self.assertEqual(d.slug,"civil-protection")
        self.assertEqual([p.id for p in d.procedures],["SS-A01-1","SS-A01-2","SS-A01-3"])
        self.assertEqual([p.relative_path.split("/")[-1] for p in d.procedures],
                         ["1-preparedness-baseline.md","2-resilience-design.md","3-exercise-review.md"])
        self.assertTrue((STAGE/"skills/civil-protection/SKILL.md").is_file(),"SK-A01 Skill source missing")
        self.assertTrue(all((STAGE/p.relative_path).is_file() for p in d.procedures))
        self.assertEqual(isolated_audit("A01"),[])

    def test_a01_corrupt_owner_symlink_and_orphan_fail_closed(self):
        def bad_owner(p):
            x=p/"references/1-preparedness-baseline.md"
            x.write_text(x.read_text().replace("**Owner:** SK-A01","**Owner:** SK-A02"))
        def no_reference(p):
            (p/"references/2-resilience-design.md").unlink()
        def orphan(p):
            (p/"references/unsafe-activation.md").write_text("# dispatch")
        for m in (bad_owner,no_reference,orphan):
            self.assertTrue(isolated_audit("A01",m))

    def test_a01_exercise_only_not_activation(self):
        s=(STAGE/"skills/civil-protection/SKILL.md").read_text(encoding="utf8")
        for term in ("TRAINING ONLY","ΑΣΚΗΣΗ","No official activation","No live dispatch","No PTT"):
            self.assertIn(term,s)

    def test_a02_emcomm_exact_canonical_files(self):
        d=next(x for x in SPECS if x.id=="A02")
        self.assertEqual(d.slug,"emcomm-traffic")
        self.assertEqual([p.relative_path.split("/")[-1] for p in d.procedures],
                         ["1-net-role-training.md","2-message-integrity-drill.md","3-fallback-traffic-simulation.md"])
        self.assertTrue((STAGE/"skills/emcomm-traffic/SKILL.md").is_file(),"SK-A02 staged source missing")
        self.assertTrue(all((STAGE/p.relative_path).is_file() for p in d.procedures))
        self.assertEqual(isolated_audit("A02"),[])

    def test_a02_training_not_actual_dispatch(self):
        p=STAGE/"skills/emcomm-traffic/SKILL.md"
        text=p.read_text(encoding="utf8")
        for term in ("EXERCISE ONLY","ΑΣΚΗΣΗ","No live dispatch","No PTT","No unofficial priority authority"):
            self.assertIn(term,text)
        self.assertTrue(isolated_audit("A02",lambda pkg: (pkg/"references/2-message-integrity-drill.md").unlink()))

    def test_a03_frequency_intelligence_exact_files_and_owners(self):
        d=next(x for x in SPECS if x.id=="A03")
        self.assertEqual(d.slug,"frequency-intelligence")
        self.assertEqual([p.relative_path.split("/")[-1] for p in d.procedures],
                         ["1-allocation-lookup.md","2-band-plan-overlay.md","3-channelrepeater-reference.md"])
        self.assertTrue((STAGE/"skills/frequency-intelligence/SKILL.md").is_file(),"SK-A03 staged source missing")
        self.assertTrue(all((STAGE/p.relative_path).is_file() for p in d.procedures))
        self.assertEqual(isolated_audit("A03"),[])

    def test_a03_no_bandplan_as_legal_authority_or_fake_live_repeaters(self):
        text=(STAGE/"skills/frequency-intelligence/SKILL.md").read_text(encoding="utf8")
        for term in ("IARU recommendations","not legal authorization","USER_SUPPLIED_UNVERIFIED","INDETERMINATE","No live repeater status"):
            self.assertIn(term,text)
        self.assertTrue(isolated_audit("A03",lambda pkg:(pkg/"references/3-channelrepeater-reference.md").unlink()))

    def test_a04_regulatory_licensing_canonical_paths(self):
        d=next(x for x in SPECS if x.id=="A04")
        self.assertEqual(d.slug,"regulatory-licensing")
        self.assertEqual([p.relative_path.split("/")[-1] for p in d.procedures],
                         ["1-licence-context.md","2-transmission-rule-evaluation.md","3-crossborder-explanation.md"])
        self.assertTrue((STAGE/"skills/regulatory-licensing/SKILL.md").is_file(),"SK-A04 staged source missing")
        self.assertTrue(all((STAGE/p.relative_path).is_file() for p in d.procedures))
        self.assertEqual(isolated_audit("A04"),[])

    def test_a04_legal_authority_fail_closed(self):
        text=(STAGE/"skills/regulatory-licensing/SKILL.md").read_text(encoding="utf8")
        for term in ("ALLOWED/NOT_ALLOWED/INDETERMINATE","INDETERMINATE","NOT_IMPLEMENTED","Never issue a licence","CEPT/HAREC","authorized:false"):
            self.assertIn(term,text)
        self.assertTrue(isolated_audit("A04",lambda pkg:(pkg/"references/3-crossborder-explanation.md").unlink()))
