# QRVAI P1.5 — Education, Community & Innovation: Canonical Ownership, Source Truth and Non-Operational Boundaries

**Date:** 2026-10-18, Europe/Athens. **Status:** development design input, no source implementation or installed ChatGPT plugin. **Inherited approved design:** `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md`. **Pinned verified parent:** P1.4 [Draft PR #48](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/48) at `e4bcee4179ae899c697874825711920b3bc56759`, [same-SHA CI #39043436161](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39043436161).

## 1. Original author-owned Domain and Sub-skill obligations

All names, filenames and `**Responsibility:**` text below are verbatim from `docs/architecture/skill-and-subskill-registry-v0.5.md`, not newly proposed capabilities.

| Domain / source Skill slug | Canonical SS and exactly-owned reference files | Required contract and principal stop |
|---|---|---|
| **D22 — Amateur Radio Academy & CW**, `radio-academy` | `SS-D22-1` `skills/radio-academy/references/1-theory-curriculum.md`: “teach syllabus-aligned electrical/RF/regulatory concepts”; `SS-D22-2` `skills/radio-academy/references/2-cw-practice.md`: “provide timing/speed drills and reproducible scoring”; `SS-D22-3` `skills/radio-academy/references/3-knowledge-assessment.md`: “ask and explain structured questions with source links” | Learner level, locale, topic, responses. **Never** official amateur licence exam/approval, official course accreditation, or unlawful republication of protected exam question banks |
| **D23 — Maker, Research & Software Development**, `radio-maker` | `SS-D23-1` `skills/radio-maker/references/1-microcontroller-integration.md`: “develop station-adjacent Arduino/ESP32/RPi project guidance”; `SS-D23-2` `skills/radio-maker/references/2-software-interoperability.md`: “review open-source radio interfaces and test strategy”; `SS-D23-3` `skills/radio-maker/references/3-experimental-rf-prototyping.md`: “build a safe bounded research plan with measurement checks” | Explicit board/version, component ratings, measured supply context and user-approved scope. No high-energy mains/lithium pack repair, claimed electrical certification or assumed radio/device compatibility |
| **D24 — Clubs, Community & Mentoring**, `clubs-mentoring` | `SS-D24-1` `skills/clubs-mentoring/references/1-member-onboarding.md`: “prepare skill-based progression for new operators”; `SS-D24-2` `skills/clubs-mentoring/references/2-trainingevent-planning.md`: “coordinate authorized workshops and activity calendars”; `SS-D24-3` `skills/clubs-mentoring/references/3-assetmentor-governance.md`: “maintain consent-based equipment/mentor availability records” | Organizer authority and volunteered/anonymized roster and assets. No club calendar write, membership provisioning, member PII/callsign sharing, volunteer assignment or externally shared inventory without explicit verified consent |

**Important:** `SC-D22-1..3`, `SC-D23-1..3` and `SC-D24-1..3` in the capability registry are *logical sub-capability contracts*. They map 1:1 to these SS procedures, **not** to nine additional host-installed Skills, nine MCP tools, or nine background agents. Domain Skills are source-only candidate entrypoints until separately packaged and host-tested.

## 2. Actual P1.4-ancestry SDK MCP source contracts for Family D

Read `mcp/qrvai-rf-worker/src/mcp/register.ts` at exact P1.4 parent SHA. It contains **38 source-registered SDK tool names**, including these three; availability in this codebase does **not** prove end-user ChatGPT access or a live SaaS/provider integration.

| Registered method | Exact bounded inputs/outputs | What is NOT implemented or inferable |
|---|---|---|
| `academy_exercise` | Input `topic∈{rf_power,antenna_basics}`, `locale∈{el,en}`, optional `answer_index∈{0,1,2}`. Output one **fixed** educational multiple-choice question with exactly 3 options, optional `correct` and `formula_revision:M36-v1`; no user profile/result storage | No complete Greek/foreign licence syllabus, official exam question bank, personalized spaced-repetition system, Morse WAV/PCM generation or verified WPM/accuracy scorer, accreditation or state authority |
| `maker_project_review` | Input `project_name` (1–48 chars), `supply_voltage_v>0` and ≤30 V, `components` **1–24 strings** (1–48 chars each). Output component checklist and warnings with `certified:false` and `formula_revision:M37-v1` | No BOM prices/compatibility guarantees, Arduino/ESP32/RPi flashing, firmware signing, CAT/PTT/TX, real component tests, electrical safety or product certification |
| `club_workshop_plan` | Input `topic∈{antenna_basics,digital_modes}`, `participants` integer **1–100**, `duration_minutes` integer **30–240**. Output static agenda sections and durations, `simulated:true`, `formula_revision:M38-v1` | No real calendar, club member roster, registration/attendance, organizer authorization, mentor availability database, private asset inventory, messaging, public event publication or accredited course issuance |

All three tools are source-registered **readOnly** with bounded synchronous mockable/deterministic outputs. Those flags **do not prove** rights to use other authors' lessons/exams, official authority, device safety, participant consent or network connectivity. Any D Skill must label future product features `NOT_IMPLEMENTED`, unknown approval/legal status `INDETERMINATE` and all user-supplied unverified content `USER_SUPPLIED_UNVERIFIED`.

## 3. Cross-Domain collaboration is policy-bound, not a new dispatcher

- `D22↔A03`: teach jurisdictional exam concepts *without* certifying a user's Greek amateur licence, quoting an out-of-date national rule as current, or granting transmit rights. Current competent source, amendment, language and effective date must be independently validated before legal claims.
- `D22↔B07`: antenna theory or RF power fundamentals can use an existing **ideal calculation** but an example formula cannot certify real equipment or a learner's achievement. Academic marking must disclose rubric/version.
- `D23↔B11`: a low-voltage breadboard or microcontroller receiver dashboard must remain **disconnected from CAT/PTT/TX**; an offline software diagram is not a connected rig driver. `live_device_connected:false` remains inherited.
- `D23↔B12`: hypothetical battery/power BOMs require explicit voltage, current, component limits, fuse/thermal/insulation context. No lithium pack modification, mains wiring, overvoltage or certification.
- `D23↔B09`: simple RC/antenna/matching experiments are theory and bench plans only, not measured VNA/certified impedance or RF transmit testing.
- `D24↔D22`: a workshop about safe radio education may reuse an academy lesson; permission to plan a workshop does not imply permission to enroll real attendees, transmit, send email or reprint a third-party exam.
- `D24↔A02`: a club EmComm training schedule is **simulation/preparedness only**; not actual dispatch, official activation or emergency message forwarding.

**Router source warning:** Multiple domains in one bilingual QA fixture are human-authored expected owners. They do **not** constitute empirical ChatGPT routing measurements, nor a deployed Router/4 Orchestrators.

## 4. Required educational and organizational provenance

1. **Curriculum sources:** distinguish `PUBLIC_REFERENCE` from `LEGALLY_VALIDATED_EFFECTIVE_SOURCE`, `USER_SUPPLIED_UNVERIFIED`, and `PROTECTED_COPYRIGHT`. Without current verified competent exam/regulatory authority, present instructional samples, not “official Greek exam syllabus” or pass eligibility. No unattributed copied question banks.
2. **CW scoring:** theory can derive `dot_seconds=1.2/WPM` for standard PARIS convention, but a numerical example is **not a real decoded audio waveform, a listening exam or a learner score**. Actual audio generation/decoder and personalized progress tracking are `NOT_IMPLEMENTED`. Input bounds and source/criterion needed before quoting a “score”.
3. **Maker compatibility:** `supply_voltage_v≤30` in the existing read-only tool limits its inputs; **≤30V is not a declaration that any current/power/battery is safe**. Component specs and hardware isolation must be checked; no invented part datasheets, compatibility or successful flash/test. Protect Wi-Fi secrets and real station device details.
4. **Clubs and minors/privacy:** public number of participants and anonymous agendas are lower risk than member names/callsigns/contact lists, personal achievements, exact mentor schedules and private equipment/locations. Provide aggregate templates; no participant PII, invented consent, hidden persistence, event creation, external messaging or autonomous assignments. For minors, require organization-specific safeguarding and suitable consent; don't infer identity/age from unverified input.
5. **Bilingual test corpus:** at least **18** distinct Greek/English synthetic cases (six per D22/D23/D24; two per each of 9 SS), at least **4** grounded mixed owner routes, plus malicious/error contexts: protected exam reuse, fake official course certification, claimed WPM from no audio, unsafe current despite low voltage, auto-flashing/CAT, hidden roster export, schedule publication, child/student privacy, emergency activation.
6. **Release/platform:** the **96-entry** cumulative ZIP is a reproducible **source review archive**, not an installable plugin. The 24 Domain candidates and 72 lazy-loaded SS remain unmounted. Plugin Creator's create/update actions are **NOT AUTHORIZED** in this phase.

## 5. Ancestry and immutable source evidence

At exact inherited P1.4 SHA `e4bcee4179ae899c697874825711920b3bc56759`, verified [GitHub CI #39043436161](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39043436161):

| Denominator | Observed P1.4 status | Target P1.5 (NOT YET EXECUTED) |
|---|---|---|
| Canonical domain registry | 24/24 defined | Remain 24/24, no registry edits |
| Source-staged Skills | **21/24** | **24/24**, add D22,D23,D24 |
| Source-staged internal SS | **63/72** | **72/72**, add nine |
| Strict deterministic P1 review ZIP | **84 Markdown entries** / SHA256 `344b7e7806406738a495d52554d686c27edf2c21c039ea66159943f18fc1076f` | **96 Markdown entries**, new fingerprint measured only after actual build |
| P1 Python suite | **109/109 PASS** | Must remain passing plus additive D tests |
| Original V0 | **49/49 Python**, 12-file ZIP SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f` | Same 49/49 and strict fingerprint |
| RF MCP tests/TypeScript | **178/178 Node + typecheck PASS** | Preserve, no registration contract changes |
| P1.2/P1.3 archive snapshots | **28 and 52 exact members** | Retain immutable; copy 21-owner P1.4 subset for 84-member test when D files arrive |
| Connected host, product release, station | **NOT_EXECUTED/NOT_CONNECTED** | Remain so throughout source-only P1.5 |

**Plan compatibility:** `tests/p1/test_family_c_archive.py` currently audits the **whole 84-file P1.4 root** with 21-owner allowlist. The P1.5 implementation must copy these 21 owners into a temporary immutable P1.4 subset *before staging D22*, then independently audit all **24 owners/96 entries** at current stage. Preserve 28/52 strict earlier regressions and unchanged 12-file V0 hash. Do not weaken `audit_stage` or `validate_review_zip` to permit extra members.

## 6. Gate

This is **research / source-truth documentation**, not authorization to implement, release or install anything. The existing owner-approved P1 global architecture defines P1.5; a **separately reviewed P1.5 written implementation plan and explicit method choice** are required before any code/source Skills are created. Parent PR #48 and prior lineage remain Open Draft/unmerged. No live ChatGPT `@QRVAI`, plugin creation/update/install, production Vercel, external member/calendar data, radio transmissions, CAT/PTT or emergency operations.
