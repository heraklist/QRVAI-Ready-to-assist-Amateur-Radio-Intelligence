# QRVAI P1.4 — Operations & Networks Source Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended when actual independent reviewers exist) or superpowers:executing-plans for Native TDD, task-by-task. Steps use checkbox (- [ ]) for tracking. **This plan is NOT owner-approved or implemented.**

**Goal:** Source-stage exactly eight canonical C14–C21 Domain Skill candidates and 24 owner-local internal Sub-skills; when implemented, raise cumulative P1 to **21/24 Skill candidates, 63/72 internal references and 84 exact review-only Markdown files**, preserving full P1.3, V0 and RF CI provenance.

**Architecture:** Reuse previously **owner-approved global P1 staging specification** `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md` (`6 explicitly names P1.4 C14–C21). One `skills/<slug>/SKILL.md` plus three exact `skills/<slug>/references/*.md` per C owner under `staging/p1-domain-skills/`; the existing registry parser/strict stage auditor/deterministic source ZIP are the only staging architecture. Bilingual QA and bounded offline examples are **static contracts**, not ChatGPT model accuracy or a live provider service. No new MCP tools, APIs or credentials.

**Tech Stack:** Existing Python 3.11 stdlib unittest + `scripts/p1/registry.py`, `audit_domain_skills.py`, `build_staging_archive.py`; GitHub Actions read-only pinned checkout + V0 Python and Node 22/TypeScript RF MCP regression, using a separate **Draft implementation PR** after owner approval. Do not add dependencies.

**Spec:** `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md`; normative `docs/architecture/skill-and-subskill-registry-v0.5.md` and `docs/architecture/capability-register-v0.5.md`; roadmap M0–M8 and V0–V8 gates; source truth `docs/research/2026-10-17-qrvai-p1-4-operations-networks-source-boundaries.md`.

**Plan date:** 2026-10-17. **Status:** DRAFT FOR OWNER REVIEW AND EXECUTION METHOD; no P1.4 implementation authorized by writing it. Approved P1.3 Native TDD choice does **not** carry to P1.4.

## Global Constraints

- **Immutable parent:** [P1.3 source-verified Draft PR #46](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/46) head `08b2759021545a778bf64c0c15c9e342c8aa421f` and [real final-SHA P1 CI #39034380131](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39034380131): **84 P1 Python / 49 V0 Python / 178 RF Node tests** and typecheck PASS at **that historical SHA**. Actual source staging **13/24 SK, 39/72 SS, 52 Markdown-only ZIP files**, previous P1 ZIP SHA256 `50160a037c52de504676593f79fc87f12166ca019d8620a4f98e00e677eb5ceb`. No assumption of P1.4 tests passing before observed CI.
- **Unchanged V0:** five original Core/Family Skills and strict **12-file ZIP SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`** must still be asserted equal in same-SHA CI.
- **Strict scope:** additive **8 SK×(1 entry+3 refs)=32 Markdown files** under staging only, eight new C candidate Skill identities, 24 internal SS IDs. Cumulative **13+8=21 SK; 39+24=63 SS; 52+32=84 ZIP members**. Other three D22–D24 remain unstaged until P1.5. No new independently mounted Sub-skills, additional MCP methods, router provider registrations or live services.
- **Forbidden code/operations:** no `main` merge, ancestor PR closure/rebase, Plugin Creator create/update/install/connect, real ChatGPT `@QRVAI` host calls, Vercel production or Cloudflare/Sites migration, OAuth/JWKS/secrets/CORS, `qrvai/**`, `mcp/**`, `api/**`, `scripts/v0/**`, `tests/v0/**`, existing two canonical registry files or production source changes. No rig CAT writes, frequency/power changes, PTT/TX, auto digital transmissions, mesh/packet/Winlink/APRS message forwarding, SDR capture, portable dispatch, real contest/log award provider writes, private location disclosure.
- **Authority/rights:** Greece-first transmit/legal/third-party traffic, band plans, event category, awards, regional repeaters and land/portable activation need current competent, authenticated, versioned sources at use. Until then source-only examples must emit `INDETERMINATE` or `NOT_IMPLEMENTED`, not fictitious permitted frequencies or official times.
- **Telemetry/currency:** Current registered `dx_reception_reports`, `spaceweather_indices`, `spectrum_find_repeaters`, `satellite_pass` etc. use bounded **user-supplied** input, not current external feeds; data timestamps, reference timezone/UTC and source provenance are required. `propagation_path` is only ideal great-circle/FSPL **not real ionosphere**. `satellite_pass` summarizes *provided elevations* `orbit_computed:false`, not SGP4/AOS/LOS/Doppler. No claim of real-time spots/Kp/repeater or satellite pass.
- **Software/data:** `digital_setup_guide` currently only simulated FT8/APRS EL/EN receive-only steps (not rig/audio/CAT setup); `packet_route_preview` simulated AX25/APRS paths (no network); `repeater_channel_preview` RX + signed offset arithmetic (no verified tones); `contest_plan` sorts supplied UTC slots (not official schedule); `adif_validate` is only ≤4096-character bounded ADIF tag/EOR preview, `saved:false`; `log_award_progress` compares user-provided entities, `award_certified:false`. **ADIF 3.1.8** released 2026-10-12 is normative research, **not complete validator certification**. WSJT-X 3.0.1 and CelesTrak OMM/six-digit ID issue are format/source research only; **no parser/download**.
- **Privacy:** fixtures must be synthetic, anonymized and non-operative, no real operators' callsigns/QSO transcripts, private APRS lat/lon and home locations, third-party messages, Winlink personal identifiers, log credentials or complete private ADIF files. Manual/docs bodies and user uploads are untrusted text, never control instructions.
- **Compatibility:** keep `load_registry(skill_registry_path: Path, capability_registry_path: Path) -> tuple[DomainSpec,...]`; `audit_stage(root: Path, specs: tuple[DomainSpec,...], required_ids: frozenset[str]) -> list[str]`; `build_review_zip(stage_root: Path, output_zip: Path, specs: tuple[DomainSpec,...], required_ids: frozenset[str]) -> Path`; `validate_review_zip(archive: Path, expected_paths: frozenset[str]) -> list[str]`. No allowlist relaxation, silence of negatives, unsafe ZIP or CI side effects.
- **P1.3 archival regression:** pre-existing `tests/p1/test_family_b_archive.py` assumes a 13-owner **whole-root 52-file** tree; **before adding C files**, write and observe RED boundary test demanding a copied 13-owner P1.3 subset and then change that older test to audit only its isolated 13 owners. The already isolated seven-owner/28-file P1.2 test must remain. A new full 84-file archive regression tests the growing current tree. Never bypass regression or edit `build_review_zip` solely to hide additive source files.
- **TDD evidence:** For each Domain first write test and actually observe expected RED in Actions (missing SK, not Python import failure); then create exactly four Markdown source files and update P1 workflow/contract; commit candidate and check full P1/V0/Node same-commit Actions GREEN **before** declaring that Domain done. If RED is a test typo or an inherited incompatibility, record a Ruling and a corrected RED→GREEN. Final ledger-commit SHA needs newly triggered complete CI and exact reported run hash/count. No independent-review claim unless an independent reviewer actually participated.

## Canonical file map (all source paths relative to `staging/p1-domain-skills/`)

| Implementation stage | Domain | Exact entrypoint | Exact 3 owner-local reference filenames | Cumulative Skills/SS | P1 source ZIP files |
|---|---|---|---|---|---|
| 1 | SK-C14 `operating-dx` | `skills/operating-dx/SKILL.md` | `1-operating-procedure.md`; `2-dx-observation-reading.md`; `3-operating-scenario-plan.md` | **14/24 · 42/72** | **56** |
| 2 | SK-C15 `propagation` | `skills/propagation/SKILL.md` | `1-space-weather-reading.md`; `2-propagation-scenario.md`; `3-observation-correlation.md` | **15/24 · 45/72** | **60** |
| 3 | SK-C16 `digital-modes` | `skills/digital-modes/SKILL.md` | `1-mode-basics.md`; `2-audiocat-diagnostics.md`; `3-software-version-guidance.md` | **16/24 · 48/72** | **64** |
| 4 | SK-C17 `packet-networks` | `skills/packet-networks/SKILL.md` | `1-packet-framerouting.md`; `2-aprslocation-ethics.md`; `3-winlinkmesh-planning.md` | **17/24 · 51/72** | **68** |
| 5 | SK-C18 `repeaters-dvoice` | `skills/repeaters-dvoice/SKILL.md` | `1-analog-repeater-settings.md`; `2-digital-voice-profiles.md`; `3-directory-discovery.md` | **18/24 · 54/72** | **72** |
| 6 | SK-C19 `satellites-weak-signal` | `skills/satellites-weak-signal/SKILL.md` | `1-satellite-metadata.md`; `2-passdoppler-calculation.md`; `3-weaksignal-workflow.md` | **19/24 · 57/72** | **76** |
| 7 | SK-C20 `logbook-awards` | `skills/logbook-awards/SKILL.md` | `1-adif-integrity.md`; `2-qso-analytics.md`; `3-awardqsl-assessment.md` | **20/24 · 60/72** | **80** |
| 8 | SK-C21 `contests-portable` | `skills/contests-portable/SKILL.md` | `1-contest-rule-preparation.md`; `2-portable-activation-planning.md`; `3-field-operations-review.md` | **21/24 · 63/72** | **84** |

Every `SKILL.md` must have original canonical slug in YAML `name`, a bounded `description`, `# SK-Cxx`, `**Trigger:**`, `**Required context:**`, `**Output contract:**`, `**Refusal/stop condition:**` and links to three `references/` files. Each `SS-Cxx-1..3` reference must have original `# SS-Cxx-n`, `**Owner:** SK-Cxx`, **verbatim original canonical** `**Responsibility:**`, `**Required input:**`, `**Procedure:**`, `**Output:**`, `**Error/stop:**` and honest `NOT_IMPLEMENTED`/`USER_SUPPLIED_UNVERIFIED` boundaries. Use registry **verbatim** for the duties below — documentation claiming full future scope must separate desired duty from current tool capability.

**Implementation-owned file map (none created in this planning Draft PR):** create `tests/p1/test_family_c_stage.py` (owner/identity/per-SS tests), `tests/p1/test_family_c_candidates.py`, `tests/p1/test_family_c_physics.py`, `tests/p1/test_family_c_cases.py`, `tests/p1/test_family_c_archive.py`; create `qa/p1/family-c-source-candidates.json`, `qa/p1/family-c-operating-scenarios.json` (≥48 Greek/English records), and final-only `qa/p1/P1-4-EVIDENCE-2026-10-17.md`. Modify only `tests/p1/test_family_b_archive.py` for inherited 52-file isolated baseline, `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml` for stage/QA counters. No other files without a documented Ruling and prior RED test.

## Review Focus: highest-risk inputs

1. **Stale DX/Kp/false propagation guarantee:** a user supplies outdated Kp or spot, asks for "live now" DX and a guaranteed ionospheric path from `propagation_path`. Expect `USER_SUPPLIED_UNVERIFIED` + age/UTC, model-only FSPL and `INDETERMINATE` about real opening; Tasks 2–3 and 10.
2. **Unauthorized digital/packet TX and private location:** FT8/CAT/PTT, APRS-IS/Winlink routing, precise location or protected messages. Expect source-only/receive-only `REFUSE` or `NOT_IMPLEMENTED`, no effect/PII; Tasks 4–5 and 10.
3. **Unverified repeater and stale orbit/old catalog format:** RX offset assumed legal/live, stale TLE, six-digit GP object misrepresented using five-digit-only TLE, fake AOS/LOS/Doppler. Expect `INDETERMINATE` + explicit `orbit_computed:false` and future OMM source requirement; Tasks 6–7 and 10.
4. **Misleading full ADIF/award confidence:** newly released ADIF 3.1.8 fields, ADI/ADX round-trip, encoding/byte lengths, real private call logs, official confirmed awards. Expect strictly ≤4096 user snippet preview, `saved:false`, no certification or QSL account; Tasks 8 and 10.
5. **Contest/activation wrong date/access and broken 52-file ancestry:** user slots across UTC midnight, no event year/regional rules/land permission, plus test assuming exactly 52 files after C staging. Expect non-official paper-only plan, lack-of-authority stop, isolated legacy 52-file regression, new 84-file audit and unchanged V0 SHA; Tasks 1, 9–11.

---


### Task 1: Isolate immutable P1.3 52-file source regression before any C stage

**Files:** modify `tests/p1/test_family_b_archive.py` only after a new failing diagnostic; add `tests/p1/test_family_c_archive.py` with `test_additive_archive_contract_requires_p13_baseline_isolation`. **Interfaces:** consume existing `SPECS`, `OWNERS`, `EXPECTED`, `audit_stage` and `build_review_zip` without changing signatures; produce `copy_family_b_baseline(destination: Path) -> Path` within test module.

- [ ] **Step 1 RED:** Write a test which creates an isolated copy of exactly 13 P1.3 owner packages and asserts original `52` canonical member names/hash; fail deliberately by detecting legacy whole-tree `audit_stage(STAGE,SPECS,OWNERS)` / `build_review_zip(STAGE,..,OWNERS)` assumptions before C staging. Do not add any C files in RED step.
- [ ] **Step 2 run RED:** `python -m unittest discover -s tests/p1 -p 'test_family_c_archive.py' -v` at a committed candidate SHA; failure must name absent baseline-copy helper/contract, not an import error.
- [ ] **Step 3 GREEN:** Change P1.3 52-file tests to run on copied 13-owner stage at temporary test root, preserve all 52-member exact expected paths and host-security negative cases. Assert original SHA256 `50160a037c52de504676593f79fc87f12166ca019d8620a4f98e00e677eb5ceb` when the copied source bytes are unchanged. Keep P1.2 isolated 28-member snapshot unchanged.
- [ ] **Step 4 full verify:** Run focused and entire P1/V0/Node GitHub Actions on candidate commit; expect staging still **13/24,39/72,52** before C files. No ZIP builder source modifications.
- [ ] **Step 5 commit receipt:** Record exact RED/green run links and full compare diff; log Ruling if snapshot helper requires a different test implementation, while preserving strict no-other-path constraints.


### Task 2: Technical source candidate provenance and C14 operating/DX (RED→GREEN)

**Files:** create `tests/p1/test_family_c_candidates.py`, `qa/p1/family-c-source-candidates.json`, `tests/p1/test_family_c_stage.py`; stage 4 C14 Markdown; update P1 workflow and `test_p1_ci_contract.py`.

**Interfaces:** produce `validate_family_c_candidates(path: Path) -> list[str]` requiring ≥8 unique bounded source refs (ADIF 3.1.8 official, NOAA/SWPC, WSJT-X 3.0.1, CelesTrak OMM context, APRS 1.0.1, Winlink terms, repeater/award/contest conditional sources). Record `checked_at` timezone-aware, `source_url` (HTTPS or null when user supplied), `source_type`, `review_state`, `provider_connected:false`, `rights_state` and explicit version/retrieval/consent notes; no claim that all online references are unusable, only that **the app has no connector for them**.

- [ ] **Step 1 RED:** Tests `test_candidates_are_versioned_no_live_connections` and `test_c14_unverified_spot_not_current` must fail with missing manifest/C14 source files; explicitly assert source allowlist and entire C14 3 canonical references.
- [ ] **Step 2 verify RED:** Run `python -m unittest discover -s tests/p1 -p 'test_family_c_*.py' -v` in CI after committing tests, ensure expected missing source failures (not missing import/syntax).
- [ ] **Step 3 GREEN:** Add provenance manifest (public format documents as research only), SK-C14 and SS-C14-1/2/3. Cite user-supplied reception reports only as `USER_SUPPLIED_UNVERIFIED`; teach operating etiquette as source-backed conditional training, no authenticated DX reports/live cluster/confirmed callsigns or on-air transmission. Preserve exact canonical duties.
- [ ] **Step 4 negative:** Reject outdated/current DX labels, forged official cluster, timestamp missing, unsupported real-time report, fake legal band approval, downloaded private QSLs and live transmitter commands.
- [ ] **Step 5 gate/commit:** Workflow and contract assert **14/24 SK,42/72 SS,56 files** and unreviewed sources; verify same-SHA full Python P1/V0 and Node+TS GREEN before moving to Task 3.


### Task 3: SK-C15 propagation — three exact canonical internal procedures (RED→GREEN)

**Files:** extend `tests/p1/test_family_c_stage.py` and `tests/p1/test_family_c_physics.py`; create exactly `staging/p1-domain-skills/skills/propagation/SKILL.md` + these three references: `staging/p1-domain-skills/skills/propagation/references/1-space-weather-reading.md`, `staging/p1-domain-skills/skills/propagation/references/2-propagation-scenario.md`, `staging/p1-domain-skills/skills/propagation/references/3-observation-correlation.md`. Update `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml`.

**Interfaces / truthful draft tool behavior:** `spaceweather_indices` (historical Kp source label, live_feed:false) and `propagation_path` (ideal great-circle FSPL, real_world_prediction:false). **Test:** `test_c15_fspl_is_not_ionospheric_forecast`. **High-risk input:** Kp=5 stamped prior date, missing offset, Greece↔remote locations and 14MHz free-space calculation. **Expected:** Separately show provenance/UTC age, spherical FSPL theoretical geometry and no ionospheric opening guarantee.. **Negative cases:** Treat cached Kp as current NOAA response, fake VOACAP, no model/version, empty location or illegal frequency approval.

**Three exact responsibilities from canonical v0.5 registry:**

- `SS-C15-1` / `skills/propagation/references/1-space-weather-reading.md`: **retrieve timestamped solar/geomagnetic measurements and interpretation**
- `SS-C15-2` / `skills/propagation/references/2-propagation-scenario.md`: **run bounded path prediction with explicit model assumptions**
- `SS-C15-3` / `skills/propagation/references/3-observation-correlation.md`: **compare modeled forecasts with actual authenticated reception reports**

- [ ] **Step 1 RED:** Add `test_c15_fspl_is_not_ionospheric_forecast` and owner-source test requiring exact `SK-C15` YAML slug, trigger/context/output/refusal, three canonical link filenames, all original SS owner/responsibility strings and explicit non-capability/negative-source tokens above. Test absence before any C15 file exists.
- [ ] **Step 2 verify RED:** Commit test; run focused `python -m unittest discover -s tests/p1 -p 'test_family_c_*.py' -v` via exact-SHA Actions; observed failure must be expected `SK-C15 source missing` (not framework error).
- [ ] **Step 3 minimal GREEN:** Stage only the one SK and three SS Markdown files, with all canonical verbatim duties and source-limited educational procedure. Keep unsupported real provider, processor, or physical action `NOT_IMPLEMENTED`, data `USER_SUPPLIED_UNVERIFIED` and all safety stops precise.
- [ ] **Step 4 negative & workflow:** Include input mutation from Review Focus (`test_c15_fspl_is_not_ionospheric_forecast`), no unsafe authorizations and `audit_stage` exact allowlist; update P1 workflow/contract stage to **15/24 SK, 45/72 SS, 60 exact files** without altering V0 checks or original source tool names.
- [ ] **Step 5 candidate CI/commit:** Commit source/workflow, inspect full P1/V0/TS/Node CI logs on **that** immutable head before recording GREEN. If older subset test breaks, isolate its preserved owner subset, never weaken global auditor.


### Task 4: SK-C16 digital-modes — three exact canonical internal procedures (RED→GREEN)

**Files:** extend `tests/p1/test_family_c_stage.py` and `tests/p1/test_family_c_physics.py`; create exactly `staging/p1-domain-skills/skills/digital-modes/SKILL.md` + these three references: `staging/p1-domain-skills/skills/digital-modes/references/1-mode-basics.md`, `staging/p1-domain-skills/skills/digital-modes/references/2-audiocat-diagnostics.md`, `staging/p1-domain-skills/skills/digital-modes/references/3-software-version-guidance.md`. Update `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml`.

**Interfaces / truthful draft tool behavior:** `digital_setup_guide` (only FT8/APRS EL/EN receive-only, simulated:true). **Test:** `test_c16_receive_only_versioned_no_cat_ptt`. **High-risk input:** WSJT-X GA 3.0.1 educational setup vs different app version or requested live CAT/PTT/FT8 transmission. **Expected:** Only version-labelled receive-side offline checklist; no soundcard inspection, PTT, CAT commands or real software configuration.. **Negative cases:** Auto-transmit, FT4/RTTY/JS8 tool support falsely claimed, local sound enumeration, undocumented menu and hidden service access.

**Three exact responsibilities from canonical v0.5 registry:**

- `SS-C16-1` / `skills/digital-modes/references/1-mode-basics.md`: **explain FT8/FT4/RTTY/PSK/JS8/SSTV and constraints**
- `SS-C16-2` / `skills/digital-modes/references/2-audiocat-diagnostics.md`: **trace interfaces, sound devices and handshake checks**
- `SS-C16-3` / `skills/digital-modes/references/3-software-version-guidance.md`: **resolve software-specific configuration using official docs**

- [ ] **Step 1 RED:** Add `test_c16_receive_only_versioned_no_cat_ptt` and owner-source test requiring exact `SK-C16` YAML slug, trigger/context/output/refusal, three canonical link filenames, all original SS owner/responsibility strings and explicit non-capability/negative-source tokens above. Test absence before any C16 file exists.
- [ ] **Step 2 verify RED:** Commit test; run focused `python -m unittest discover -s tests/p1 -p 'test_family_c_*.py' -v` via exact-SHA Actions; observed failure must be expected `SK-C16 source missing` (not framework error).
- [ ] **Step 3 minimal GREEN:** Stage only the one SK and three SS Markdown files, with all canonical verbatim duties and source-limited educational procedure. Keep unsupported real provider, processor, or physical action `NOT_IMPLEMENTED`, data `USER_SUPPLIED_UNVERIFIED` and all safety stops precise.
- [ ] **Step 4 negative & workflow:** Include input mutation from Review Focus (`test_c16_receive_only_versioned_no_cat_ptt`), no unsafe authorizations and `audit_stage` exact allowlist; update P1 workflow/contract stage to **16/24 SK, 48/72 SS, 64 exact files** without altering V0 checks or original source tool names.
- [ ] **Step 5 candidate CI/commit:** Commit source/workflow, inspect full P1/V0/TS/Node CI logs on **that** immutable head before recording GREEN. If older subset test breaks, isolate its preserved owner subset, never weaken global auditor.


### Task 5: SK-C17 packet-networks — three exact canonical internal procedures (RED→GREEN)

**Files:** extend `tests/p1/test_family_c_stage.py` and `tests/p1/test_family_c_physics.py`; create exactly `staging/p1-domain-skills/skills/packet-networks/SKILL.md` + these three references: `staging/p1-domain-skills/skills/packet-networks/references/1-packet-framerouting.md`, `staging/p1-domain-skills/skills/packet-networks/references/2-aprslocation-ethics.md`, `staging/p1-domain-skills/skills/packet-networks/references/3-winlinkmesh-planning.md`. Update `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml`.

**Interfaces / truthful draft tool behavior:** `packet_route_preview` (simulated AX25/APRS user path, 2–8 hops). **Test:** `test_c17_no_live_packet_forward_or_location_leak`. **High-risk input:** synthetic 3-node path with remote/private APRS location and third-party Winlink traffic request. **Expected:** Display hypothetical hops, redact private location/messages, stop any real send/forward and local law judgement absent verified authority.. **Negative cases:** Unauthorized messages, APRS-IS API writes, live mesh routing, third-party traffic legally allowed without Greece-first rules.

**Three exact responsibilities from canonical v0.5 registry:**

- `SS-C17-1` / `skills/packet-networks/references/1-packet-framerouting.md`: **explain AX.25/TNC, digipeat and packet path behavior**
- `SS-C17-2` / `skills/packet-networks/references/2-aprslocation-ethics.md`: **interpret packet paths and privacy limits**
- `SS-C17-3` / `skills/packet-networks/references/3-winlinkmesh-planning.md`: **assess authorized infrastructure and link dependencies**

- [ ] **Step 1 RED:** Add `test_c17_no_live_packet_forward_or_location_leak` and owner-source test requiring exact `SK-C17` YAML slug, trigger/context/output/refusal, three canonical link filenames, all original SS owner/responsibility strings and explicit non-capability/negative-source tokens above. Test absence before any C17 file exists.
- [ ] **Step 2 verify RED:** Commit test; run focused `python -m unittest discover -s tests/p1 -p 'test_family_c_*.py' -v` via exact-SHA Actions; observed failure must be expected `SK-C17 source missing` (not framework error).
- [ ] **Step 3 minimal GREEN:** Stage only the one SK and three SS Markdown files, with all canonical verbatim duties and source-limited educational procedure. Keep unsupported real provider, processor, or physical action `NOT_IMPLEMENTED`, data `USER_SUPPLIED_UNVERIFIED` and all safety stops precise.
- [ ] **Step 4 negative & workflow:** Include input mutation from Review Focus (`test_c17_no_live_packet_forward_or_location_leak`), no unsafe authorizations and `audit_stage` exact allowlist; update P1 workflow/contract stage to **17/24 SK, 51/72 SS, 68 exact files** without altering V0 checks or original source tool names.
- [ ] **Step 5 candidate CI/commit:** Commit source/workflow, inspect full P1/V0/TS/Node CI logs on **that** immutable head before recording GREEN. If older subset test breaks, isolate its preserved owner subset, never weaken global auditor.


### Task 6: SK-C18 repeaters-dvoice — three exact canonical internal procedures (RED→GREEN)

**Files:** extend `tests/p1/test_family_c_stage.py` and `tests/p1/test_family_c_physics.py`; create exactly `staging/p1-domain-skills/skills/repeaters-dvoice/SKILL.md` + these three references: `staging/p1-domain-skills/skills/repeaters-dvoice/references/1-analog-repeater-settings.md`, `staging/p1-domain-skills/skills/repeaters-dvoice/references/2-digital-voice-profiles.md`, `staging/p1-domain-skills/skills/repeaters-dvoice/references/3-directory-discovery.md`. Update `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml`.

**Interfaces / truthful draft tool behavior:** `repeater_channel_preview` (RX Hz plus signed Hz offset, verified:false) and `spectrum_find_repeaters` (user-provided ≤24 entries, live_status_known:false). **Test:** `test_c18_signed_offset_no_repeater_operational_proof`. **High-risk input:** RX=145600000Hz, signed offset=−600000Hz giving user-modelled 145000000Hz. **Expected:** Arithmetic example only, explicit absent tones/CTCSS/DCS/network status and country-dependent licence check.. **Negative cases:** Invented directory, verified tone, talkgroup, on-air status, supported codeplug import or authorization.

**Three exact responsibilities from canonical v0.5 registry:**

- `SS-C18-1` / `skills/repeaters-dvoice/references/1-analog-repeater-settings.md`: **calculate split/offset/CTCSS/DCS with source**
- `SS-C18-2` / `skills/repeaters-dvoice/references/2-digital-voice-profiles.md`: **explain DMR/D-STAR/C4FM, hotspot and codeplug constraints**
- `SS-C18-3` / `skills/repeaters-dvoice/references/3-directory-discovery.md`: **filter actual verified repeater metadata and freshness**

- [ ] **Step 1 RED:** Add `test_c18_signed_offset_no_repeater_operational_proof` and owner-source test requiring exact `SK-C18` YAML slug, trigger/context/output/refusal, three canonical link filenames, all original SS owner/responsibility strings and explicit non-capability/negative-source tokens above. Test absence before any C18 file exists.
- [ ] **Step 2 verify RED:** Commit test; run focused `python -m unittest discover -s tests/p1 -p 'test_family_c_*.py' -v` via exact-SHA Actions; observed failure must be expected `SK-C18 source missing` (not framework error).
- [ ] **Step 3 minimal GREEN:** Stage only the one SK and three SS Markdown files, with all canonical verbatim duties and source-limited educational procedure. Keep unsupported real provider, processor, or physical action `NOT_IMPLEMENTED`, data `USER_SUPPLIED_UNVERIFIED` and all safety stops precise.
- [ ] **Step 4 negative & workflow:** Include input mutation from Review Focus (`test_c18_signed_offset_no_repeater_operational_proof`), no unsafe authorizations and `audit_stage` exact allowlist; update P1 workflow/contract stage to **18/24 SK, 54/72 SS, 72 exact files** without altering V0 checks or original source tool names.
- [ ] **Step 5 candidate CI/commit:** Commit source/workflow, inspect full P1/V0/TS/Node CI logs on **that** immutable head before recording GREEN. If older subset test breaks, isolate its preserved owner subset, never weaken global auditor.


### Task 7: SK-C19 satellites-weak-signal — three exact canonical internal procedures (RED→GREEN)

**Files:** extend `tests/p1/test_family_c_stage.py` and `tests/p1/test_family_c_physics.py`; create exactly `staging/p1-domain-skills/skills/satellites-weak-signal/SKILL.md` + these three references: `staging/p1-domain-skills/skills/satellites-weak-signal/references/1-satellite-metadata.md`, `staging/p1-domain-skills/skills/satellites-weak-signal/references/2-passdoppler-calculation.md`, `staging/p1-domain-skills/skills/satellites-weak-signal/references/3-weaksignal-workflow.md`. Update `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml`.

**Interfaces / truthful draft tool behavior:** `satellite_pass` (1–32 user elevation points, orbit_computed:false). **Test:** `test_c19_supplied_elevation_is_not_sgp4_doppler`. **High-risk input:** user-provided 3 elevation samples, stale TLE epoch and 6-digit catalog ID needing future OMM-aware representation. **Expected:** Report sample-only positive-elevation window/max; no real orbit calculation, Doppler, AOS/LOS or precision pass times.. **Negative cases:** Fresh TLE fabricated, misrepresent 6-digit catalog number as 5-digit TLE, false SGP4, auto tracking/radio operation.

**Three exact responsibilities from canonical v0.5 registry:**

- `SS-C19-1` / `skills/satellites-weak-signal/references/1-satellite-metadata.md`: **retrieve amateur spacecraft frequency/mode data and date**
- `SS-C19-2` / `skills/satellites-weak-signal/references/2-passdoppler-calculation.md`: **calculate AOS/LOS/doppler using current appropriate orbit model**
- `SS-C19-3` / `skills/satellites-weak-signal/references/3-weaksignal-workflow.md`: **teach EME, meteor scatter and VHF propagation limitations**

- [ ] **Step 1 RED:** Add `test_c19_supplied_elevation_is_not_sgp4_doppler` and owner-source test requiring exact `SK-C19` YAML slug, trigger/context/output/refusal, three canonical link filenames, all original SS owner/responsibility strings and explicit non-capability/negative-source tokens above. Test absence before any C19 file exists.
- [ ] **Step 2 verify RED:** Commit test; run focused `python -m unittest discover -s tests/p1 -p 'test_family_c_*.py' -v` via exact-SHA Actions; observed failure must be expected `SK-C19 source missing` (not framework error).
- [ ] **Step 3 minimal GREEN:** Stage only the one SK and three SS Markdown files, with all canonical verbatim duties and source-limited educational procedure. Keep unsupported real provider, processor, or physical action `NOT_IMPLEMENTED`, data `USER_SUPPLIED_UNVERIFIED` and all safety stops precise.
- [ ] **Step 4 negative & workflow:** Include input mutation from Review Focus (`test_c19_supplied_elevation_is_not_sgp4_doppler`), no unsafe authorizations and `audit_stage` exact allowlist; update P1 workflow/contract stage to **19/24 SK, 57/72 SS, 76 exact files** without altering V0 checks or original source tool names.
- [ ] **Step 5 candidate CI/commit:** Commit source/workflow, inspect full P1/V0/TS/Node CI logs on **that** immutable head before recording GREEN. If older subset test breaks, isolate its preserved owner subset, never weaken global auditor.


### Task 8: SK-C20 logbook-awards — three exact canonical internal procedures (RED→GREEN)

**Files:** extend `tests/p1/test_family_c_stage.py` and `tests/p1/test_family_c_physics.py`; create exactly `staging/p1-domain-skills/skills/logbook-awards/SKILL.md` + these three references: `staging/p1-domain-skills/skills/logbook-awards/references/1-adif-integrity.md`, `staging/p1-domain-skills/skills/logbook-awards/references/2-qso-analytics.md`, `staging/p1-domain-skills/skills/logbook-awards/references/3-awardqsl-assessment.md`. Update `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml`.

**Interfaces / truthful draft tool behavior:** `adif_validate` (≤4096-char bounded ADIF snippet, saved:false) and `log_award_progress` (≤100 supplied labels, verified:false, award_certified:false). **Test:** `test_c20_adif318_preview_not_full_roundtrip_or_award_cert`. **High-risk input:** synthetic/redacted ADIF 3.1.8 tag/EOR example, malformed field length, duplicate, non-ASCII byte-count caveat and unverified award entity list. **Expected:** Only supported tag/EOR preview and overlap, with separate ADIF 3.1.8 normative requirements marked NOT_IMPLEMENTED for full compliance.. **Negative cases:** Bulk log retention or raw callsign in QA, LoTW/eQSL login/upload, genuine confirmed QSL or earned DXCC award asserted.

**Three exact responsibilities from canonical v0.5 registry:**

- `SS-C20-1` / `skills/logbook-awards/references/1-adif-integrity.md`: **parse and round-trip version-aware ADIF with provenance**
- `SS-C20-2` / `skills/logbook-awards/references/2-qso-analytics.md`: **summarize contact statistics while preserving privacy**
- `SS-C20-3` / `skills/logbook-awards/references/3-awardqsl-assessment.md`: **compare confirmations to current award criteria and services**

- [ ] **Step 1 RED:** Add `test_c20_adif318_preview_not_full_roundtrip_or_award_cert` and owner-source test requiring exact `SK-C20` YAML slug, trigger/context/output/refusal, three canonical link filenames, all original SS owner/responsibility strings and explicit non-capability/negative-source tokens above. Test absence before any C20 file exists.
- [ ] **Step 2 verify RED:** Commit test; run focused `python -m unittest discover -s tests/p1 -p 'test_family_c_*.py' -v` via exact-SHA Actions; observed failure must be expected `SK-C20 source missing` (not framework error).
- [ ] **Step 3 minimal GREEN:** Stage only the one SK and three SS Markdown files, with all canonical verbatim duties and source-limited educational procedure. Keep unsupported real provider, processor, or physical action `NOT_IMPLEMENTED`, data `USER_SUPPLIED_UNVERIFIED` and all safety stops precise.
- [ ] **Step 4 negative & workflow:** Include input mutation from Review Focus (`test_c20_adif318_preview_not_full_roundtrip_or_award_cert`), no unsafe authorizations and `audit_stage` exact allowlist; update P1 workflow/contract stage to **20/24 SK, 60/72 SS, 80 exact files** without altering V0 checks or original source tool names.
- [ ] **Step 5 candidate CI/commit:** Commit source/workflow, inspect full P1/V0/TS/Node CI logs on **that** immutable head before recording GREEN. If older subset test breaks, isolate its preserved owner subset, never weaken global auditor.


### Task 9: SK-C21 contests-portable — three exact canonical internal procedures (RED→GREEN)

**Files:** extend `tests/p1/test_family_c_stage.py` and `tests/p1/test_family_c_physics.py`; create exactly `staging/p1-domain-skills/skills/contests-portable/SKILL.md` + these three references: `staging/p1-domain-skills/skills/contests-portable/references/1-contest-rule-preparation.md`, `staging/p1-domain-skills/skills/contests-portable/references/2-portable-activation-planning.md`, `staging/p1-domain-skills/skills/contests-portable/references/3-field-operations-review.md`. Update `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml`.

**Interfaces / truthful draft tool behavior:** `contest_plan` (1–24 user HH:MM UTC band slots; official_schedule:false). **Test:** `test_c21_sorted_utc_slots_not_event_calendar_or_contest_score`. **High-risk input:** synthetic crossing-midnight UTC schedule, unknown event year/rules, SOTA/POTA activation at permission-unknown land. **Expected:** Sort paper planning slots and flag UTC date missing; do not claim contest official times, multipliers or legitimate activation.. **Negative cases:** Auto log submission, invented scoring, operating/land-access permission, live PTT, unsafe portable antenna/power setup.

**Three exact responsibilities from canonical v0.5 registry:**

- `SS-C21-1` / `skills/contests-portable/references/1-contest-rule-preparation.md`: **interpret sourced rule revision, category and scoring**
- `SS-C21-2` / `skills/contests-portable/references/2-portable-activation-planning.md`: **plan antennas/power and access/permission requirements**
- `SS-C21-3` / `skills/contests-portable/references/3-field-operations-review.md`: **assess log quality and activity outcome without external writes**

- [ ] **Step 1 RED:** Add `test_c21_sorted_utc_slots_not_event_calendar_or_contest_score` and owner-source test requiring exact `SK-C21` YAML slug, trigger/context/output/refusal, three canonical link filenames, all original SS owner/responsibility strings and explicit non-capability/negative-source tokens above. Test absence before any C21 file exists.
- [ ] **Step 2 verify RED:** Commit test; run focused `python -m unittest discover -s tests/p1 -p 'test_family_c_*.py' -v` via exact-SHA Actions; observed failure must be expected `SK-C21 source missing` (not framework error).
- [ ] **Step 3 minimal GREEN:** Stage only the one SK and three SS Markdown files, with all canonical verbatim duties and source-limited educational procedure. Keep unsupported real provider, processor, or physical action `NOT_IMPLEMENTED`, data `USER_SUPPLIED_UNVERIFIED` and all safety stops precise.
- [ ] **Step 4 negative & workflow:** Include input mutation from Review Focus (`test_c21_sorted_utc_slots_not_event_calendar_or_contest_score`), no unsafe authorizations and `audit_stage` exact allowlist; update P1 workflow/contract stage to **21/24 SK, 63/72 SS, 84 exact files** without altering V0 checks or original source tool names.
- [ ] **Step 5 candidate CI/commit:** Commit source/workflow, inspect full P1/V0/TS/Node CI logs on **that** immutable head before recording GREEN. If older subset test breaks, isolate its preserved owner subset, never weaken global auditor.


### Task 10: ≥48 Greek+English C-family static routing/privacy cases (RED→GREEN)

**Files:** create `tests/p1/test_family_c_cases.py`; after RED create `qa/p1/family-c-operating-scenarios.json`. Extend `tests/p1/test_family_c_physics.py` for numeric distinctions when appropriate.

**Interfaces:** `validate_family_c_cases(path: Path) -> list[str]`. Exact case fields: `id`, `domain`, `procedure_id`, `prompt_el`, `prompt_en`, `expected_domains` (1–3 registry canonical owners, always includes primary), `risk_class`, `expected_outcome` (`PARTIAL|INDETERMINATE|NOT_IMPLEMENTED|REFUSE|IDEAL_MODEL`), `source_kind`, `fixture_basis`, `must_not_claim` nonempty. No raw legal/radio actions or real callsigns.

- [ ] **Step 1 RED:** Test `test_48_bilingual_cases_cover_all_24_c_procedures` requires exactly/at least **48** cases, **≥6 per each C14–C21**, all **24/24 C SS** with two examples per SS, distinct EL/EN prompts, **≥6 mixed** cases, fail-closed provenance and no private location.
- [ ] **Step 2 verify RED:** Commit test before corpus; observe missing `family-c-operating-scenarios.json` failure, not an import error. Check expected exact Greek/English strings are distinct and meaningful, not a translation placeholder.
- [ ] **Step 3 GREEN dataset:** Construct synthetic cases spanning all eight Domains (6 per Domain) with explicit mixed expected tuples: ``C14,C15``, ``C16,B11``, ``C17,A04``, ``C18,A04``, ``C19,C15``, ``C20,C21``, ``C21,B12``. Each tuple must be grounded in an actual cross-capability question, not automatic multi-assign.
- [ ] **Step 4 adversarial mutations:** Reject duplicate id, false SS owner, omitted Greek prompt, caller ID/private location, live DX/NOAA freshness claim, packet send, hidden PTT/CAT, uncertified repeater/mission, stale orbit, invalid 6-digit TLE, ADIF saved/awarded, event approval and inappropriate legal permission. Make each fail the validator and/or a source contract assertion.
- [ ] **Step 5 regression:** Run full P1/V0/Node Actions at candidate head, append measured counts and negative results. Static expected cases must never be reported as ChatGPT live routing accuracy.


### Task 11: CI P1.4 exact 84-file audit, V0 fingerprint and inherited 28/52 regression

**Files:** create/extend `tests/p1/test_family_c_archive.py`; modify `tests/p1/test_p1_ci_contract.py` and `.github/workflows/p1-domain-skills-ci.yml` only. Avoid modifying real ZIP builder unless a demonstrated security bug requires a new approved design.

**Interfaces:** `load_registry`, `audit_stage`, `build_review_zip`, `validate_review_zip`, existing fixed 13-owner`/`52-member P1.3 snapshot + P1.2 7-owner/28-member snapshot; new complete 21-owner 84-member stage.

- [ ] **Step 1 RED:** Assert exact `P1_STAGE=21/24,63/72`, `P1_STAGE_ARCHIVE_FILES=84`, `P1_FAMILY_C_CASES=48` (or measured count ≥48 with explicit log), `P1_FAMILY_C_SS_COVERED=24/24`, `P1_C_PROVIDER_LINKS=NOT_CONNECTED`, `P1_C_TX=NOT_ENABLED` in workflow and fail on absent/incorrect fields before writing workflow changes.
- [ ] **Step 2 GREEN:** Update workflow to use 21 canonical IDs in full-tree allowlist; assert **21 SK +63 reference** paths, exact 84 count, two temp ZIP builds byte-identical and SHA-256 recorded from actual output, **not predicted**. Execute C validator/import, 48 cases and 24 SS, Family A 30, Family B 36, original 13-owner/52-member and 7-owner/28-member immutable subset tests. Keep V0 strict **12-file hash equality** and 49+ Python tests; Node 22 npm ci/typecheck/test on same P1 run, read-only permissions and no secrets.
- [ ] **Step 3 abuse cases:** Reject 85th file, `plugin.json`, ZIP traversal, symlink, duplicate/casefold filename, oversize/unbounded compression, wrong SS-C21 owner or orphan, hidden executable; ensure original `validate_review_zip` API unmodified.
- [ ] **Step 4 full run:** Commit CI and tests; actual GitHub Actions must prove complete P1/V0/Node and TypeScript GREEN at one SHA. Count fail must be **0**, not "not run". Compare reproducible 84-member P1 ZIP hash and unchanged V0 12-file hash.
- [ ] **Step 5 contract:** Record exact stage, source/archive hashes, QA 48/24, previous A30/B36, NOAA/DX/orbit/provider `NOT_CONNECTED`, host E2E `NOT_EXECUTED`; add negative CI tests that changing those markers or omitting node/V0 steps fails.


### Task 12: Whole-branch adversarial source review (author-side; independent reviewer not assumed)

**Files:** no implementation changes except RED→GREEN fixes for proven errors. Source all changed paths and `qa/p1` corpus.

- [ ] **Step 1 diff scope:** Compare against exact owner-approved P1.4 plan head, require **32 new staged Markdown paths**, C source candidates/cases, P1 tests/CI, final ledger only; **no** production/runtime, V0 source/tests, MCP, OAuth, CAT/PTT/TX, plugin or Vercel production changes. Inspect for sensitive callsigns, coordinates and raw QSO data.
- [ ] **Step 2 registry review:** Re-read 8 SK YAML/required context/output/stop/3 local links; re-read **24 SS verbatim canonical duties/owner/filenames and corresponding SC IDs**. No extra host-visible Skills or tools.
- [ ] **Step 3 focused safety review:** Execute each of five Review Focus attacks; distinguish external authoritative documents `PUBLIC_REFERENCE` vs current unverified provider data, observation vs prediction vs ideal mathematical model, private APRS/Winlink data, ADIF privacy, user-supplied repeater/satellite/event claims and physical TX permission.
- [ ] **Step 4 findings:** Classify Critical/Important/Minor with paths and concrete reproduction. Important/Critical fixes require a new failing test followed by full P1/V0/Node GREEN. Report `INDEPENDENT_REVIEW=NOT_EXECUTED` unless a demonstrably different reviewer provided proof. Self-review must use GitHub COMMENT, not APPROVE.
- [ ] **Step 5 Rulings:** For each unavoidable deviation log `Ruling: decision — why — risk if wrong` in Task 13 ledger, then recount paths and source archive.


### Task 13: Final SHA evidence ledger, exact job logs and non-release handoff

**Files:** create only `qa/p1/P1-4-EVIDENCE-2026-10-17.md` as final source commit; update new Draft PR description and issue comment; no external device action.

- [ ] **Step 1 ledger draft:** Cite *actual* RED and GREEN run URLs per Domain and boundary task, final 21/24 and 63/72 counts, exact 84-file ZIP hash, 48+ bilingual static cases/24 SS, all inherited Family A/B gates, pinned original V0 SHA, real P1/V0/RF test totals and all source/host limits. Document version-sensitive standards checked (ADIF 3.1.8, WSJT-X 3.0.1, NOAA, OMM) without asserting a live API.
- [ ] **Step 2 commit:** Commit ledger to Draft implementation branch based on approved plan. Ensure `qa/p1/**` path filter triggers a **new complete P1/V0/Node workflow at final ledger SHA**. Earlier GREEN is not final proof.
- [ ] **Step 3 inspect final run:** Verify GitHub PR HEAD equals tested immutable SHA, Actions `completed/success` and all job steps PASS; parse logs for staged 21/63, 84 deterministic files, 48/24, 49 V0, Node+TS, absence of privilege, original V0 fingerprint, and zero failures. Otherwise state `BLOCKED/PENDING`, repair and repeat.
- [ ] **Step 4 author review and receipts:** Publish author-side GitHub PR COMMENT and exact-SHA top-level verification receipt and ledger URL. Set title/description `P1.4 OPERATIONS SOURCE PILOT VERIFIED IN DRAFT` **only if** genuine same-final-SHA evidence exists; an author's COMMENT is not an independent approval.
- [ ] **Step 5 no release:** Keep P1.3/parent Drafts open/unmerged, leave `main` untouched, no Plugin Creator create/update/connect, host install, Vercel production, OAuth, live DX feed, satellite tracker, station CAT/PTT/TX, APRS/Winlink messages or real EmComm. P1.5 D22–D24 needs its own design/approved plan and owner execution method.


## P1-G0–P1-G7 acceptance matrix and metric provenance

| Gate | Exact future P1.4 evidence target | What it can NOT prove |
|---|---|---|
| **G0** | Canonical unmodified **24 SK,72 SS/SC**, 8 C owners/24 canonical duties crosschecked | Installed features |
| **G1** | 8 source-only C SK packages +13 inherited = **21/24 SK** | 21 mounted host Skills |
| **G2** | 24 new owner-local SS +39 inherited = **63/72 SS**, exact **84 Markdown** | 63 distinct MCP methods |
| **G3** | **≥48** meaningful EL/EN C static cases, **≥6 per owner**, **24/24 SS**, **≥6 mixed** | Empirical ChatGPT assistant routing |
| **G4** | DX/Kp/repeater freshness stops; no hardware/packet writes; ADIF/award privacy, satellite/orbit and contest permissions rejected | Legal operating, award, calibration or source-data certification |
| **G5** | P1.2 28/P1.3 52 isolated baselines, original **5 V0 SK, 49+ tests**, unchanged **12-file V0 SHA** | Real live V0/host plugin |
| **G6** | Strict **84/84** deterministic new P1 source ZIP, hostile input rejection, exact SHA recorded | Plugin Creator installable artifact |
| **G7** | Complete **P1+V0+Node/TS** job `completed/success` at *same final ledger commit SHA* and scoped review | Independent audit, deployment, real radio/third-party provider consent |

**Data/QA metric semantics:** `SK_STAGED=21/24`, `SS_STAGED=63/72`, `FAMILY_C_CASES_VALID/TOTAL=48/48` only if measured, `FAMILY_C_SS=24/24`, `P1_ZIP_FILES=84`, `P1_ZIP_SHA256` measured, `V0_ZIP_FILES=12` with pinned fingerprint, `P1/V0/RF_PASSED/TOTAL` observed, `C_PROVIDER_LINKS=NOT_CONNECTED`, `HOST_E2E=NOT_EXECUTED`, `LEGAL_AUTHORITIES_VALIDATED=0/UNVERIFIED` unless expert validation occurred. Do not turn these independent source-coverage measures into a product-completion percentage.

## Owner gate and execution method

**This is a written planning artifact only, not authorization to implement it.** Prior global P1 design was approved and explicitly contains P1.4 owners, but the separate **P1.4 written TDD plan must now be reviewed and approved**, and a method deliberately selected **Native TDD** or **Subagent-driven** (only if actual worker/reviewer tools available; never invent independent review). Prior P1.3 Native approval is phase-local. After new approval, branch a **separate Draft implementation PR** from the reviewed plan SHA, begin test-first RED→GREEN using actual GitHub Actions and finish with exact-final-SHA evidence. Nothing is merged or released until a separate owner release decision and independent gates.
