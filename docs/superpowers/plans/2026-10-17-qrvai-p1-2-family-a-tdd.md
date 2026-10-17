# QRVAI P1.2 — Family A (A01–A05) — TDD Implementation Plan

> **Execution prerequisite:** REQUIRED SUB-SKILL: read Superpowers `executing-plans` + `test-driven-development` for **Native**, or `subagent-driven-development` for a user-selected subagent approach. **This document is a plan only.** Do not write tests, product source, packages or deploy until the owner reviews the written plan and explicitly selects a P1.2 execution method.

**Date:** 2026-10-17. **Status:** DRAFT FOR OWNER REVIEW — NOT IMPLEMENTED.  
**Parent verified source:** [P1.1 Draft PR #42](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/42) at immutable SHA `9e1f6a95175dafdc5093f0647eee93465ba4f55a`. Last [same-SHA P1/V0/RF CI](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39013652619): **44 P1 / 49 V0 / 178 Node RF tests** passed with TypeScript typecheck, 8-file staging ZIP / 12-file V0 ZIP. Those counts are historical proof for P1.1, **not** prospective P1.2 test results.  
**Owner-approved architectural design:** [QRVAI P1 Domain Staging Specification](../specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md), originally reviewed in [PR #39](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/39).  
**Canonical authority:** `docs/architecture/skill-and-subskill-registry-v0.5.md`; `docs/architecture/capability-register-v0.5.md`; original [M0–M8 Master Roadmap](../../roadmap/2026-10-14-qrvai-master-roadmap.md) and [V0–V8 delivery gates](../../roadmap/2026-10-14-qrvai-review-gates-v0.5.md). P1.2 serves especially M2/V2 and M6/V6; it **does not claim release of these slices**.  
**New risk research:** [Family A official-source candidate survey](../../research/2026-10-17-qrvai-p1-2-family-a-authority-survey.md), checked 2026-10-17. This survey identifies primary research entrypoints, **not** a verified consolidated law, official operator-specific privilege, or RF exposure limit.

## 1. Goal, architecture, exclusions

Stage exactly five additional candidate host Domain Skill entrypoints `SK-A01`–`SK-A05` and 15 owner-local procedural references, retaining all eight prior B07/B08 files. Cumulative P1 **source-only** state must be **7/24 Domain Skills, 21/72 internal Sub-skills**, and **28/28 exact allowed Markdown files** in a deterministic review-only staging ZIP. Preserve **five V0 Core/Family Skills, 49 V0 tests and the identical 12-file original V0 ZIP fingerprint**. Preserve 178+ Node RF tests/typecheck; record the actual observed count at the **final** head.

Architecture: ChatGPT-first, isolated `staging/p1-domain-skills/`, one Skill entrypoint per Domain, three selective internal procedure files per Skill, no second host identity, no orchestration or external authorization implied by Markdown. Extend the **existing** `scripts/p1/registry.py`, `scripts/p1/audit_domain_skills.py` and `scripts/p1/build_staging_archive.py` test use only; prefer not to modify their source. The `.github/workflows/p1-domain-skills-ci.yml` and `tests/p1/test_p1_ci_contract.py` currently explicitly expect **B07+B08**, **P1_STAGE=2/24,6/72**, and eight review ZIP entries; every legal update must adjust these *together* at the GREEN phase, never disable an audit to make CI pass.

**Absolute exclusions:** no `main` merges, closing ancestor Draft PRs, plugin creation/installation/update/release, Vercel promotion, production OAuth/issuer secrets, backend MCP tool changes, `qrvai/**, `scripts/v0/**, `tests/v0/**, live frequency/reference provider, emergency dispatch/activation, CAT/PTT/TX, rig/SDR access, licensed operation assertions, electrical procedures, RF safety certification, actual exposure measurements or official CEPT/HAREC adjudication. Sub-skills are not independently host-mounted.

**Decision semantics:** `ALLOWED`/`NOT_ALLOWED` may appear only with *clearly synthetic* versioned legal fixtures that model a rule decision; **no real Greek operating scenario may receive `ALLOWED` from user-supplied excerpts, an IARU bandplan, a Gov.gr application page, the existence of a tool, or unverified current law**. For real scenarios, source status unknown/conflicting/expired/missing or licence details absent ⇒ `INDETERMINATE` plus explanation and authoritative verification path. A03/A04 source labels never imply automatic legal checking.

## 2. Scoped interfaces and exact files

### 2.1 Existing source and method contracts

| Existing interface | Exact signature or truthful scope |
|---|---|
| `load_registry(skill_registry_path: Path, capability_registry_path: Path) -> tuple[DomainSpec,...]` | Parses full 24/72 and checks SC→SS bijection, no shadow taxonomy |
| `audit_stage(root: Path, specs: tuple[DomainSpec,...], required_ids: frozenset[str]) -> list[str]` | Strict approved stage allowlist; rejects unexpected/missing files, symlinks, wrong ownership |
| `build_review_zip(stage_root: Path, output_zip: Path, specs: tuple[DomainSpec,...], required_ids: frozenset[str]) -> Path` | Deterministic review-only ZIP, not an installable plugin |
| `validate_review_zip(archive: Path, expected_paths: frozenset[str]) -> list[str]` | Metadata/UTF-8 and canonical member validation; never extract uploaded ZIP |
| `validate_routing_cases(path: Path, specs: tuple[DomainSpec,...]) -> list[str]` | Existing 18 static EL/EN risk fixtures, not host LLM routing |

Already source-registered candidate MCP methods, per current `mcp/qrvai-rf-worker/src/mcp/register.ts`: `emcomm_drill` (scenarios `power_outage` or `repeater_unavailable`; roles; output `simulated:true`), `emcomm_readiness` (battery/staffing hypothetical; `simulated:true`), `power_autonomy` (ideal hours), `source_lookup` (**USER_SUPPLIED_UNVERIFIED** excerpts only), `spectrum_band_segments` (user-supplied ranges, `verified:false`), `spectrum_find_repeaters` (user-supplied metadata, `live_status_known:false`), `regulatory_check_operation` (user-supplied regional rules, `authorized:false`), `rf_exposure_screen` (ideal far-field estimate using **user-given** reference flux, `compliance_established:false`). **Do not call any method live merely because its name exists in Draft source.** No external official legal lookup adapter or independently vetted regulator-rule engine is implemented by P1.2.

### 2.2 Exact twenty planned source files

Every Skill must have approved YAML `name`/`description` and `# SK-Axx`, `**Trigger:**`, `**Required context:**`, `**Output contract:**`, `**Refusal/stop condition:**` plus exactly 3 canonical relative reference links. Every referenced Sub-skill must contain the exact `SS` ID, `**Owner:** SK-Axx` and verbatim canonical `**Responsibility:**`, plus `**Required input:**`, `**Procedure:**`, `**Output:**`, `**Error/stop:**`. Count **20 new Markdown**, in addition to existing 8.

| Skill/Domain (new 4-file package) | Exactly three reference filenames from the v0.5 canonical registry |
|---|---|
| `SK-A01` → `skills/civil-protection/SKILL.md` | `skills/civil-protection/references/1-preparedness-baseline.md`; `2-resilience-design.md`; `3-exercise-review.md` (same owner prefix) |
| `SK-A02` → `skills/emcomm-traffic/SKILL.md` | `skills/emcomm-traffic/references/1-net-role-training.md`; `2-message-integrity-drill.md`; `3-fallback-traffic-simulation.md` |
| `SK-A03` → `skills/frequency-intelligence/SKILL.md` | `skills/frequency-intelligence/references/1-allocation-lookup.md`; `2-band-plan-overlay.md`; `3-channelrepeater-reference.md` |
| `SK-A04` → `skills/regulatory-licensing/SKILL.md` | `skills/regulatory-licensing/references/1-licence-context.md`; `2-transmission-rule-evaluation.md`; `3-crossborder-explanation.md` |
| `SK-A05` → `skills/rf-safety-emc/SKILL.md` | `skills/rf-safety-emc/references/1-rf-exposure-worksheet.md`; `2-interference-troubleshooting.md`; `3-installation-risk-review.md` |

All above file names must be prefixed `staging/p1-domain-skills/` when created. The table's abbreviated A01 reference names are exactly the full paths formed from the same shown `skills/civil-protection/references/` prefix, not aliases.

**Verbatim responsibilities from original Skill registry:**
- A01: (1) inventory go-bags, batteries, frequencies and volunteers; identify unverified legal assumptions; (2) compare station and power backups; explicitly mark simulated outages; (3) produce measurable exercise checks and after-action recommendations.
- A02: (1) teach NCS/check-in procedures and distinct message roles; (2) validate structured message headers, repeats, acknowledgements and timestamps; (3) run exercise-only failure and alternative path plan.
- A03: (1) retrieve effective national frequency allocation and its legal status; (2) overlay IARU recommendations distinctly from binding law; (3) filter source-verified repeater/beacon/channel metadata with freshness.
- A04: (1) determine credential, class, privileges and portability requirements; (2) apply versioned legal rules to a fully specified operating scenario; (3) separate domestic law, CEPT/HAREC mechanisms and recommendations.
- A05: (1) calculate conservative input-dependent exposure screening, cite local threshold; (2) systematically isolate RFI symptom patterns without unsafe procedures; (3) flag lightning, grounding and mains-electrical situations for qualified personnel.

**Interpretation of A03/A05 canon:** "retrieve"/"source-verified" and "cite local threshold" are *required capability intents*, **not proof the current static candidate has a live national legal adapter or independently verified RF exposure thresholds**. Instruction files must clearly state `NOT_IMPLEMENTED` or `SOURCE_UNVERIFIED` and abstain from pretending to have completed an unsupported dependency. No fake citations.

### 2.3 Planned test/QA/CI edits (after separate implementation approval only)

- **Create** `tests/p1/test_family_a_stage.py` — real staged source package audit + mutations, canonical owner/file/refs (use disposable single-domain clones when selecting only an owner, or include all staged IDs in the whole-tree check).
- **Create** `tests/p1/test_family_a_safety.py` — deterministic negative/positive source and training/authority contracts, no live model calls.
- **Create** `qa/p1/family-a-routing-and-safety-cases.json` — ≥30 EL/EN scenarios, minimum **6 per Domain**, 15/15 internal procedure coverage, mixed A03/A04, A01/A02 and A05/B07 pairings, explicit `expected_domains` for multi-domain cases; synthetic-only legal rule examples.
- **Create** `qa/p1/family-a-source-evidence-candidates.json` — compact metadata labels for the public survey links; no scrape/no legal-decision corpus, no invented effective dates; any unknown `effective_at` remains null.
- **Modify** `.github/workflows/p1-domain-skills-ci.yml` and `tests/p1/test_p1_ci_contract.py` in lockstep for 12→16→20→24→28 approved Markdown members, cumulative stage counts; preserve Python P1/V0 and Node22 RF suites with pinned actions, V0 baseline SHA.
- **Create** `qa/p1/P1-2-EVIDENCE-2026-10-17.md` only after source and CI pass; record final-SHA run links, metrics, review limitations and gate disposition.
- **Never modify** `mcp/**`, `api/**`, `qrvai/**`, original V0 source/tests, host OAuth, Vercel prod, plugin record or radio hardware.

## 3. P1.2 authority/evidence and safety contracts

**Authority hierarchy (A03/A04):** binding Greek legal instrument + exact section/effective date/amendments/exception and operator-specific licence conditions outrank IARU Region 1 band-plan *recommendations*. CEPT/HAREC material is a separate legal-recognition layer, not a universal cross-border permit. Gov.gr licence applications describe procedures, not automatic operating privilege. No snippet-only comparison (`regulatory_check_operation` says `authorized:false`) can independently produce a real `ALLOWED` outcome. Log `source_url`, `instrument`, `issuer`, `jurisdiction`, `effective_from/to` (nullable), `checked_at`, `status`, `legal_review_state`, `source_layer`. Missing/expired/contradictory evidence => `INDETERMINATE`, no TX.

**A01/A02 safe exercise semantics:** `TRAINING_ONLY`/`ΑΣΚΗΣΗ`, synthetic participant IDs/callsigns and places, dry-run roles, check-in forms with timezone-identified timestamps, acknowledgment status, message numbers, injected simulated outage/repeater loss, after-action outcomes. No real dispatch, "priority" authority, automatic radio keying, live message delivery, emergency activation, claimed authorization from ITU recommendation, or user-private volunteer rosters without consent.

**A05 screening semantics:** no local regulatory RF threshold verified in the survey. The tool `rf_exposure_screen` uses user-supplied `reference_flux_w_m2` and ideal parameters `mean_power_w`, `linear_gain`, `distance_m`, and always states `compliance_established:false`; below a user-entered comparison value is not certification. Near-field, duty cycle, pattern, site geometry and occupational/public class assumptions may be missing. Mains/roof/tower/lightning repairs require qualified personnel; guidance is non-invasive only.

**Cross-Domain routing:** A01/A02 simulated preparedness; A03/A04 allocation vs licence law; A05/B07 ideal RF math vs actual compliance. Each pair carries explicitly declared owners in fixture expectations; do not automatically call all five A Skills. For live emergency distress, direct the user toward the appropriate official emergency channels/services, not a plugin dispatch simulation.

## 4. Review Focus: five negative failure modes which MUST be tested

1. **Authority confusion/false TX permission:** IARU recommended segments treated as statute; `authorized:false` from a user excerpt reinterpreted as `ALLOWED`; licence category, emission, power, country, date, or exception missing; old law supersession. Test A03/A04 source metadata and adversarial fixture.
2. **EmComm authority leakage:** training traffic sent as real net message, false agency activation/priority or PTT command, training roster contains real personal identifiers, role/timestamp corruption, outage simulation mistaken for incident status. Test A01/A02 and cross-Domain cases.
3. **RF screening as certification:** "below user-supplied reference" becomes "safe"/"legally compliant", near-field or missing duty assumption ignored; unqualified instructions for mains/lightning. Test A05 case and content assertion.
4. **Source provenance spoofing:** stale/unreviewed regulation, snippet from unknown issuer, no exact instrument effective date, fabricated CEPT portability, current repeater status asserted without read-only provider. Test source matrix metadata and A03/A04/A05 negative cases.
5. **Regression/allowlist drift:** missing any of 20 files, misowned SS, wrong slug, 8-file archive left in CI, wildcard archive that includes unexpected manifests, V0 12-file SHA drift, RF Node test omitted, or different final CI SHA. Test audit, archive and CI-contract negative mutation.

---

### Task 1: Freeze authority and risk fixtures; test first

**Files:** create `qa/p1/family-a-source-evidence-candidates.json` and `tests/p1/test_family_a_safety.py` initial source-version subtests; use the existing [survey](../../research/2026-10-17-qrvai-p1-2-family-a-authority-survey.md) as the **read-only normative scope**, not a rule database.

- [ ] **Step 1 (RED):** Add `test_all_authority_candidates_are_versioned_and_source_layered` requiring an array of identified `source_id`, `canonical_url`, `issuer`, `layer`, `checked_at`, `instrument`, `effective_from` (nullable) and `legal_review_state`. Fail because the JSON does not exist. Use explicit enum for binding, guidance, recommendation, simulation, unverified user evidence.
- [ ] **Step 2 (run RED):** `python -m unittest discover -s tests/p1 -p 'test_family_a_safety.py' -v`, observe expected missing dataset failure; not a typo/import break.
- [ ] **Step 3 (GREEN):** Enter only actually observed URLs/metadata for Greek EETT EKΚΖΣ candidate, EETT amendment index, Gov.gr licence, IARU Region 1 advisory, ITU-R M.1042-4, Greek GGPP exercise guidance; **never** fabricate legal effective-date or expert-reviewed state. Where no primary effective date observed set null and `UNREVIEWED`.
- [ ] **Step 4 (negative):** `test_cannot_turn_advisory_or_unreviewed_excerpt_into_permission` rejects `ALLOWED` for user excerpts, IARU bandplan and metadata-only records. Test a mutated dictionary in a temporary file; no actual operating permission lookup.
- [ ] **Step 5 (GREEN):** Focused P1 test then full P1/V0/RF suite at exact SHA (CI). Commit tests/metadata only after GREEN; stage still B07/B08 **2/24,6/72**, review ZIP 8; no new A package yet.

### Task 2: RED canonical A01 staged Skill contracts

**Files:** create `tests/p1/test_family_a_stage.py` covering A01 first, then append A02 in Task 4. Use `load_registry(...)` and the same `isolated_audit` pattern as `tests/p1/test_rf_pilot_stage.py`.

- [ ] **Step 1 (RED):** Assert A01 slug `civil-protection`, exact three SS-A01 IDs/named files and actual presence of entrypoint + 3 refs; audit with copied A01-only directory and `frozenset({"A01"})`.
- [ ] **Step 2 (run RED):** `python -m unittest discover -s tests/p1 -p 'test_family_a_stage.py' -v`; expected missing `SK-A01` staged source assertion.
- [ ] **Step 3 (negatives):** In disposable copies, delete middle A01 reference, swap owner `SK-A02`, add unexpected manifest/symlink; each must return audit violations.
- [ ] **Step 4:** Add source assertions `TRAINING ONLY / ΑΣΚΗΣΗ`, "not official activation", no real dispatch/no PTT. Since A01 still absent tests remain deliberately RED; commit test-only without misleading success claims.

### Task 3: GREEN A01 civil protection; migrate to 3/24 · 9/72, 12 ZIP files

**Files:** create 4 `civil-protection` Markdown files; update `.github/workflows/p1-domain-skills-ci.yml` + `tests/p1/test_p1_ci_contract.py` in the **same** GREEN unit.

- [ ] **Step 1:** Write `SK-A01` YAML/trigger/context/output/stop and three links; procedures' exact responsibilities: (1) inventory preparedness with synthetic volunteers + unknown frequency legality, (2) compare offline backup power via declared conditions and simulation-only outage, (3) measurable tabletop exercise checks/after-action follow-up. No real municipal activation/agency roles presumed.
- [ ] **Step 2:** Allowlist owners `{"B07","B08","A01"}`, exact `P1_STAGE=3/24,9/72`, `P1_STAGE_ARCHIVE_FILES=12` (three 4-file Skill packages); update CI test contract, not registry/v0 scripts.
- [ ] **Step 3 (GREEN):** Run focused Stage audit tests, P1 3-owner stage and deterministic 12-entry review-only archive; confirm original **V0 12-entry ZIP remains unchanged** (different archive, independent hash).
- [ ] **Step 4 (negative):** Mutate A01 stop condition and a procedural owner in separate disposable copies; both rejected by appropriate tests. Run full P1+V0+RF typecheck/Node before recording GREEN and commit.

### Task 4: RED then GREEN A02 EmComm drills; migrate 4/24 · 12/72, 16 ZIP files

**Files:** extend `tests/p1/test_family_a_stage.py`; create four `emcomm-traffic` Markdown; extend `tests/p1/test_family_a_safety.py` with message integrity/authority cases; update workflow/contract.

- [ ] **Step 1 (RED):** Test absent `SK-A02` and SS-A02-1..3, exact references `1-net-role-training.md`, `2-message-integrity-drill.md`, `3-fallback-traffic-simulation.md`, and simulated traffic with no dispatch/priority/PTT authority. Run focused test, observe missing source.
- [ ] **Step 2 (GREEN files):** Build entrypoint and three canonical procedures: NCS/check-in roles; uniquely numbered mock message headers, sender/recipient synthetic IDs, UTC/offset-aware timestamp and ACK/REPEAT integrity; injected `power_outage` / `repeater_unavailable` fallback. `emcomm_drill`/`emcomm_readiness`, where available, are **paper-only** tools with `simulated:true`, not live agencies.
- [ ] **Step 3 (RED/GREEN negatives):** Test that absence of `EXERCISE ONLY`, real dispatch or `PTT` permission text, message duplication or erased timezone fail static fixture/schema checks; restore safe instructions and assert pass. No real callsigns/private live data.
- [ ] **Step 4 (CI):** Cumulative approved owners plus `A02`, `P1_STAGE=4/24,12/72`, archive 16 entries, update companion CI invariant. Run P1+V0+RF same-SHA CI, record result and commit staged A02 content+tests+CI.

### Task 5: RED then GREEN A03 spectrum and source precedence; migrate 5/24 · 15/72, 20 ZIP files

**Files:** stage four `frequency-intelligence` Markdown and extend `tests/p1/test_family_a_stage.py`/`test_family_a_safety.py`, source fixtures, CI.

- [ ] **Step 1 (RED):** Test A03 exact owner/slug/3 filenames (`1-allocation-lookup.md`, `2-band-plan-overlay.md`, `3-channelrepeater-reference.md`) and require *national legal allocation* vs *IARU advisory* vs *source-verified repeater* distinctions; run and observe absent A03.
- [ ] **Step 2 (GREEN files):** Write exact responsibilities. Query conditions country, frequency_hz, mode, date and licence class where needed. Only fully versioned/effective primary excerpts can be used to *describe* potential legal allocation; source-entrypoint URLs are not current retrieval. Existing `spectrum_band_segments` has `verified:false` and `spectrum_find_repeaters` `live_status_known:false`. No fabricated verified repeaters or broad "legal to transmit" conclusions.
- [ ] **Step 3 (negative):** Synthetic band-edge fixture (inside, exact boundary, one hertz outside) with invented non-real rule ID `SYNTH-A03-001`; stale/changed allocation or IARU-only evidence must return `SOURCE_UNVERIFIED` / `INDETERMINATE`. Test user-supplied spot table not treated as live.
- [ ] **Step 4 (CI GREEN):** Update owners with A03 and exact stage/archive counts **5/24,15/72** / **20**; execute focused+full P1/V0/Node suite and stage ZIP repeatability. Commit only after actual success.

### Task 6: RED then GREEN A04 licensing and transmission-rule abstention; migrate 6/24 · 18/72, 24 ZIP files

**Files:** stage four `regulatory-licensing` Markdown and add authority tests (real vs synthetic); update workflow and contract.

- [ ] **Step 1 (RED):** Test canonical `SK-A04`, refs `1-licence-context.md`, `2-transmission-rule-evaluation.md`, `3-crossborder-explanation.md` and explicit `ALLOWED/NOT_ALLOWED/INDETERMINATE` hierarchy. Observe expected missing entrypoint RED.
- [ ] **Step 2 (GREEN files):** Require jurisdiction, operating location/time, validated licence/class, frequency, exact emission, power and exceptions before making any *synthetic* rules evaluation; real Greece-first rules need verified FEK and current amendments plus qualified review. A Gov.gr administrative form or personal claim is not verified licence. IARU and HAREC/CEPT guidance must not bypass Greek/host-country rules.
- [ ] **Step 3 (negative):** Synthetic-only rule fixtures `SYNTH-A04-001` with explicit revision/effective windows show allowed/not allowed/indeterminate on synthetic conditions; all real-law source missing/expired/conflicting/visitor-privilege uncertain cases are `INDETERMINATE`. `regulatory_check_operation` has `authorized:false` — static tests reject any conversion to real `ALLOWED`.
- [ ] **Step 4 (CI GREEN):** Update owners with A04; exact stage/archive **6/24,18/72**, **24** entries. Require P1/V0/Node tests same SHA and both ZIP validations before committing; do not modify actual RF/backend rule logic.

### Task 7: RED then GREEN A05 RF safety & non-invasive EMC; migrate 7/24 · 21/72, 28 ZIP files

**Files:** stage four `rf-safety-emc` Markdown and add A05 safety assertions; update workflow/contract.

- [ ] **Step 1 (RED):** Test A05 owner/slug `rf-safety-emc`, three exact refs `1-rf-exposure-worksheet.md`, `2-interference-troubleshooting.md`, `3-installation-risk-review.md`; expected absent A05 stage RED.
- [ ] **Step 2 (GREEN files):** Write worksheet with explicit user-supplied `mean_power_w`, `linear_gain`, `distance_m` and **user-provided** `reference_flux_w_m2`; ideal far-field physics only, mandatory `compliance_established=false`. No independently verified national RF exposure threshold exists in this survey; hence defer any assertion of legal/safety compliance. Give non-invasive RFI checklist and qualified-personnel referral for grounding, rooftop/tower, mains, lightning.
- [ ] **Step 3 (negative):** Test "below user reference" ≠ safe/certified; unknown duty/gain/near-field cannot become clearance; mains/roof instructions must not include unsafe modification. Test `rf_exposure_screen` source semantics without connecting it to hardware.
- [ ] **Step 4 (CI GREEN):** Final fixed owner allowlist `frozenset({"B07","B08","A01","A02","A03","A04","A05"})`; final `P1_STAGE=7/24,21/72` and `P1_STAGE_ARCHIVE_FILES=28`; adjust CI/contract in lockstep. Run full P1/V0/Node test suite and two deterministic staged ZIP builds. Commit after actual success.

### Task 8: Reviewable ≥30 Greek/English cases and 15/15 owner-specific subprocedures

**Files:** create `qa/p1/family-a-routing-and-safety-cases.json`, extend `tests/p1/test_family_a_safety.py`. No host model/routing execution.

- [ ] **Step 1 (RED):** Write `test_family_a_thirty_bilingual_cases_all_procedures`: require **≥30** records, **≥6 per A Domain**, all **15 procedure IDs**, nonempty distinct `prompt_el`/`prompt_en`, `expected_domains` (1–3 real canonical owners), `risk_class`, `expected_outcome`, `source_kind` and nonempty `must_not_claim`. Before data exists, observe missing file RED.
- [ ] **Step 2 (GREEN):** Author training inventory/outage/message repeat/role fixtures (A01/A02), Greek allocation/recency/bandplan overlays (A03), legal/CEPT/unknown-licence cases (A04), exposure/EMC/electrical hazard cases (A05), including three mixed-owner scenarios `["A01","A02"]`, `["A03","A04"]` and `["A05","B07"]`. All operational legal cases abstain without primary expert-approved evidence.
- [ ] **Step 3 (negative):** Mutation tests reject ID duplication, unknown owner, missing Greek/English prompt, false source-verification flag, `priority dispatch`, false `ALLOWED` from `IARU_RECOMMENDATION`, false `compliance_established:true`, fake official live repeater, unredacted victim info or unsafe electrical steps.
- [ ] **Step 4 (GREEN):** Focused and full P1 tests pass. **Important:** existing 18 general bilingual cases and 20 RF cases remain; the new ≥30 are separate QA evidence, **not** installed host E2E test requests. Commit source cases plus tests.

### Task 9: CI regression hardening and exactly 28-file ZIP provenance

**Files:** modify only `.github/workflows/p1-domain-skills-ci.yml`, `tests/p1/test_p1_ci_contract.py` and, if an observed test fails, `tests/p1/test_staging_archive.py`.

- [ ] **Step 1 (RED):** Add CI-contract tests requiring exact fixed 7-owner set, `P1_STAGE=7/24,21/72`, `P1_STAGE_ARCHIVE_FILES=28`, source evidence test, new ≥30 bilingual fixture tests and absence of any installer/release/deploy command. Observe RED if workflow still has 8/12/16/20/24 ZIP count or lacks required fixture check.
- [ ] **Step 2 (GREEN):** Derive allowlist from canonical registry for only approved seven IDs; two independent review-only ZIP builds have identical SHA256; enumerate exactly 28 entries, no manifest/secret/executable/symlink/unsafe paths. Do **not** upload ZIP or present it as a valid plugin archive.
- [ ] **Step 3 (regression):** Preserve existing P1 stage tests (B07/B08), all 5 V0 original Skills, `V0_ARCHIVE_FILES=12` and the pinned fingerprint `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`; preserve Node 22 `npm ci --ignore-scripts`, `npm run typecheck`, `npm test`, read-only contents permission and pinned checkout/setup actions.
- [ ] **Step 4 (negative):** Mutate cloned ZIP (29th plugin manifest, path escape, symlink, duplicate member, oversized/ratio), one missing SS and one misowned A04 reference; tests detect each before ZIP creation. Mutate CI string to remove P1 owner or RF/V0 job; CI-contract test must fail.
- [ ] **Step 5 (GREEN):** Run actual Linux GitHub Actions at exact commit, inspect full logs and result: P1, V0, Node all green; 28 and 12 ZIP members with hashes; **test totals taken only from this observed run**. Commit CI/tests and address only demonstrated defects via failing tests first.

### Task 10: Security/source truth whole-branch review before evidence

**Files:** source review only; add explicit findings to final ledger in Task 11 (do not write implementation or deploy here).

- [ ] **Step 1:** Diff against *reviewed P1.2 plan SHA*, check only `staging/p1-domain-skills/**`, `tests/p1/**`, `qa/p1/**`, `.github/workflows/p1-domain-skills-ci.yml` changed; `qrvai/**, `mcp/**, `api/**, `scripts/v0/**, `tests/v0/**, Vercel and Plugin Creator remain untouched.
- [ ] **Step 2:** Reconcile all 5 canonical Skills and 15 duties verbatim with original registry; source identity unchanged (24/72). 20 new Markdown files + 8 inherited source files, no hidden binary/plugin manifest.
- [ ] **Step 3:** Run five Review Focus negatives and audit expected authority-unknown/expiry, bandplan-law separation, dispatch/PTT, identity privacy, false compliance, cross-border unknowns; record failures and fix with fresh RED→GREEN only if source allows.
- [ ] **Step 4:** Flag independently unaudited real-law, RF threshold, vendor/provider, host login, physical measurements, actual authority/activation gates as `NOT_EXECUTED`, not PASS. A green static suite is not evidence of legal authorization.

### Task 11: Exact-final-SHA source-only QA ledger and Draft PR receipt

**Files:** create `qa/p1/P1-2-EVIDENCE-2026-10-17.md`, then GitHub PR metadata/comments only.

- [ ] **Step 1:** Write ledger from **observed** RED/GREEN Actions receipts for Tasks 1–9, 30-case denominator, owner IDs, per-SS/negative-case count, 7/24 and 21/72 source stage, exact 28 P1 + 12 V0 ZIP hashes, P1/V0/Node test totals, source candidates and legal uncertainties. Mark unknowns as `NOT_IMPLEMENTED`, `INDETERMINATE` or `NOT_EXECUTED`.
- [ ] **Step 2:** Record every plan deviation as `Ruling: decision — why — risk if wrong`. State independent reviewer `NOT_EXECUTED` unless a **real separate** review occurs; author-side review is not independent.
- [ ] **Step 3 (commit):** Commit evidence file alone; `qa/p1/**` PR path filter triggers a **fresh complete P1/V0/Node workflow at the new final SHA**. Do not record a predicted future SHA or run ID as if observed.
- [ ] **Step 4 (verify):** Read PR head + commit-triggered Actions job logs. Claim `SOURCE PILOT VERIFIED IN DRAFT` only if the head SHA matches run SHA, conclusion success, all suites 0 failures, stage 7/21 and both immutable-allowlist ZIP gates pass. Otherwise report `PENDING/BLOCKED`.
- [ ] **Step 5 (review):** Whole-branch author self-review COMMENT with source diff/limitations and independent reviewer flag; never submit self-approval as proof of independent review. Post exact run URL and observed denominator to the Draft implementation PR.
- [ ] **Step 6 (handoff):** Leave `main` and parent Draft PRs open/unmerged; no plugin create/install/release, Vercel promotion, credentials or hardware. P1.3 requires its own written plan and explicit consent.

## 5. P1-G0–P1-G7 exit matrix, metric validity and decisions

| Gate | P1.2 source-only proof after implementation | Out-of-scope certification |
|---|---|---|
| **G0** registry | 24/72 canonical identities and 5+2 cumulative Stage Domain IDs are unchanged | No other Domains implemented |
| **G1** entrypoints | `SK-A01–A05` positive/negative triggers and valid YAML, 7 staged total | No actual ChatGPT Skill host import |
| **G2** internal references | 15 exact A procedures + 6 inherited B = **21/72**; 28 files | No 21 independent host Skills/MCP calls |
| **G3** EL/EN | ≥30 new Family A cases, six per Domain, all 15 SS, 3 mixed routing contexts | No live LLM route accuracy |
| **G4** truth/safety | legal source precedence, EmComm drill-only, false certification and privacy negatives pass | No legal opinion, regulatory compliance or real emergency activation |
| **G5** V0 | 49+ V0 tests, 5 unchanged V0 Skills, strict **12-file** pinned ZIP hash | No plugin release/host proof |
| **G6** archive | **28/28** staged deterministic review-only files and validation | No installable Plugin Creator ZIP |
| **G7** same SHA | P1/V0/Node RF green on evidence-commit SHA, 0 failures; reviewer gaps recorded | No merge approval or independent legal/security review |

**Analytics denominators:** report independently (i) `SK_STAGED=7/24`, (ii) `SS_STAGED=21/72`, (iii) `FAMILY_A_QA_CASES_PASS/EXECUTED`, (iv) `FAMILY_A_SS_REFERENCED=15/15`, (v) `NEGATIVE_ASSERTIONS_PASS/DEFINED`, (vi) `P1/V0/RF TESTS_PASS/EXECUTED`, (vii) `P1_ZIP_ENTRIES=28` and `V0_ZIP_ENTRIES=12` + respective SHA, (viii) `HOST_E2E=NOT_EXECUTED`, (ix) `LEGAL_PRIMARY_RULES_EXPERT_VALIDATED=0/UNVERIFIED` until an actual review proves otherwise. **Never collapse these into a misleading single "% complete".**

## 6. Implementation gate — owner decision pending

**Owner to review:** this full written plan, especially Greece-first A03/A04 legal source handling, synthetic-only rule evaluations, EmComm-only A01/A02 and A05 physical safety boundaries. The already-approved global P1 spec allows **planning**, but **not** executing new P1.2 code or staging Skills without this plan's separate explicit owner approval and method selection: **Native TDD** or **Subagent-driven**. The P1.1 Native choice applied only to P1.1.

After approval: create a **new Draft implementation branch** from the verified head of **this planning branch**, open Draft PR against it (never `main`), write failing tests before any of the 20 staged Markdown files, observe real RED→GREEN with full-suite evidence and finish with final-SHA receipt. Until that decision, this PR is **documentation only**.
