"""Independent RF numerical golden fixtures and content/source provenance contracts."""
import json
import math
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
CASES = ROOT / "qa/p1/rf-pilot-golden-cases.json"
STAGE = ROOT / "staging/p1-domain-skills/skills"

class RFPilotGoldenTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = json.loads(CASES.read_text(encoding="utf-8"))

    def test_b07_golden_cases_have_typed_results_and_truthful_evidence(self):
        byid={r["id"]:r for r in self.rows if r["domain"]=="B07"}
        for name, ss, expected, unit in [
            ("b07-power-100w","SS-B07-1",50.0,"dBm"),
            ("b07-power-1mw","SS-B07-1",0.0,"dBm"),
            ("b07-power-1w","SS-B07-1",0.0,"dBW"),
            ("b07-rx-link","SS-B07-2",-68.0,"dBm"),
            ("b07-link-margin","SS-B07-2",32.0,"dB"),
            ("b07-swr","SS-B07-3",2.0,"ratio"),
            ("b07-return-loss","SS-B07-3",9.542425094393248,"dB")]:
            row=byid[name]
            self.assertEqual(row["procedure_id"],ss)
            self.assertEqual(row["source_kind"],"IDEAL_MODEL")
            self.assertEqual(row["expected_outcome"],"DIRECT")
            self.assertEqual(row["expected_quantity"]["unit"],unit)
            self.assertTrue(math.isclose(row["expected_quantity"]["value"],expected,rel_tol=0,abs_tol=row["tolerance"]))
            self.assertTrue(row["prompt_el"] and row["prompt_en"] and row["must_not_claim"])
            self.assertTrue(row["input_assumptions"])
        self.assertEqual(byid["b07-rx-link"]["input_assumptions"]["path_loss_db"],100)
        self.assertIn("sensitivity",byid["b07-link-margin"]["input_assumptions"])
        self.assertIn("no numeric sensitivity", " ".join(byid["b07-noise-incomplete"]["must_not_claim"]))

    def test_b07_invalid_and_incomplete_inputs_have_no_guessed_number(self):
        byid={r["id"]:r for r in self.rows if r["domain"]=="B07"}
        for name in ("b07-power-zero","b07-unknown-unit","b07-missing-path-loss","b07-noise-incomplete"):
            r=byid[name]
            self.assertIn(r["expected_outcome"],["OUT_OF_RANGE","MISSING_CONTEXT","INDETERMINATE"])
            self.assertIsNone(r["expected_quantity"])
            self.assertIn(r["procedure_id"],["SS-B07-1","SS-B07-2","SS-B07-3"])
        self.assertIn("bandwidth", " ".join(byid["b07-noise-incomplete"]["must_not_claim"]))

    def test_b07_reference_content_covers_math_and_no_live_claim(self):
        files=[STAGE/"rf-engineering/references"/x for x in (
            "1-rf-unit-algebra.md","2-link-budget-analysis.md","3-mismatch-and-noise-metrics.md")]
        for f in files:
            s=f.read_text(encoding="utf-8")
            self.assertIn("**Required input:**",s)
            self.assertIn("**Error/stop:**",s)
            self.assertNotIn("verified VNA readings provided",s)
        noise=files[-1].read_text(encoding="utf-8")
        for name in ("bandwidth","temperature","noise figure","SNR"):
            self.assertIn(name,noise.lower() if name=="bandwidth" else noise if name=="SNR" else noise.lower())
