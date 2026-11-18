"""Exact canonical Family D Skill source contracts: staged, not installed capabilities."""
from pathlib import Path
from tempfile import TemporaryDirectory
from shutil import copytree
import unittest
from scripts.p1.registry import load_registry
from scripts.p1.audit_domain_skills import audit_stage

ROOT=Path(__file__).resolve().parents[2]
STAGE=ROOT/"staging/p1-domain-skills"
SPECS=load_registry(ROOT/"docs/architecture/skill-and-subskill-registry-v0.5.md",ROOT/"docs/architecture/capability-register-v0.5.md")

def verify_d_owner(id: str,slug: str,tokens: tuple[str,...]):
    spec=next(x for x in SPECS if x.id==id)
    assert spec.slug==slug,(id,spec.slug,slug)
    owner=STAGE/"skills"/slug
    assert (owner/"SKILL.md").is_file(),f"SK-{id} source missing"
    with TemporaryDirectory() as temp:
        copied=Path(temp)
        copytree(owner,copied/"skills"/slug,symlinks=True)
        failures=audit_stage(copied,SPECS,frozenset({id}))
        assert not failures,f"SK-{id} audit: {failures}"
    entry=(owner/"SKILL.md").read_text(encoding="utf8")
    for marker in (f"name: {slug}",f"# SK-{id}","**Trigger:**","**Required context:**","**Output contract:**","**Refusal/stop condition:**",*tokens):
        assert marker in entry,f"SK-{id} missing {marker}"
    assert entry.count("](references/")==3
    assert len(spec.procedures)==3
    for sub in spec.procedures:
        path=STAGE/sub.relative_path
        source=path.read_text(encoding="utf8")
        for marker in (f"# {sub.id}",f"**Owner:** SK-{id}",f"**Responsibility:** {sub.responsibility}","**Required input:**","**Procedure:**","**Output:**","**Error/stop:**"):
            assert marker in source,f"{sub.id} missing {marker}"
        assert path.name in entry,sub.id

class FamilyDStageTests(unittest.TestCase):
    def test_d22_no_state_certification_or_protected_questions(self):
        verify_d_owner("D22","radio-academy",("academy_exercise","TRAINING_ONLY","No official exam certification","CW audio NOT_IMPLEMENTED"))

    def test_d23_30v_preview_never_certifies_or_flashes(self):
        verify_d_owner("D23","radio-maker",("maker_project_review","certified:false","No firmware flashing","No CAT/PTT","NOT_IMPLEMENTED"))

    def test_d24_roster_calendar_and_minors_fail_closed(self):
        verify_d_owner("D24","clubs-mentoring",("club_workshop_plan","simulated:true","No personal roster","No calendar write","NOT_PERSISTED"))
