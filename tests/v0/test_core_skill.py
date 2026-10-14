import unittest
from pathlib import Path
from scripts.v0.validate import validate_skill

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / "qrvai/skills/qrvai-core"


class TestCoreSkill(unittest.TestCase):
    def test_frontmatter_and_routing_contract(self):
        self.assertEqual(validate_skill(CORE / "SKILL.md"), [])
        skill = (CORE / "SKILL.md").read_text(encoding="utf-8")
        routing = (CORE / "references/routing.md").read_text(encoding="utf-8")
        scope = (CORE / "references/product-scope.md").read_text(encoding="utf-8")
        for label in ["Family A", "Family B", "Family C", "Family D"]:
            self.assertIn(label, routing)
        for key in ["Greek", "English", "source", "uncertainty", "essential"]:
            self.assertIn(key, skill + routing + scope)
        self.assertIn("Skills-only", scope)
        self.assertIn("not implemented", scope)

    def test_router_does_not_inherit_privileges(self):
        routing = (CORE / "references/routing.md").read_text(encoding="utf-8")
        for phrase in ["No PTT", "no emergency dispatch", "no privilege escalation",
                       "do not assume", "permissions"]:
            self.assertIn(phrase.lower(), routing.lower())


if __name__ == "__main__":
    unittest.main()
