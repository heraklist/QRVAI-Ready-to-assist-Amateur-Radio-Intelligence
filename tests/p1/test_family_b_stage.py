"""P1.3 stage contracts: exactly 6 canonical engineering owners and safety boundaries."""
from pathlib import Path
from tempfile import TemporaryDirectory
from shutil import copytree
import unittest
from scripts.p1.registry import load_registry
from scripts.p1.audit_domain_skills import audit_stage

ROOT=Path(__file__).resolve().parents[2]
STAGE=ROOT/"staging/p1-domain-skills"
SPECS=load_registry(ROOT/"docs/architecture/skill-and-subskill-registry-v0.5.md",
                    ROOT/"docs/architecture/capability-register-v0.5.md")

def verify_owner(id: str, slug: str, names: list[str], safety: list[str]):
    spec=next(x for x in SPECS if x.id==id)
    assert spec.slug==slug
    assert [p.relative_path.split("/")[-1] for p in spec.procedures]==names
    root=STAGE/"skills"/slug
    assert (root/"SKILL.md").is_file(),f"SK-{id} source missing"
    assert all((STAGE/p.relative_path).is_file() for p in spec.procedures)
    text=(root/"SKILL.md").read_text(encoding="utf8")
    for marker in safety:
        assert marker in text,f"SK-{id}: missing safety '{marker}'"
    with TemporaryDirectory() as tmp:
        copied=Path(tmp)/"skills"/slug
        copytree(root,copied,symlinks=True)
        assert audit_stage(Path(tmp),SPECS,frozenset({id}))==[]
        # The existing auditor must reject removed canonical source
        (copied/"references"/names[0]).unlink()
        assert audit_stage(Path(tmp),SPECS,frozenset({id}))

class EngineeringStageTests(unittest.TestCase):
    def test_b06_manuals_canonical_and_rights_safety(self):
        verify_owner("B06","equipment-manuals",[
            "1-versioned-manual-retrieval.md","2-configuration-walkthrough.md","3-safe-troubleshooting.md"
        ],["USER_SUPPLIED_UNVERIFIED","No invented manual pages","No firmware flashing","prompt injection","manual_find"])

    def test_b09_rf_electronics_first_order_rc_and_datasheet_limits(self):
        verify_owner("B09","rf-electronics",[
            "1-filter-modeling.md","2-rf-chain-explanation.md","3-component-selection-checks.md"
        ],["first-order RC","NOT_IMPLEMENTED","No live repair","rf_filter_response","No invented ratings"])
