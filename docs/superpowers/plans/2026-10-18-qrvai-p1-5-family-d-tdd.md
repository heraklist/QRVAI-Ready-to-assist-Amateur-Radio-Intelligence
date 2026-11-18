# QRVAI P1.5 — Education, Community & Innovation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **This document is a review candidate, not implementation authorization.**

**Goal:** Source-stage the final **3** canonical D22–D24 host Domain Skill candidates and **9** owner-local internal Sub-skills, closing P1 source-staging coverage at exactly **24/24 Domain SK, 72/72 SS, 96/96 Markdown source files**, while preserving all inherited V0, P0 and P1.1–P1.4 regressions and clearly prohibiting live integrations or release.

**Architecture:** Implement the separately reviewed **P1.5 phase-specific written design** and reuse the owner-approved global P1 design `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md`, canonical Skill/Capability registries v0.5 and existing strict `scripts/p1` audit/ZIP builder. Each of D22/D23/D24 adds one Markdown `SKILL.md` plus its three exact `references/*.md`. No new installed Skill, independent Sub-skill, MCP operation, Router/Orchestrator, service, OAuth provider, autonomous task, plugin manifest or product deployment.

**Tech Stack:** Existing Python 3.11 stdlib `unittest`, `scripts/p1/registry.py` + `audit_domain_skills.py` + `build_staging_archive.py`, GitHub Actions (read-only), Node 22 RF MCP SDK test suite and TypeScript typecheck. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-18-qrvai-p1-5-family-d-design.md` (**P1.5 owner-reviewed phase-specific written design, Draft PR #49**, immutable SHA `c5b3f428adc98e1b8e69584509543792741c5bb0`); original owner-approved `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md`; canonical `docs/architecture/skill-and-subskill-registry-v0.5.md` and `docs/architecture/capability-register-v0.5.md`. **Research:** `docs/research/2026-10-18-qrvai-p1-5-family-d-source-and-risks.md`.

**Date:** 2026-10-18. **Status:** DRAFT plan for owner review after P1.5 design approval — owner must review this written plan and choose the phase-specific execution method (`Native TDD` or `Subagent-driven`). No P1.5 implementation authorized by earlier P1.4 approvals.

## Global Constraints

- **Immutable ancestor lineage:** [P1.5 written design PR #49](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/49) at `c5b3f428adc98e1b8e69584509543792741c5bb0`, descended from [P1.4 Open Draft PR #48](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/48) head `e4bcee4179ae899c697874825711920b3bc56759`. [Actual same-parent-SHA GitHub Actions #39043436161](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39043436161) completed/success: **109/109 P1 Python**, **49/49 original V0 Python**, **178/178 RF MCP Node** and TS typecheck; staged **21/24 SK,63/72 SS,84 strict Markdown**. P1.4 source ZIP SHA256 `344b7e7806406738a495d52554d686c27edf2c21c039ea66159943f18fc1076f`. Prior P1.3 thirteen-owner/52-member snapshot `50160a037c52de504676593f79fc87f12166ca019d8620a4f98e00e677eb5ceb` and original V0 twelve-file SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f` must not drift.
- **Targets are NOT accomplishments until same-SHA CI:** 3 D SK + 9 D SS = **12 new source Markdown**, cumulative **24 SK/72 internal SS**, strict **96-member review-only P1 ZIP**. D source-only staging does **not** finish the plugin, M8 full product, P2–P6, real pedagogy platform or market acceptance.
- **Forbidden changes in future implementation branch:** No edits to `main`, ancestor PR merges/rebases/closures, Plugin Creator create/update/install/connect, ChatGPT `@QRVAI` live host, OAuth/JWKS/secrets/CORS, Vercel production, Sites/Cloudflare migration, `qrvai/**`, `mcp/**`, `api/**`, `scripts/v0/**`, `tests/v0/**`, original canonical `docs/architecture/*-registry-v0.5.md` and physical station automation. No CAT/PTT/TX, transceiver control, automatic microcontroller flashing, mains/high-energy/lithium unsafe repair, private member roster writes or external organizer messages.
- **Registered methods, no new provider claims:** `academy_exercise` only fixed RF-power/antenna basics question (EL/EN; optional 0–2 answer index, no student history or CW audio); `maker_project_review` only **1–24 user-supplied component labels**, positive **≤30 V supply** low-voltage preview `certified:false`; `club_workshop_plan` only two fixed topics, **1–100** participants, **30–240** minutes, `simulated:true`, no roster/calendar. Source-registered methods ≠ connected ChatGPT tools. Existing 38 MCP SDK methods and public schemas are unchanged.
- **Educational source integrity:** Preserve canonical SS responsibilities, separate intended future training from implemented preview, do not invent official Greek radio licence curriculum, exam score/certification, national authority or a legally reusable exam bank. Source citations and copyrighted content require authenticated edition, effective date and reuse permission; lacking this return `INDETERMINATE` or `NOT_IMPLEMENTED`. Simple CW timing theory (`PARIS dot_seconds=1.2/WPM`) is not real audio scoring, student progress or Morse certificate.
- **Maker safety:** Model/component supply `≤30 V` does not certify current, fusing, thermal, insulation, RF exposure or lithium/mains safety; no live Arduino/ESP32/RPi programming, software install, vendor-flash utility, CAT writes or device probe. Report `certified:false`, `NOT_IMPLEMENTED` for actual hardware integration.
- **Club member privacy and agency:** Use fictional/anonymized participant counts, no real callsigns, children/student identity, medical/accessibility/private attendance, phone/email, home address, mentor whereabouts, exact asset storage locations, cloud calendar invites, roster exports, hidden database persistence or third-party messages. Explicit permission is necessary but permission itself does not create a connected provider. No real emergency activation.
- **TDD per task:** First commit a source-contract test that must fail for the **expected missing D file**, then stage exactly four Markdown files, prove GREEN on the exact source commit through complete GitHub Actions (P1/V0/Node+TS), include negative cases and preserve previous immutable snapshots. No red run counted if failure was syntax, missing Python import or noisy test fixture. Fix root cause with a new RED→GREEN and record Ruling.
- **Stage auditor and ZIP APIs frozen:** `load_registry(skill_registry_path: Path, capability_registry_path: Path)`; `audit_stage(root: Path, specs, required_ids: frozenset[str]) -> list[str]`; `build_review_zip(stage_root: Path, output_zip: Path, specs, required_ids) -> Path`; `validate_review_zip(archive: Path, expected_paths: frozenset[str]) -> list[str]`. Never relax allowlist, symlink, byte-size, case-fold or compression ratio checks to make new files fit.
- **Inherited P1.4 archive isolation:** `tests/p1/test_family_c_archive.py` currently assumes exactly **84** Markdown sources in the whole 21-owner staging root. **Before staging D22**, add a RED test requiring an immutable copy of exactly 21 previous-owner packages and then make the P1.4 regression audit that copied subset; preserve exact **84-file old hash**. Keep P1.3 52, P1.2 28 isolated regression tests and V0 12 SHA unchanged. New tests independently audit all 24 owners and exactly 96 current files.
- **Evidence/no false independent review:** Every test count/counter must be read from actual same-commit Actions output. Static Greek/English routing fixtures are author expectations, not observed model quality. Author-side PR review is only COMMENT, not independent APPROVE; report `INDEPENDENT_REVIEW=NOT_EXECUTED` until genuine separate reviewer evidence. Final ledger itself must trigger a **fresh** complete P1 workflow at the **ledger-inclusive HEAD SHA** before any final source completion claim.

## Canonical physical map

Each relative path below is under `staging/p1-domain-skills/`. The exact names and responsibilities are copied from the v0.5 registry, not inferred from the Family labels.

| Domain | Exact entrypoint | Three exact owner-local reference paths | Post-stage cumulative |
|---|---|---|---|
| SK-D22 | `skills/radio-academy/SKILL.md` | `skills/radio-academy/references/1-theory-curriculum.md`, `skills/radio-academy/references/2-cw-practice.md`, `skills/radio-academy/references/3-knowledge-assessment.md` | 22/24 SK · 66/72 SS · 88 ZIP |
| SK-D23 | `skills/radio-maker/SKILL.md` | `skills/radio-maker/references/1-microcontroller-integration.md`, `skills/radio-maker/references/2-software-interoperability.md`, `skills/radio-maker/references/3-experimental-rf-prototyping.md` | 23/24 SK · 69/72 SS · 92 ZIP |
| SK-D24 | `skills/clubs-mentoring/SKILL.md` | `skills/clubs-mentoring/references/1-member-onboarding.md`, `skills/clubs-mentoring/references/2-trainingevent-planning.md`, `skills/clubs-mentoring/references/3-assetmentor-governance.md` | 24/24 SK · 72/72 SS · 96 ZIP |

**SK-D22 `radio-academy` canonical three procedures:**
- `SS-D22-1` — `skills/radio-academy/references/1-theory-curriculum.md`: **teach syllabus-aligned electrical/RF/regulatory concepts**
- `SS-D22-2` — `skills/radio-academy/references/2-cw-practice.md`: **provide timing/speed drills and reproducible scoring**
- `SS-D22-3` — `skills/radio-academy/references/3-knowledge-assessment.md`: **ask and explain structured questions with source links**

**SK-D23 `radio-maker` canonical three procedures:**
- `SS-D23-1` — `skills/radio-maker/references/1-microcontroller-integration.md`: **develop station-adjacent Arduino/ESP32/RPi project guidance**
- `SS-D23-2` — `skills/radio-maker/references/2-software-interoperability.md`: **review open-source radio interfaces and test strategy**
- `SS-D23-3` — `skills/radio-maker/references/3-experimental-rf-prototyping.md`: **build a safe bounded research plan with measurement checks**

**SK-D24 `clubs-mentoring` canonical three procedures:**
- `SS-D24-1` — `skills/clubs-mentoring/references/1-member-onboarding.md`: **prepare skill-based progression for new operators**
- `SS-D24-2` — `skills/clubs-mentoring/references/2-trainingevent-planning.md`: **coordinate authorized workshops and activity calendars**
- `SS-D24-3` — `skills/clubs-mentoring/references/3-assetmentor-governance.md`: **maintain consent-based equipment/mentor availability records**

## Review Focus — five adversarial conditions

1. **False Greek exam authority/protected bank (D22):** user asks for a “certified” state exam pass, authentic current official question bank without lawful rights, or automatic granting of licence. Test `test_d22_no_state_certification_or_protected_questions`: source output `INDETERMINATE` or `REFUSE`, no invented competent authority.
2. **CW false performance metrics (D22):** user supplies only a desired WPM but requests “measured” hearing accuracy, generated audio or long-term student progress. Test `test_d22_cw_wpm_formula_not_audio_scoring`: ideal 20 WPM dot 0.06 s only; actual audio/Morse decoder and graded score `NOT_IMPLEMENTED`.
3. **Unsafe low-voltage fallacy / device flash (D23):** user claims a 29 V, high-current or battery build is certified safe and asks to flash ESP32 or modify a radio. Test `test_d23_30v_preview_never_certifies_or_flashes`: stop or source-only warning, `certified:false`, no device interaction or CAT/PTT.
4. **Member privacy and unapproved event publication (D24):** user supplies purported club member list, minors, mentor calendar, equipment storage, asks for email/online publishing. Test `test_d24_roster_calendar_and_minors_fail_closed`: aggregate only, consent required, `NOT_IMPLEMENTED` for provider writes, no identifying fixture data.
5. **84-member ancestral ZIP rejected after adding D (global):** new D22 package makes P1.4 whole-root snapshot fail. Test `test_p14_84_zip_copy_unchanged_with_family_d`: exact 21-owner subset SHA unchanged; P1.5 whole-tree 96-member auditor separately rejects orphan/extra files; test actual V0 hash and RF suite.

---

### Task 1: Preserve immutable P1.4 84-member archive before any D files

**Files:** Create `tests/p1/test_family_d_archive.py` and adjust only `tests/p1/test_family_c_archive.py` (when RED proves need). Read existing `tests/p1/test_family_b_archive.py` and the original 84 ZIP SHA. **Interface:** `copy_family_c_baseline(destination: Path) -> Path` returns a temp stage containing exactly 21 existing A/B/C owner folders, under `skills/<slug>/`; use `copytree(..., symlinks=True)` and current registry, no hidden fallback.

- [ ] **Step 1 RED:** Add `test_p14_84_zip_copy_unchanged_with_family_d` that explicitly requires `copy_family_c_baseline`, checks `audit_stage` + `validate_review_zip` on a 21-owner subset, validates 84 entries and pinned SHA256 `344b7e7806406738a495d52554d686c27edf2c21c039ea66159943f18fc1076f`. It should fail because helper is initially absent.
- [ ] **Step 2 observe:** Commit test to new *implementation* Draft branch, inspect actual same-SHA GitHub Actions failure; reject unrelated import or formatting errors as invalid TDD evidence.
- [ ] **Step 3 GREEN:** Implement the temp 21-owner subset helper in `tests/p1/test_family_c_archive.py`, retarget each old 84-file positive/negative audit/build path from full P1 stage to that subset; do **not** change the strict source ZIP builder.
- [ ] **Step 4 verify:** Run full GitHub P1/V0/Node+TS suite on candidate SHA; before D staging it must print **21/24 SK,63/72 SS,84 ZIP entries**, and still pass P1.2 28 + P1.3 52 immutable tests.
- [ ] **Step 5 receipt:** Record RED and GREEN SHA/run IDs, diff and preservation of original fingerprints; any test-design deviation gets `Ruling: decision—why—risk if wrong`.

### Task 2: SK-D22 `radio-academy` — theory, CW practice, assessments

**Files:** Extend `tests/p1/test_family_d_stage.py` (create) and `tests/p1/test_family_d_physics.py` (create); stage exactly `skills/radio-academy/SKILL.md` and `skills/radio-academy/references/1-theory-curriculum.md`, `2-cw-practice.md`, `3-knowledge-assessment.md`. Modify `.github/workflows/p1-domain-skills-ci.yml` and `tests/p1/test_p1_ci_contract.py` source-stage denominators only.

**Interfaces:** `verify_family_d_owner("D22","radio-academy", expected_tokens)` cross-checks registry slug, three exact paths/owner IDs/verbatim responsibilities/4 required behavioral fields. `academy_exercise(topic,locale,answer_index?)` is fixed 3-option question, not a licence test or learner-history platform.

- [ ] **Step 1 RED:** Commit `test_d22_no_state_certification_or_protected_questions` and `test_d22_cw_wpm_formula_not_audio_scoring` plus owner/3-SS source contract. Expected failure: `SK-D22 source missing`.
- [ ] **Step 2 observe:** Inspect failed GitHub Actions at RED SHA; ensure scope is absent D22 source rather than Python/test typo.
- [ ] **Step 3 GREEN:** Create one D22 SK+three SS Markdown with verbatim duties, EN/EL source caveats, grade/exam restrictions, synthetic learner state only, CW `1.2/WPM` ideal calculation, `NOT_IMPLEMENTED` for actual CW audio/receiver scoring or real exam certification.
- [ ] **Step 4 full CI:** Assert cumulative **22/24 SK,66/72 SS,88 ZIP files** in workflow+contract, preserve old 84-member subset, V0 original hash and RF Node; verify same-commit full CI GREEN.
- [ ] **Step 5 audit:** Record tested SHA/run IDs and check missing answer, unsupported topic, proprietary question copy, unknown examination country/edition, and no student performance persistence.

### Task 3: SK-D23 `radio-maker` — firmware-adjacent education and safe RF prototyping

**Files:** Extend `tests/p1/test_family_d_stage.py`, `tests/p1/test_family_d_physics.py`; stage `skills/radio-maker/SKILL.md` + `references/1-microcontroller-integration.md`, `2-software-interoperability.md`, `3-experimental-rf-prototyping.md`; update P1 workflow/contract counts.

**Interfaces:** `maker_project_review` requires `project_name` 1–48 chars, `supply_voltage_v` positive **≤30V**, 1–24 nonblank component strings 1–48 chars, returns `certified:false` and warnings. No actual wiring/flash.

- [ ] **Step 1 RED:** Commit `test_d23_30v_preview_never_certifies_or_flashes` plus three canonical SS owner tests, including unsafe high-current 29V example and asked-for live ESP32/CAT/PTT flash; expected `SK-D23 source missing`.
- [ ] **Step 2 observe:** GitHub Actions RED must correspond to absent D23 files, not unsupported import/JSON fixture.
- [ ] **Step 3 GREEN:** Create exact 4 Markdown files; all board/firmware/tool instructions conditional on real source revision, `NOT_IMPLEMENTED` for flash and connected serial hardware, external vendor files and electrical certification; preserve `certified:false` and do not equate low voltage with safe power/current.
- [ ] **Step 4 full CI:** Assert **23/24 SK,69/72 SS,92 ZIP members**; run P1+V0+Node/TS and strict 84/52/28 subset archives; record same-SHA GREEN.
- [ ] **Step 5 audit:** Mutate board model/firmware mismatch, dangerous 29V high current, request to disable fuses, publish Wi-Fi credentials, claimed real device success, or automatic radio TX and verify safe stop.

### Task 4: SK-D24 `clubs-mentoring` — workshop templates, consent-based collaboration

**Files:** Extend `tests/p1/test_family_d_stage.py`; create exactly `skills/clubs-mentoring/SKILL.md` and `references/1-member-onboarding.md`, `2-trainingevent-planning.md`, `3-assetmentor-governance.md`; P1 workflow+contract counts.

**Interfaces:** `club_workshop_plan(topic,participants,duration_minutes)` supports only `antenna_basics|digital_modes`, integer **1–100** anonymous participant count, integer **30–240** minutes; returns `simulated:true` and agenda, **not** a persisted/official club calendar.

- [ ] **Step 1 RED:** Commit `test_d24_roster_calendar_and_minors_fail_closed` and canonical 3-SS owner test. Expected `SK-D24 source missing`.
- [ ] **Step 2 observe:** Inspect actual red GitHub Actions for intended missing source error.
- [ ] **Step 3 GREEN:** Create four exact Markdown files; give safe, source-only onboarding and mock workshop template, ownership and consent questions for volunteer records; `NOT_IMPLEMENTED` for roster, invites, private mentor availability, members' addresses, certification, persistent asset changes or emergency activation.
- [ ] **Step 4 full CI:** Update stage to **24/24 SK,72/72 SS,96 exact Markdown ZIP** and validate full P1/V0/Node+TS at the candidate SHA; preserve 84/52/28 subsets and untouched V0 12-file SHA.
- [ ] **Step 5 audit:** Reject private member roster, age/contact fields, a minor's exam result, home mentor schedule, hidden calendar/event publishing, unauthorized club emails, false public course accreditation and device/radio TX.

### Task 5: Pedagogical physics and source-truth negative characterization

**Files:** `tests/p1/test_family_d_physics.py` and if required `tests/p1/test_family_d_candidates.py` + `qa/p1/family-d-education-source-candidates.json` (only public research references or explicit unverified user-provided excerpts). Use existing D Research doc for scoped claims.

- [ ] **Step 1 RED:** Tests require D22 **20 WPM → 0.06 s dot** via standard PARIS ideal timing and `academy_exercise` 2 fixed topics, and D23 **29 V can still be unsafe under high current**, D24 workshop duration **30–240** and participants **1–100**; fake certification and source claims fail.
- [ ] **Step 2 observe:** Commit tests before adding any optional candidate metadata; if sourcing manifest is needed, require exact provenance schema and observe missing-file RED; do not fabricate source authenticity or introduce live retrieval.
- [ ] **Step 3 GREEN:** Add minimal fixture/public-reference metadata with `UNREVIEWED`/`UNVERIFIED` and `provider_connected:false` only if needed for source traceability. Never copy copyrighted state exams; prefer abstract synthetic lessons instead. No material physical device data.
- [ ] **Step 4 verify:** Run P1 suite + inherited tests and ensure no personal data, hard-coded real operator names/callsigns, private URLs, live membership tokens or accidental state writes.
- [ ] **Step 5 receipt:** Preserve source/version/provenance limitations in ledger, report static numerical tests as **math checks**, not tested Morse reception/performance or certified voltage/club operations.

### Task 6: Bilingual D-family route/abuse corpus, nine SS and source permissions

**Files:** Create `tests/p1/test_family_d_cases.py` and, after RED, `qa/p1/family-d-education-community-cases.json`.

**Interfaces:** Implement `validate_family_d_cases(path: Path) -> list[str]`; record keys `id, domain, procedure_id, prompt_el, prompt_en, expected_domains, risk_class, expected_outcome, source_kind, fixture_basis, must_not_claim`; owner `D22|D23|D24`, SS one of **SS-D22-1..SS-D24-3**, all expected domains canonical IDs, result one of `PARTIAL|INDETERMINATE|NOT_IMPLEMENTED|REFUSE|IDEAL_MODEL`. Reject unknown status and case-insensitive PII patterns. No literal real callsign/student/child record.

- [ ] **Step 1 RED:** Commit `test_18_bilingual_cases_cover_9_ss_with_six_mixed_owners`; require exactly **18** distinct records, **six per D Domain**, **two per each SS**, nonempty distinct authentic EL/EN prompts, **≥6** grounded mixed-owner cases. Failure must be missing corpus, not import.
- [ ] **Step 2 observe:** Inspect actual RED from GitHub Actions at test-only commit SHA.
- [ ] **Step 3 GREEN:** Create 18 meaningful synthetic fixtures, covering `D22,A04` legal education, `D22,B07` ideal RF, `D23,B11` no connected rig, `D23,A05` electrical-safety boundaries, `D24,D22` workshop education and `D24,A02` EmComm simulation, plus no-child-roster, no accredited cert, no EEPROM/radio firmware writes, no protected exam banks.
- [ ] **Step 4 mutate:** Reject duplicate IDs, wrong SS ownership, empty Greek prompt, matching EN text, unsupported route, live certified status, actual CW decoder claim, >30V misrepresented as safe, real member/contact/minor identifiers, hidden invite/calendar/event write and real CAT/PTT.
- [ ] **Step 5 verify:** Run complete Python P1/V0 + Node/TS CI at candidate commit and preserve Families A30/B36/C48 source cases; **18 cases are expectations**, not empirical ChatGPT model accuracy.

### Task 7: Full P1 final-source archive 96/96 and read-only CI counters

**Files:** Extend `tests/p1/test_family_d_archive.py`, `tests/p1/test_p1_ci_contract.py`, `.github/workflows/p1-domain-skills-ci.yml`. No builder edits unless a separate proven security bug and owner-approved design.

- [ ] **Step 1 RED:** Add contract mutation tests demanding `P1_STAGE=24/24,72/72`, `P1_STAGE_ARCHIVE_FILES=96`, `P1_FAMILY_D_CASES=18`, `P1_FAMILY_D_SS_COVERED=9/9`, `P1_D_EXTERNAL_ACCOUNTS=NOT_CONNECTED`, `P1_D_DEVICE_ACTIONS=NOT_ENABLED`, `P1_D_CLUB_DATA=NOT_PERSISTED`. Require old 84-member snapshot helper; fail on absent workflow assertions before updating it.
- [ ] **Step 2 observe:** Inspect actual CI RED at test-commit SHA; reason must be missing expected counters (not syntax).
- [ ] **Step 3 GREEN:** Update full-stage allowlist to exactly **24** canonical owners; audit **24 SK +72 SS** and deterministic byte-identical **96-entry ZIP** in two isolated temp builds, `validate_review_zip` exact allowlist, log its *measured* SHA256. Keep original V0 5 Skills/12-file SHA, 49 V0 tests, P1.2/P1.3/P1.4 28/52/84 archive tests, Node RF 178 tests/typecheck. Run D corpus and print source-only disclaimers.
- [ ] **Step 4 abuse:** Reject 97th file, extra `plugin.json` or executable, zip traversal, wrong SS-D24 owner, orphan, symlink, case-fold duplicates, >1 MiB stage source, decompression ratio bomb and hidden sensitive student/member data. Never disable strict guard to reach 96.
- [ ] **Step 5 same-SHA full CI:** Commit and check workflow **completed/success**, all Python P1/V0 and Node/TS steps, `P1_STAGE=24/24,72/72`, `P1_STAGE_ARCHIVE_FILES=96` and source safety counters; failures imply `BLOCKED` not release progress.

### Task 8: Whole-branch source and privacy/security review (author-side)

**Files:** No new source except test-first corrections; review `staging/p1-domain-skills`, `tests/p1`, `qa/p1`, workflow diff and plan audit.

- [ ] **Step 1 scope:** Compare approved P1.5 plan HEAD vs implementation HEAD. Expected three new `SKILL.md` plus nine canonical Markdown references, scoped P1 tests/QA/workflow, final ledger; absolutely no runtime/MCP/V0/main/install/prod changes.
- [ ] **Step 2 contracts:** Open/read all three D entrypoints for exact YAML names, four required user-facing sections and three correct reference links each; all nine SS refs for exact *verbatim* canonical responsibilities, owner IDs, inputs, procedure, output and fail/stop, full SC crosswalk.
- [ ] **Step 3 adversarial:** Reproduce all five Review Focus cases, check grading claims, restricted question reuse, CW formula vs actual audio, current/voltage limits, connected Arduino/rig boundary, private club list and third-party messaging, cross-domain authority escalation and mock versus observed.
- [ ] **Step 4 findings:** Classify specific paths/steps Critical/Important/Minor; Critical/Important fixes require actual failing test→minimal source fix→full same-SHA tests. Do not treat a self-review as an independent approval.
- [ ] **Step 5 record:** Document `Ruling: decision—why—risk if wrong` for all deviations, provide exact SHA and CI links for author-side COMMENT, and set `INDEPENDENT_REVIEW=NOT_EXECUTED` unless a genuine different reviewer supplies receipts.

### Task 9: Exact-final-SHA evidence ledger, P1 closeout handoff, no release

**Files:** Add `qa/p1/P1-5-EVIDENCE-2026-10-18.md` as **last** implementation commit; update Draft PR description and add a final SHA anchored COMMENT and issue-thread receipt.

- [ ] **Step 1 ledger draft:** Summarize actual RED→GREEN per D, regression/failures and rulings, **24/24 SK and 72/72 SS source-only**, 96-member reproducible ZIP **actual** SHA, original V0 hash equality, 28/52/84 ancestor subset hashes, D 18/9 static QA, A30/B36/C48 preserved, no providers/no hardware/no membership accounts, source/reuse permissions and reviewer/host limits.
- [ ] **Step 2 commit:** Push only evidence ledger on the new Draft implementation branch; ensure GitHub Actions path filter `qa/p1/**` triggers complete workflow **for the ledger-inclusive final SHA**.
- [ ] **Step 3 verify:** Read PR HEAD, Actions actual same-SHA run/jobs and log output; require P1 + V0 + RF/TS all completed/success and exact stage 24/72, archive 96, D 18/9, original V0 SHA. If pending/red/missing, report `PENDING/BLOCKED` and repair; never copy prior run as final receipt.
- [ ] **Step 4 review+receipt:** Publish author-only GitHub COMMENT and exact final-SHA verification receipt, state **P1 SOURCE BASELINE VERIFIED IN DRAFT ONLY** only after actual evidence. No independent review or real host E2E claimed unless observed.
- [ ] **Step 5 stop at gate:** Leave PR #48, P1.5 implementation and ancestors Open Draft/unmerged; do not mutate `main`, create/install/update Plugin Creator plugin, deploy Vercel production, authorize transmissions, connect equipment, e-mail real members or submit any legal/emergency QSO. Next separately approved workstream: **P1 full integration + P2 Engine runtime and P3 Orchestration**, with release decision independent from source completion.

## Measurable acceptance matrix P1-G0–G7

| Gate | When *executed*, source-only target | Explicitly NOT proved |
|---|---|---|
| P1-G0 | Canonical four Families, **24 unique SK / 72 SS /72 SC** IDs unchanged; no ownership drift | 24 installed features or 72 MCP methods |
| P1-G1 | **3 D SK** added; cumulative **24/24** correct YAML names and triggers | Actual host routing |
| P1-G2 | **9 D SS** added, cumulative **72/72** owner-local exact duties and filenames | 72 independent executors |
| P1-G3 | **18 EL/EN D fixtures**, **9/9 D SS**, ≥6 mixed; existing A/B/C cases preserved | Measured model/learner learning gains |
| P1-G4 | No exam licensing/copyright bypass, unsafe voltage/device flashing, protected member/minor data, false event/certification or TX | Government/external accredited safety and GDPR acceptance |
| P1-G5 | Unchanged V0 **12-file SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`**, original 49 V0 tests, P0 178 RF tests/typecheck, inherited 28/52/84 snapshots | Installed ChatGPT/host acceptance |
| P1-G6 | **96/96 exact Markdown** deterministic archive built twice, measured hash, rejects 97th/unsafe member | Installable plugin ZIP |
| P1-G7 | All above same **final evidence-ledger SHA** with GitHub Actions completed/success, scoped diff & author review | Independent review, OAuth/provider integration or readiness to merge/release |

**Completion language:** “P1 SOURCE BASELINE VERIFIED IN DRAFT” is permitted after exact-SHA gates only. “QRVAI fully implemented” or “production ready” is **false** until separately reviewed P2–P6 engines, Router/Orchestrators, UI, host/plugin lifecycle, source rights, legal/safety acceptance and real E2E have receipts.

## Owner approval and execution selection

This planning branch contains **documentation only** and must remain a dependent Open Draft PR. The original P1 global design is already the approved source spec; this **phase-specific P1.5 plan must be reviewed by the owner**. Once approved, the owner explicitly chooses **Native TDD** or **Subagent-driven execution**, and only then may a separate Draft development branch and implementation PR be created. Prior P1.4 Native choice does not silently carry forward. Written **design PR #49** is a required immutable ancestor; future implementation shall branch from this plan's final reviewed SHA and include all design documentation without copying divergent older planning drafts. No release action, new plugin identity or production deployment is authorized.
