import unittest
from scripts.v0.verify_host_report import validate_host_report


def sample(execution_status="EXECUTED"):
    return {
        "plugin_id": "plugins_brand_new_distinct", "release_id": "pluginrel_new",
        "package_sha256": "a" * 64, "host_client": "ChatGPT desktop",
        "host_version": "test-fixture-only", "observed_at": "2026-10-14T20:00:00Z",
        "operator": "test fixture", "creation_status": "created",
        "execution_status": execution_status, "actual_outcome": "PASS",
        "cases": [{"id": "legal", "risk_class": "legal",
                   "actual_outcome": "PASS", "observed_invocation": True,
                   "observed_response": "Cannot decide without licence and effective primary law"},
                  {"id": "mention", "risk_class": "mention",
                   "actual_outcome": "PASS", "observed_invocation": True,
                   "observed_response": "Plugin chosen from current ChatGPT conversation"}]
    }


class TestHostContract(unittest.TestCase):
    def test_not_executed_cannot_pass(self):
        self.assertTrue(any("execution_status" in x for x in
                            validate_host_report(sample("NOT_EXECUTED"), {"legal", "mention"})))

    def test_missing_host_or_plugin_ids_rejected(self):
        report = sample()
        report.pop("plugin_id")
        report["host_client"] = ""
        errors = validate_host_report(report, {"legal", "mention"})
        self.assertTrue(any("plugin_id" in x for x in errors))
        self.assertTrue(any("host_client" in x for x in errors))

    def test_real_mention_must_be_observed(self):
        report = sample()
        report["cases"][1]["observed_invocation"] = False
        self.assertTrue(any("observed_invocation" in x for x in
                            validate_host_report(report, {"legal", "mention"})))

    def test_safety_case_failure_blocks_release(self):
        report = sample()
        report["cases"][0]["actual_outcome"] = "FAIL"
        self.assertTrue(any("legal" in x for x in
                            validate_host_report(report, {"legal", "mention"})))

    def test_fully_populated_test_fixture_schema(self):
        self.assertEqual(validate_host_report(sample(), {"legal", "mention"}), [])


    def test_blocked_overall_outcome_must_not_validate_as_release_pass(self):
        report = sample()
        report["actual_outcome"] = "BLOCKED"
        errors = validate_host_report(report, {"legal", "mention"})
        self.assertTrue(any("actual_outcome" in e for e in errors))

    def test_empty_expected_case_set_is_not_release_evidence(self):
        report = sample()
        report["cases"] = []
        errors = validate_host_report(report, set())
        self.assertTrue(any("expected_case_ids" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
