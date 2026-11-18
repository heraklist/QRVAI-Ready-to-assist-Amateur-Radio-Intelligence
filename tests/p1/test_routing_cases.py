"""Static QA-fixture integrity tests; no LLM routing is executed."""
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from scripts.p1.registry import load_registry
from scripts.p1.routing_cases import validate_routing_cases

ROOT = Path(__file__).resolve().parents[2]
SPECS = load_registry(ROOT/"docs/architecture/skill-and-subskill-registry-v0.5.md",
                      ROOT/"docs/architecture/capability-register-v0.5.md")
CASES = ROOT / "qa/p1/domain-routing-cases.json"


class BilingualCasesTests(unittest.TestCase):
    def test_16_bilingual_fixtures_across_all_families_and_risks(self):
        self.assertEqual(validate_routing_cases(CASES,SPECS), [])
        rows = json.loads(CASES.read_text(encoding="utf8"))
        self.assertGreaterEqual(len(rows),16)
        self.assertEqual({r["risk_class"] for r in rows},
                         {"numerical","legal","emergency","hardware","privacy","source","education","cross_domain"})
        self.assertEqual({d[0] for r in rows for d in r["expected_domains"]}, set("ABCD"))
        power = next(x for x in rows if x["id"] == "b07-power-100w")
        self.assertEqual(power["expected_domains"],["B07"])
        self.assertEqual(power["expected_outcome"],"DIRECT")

    def assert_invalid(self, mutator):
        with TemporaryDirectory() as tmp:
            rows=json.loads(CASES.read_text(encoding="utf8"))
            mutator(rows)
            path=Path(tmp)/"cases.json"
            path.write_text(json.dumps(rows,ensure_ascii=False),encoding="utf8")
            self.assertTrue(validate_routing_cases(path,SPECS))

    def test_reject_empty_ellinika(self):
        self.assert_invalid(lambda rows: rows[0].__setitem__("prompt_el",""))
    def test_reject_duplicate_id(self):
        self.assert_invalid(lambda rows: rows[1].__setitem__("id",rows[0]["id"]))
    def test_reject_unknown_domain(self):
        self.assert_invalid(lambda rows: rows[0].__setitem__("expected_domains",["X99"]))
    def test_reject_fake_transmit_authority(self):
        self.assert_invalid(lambda rows: rows[0].__setitem__("expected_outcome","AUTHORIZED_TX"))
    def test_reject_legal_direct_without_evidence(self):
        self.assert_invalid(lambda rows: next(r for r in rows if r["risk_class"]=="legal").__setitem__("expected_outcome","DIRECT"))
    def test_reject_emergency_without_no_ptt(self):
        self.assert_invalid(lambda rows: next(r for r in rows if r["risk_class"]=="emergency").__setitem__("must_not_claim",["safe to dispatch"]))
