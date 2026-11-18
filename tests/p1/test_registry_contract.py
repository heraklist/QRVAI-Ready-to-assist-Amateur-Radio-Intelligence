from pathlib import Path
import tempfile
import unittest
from scripts.p1.registry import load_registry

ROOT = Path(__file__).resolve().parents[2]
SKILL = ROOT / "docs/architecture/skill-and-subskill-registry-v0.5.md"
CAP = ROOT / "docs/architecture/capability-register-v0.5.md"

class RegistryContractTests(unittest.TestCase):
    def test_canonical_identity_and_paths(self):
        ds = load_registry(SKILL, CAP)
        expected = ([f"A{x:02d}" for x in range(1, 6)] +
                    [f"B{x:02d}" for x in range(6, 14)] +
                    [f"C{x:02d}" for x in range(14, 22)] +
                    [f"D{x:02d}" for x in range(22, 25)])
        self.assertEqual([d.id for d in ds], expected)
        self.assertEqual(len({d.slug for d in ds}), 24)
        self.assertEqual(len({p.id for d in ds for p in d.procedures}), 72)
        self.assertEqual(len({p.relative_path for d in ds for p in d.procedures}), 72)
        self.assertEqual([len(d.procedures) for d in ds], [3]*24)
        b07 = next(d for d in ds if d.id == "B07")
        self.assertEqual(b07.slug, "rf-engineering")
        self.assertEqual(b07.procedures[1].relative_path, "skills/rf-engineering/references/2-link-budget-analysis.md")
        b08 = next(d for d in ds if d.id == "B08")
        self.assertEqual(b08.procedures[1].relative_path, "skills/antenna-feedline/references/2-matchingsmith-chart.md")

    def assert_rejected(self, skill_text=None, cap_text=None):
        with tempfile.TemporaryDirectory() as d:
            first, second = Path(d) / "skills.md", Path(d) / "cap.md"
            first.write_text(skill_text if skill_text is not None else SKILL.read_text(), encoding="utf8")
            second.write_text(cap_text if cap_text is not None else CAP.read_text(), encoding="utf8")
            with self.assertRaises(ValueError):
                load_registry(first, second)

    def test_reject_duplicate_skill(self):
        source = SKILL.read_text(encoding="utf8")
        a = source.index("### SK-B07 ")
        b = source.index("### SK-B08 ", a)
        self.assert_rejected(skill_text=source[:b] + source[a:b] + source[b:])

    def test_reject_wrong_procedure_owner(self):
        source = SKILL.read_text(encoding="utf8")
        self.assert_rejected(skill_text=source.replace("`SS-B07-2`", "`SS-B08-2`", 1))

    def test_reject_missing_context(self):
        source = SKILL.read_text(encoding="utf8")
        self.assert_rejected(skill_text=source.replace("**Required context:** typed physical values with units and assumptions.", "**Required context:**  ", 1))

    def test_reject_swapped_sc_procedure(self):
        source = CAP.read_text(encoding="utf8")
        self.assert_rejected(cap_text=source.replace("| `SS-B07-2` |", "| `SS-B08-2` |", 1))
