"""P1 CI is an explicit P1+V0 source-only gate, not a release workflow."""
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[2]
WORKFLOW=ROOT / ".github/workflows/p1-domain-skills-ci.yml"
REQUIRED=(
    "'staging/p1-domain-skills/**'",
    "'scripts/p1/**'",
    "'tests/p1/**'",
    "'qa/p1/**'",
    "'docs/architecture/skill-and-subskill-registry-v0.5.md'",
    "'docs/architecture/capability-register-v0.5.md'",
    "'.github/workflows/p1-domain-skills-ci.yml'",
    "permissions:\n      contents: read",
    "python-version: '3.11'",
    "python -m unittest discover -s tests/p1 -p 'test_*.py' -v",
    "python -m unittest discover -s tests/v0 -p 'test_*.py' -v",
    "audit_catalog(root)",
    "build_archive(root,",
    "validate_archive(archive)",
    "V0_ARCHIVE_FILES=12",
    "P1_REGISTRY=24/72",
    "P1_STAGE=14/24,42/72",
    "P1_STAGE_ARCHIVE_FILES=56",
    "P1_FAMILY_A_CASES=30",
    "P1_FAMILY_B_CASES=36",
    "P1_FAMILY_B_SS_COVERED=18/18",
    "P1_STATION_BRIDGE=NOT_CONNECTED",
    "P1_FAMILY_A_SS_COVERED=15/15",
    "P1_LEGAL_PRIMARY_RULES_EXPERT_VALIDATED=0/UNVERIFIED",
    "P1_AUTHORITY_CANDIDATES=7",
    "build_review_zip(",
    "validate_review_zip(",
    "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020",
    "node-version: '22'",
    "npm ci --ignore-scripts",
    "npm run typecheck",
    "npm test",
    "P1_HOST_E2E=NOT_EXECUTED",
)

def workflow_errors(text: str) -> list[str]:
    errors=[f"missing workflow invariant {fragment}" for fragment in REQUIRED if fragment not in text]
    if "actions/checkout@11d5960a326750d5838078e36cf38b85af677262" not in text:
        errors.append("unpinned checkout")
    if "actions/setup-python@a26af69be951a213d495a4c3e4e4022e16d87065" not in text:
        errors.append("unpinned Python setup")
    if "secrets." in text or "id-token: write" in text or "workflow_dispatch:" in text:
        errors.append("unapproved privilege or deployment")
    return errors

class P1CIContractTests(unittest.TestCase):
    def test_exact_v0_and_p1_same_sha_workflow(self):
        self.assertEqual(workflow_errors(WORKFLOW.read_text(encoding="utf8")),[])
    def test_missing_v0_command_fails_closed(self):
        content=WORKFLOW.read_text(encoding="utf8")
        mutated=content.replace("python -m unittest discover -s tests/v0 -p 'test_*.py' -v","echo skip-v0")
        self.assertTrue(workflow_errors(mutated))
    def test_missing_qa_path_filter_fails_closed(self):
        content=WORKFLOW.read_text(encoding="utf8")
        self.assertTrue(workflow_errors(content.replace("'qa/p1/**'","'qa/wrong/**'")))

    def test_v0_archive_sha_is_guarded_not_just_printed(self):
        content=WORKFLOW.read_text(encoding="utf8")
        self.assertIn('assert fingerprint == "eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f"',content)

    def test_rf_and_8_file_zip_gate_fail_when_removed(self):
        text=WORKFLOW.read_text(encoding="utf8")
        self.assertTrue(workflow_errors(text.replace("P1_STAGE_ARCHIVE_FILES=56","P1_STAGE_ARCHIVE_FILES=0")))
        self.assertTrue(workflow_errors(text.replace("npm run typecheck","echo skip-typecheck")))
        self.assertTrue(workflow_errors(text.replace("build_review_zip(","build_unreviewed_zip(")))

    def test_stage_count_does_not_regress_to_b07_only_or_zero(self):
        text=WORKFLOW.read_text(encoding="utf8")
        self.assertTrue(workflow_errors(text.replace("P1_STAGE=14/24,42/72","P1_STAGE=2/24,6/72")))
        self.assertIn('frozenset({"B07","B08","A01","A02","A03","A04","A05","B06","B09","B10","B12","B13","B11","C14"})',text)

    def test_family_a_metrics_and_review_gate_must_run(self):
        content=WORKFLOW.read_text(encoding="utf8")
        for removed in ("P1_FAMILY_A_CASES=30","P1_FAMILY_A_SS_COVERED=15/15","P1_LEGAL_PRIMARY_RULES_EXPERT_VALIDATED=0/UNVERIFIED","P1_AUTHORITY_CANDIDATES=7"):
            self.assertTrue(workflow_errors(content.replace(removed,"REMOVED")))

    def test_p1_ci_must_be_readonly_and_not_deploy(self):
        c=WORKFLOW.read_text(encoding="utf8")
        self.assertNotIn("secrets.",c)
        self.assertNotIn("actions/upload-artifact",c)
        self.assertNotIn("vercel --prod",c)
        self.assertNotIn("plugin_creator",c.lower())

    def test_family_b_qa_and_bridge_metrics_are_mandatory(self):
        content=WORKFLOW.read_text(encoding="utf8")
        for required in ("P1_FAMILY_B_CASES=36","P1_FAMILY_B_SS_COVERED=18/18","P1_STATION_BRIDGE=NOT_CONNECTED"):
            self.assertTrue(workflow_errors(content.replace(required,"REMOVED")))

    def test_all_thirteen_owners_staged_not_six_only(self):
        content=WORKFLOW.read_text(encoding="utf8")
        owners='frozenset({"B07","B08","A01","A02","A03","A04","A05","B06","B09","B10","B12","B13","B11","C14"})'
        self.assertIn(owners,content)
        self.assertNotIn("id-token: write",content)
        self.assertNotIn("vercel --prod",content)
