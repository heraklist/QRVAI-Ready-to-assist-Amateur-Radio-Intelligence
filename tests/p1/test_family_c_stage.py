"""Canonical C14-C21 stage source tests, hermetic and non-operational."""
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
def verify_c_owner(id: str, slug: str, required: tuple[str,...]):
    spec=next(x for x in SPECS if x.id==id)
    assert spec.slug==slug
    owner=STAGE/"skills"/slug
    assert (owner/"SKILL.md").is_file(),f"SK-{id} source missing"
    with TemporaryDirectory() as tmp:
        dest=Path(tmp);copytree(owner,dest/"skills"/slug,symlinks=True)
        errors=audit_stage(dest,SPECS,frozenset({id}))
        assert errors==[],f"SK-{id}: {errors}"
        content=(owner/"SKILL.md").read_text(encoding="utf8")
        for phrase in (f"name: {slug}",f"# SK-{id}","**Trigger:**","**Required context:**","**Output contract:**","**Refusal/stop condition:**",*required):
            assert phrase in content,f"SK-{id} missing {phrase}"
        for sub in spec.procedures:
            p=STAGE/sub.relative_path
            text=p.read_text(encoding="utf8")
            assert f"# {sub.id}" in text and f"**Owner:** SK-{id}" in text
            assert f"**Responsibility:** {sub.responsibility}" in text
            for label in ("**Required input:**","**Procedure:**","**Output:**","**Error/stop:**"):
                assert label in text
            assert p.name in content

class CFamilyStagingTests(unittest.TestCase):
    def test_c14_unverified_spot_not_current(self):
        verify_c_owner("C14","operating-dx",("dx_reception_reports","provider_authenticated:false","No fabricated real-time DX spots","No PTT"))

    def test_c15_fspl_is_not_ionospheric_forecast(self):
        verify_c_owner("C15","propagation",("spaceweather_indices","propagation_path","live_feed:false","real_world_prediction:false","No guaranteed path opening"))

    def test_c16_receive_only_versioned_no_cat_ptt(self):
        verify_c_owner("C16","digital-modes",("digital_setup_guide","simulated:true","No PTT","No CAT writes","NOT_IMPLEMENTED"))

    def test_c17_no_live_packet_forward_or_location_leak(self):
        verify_c_owner("C17","packet-networks",("packet_route_preview","simulated:true","No APRS-IS write","No Winlink send","private location"))
