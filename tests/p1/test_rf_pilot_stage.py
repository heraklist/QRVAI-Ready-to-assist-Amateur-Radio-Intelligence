"""P1.1 real staged Skill files: isolated source, canonical ownership, no plugin install."""
from pathlib import Path
from tempfile import TemporaryDirectory
from shutil import copytree
import unittest

from scripts.p1.registry import load_registry
from scripts.p1.audit_domain_skills import audit_stage

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / "staging/p1-domain-skills"
SPECS = load_registry(ROOT/"docs/architecture/skill-and-subskill-registry-v0.5.md",
                      ROOT/"docs/architecture/capability-register-v0.5.md")


def isolated_audit(domain_id: str, mutate=None):
    d = next(x for x in SPECS if x.id == domain_id)
    with TemporaryDirectory() as directory:
        dest = Path(directory)/"skills"/d.slug
        copytree(STAGE/"skills"/d.slug, dest, symlinks=True)
        if mutate:
            mutate(dest)
        return audit_stage(Path(directory), SPECS, frozenset({domain_id}))


class RFPilotStageTests(unittest.TestCase):
    def test_b07_four_exact_canonical_paths_and_valid_source(self):
        d = next(x for x in SPECS if x.id=="B07")
        self.assertEqual(d.slug, "rf-engineering")
        self.assertEqual([p.id for p in d.procedures], ["SS-B07-1","SS-B07-2","SS-B07-3"])
        self.assertEqual([p.relative_path.split("/")[-1] for p in d.procedures],
                         ["1-rf-unit-algebra.md","2-link-budget-analysis.md","3-mismatch-and-noise-metrics.md"])
        self.assertTrue((STAGE/"skills/rf-engineering/SKILL.md").is_file(), "P1.1 B07 Skill source missing")
        self.assertTrue(all((STAGE/p.relative_path).is_file() for p in d.procedures))
        self.assertEqual(isolated_audit("B07"), [])

    def test_b07_malformed_owner_missing_ref_and_orphan_rejected(self):
        d = next(x for x in SPECS if x.id=="B07")
        def no_ref(pkg):
            (pkg/"references/2-link-budget-analysis.md").unlink()
        def spoof_owner(pkg):
            p=pkg/"references/1-rf-unit-algebra.md"
            p.write_text(p.read_text().replace("**Owner:** SK-B07","**Owner:** SK-B08"))
        def orphan(pkg):
            (pkg/"references/new-tool.md").write_text("# Unexpected tool")
        for corrupt in (no_ref,spoof_owner,orphan):
            self.assertTrue(isolated_audit("B07",corrupt))

    def test_b07_not_plugin_manifest_or_automatic_tx(self):
        p=STAGE/"skills/rf-engineering"
        self.assertFalse((p/"plugin.json").exists())
        self.assertFalse((p/"mcp.json").exists())
        s=(p/"SKILL.md").read_text(encoding="utf-8")
        self.assertIn("No automatic transmission",s)
        self.assertIn("No verified physical measurements",s)
