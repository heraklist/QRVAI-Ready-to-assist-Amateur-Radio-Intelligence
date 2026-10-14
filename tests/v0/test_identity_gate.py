import unittest
from pathlib import Path
from scripts.v0.release_gates import evaluate_identity_gate, verify_release_preflight

OLD = "plugins_6acf47f502dc8191bf542fe040d484d8"
ROOT = Path(__file__).resolve().parents[2]


class TestIdentityGate(unittest.TestCase):
    def test_old_saved_record_blocks_creation(self):
        self.assertEqual(evaluate_identity_gate(True, OLD, "qrvai", None), "BLOCKED")
        self.assertEqual(evaluate_identity_gate(True, OLD, "qrvai", "new_record"), "BLOCKED")

    def test_new_id_must_differ_from_legacy(self):
        self.assertEqual(evaluate_identity_gate(False, OLD, "qrvai", OLD), "BLOCKED")
        self.assertEqual(evaluate_identity_gate(False, OLD, "qrvai", "plugin_new_distinct"), "CREATED_DISTINCT")

    def test_absence_plus_authorized_slug_is_necessary_but_not_installation_proof(self):
        self.assertEqual(evaluate_identity_gate(False, OLD, "qrvai", None), "READY_FOR_CREATION")
        self.assertEqual(evaluate_identity_gate(False, OLD, "qrvai-2", None), "BLOCKED")
        missing = verify_release_preflight(ROOT / "qrvai/plugin.json", {"old_record_absent": False})
        self.assertTrue(any("old_record_absent" in error for error in missing))


if __name__ == "__main__":
    unittest.main()
