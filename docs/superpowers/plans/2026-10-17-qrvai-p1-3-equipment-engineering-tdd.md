# QRVAI P1.3 — Equipment & Engineering Source Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking. **This plan has NOT been approved or executed yet.**

**Goal:** Stage precisely six canonical engineering Domain Skill candidates (`SK-B06` and `SK-B09`–`SK-B13`) and 18 owner-local internal Sub-skills, reaching **13/24 staged Domain Skills, 39/72 procedural references and 52 Markdown-only review files**, while preserving V0, existing A/B source packages and all RF regression tests.

**Architecture:** Reuse the **already owner-approved** P1 architectural spec, `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md` (`6 P1.3). Stage each Domain under `staging/p1-domain-skills/skills/<canonical-slug>/` with exactly one `SKILL.md` and three owner-local `references/*.md`. Existing parser, source audit, strict review-only ZIP, static bilingual fixtures and GitHub Actions provide the acceptance contract. This is NOT a plugin install, real manufacturer ingestion, calibrated instrument, FFT engine or connected rig.

**Tech Stack:** GitHub Draft PR + GitHub Actions, Python 3.11 stdlib `unittest`/existing `scripts/p1/`, existing 49 V0 Python tests, Node 22 TypeScript RF MCP typecheck + Node tests; no new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md` and the normative `docs/architecture/skill-and-subskill-registry-v0.5.md` and `docs/architecture/capability-register-v0.5.md`, original M0–M8 Master Roadmap and V0–V8 review gates.

**Source survey:** `docs/research/2026-10-17-qrvai-p1-3-engineering-source-boundaries.md` — actual existing MCP method input/output limitations, IBIS Touchstone 2.1, SigMF, manual copyright and provenance, privacy, electrical and radio control boundaries.

**Date:** 2026-10-17. **Status:** DRAFT FOR OWNER REVIEW; P1.3 IS NOT IMPLEMENTED. Owner must separately approve **this written plan and an execution method** (Native TDD or Subagent-driven); the prior P1.2 Native approval does not carry forward.

## Global Constraints

- **Parent:** verified [Draft PR #44](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/44) head `e73d8bd88d986e073533f369687dfd03fa1359bf` and [same-SHA CI #39017739355](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39017739355). Historical exact results: **64/64 P1 Python; 49/49 V0; 178/178 Node RF; TypeScript typecheck PASS**, registry 24/72, staged 7/24 + 21/72 and 28 files. This is P1.2 evidence, NOT future P1.3 proof.
- **Absolute exclusions:** no merge to `main`, no rebase/close of ancestor Draft PRs, no plugin create/update/install or host `@QRVAI` activation, no Vercel production or alternate Cloudflare/Sites deployment, no secrets/OAuth/issuer/CORS changes, no `qrvai/**`, `mcp/**`, `api/**`, `scripts/v0/**`, `tests/v0/**` edits, no external provider downloads, CAT parameter writes/PTT/TX, device scan/rig reads or live SDR capture.
- **Manual rights and untrusted content:** Require vendor/model/exact document and firmware revision, page/section evidence and user rights. `manual_find` and `manual_answer_cited` process **user-supplied excerpts only**, not official-document retrieval; they cannot prove an excerpt genuine. No invented menu/page, blind manual ingestion, copyright redistribution or following prompt-injection strings inside manuals.
- **Engine truth:** `rf_filter_response` supports only **ideal first-order RC** lowpass/highpass; `measurements_inspect_trace` only extrema of up to 32 user-supplied scalar frequency/magnitude points, **not calibrated VNA/S11/S21/Touchstone parsing**; `sdr_inspect_iq` computes mean power/peak from up to 32 supplied IQ pairs, **not FFT, SigMF binary ingestion or demodulation**.
- **Station truth:** `station_signal_path` is a user-supplied topology (`verified:false`), `station_get_profile` echoes a user profile (`profile_connected:false`); `station_read_status` only echoes a **user-supplied** mode/frequency snapshot (`live_device_connected:false`), even if the snapshot's mode reads "TX". No real read-only bridge currently connected.
- **Power/safety truth:** `power_autonomy` computes ideal constant-load `battery_wh*usable_fraction/average_load_w`; user duty, health, charger, chemistry and temperature assumptions are not telemetry. No energized electrical repair, tower/roof guidance, lightning work, lithium pack manipulation, RF/EMC certification or unsupported component ratings.
- **Sensitive data:** No real callsigns, geolocations, IQ captures of protected communications, private manuals, vendor licence files, passwords, personally identifying SigMF `core:author` data or live station snapshots in committed fixtures. Source candidates may use public official links, labelled `UNREVIEWED`; never auto-grant device/operating permission.
- **Exact shared interfaces:** `load_registry(skill_registry_path: Path, capability_registry_path: Path) -> tuple[DomainSpec,...]`; `audit_stage(root: Path, specs: tuple[DomainSpec,...], required_ids: frozenset[str]) -> list[str]`; `build_review_zip(stage_root: Path, output_zip: Path, specs: tuple[DomainSpec,...], required_ids: frozenset[str]) -> Path`; `validate_review_zip(archive: Path, expected_paths: frozenset[str]) -> list[str]`. Keep existing strict staging audit and ZIP builder unchanged unless a tested genuine bug proves otherwise.
- **Native TDD evidence:** Write a failing source/fixture test first, observe the correct RED in real GitHub Actions, add minimum data/files/CI for GREEN, inspect full P1/V0/Node logs for every completed slice. Final QA-ledger commit must itself trigger P1 workflow, and the exact final SHA must be green. Never invent test totals, successful host interactions or independent reviews.
- **V0 fingerprint:** 5 original V0 Core/Family Skills and **12-file ZIP SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`**, with equality asserted in CI, not merely printed.
- **Canonical scope:** 6 newly staged SK, 18 internal SS, **24 new** Markdown; existing 7 SK + 21 SS + 28 Markdown ⇒ **13/24, 39/72, 52** at completion. These ratios count *sources*, not installed Skills, live integrations or product completeness.

## File map and incremental stage gates

Every path below is relative to `staging/p1-domain-skills/`; each three-reference set is in the owner's `references/` directory and must retain **verbatim** `**Responsibility:**` text from the canonical registry.

| Stage (risk-weighted) | Owner entrypoint | Three canonical reference filenames | Cumulative SK/SS | P1 ZIP files |
|---|---|---|---|---|
| 1 | `skills/equipment-manuals/SKILL.md` (**B06**) | `1-versioned-manual-retrieval.md`; `2-configuration-walkthrough.md`; `3-safe-troubleshooting.md` | **8/24,24/72** | **32** |
| 2 | `skills/rf-electronics/SKILL.md` (**B09**) | `1-filter-modeling.md`; `2-rf-chain-explanation.md`; `3-component-selection-checks.md` | **9/24,27/72** | **36** |
| 3 | `skills/rf-measurements/SKILL.md` (**B10**) | `1-vna-trace-interpretation.md`; `2-spectrumtest-setup.md`; `3-measurement-reconciliation.md` | **10/24,30/72** | **40** |
| 4 | `skills/power-infrastructure/SKILL.md` (**B12**) | `1-power-budget.md`; `2-battery-runtime.md`; `3-backup-scenario.md` | **11/24,33/72** | **44** |
| 5 | `skills/sdr-dsp/SKILL.md` (**B13**) | `1-sampling-foundations.md`; `2-spectrumfft-visualization.md`; `3-dsp-filter-analysis.md` | **12/24,36/72** | **48** |
| 6 (last; hardware-sensitive) | `skills/station-integration/SKILL.md` (**B11**) | `1-signal-path-mapping.md`; `2-compatibility-check.md`; `3-readonly-telemetry.md` | **13/24,39/72** | **52** |

*Ruling:* Execute B11 last because a station "status" question tempts false connected-device claims. Canonical registry IDs/order remain unchanged; only incremental implementation order differs.

Every `SKILL.md`: YAML `name`/`description`, `# SK-Bxx`, `**Trigger:**`, `**Required context:**`, `**Output contract:**`, `**Refusal/stop condition:**` and 3 local links. Every SS: original `# SS-Bxx-n`, `**Owner:** SK-Bxx`, verbatim `**Responsibility:**` and `**Required input:**`, `**Procedure:**`, `**Output:**`, `**Error/stop:**`. Actual presence is machine-audited; narrative intent without a source file does not count.

**New implementation-owned files (not created in this planning PR):** `tests/p1/test_family_b_stage.py`, `tests/p1/test_family_b_cases.py`, `tests/p1/test_family_b_physics.py`, `tests/p1/test_family_b_archive.py`, `qa/p1/family-b-engineering-cases.json`, `qa/p1/family-b-engineering-source-candidates.json`, final-only `qa/p1/P1-3-EVIDENCE-2026-10-17.md`. Modify **only** `.github/workflows/p1-domain-skills-ci.yml` and `tests/p1/test_p1_ci_contract.py` in lockstep for owner/ZIP stage counts. No production tool files.

## Review Focus — five highest-risk untested inputs

1. **Rights/prompt injection (B06):** a user-supplied fake "official" manual excerpt names another firmware version, invents menu/page or contains instructions to ignore safety constraints. Assert abstention and exact source citation; never download/reproduce a full copyrighted manual.
2. **Measurement overclaim (B10):** an uncalibrated scalar dB trace is described as a full complex S11/S21 Touchstone 2.1 measurement or an accurate VNA calibration. Assert `USER_SUPPLIED_UNVERIFIED` and `NOT_IMPLEMENTED` for parsing/certification.
3. **SDR privacy/FFT overclaim (B13):** missing/invalid IQ sample rate, personally identifying SigMF metadata or intercepted audio, or requested FFT when only bounded IQ statistics exist. Assert no file upload/decoding, no station attribution and `NOT_IMPLEMENTED` for actual FFT/waterfall.
4. **Station-control escalation (B11):** a supplied `mode:"TX"` snapshot is misread as connected/live telemetry; user asks PTT, CAT writes or serial port discovery. Assert `live_device_connected:false`, no network/device interaction and refusal.
5. **Wrong physics/unsafe installation (B09/B12):** LC/4-pole claims from first-order RC, missing unit/duty assumptions, battery high-voltage/lithium repair, or P1 allowlist/V0 regression drift. Assert scoped ideal formula, missing-context response, qualified professional referral and immutable archived V0.

---

### Task 1: Test-first freeze engineering-source contracts (NO new parser)

**Files:** create `tests/p1/test_family_b_physics.py` initial source-boundary tests; after RED, `qa/p1/family-b-engineering-source-candidates.json`. **Consumes:** source survey; **Produces:** version/rights/provenance data used by B06/B10/B13 QA.

- [ ] **Step 1 (RED test):** Define `test_candidates_have_exact_provenance_and_no_auto_implementation` demanding ≥4 candidates with unique IDs, URL or `source_type:"USER_SUPPLIED"`, `kind`, `version` (nullable), `checked_at`, `rights_status` and `review_state:"UNREVIEWED"` and `capability_available:false`. Require IBIS Touchstone 2.1 and SigMF as **format-document** candidates, not code.
- [ ] **Step 2 (run RED):** `python -m unittest discover -s tests/p1 -p 'test_family_b_physics.py' -v`; expected missing candidate JSON error/assertion, not a broken import.
- [ ] **Step 3 (GREEN):** Add public normative format URL metadata and rights-unverified manufacturer candidate instructions with no vendor PDF bytes, no fake firmware/page, no test personal data. Unknown revision is null, not guessed.
- [ ] **Step 4 (negative):** Mutate source to verified rights, `capability_available:true`, non-HTTPS unsafe link or embedded token/PII: metadata validation must fail. Record the required bounds.
- [ ] **Step 5 (verification/commit):** Focused GREEN, then same-SHA P1/V0/Node full CI, with baseline **7/24,21/72,28** unchanged; record job/run.

### Task 2: B06 Equipment Manuals RED→GREEN

**Files:** create `tests/p1/test_family_b_stage.py`, four B06 files; modify P1 CI workflow + CI-contract test.

- [ ] **Step 1 (RED test):** Require canonical B06 slug, SS-B06-1..3 exact file names, source owner, 3 local links, "no guessed menu/page" and rights-aware user-excerpt behavior; invoke `audit_stage` on temporary B06-only source tree.
- [ ] **Step 2 (run RED):** focused `python -m unittest discover -s tests/p1 -p 'test_family_b_stage.py' -v` must fail because `SK-B06` staged entrypoint is missing.
- [ ] **Step 3 (GREEN sources):** SS-B06-1 explains rights-aware exact model/revision excerpt retrieval without actual HTTP fetch; SS-B06-2 only gives documented menu/port setup with cited page+firmware; SS-B06-3 reversible non-invasive checks; `manual_find`/`manual_answer_cited` receive user excerpts only, `equipment_diagnose` handles only the three enumerated symptoms.
- [ ] **Step 4 (negative):** Mismatched model, invented page, missing firmware, malicious embedded manual instruction and unexpected copyrighted `manual.pdf` must fail source or corpus audit.
- [ ] **Step 5 (CI/commit):** Allowlist add B06, print **P1_STAGE=8/24,24/72** and **P1_STAGE_ARCHIVE_FILES=32**, run P1/V0/Node all green and commit.

### Task 3: B09 RF Electronics RED→GREEN

**Files:** extend `test_family_b_stage.py` and `test_family_b_physics.py`; create four `skills/rf-electronics/` docs; CI+contract.

- [ ] **Step 1 (RED test):** Require exact B09 paths and first-order RC source limits. Golden ideal R=1000 Ω, C=1e-6 F ⇒ `f_c=1/(2πRC)≈159.154943 Hz`; at cutoff magnitude `1/√2` and gain `−3.01029996 dB`. Any unsupported high-order LC optimizer ⇒ `NOT_IMPLEMENTED`.
- [ ] **Step 2 (run RED):** focused test must fail due to missing staged B09 Skill, not code-import failures.
- [ ] **Step 3 (GREEN sources):** SS-B09-1 bounded RC response (current `rf_filter_response` only), SS-B09-2 conceptual mixer/oscillator/gain/linearity without made-up IP3/NF, SS-B09-3 rated component comparison only from supplied datasheets with voltage/thermal caveats.
- [ ] **Step 4 (negative):** reject missing/negative R/C or units, false "measured filter curve", undocumented component safety ratings and unsafe live repair.
- [ ] **Step 5 (CI/commit):** Allowlist B09 stage **9/24,27/72**, ZIP **36**, same-SHA full P1/V0/RF green before commit.

### Task 4: B10 Test Equipment & Diagnostics RED→GREEN

**Files:** stage four `skills/rf-measurements/` docs; extend stage, physics, safety tests; CI/contract.

- [ ] **Step 1 (RED test):** Require B10 exact filenames and an independent user-supplied scalar trace: (144 MHz,−10 dB), (145 MHz,−20 dB), (146 MHz,−5 dB) ⇒ minimum −20 dB, maximum −5 dB, dip 145 MHz; these are **NOT** a calibrated S11/S21/Touchtone parser output.
- [ ] **Step 2 (run RED):** observe missing B10 staged Skill.
- [ ] **Step 3 (GREEN sources):** SS-B10-1 document complex S-parameter/reference impedance requirements from official Touchstone **2.1** and mark full parser `NOT_IMPLEMENTED`; SS-B10-2 instrument power/attenuator setup as informational with model-specific limits unknown; SS-B10-3 compare supplied trace vs ideal with uncertainty and missing calibration.
- [ ] **Step 4 (negative):** missing phase/reference impedance, guessed port mapping, fabricated VNA accuracy, analyzer input-power overload advice must fail.
- [ ] **Step 5 (CI/commit):** Owners **10/24,30/72**, ZIP **40**; full same-SHA P1/V0/Node PASS before commit.

### Task 5: B12 Power Infrastructure RED→GREEN

**Files:** four `skills/power-infrastructure/` Markdown, stage/physics/safety tests, CI/contract.

- [ ] **Step 1 (RED test):** Require B12 filenames, exact owner/duties and golden ideal load `10 W RX×0.8 + 60 W simulated TX×0.2=20 W`; `240 Wh × usable 0.8 / 20 W = 9.6 h`; label this a hypothetical model, NOT live TX or actual battery state.
- [ ] **Step 2 (run RED):** missing B12 source test fails correctly.
- [ ] **Step 3 (GREEN sources):** SS-B12-1 weighted W/Wh + duty math; SS-B12-2 sensitivity to usable fraction/degradation/temperature; SS-B12-3 backup/solar as labelled scenarios with unknown real irradiance. `power_autonomy` is only ideal constant-load arithmetic.
- [ ] **Step 4 (negative):** Ah without voltage, missing load, nonpositive capacity, unsafe lithium/mains repairs or guaranteed outage autonomy must fail.
- [ ] **Step 5 (CI/commit):** Owners **11/24,33/72**, ZIP **44**; P1/V0/Node full green and commit.

### Task 6: B13 SDR & DSP RED→GREEN

**Files:** four `skills/sdr-dsp/` Markdown, tests and CI/contract.

- [ ] **Step 1 (RED test):** Require canonical B13 paths; test four IQ pairs (1,0),(0,1),(−1,0),(0,−1) ⇒ ideal supplied mean power 1 and peak magnitude 1; theoretical sample rate 1 MHz with N=1024 gives `Δf=976.5625 Hz` but **not** observed FFT data.
- [ ] **Step 2 (run RED):** fail specifically for missing `SK-B13`.
- [ ] **Step 3 (GREEN sources):** SS-B13-1 Nyquist/alias/decimation with complex-vs-real context; SS-B13-2 explain FFT resolution/window/leakage and explicitly mark live FFT/waterfall `NOT_IMPLEMENTED`; SS-B13-3 describe DSP-filter/demodulation concepts without actual radio decoding. SigMF \`metadata\` is public format context, not automatically parsed binary or permission to intercept.
- [ ] **Step 4 (negative):** reject missing sample rate, fake SDR connection, unredacted `core:author`/geolocation, unwarranted station identification, signal decryption/interception and "full FFT result" from `sdr_inspect_iq`.
- [ ] **Step 5 (CI/commit):** Owners **12/24,36/72**, ZIP **48**; full same-SHA suites green and commit.

### Task 7: B11 Station Integration LAST, no hardware connection

**Files:** four `skills/station-integration/` docs, stage/safety tests, CI/contract.

- [ ] **Step 1 (RED test):** Require B11 canonical references and explicit **no** CAT parameter writes, PTT, local bridge, station USB/serial device scans; `station_signal_path.verified=false`, `station_read_status.live_device_connected=false` and `station_get_profile.profile_connected=false` even on user-supplied `mode:"TX"`.
- [ ] **Step 2 (run RED):** fail from missing SK-B11, not a host API error.
- [ ] **Step 3 (GREEN sources):** SS-B11-1 schematic topology with unverified directed edges; SS-B11-2 verify ports/protocol/driver/firmware only from documented compatible source, no live probing; SS-B11-3 explain future *opt-in read-only* state design but mark actual telemetry `NOT_IMPLEMENTED`. No bridge, secrets or hardware code.
- [ ] **Step 4 (negative):** user requests to key rig, toggle CAT/serial, change frequency/power, read a remote device without consent or assert connected state must return refusal/`NOT_IMPLEMENTED`.
- [ ] **Step 5 (CI/commit):** Final fixed owners `{"A01","A02","A03","A04","A05","B06","B07","B08","B09","B10","B11","B12","B13"}`; stage **13/24,39/72**, ZIP **52**. Run full P1/V0/Node green before commit.

### Task 8: ≥36 bilingual engineering fixtures with all 18 procedure IDs

**Files:** create `tests/p1/test_family_b_cases.py`, `qa/p1/family-b-engineering-cases.json`; extend `test_family_b_physics.py`.

- [ ] **Step 1 (RED test):** Define `validate_family_b_cases(path: Path) -> list[str]` with exact schema `id/domain/procedure_id/prompt_el/prompt_en/expected_domains/risk_class/expected_outcome/source_kind/fixture_basis/must_not_claim`; demand **≥36** unique bilingual records, **≥6 for each B owner**, **18/18 SS IDs**, all multi-domain owners valid and at least four mixed owner tuples.
- [ ] **Step 2 (run RED):** missing corpus fails real test.
- [ ] **Step 3 (GREEN):** Author 36+ Greek/English cases: 6 B06 manual source/firmware, 6 B09 ideal RF/components, 6 B10 supplied trace/uncertainty, 6 B12 W/Wh/duty, 6 B13 IQ/theoretical FFT/privacy, 6 B11 snapshot/no CAT. Add mix `["B06","B11"]`, `["B09","B10"]`, `["B12","A01"]`, `["B13","B10"]` with explicit author-chosen owner order.
- [ ] **Step 4 (negative):** mutate duplicate ID, wrong canonical SS, empty Greek or English, false verified vendor manual, fake complex S11 calibration, arbitrary LC solver, incorrect units, personal SigMF author/geo, `live_device_connected:true`, PTT command, unsafe battery repair. Verify tests reject each.
- [ ] **Step 5 (GREEN/commit):** Verify all golden source assumptions with tolerances and provenance; run P1/V0/Node full suite, record observed denominators, commit.

### Task 9: Full 52-file archive, CI regression and guardrails

**Files:** create `tests/p1/test_family_b_archive.py`; update `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml` only.

- [ ] **Step 1 (RED):** Require owner count **13**, `P1_STAGE=13/24,39/72`, `P1_STAGE_ARCHIVE_FILES=52`, `P1_FAMILY_B_SS_COVERED=18/18`, `P1_FAMILY_B_CASES` actual ≥36, `P1_STATION_BRIDGE=NOT_CONNECTED`, and preserve all P1.2 Family A/30-case/unreviewed legal-source gates.
- [ ] **Step 2 (GREEN):** Audit exact canonical source-file allowlist (13×4=52) and perform two build runs in temp directories; assert byte-for-byte SHA equality and 52 member filenames, 13 Skill entrypoints, 39 internal references. Never upload generated ZIP.
- [ ] **Step 3 (negative):** reject 53rd plugin manifest, malicious traversal, symlink, duplicate filename, oversize/ZIP bomb, wrong B11 owner or casefold collision; do not weaken `audit_stage` or archive preflight.
- [ ] **Step 4 (regression):** Preserve prior A01–A05, B07–B08, ≥30 Family A cases and 7 unreviewed legal sources; unchanged V0 49+ tests, 5 original skills, immutable 12-member ZIP hash equality; Node 22 `npm ci --ignore-scripts`, `npm run typecheck` and `npm test` inside same read-only pinned CI.
- [ ] **Step 5 (GREEN/commit):** Run actual same-SHA GitHub Actions P1/V0/Node; record observed numeric totals and generated P1 SHA (not predicted), commit verified CI/tests.

### Task 10: Whole-branch author-side source/security review

**Files:** no new implementation; record findings in later evidence ledger.

- [ ] **Step 1:** Compare PR diff with **owner-reviewed P1.3 plan SHA**; exact new 24 Markdown paths and only `tests/p1/**`, `qa/p1/**` plus P1 workflow outside stage. Reject changes in any runtime, V0, credential, hardware, Plugin Creator or Vercel path.
- [ ] **Step 2:** Reconcile all 6 domain entrypoints and **18 verbatim canonical SS responsibilities** against v0.5 source; inspect full files for "present in MCP source" misstatements and fake official/manual instrumentation.
- [ ] **Step 3:** Independently scrutinize the five Review Focus negative classes in the actual source/QA (rights/injection; calibration; SDR privacy; bridge/PTT; unsafe power and CI drift), fix demonstrable Critical/Important issues through RED→GREEN + full regression.
- [ ] **Step 4:** Record `MANUFACTURER_RIGHTS_AUDIT`, `TOUCHSTONE_PARSER`, `SIGMF_BINARY_PARSER`, `FFT_RUNTIME`, `CALIBRATED_VNA`, `STATION_BRIDGE`, `HOST_E2E`, `INDEPENDENT_REVIEW` as `NOT_EXECUTED`/`NOT_IMPLEMENTED` unless independently observed. Self-review is COMMENT, not a second person.

### Task 11: Ledger + final exact-SHA CI receipt + development handoff

**Files:** create `qa/p1/P1-3-EVIDENCE-2026-10-17.md` only after implementation GREEN; update Draft PR comments/metadata only.

- [ ] **Step 1:** Write ledger of exact RED→GREEN run links per Task, 6/18 new owners, 36+ EL/EN cases, all 18 SS, four mixed routes, negative tests, actual stage **13/24,39/72**, 52-file deterministic P1 ZIP hash, V0 12-file pinned hash and actual P1/V0/Node test denominators. Document each deviation `Ruling: decision — why — risk if wrong`.
- [ ] **Step 2:** Commit ledger at new immutable HEAD; `qa/p1/**` filter must trigger **fresh complete CI** at that final SHA, not merely cite pre-ledger runs.
- [ ] **Step 3:** Fetch complete final-SHA Actions job logs and assert all tests 0 failures, P1 stage 13/39 and 52 ZIP members, ≥36/18 new fixtures, V0 SHA unchanged, Node typecheck/PASS, read-only CI. Else report `PENDING/BLOCKED`.
- [ ] **Step 4:** Post whole-branch **author-side COMMENT review** and precise SHA + real Actions run receipt to Draft PR. Call it **P1.3 SOURCE PILOT VERIFIED IN DRAFT** only if actual same-SHA evidence exists; independent reviewer and ChatGPT host E2E are not executed.
- [ ] **Step 5:** Leave `main` and all ancestor Draft PRs open/unmerged. No host install, product release, OAuth, Vercel production, rig connection, CAT/PTT/TX. P1.4 C14–C21 requires a new plan and its own explicit owner execution consent.

## Exit matrix and truthful metrics

| Gate | P1.3 source-only pass conditions (future) | Explicitly NOT established |
|---|---|---|
| **P1-G0** | Original registry **24 Domain IDs/72 SS+SC mapping**, unchanged | Actual product capabilities |
| **P1-G1** | Exactly 6 new B Skill entrypoints + 7 inherited = **13/24** | 13 installed Skills |
| **P1-G2** | Exactly 18 new +21 inherited SS = **39/72**, 52 Markdown files | 39 separate MCP tools |
| **P1-G3** | ≥36 bilingual Family B cases, ≥6/domain, all **18 SS** and ≥4 mixed | Live model routing accuracy |
| **P1-G4** | Manual rights and anti-injection; RC/VNA/SDR data limits; power safety; no hardware CAT/TX | Manufacturer, instrument or electrical certification |
| **P1-G5** | 5 original V0 Skills, **49+ V0 tests** and strict **12-file V0 ZIP** unchanged SHA | V0 host release |
| **P1-G6** | **52/52** deterministic Markdown review ZIP, hostile source/ZIP rejects | Installable Plugin Creator ZIP |
| **P1-G7** | **Exact final ledger-commit SHA**, P1/V0/Node all green, reviewed scoped diff | Independent review, production, OAuth and devices |

**QA/data denominators:** Report `SK_STAGED=13/24`, `SS_STAGED=39/72`, `FAMILY_B_CASES_PASS/TOTAL`, `FAMILY_B_SS=18/18`, `P1/V0/RF_PASSED/EXECUTED`, `P1_ZIP_FILES=52` and SHA, `V0_ZIP_FILES=12` and fixed SHA; `HOST_E2E=NOT_EXECUTED`, `LIVE_STATION_BRIDGE=NOT_CONNECTED`. Never present staging completion as a single percentage of plugin/product readiness.

## Mandatory owner handoff

The owner must review this **actual** P1.3 plan, not just the earlier conceptual scope. After reviewing, explicitly approve the plan and select **Native TDD** or **Subagent-driven**. Until then **this docs-only planning PR has no implementation, tests, new Skills, plugin creation or deployment authorization**. Once approved, start a **separate Draft implementation PR from this planning branch's verified head**, execute RED→GREEN, and finish with same-final-SHA evidence and a scoped review.
