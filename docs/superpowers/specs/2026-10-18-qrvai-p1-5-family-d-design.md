# QRVAI P1.5 — Family D Education, Maker & Clubs Source-Staging Design

**Date:** 2026-10-18 · **Status:** PROPOSED WRITTEN DESIGN FOR OWNER REVIEW. No phase-specific plan or implementation authorized by this document.

**Mission / owner intent:** Continue the already-approved ChatGPT-first QRVAI architectural taxonomy in GitHub: finish the final 3 candidate Domain Skills and 9 internal Sub-skills for **D22–D24**, preserving the exact identifiers, filenames, safety model and stage isolation from P1.0–P1.4. Achieve 24/24 Skill candidates, 72/72 internal procedures and 96/96 review-only Markdown files **in future source staging only**, with a separate release path for the personal market later.

**Immutable starting point:** verified [P1.4 source Draft PR #48](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/48) HEAD `e4bcee4179ae899c697874825711920b3bc56759` and [same-SHA GitHub Actions #39043436161](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39043436161), 109 P1 Python, 49 V0 Python, 178 RF Node plus TypeScript typecheck PASS. Source baseline **21/24 Domain SK, 63/72 SS, strict 84-file P1 review ZIP**, fingerprint `344b7e7806406738a495d52554d686c27edf2c21c039ea66159943f18fc1076f`. Old **5-Skill V0 /12-file ZIP** SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`. All ancestor PRs remain Draft and unmerged.

**Normative authority:** [canonical capability register](../../architecture/capability-register-v0.5.md), [canonical Skill/sub-skill registry](../../architecture/skill-and-subskill-registry-v0.5.md), [global owner-approved P1 staging design](2026-10-17-qrvai-p1-domain-skills-staging-design.md), [M0–M8 master roadmap](../../roadmap/2026-10-14-qrvai-master-roadmap.md) and [V0–V8 delivery gates](../../roadmap/2026-10-14-qrvai-review-gates-v0.5.md). Stable IDs and original verbatim reference responsibilities control any subsequent implementation; this document adds risk-specific acceptance criteria, not a parallel taxonomy.

## 1. Problem, users, scope and alternatives

**Who benefits:** Beginner and experienced radio amateurs learning theory/CW, makers researching low-voltage station-adjacent projects, and authorized clubs/mentors preparing privacy-safe training and asset plans. English/Greek support, Greece-first law only when actually sourced; no callsign or external account required for ordinary lessons.

**Design choices:**
- **A — Put D22–D24 into the old V0 `qrvai/skills` package now:** rejected; violates the sealed five-Skill /12-file V0 fingerprint and conflates a staged Domain candidate with a released host Skill.
- **B — Add new Academy, Maker, Club MCP tools and persistent club platform now:** rejected; expands P1 into Engines E16/E17, authentication, rights, storage, product build and privacy handling, none authorized.
- **C — Extend isolated `staging/p1-domain-skills` with three owner-local Skill packages and bilingual offline characterization while preserving all parent acceptance checks:** **selected**. It follows the approved P1 global design and minimizes compatibility and security risk.

**Outputs of the future P1.5 source implementation:** 3 new `SKILL.md` entries; 9 exact local `references/*.md` files; separate Family D Greek/English deterministic static QA fixture and tests; narrow source/reuse provenance review; updated P1-only CI expected counts; strictly reproducible **96-file** review-only source ZIP; final exact-SHA evidence, preserving P1.4 84-file, P1.3 52-file, P1.2 28-file and original V0 12-file baseline checks.

**Not in P1.5:** Plugin Creator create/update/install, real host `@QRVAI` runtime, upload of student/club data, new question-bank downloads, audio synthesizer/player, MCUs/USB/serial/RPi ports, CAT/PTT/TX, shell commands on user hardware, authenticated provider APIs, calendar writes, club registry, exam certificate, real-world session booking, Vercel/Cloudflare/Sites deploy, orchestrator or new MCP methods, main merge or PR rebases/closures.

## 2. Exact source inventory (immutable canonical map)

| Skill identity | Folder | Entrypoint | Three internal SS owners |
|---|---|---|---|
| `SK-D22` | `radio-academy` | `staging/p1-domain-skills/skills/radio-academy/SKILL.md` | `SS-D22-1`, `SS-D22-2`, `SS-D22-3` |
| `SK-D23` | `radio-maker` | `staging/p1-domain-skills/skills/radio-maker/SKILL.md` | `SS-D23-1`, `SS-D23-2`, `SS-D23-3` |
| `SK-D24` | `clubs-mentoring` | `staging/p1-domain-skills/skills/clubs-mentoring/SKILL.md` | `SS-D24-1`, `SS-D24-2`, `SS-D24-3` |

| Procedure ID | Name | Verbatim canonical responsibility | Exact local reference source path |
|---|---|---|---|
| `SS-D22-1` | Theory Curriculum | teach syllabus-aligned electrical/RF/regulatory concepts | `skills/radio-academy/references/1-theory-curriculum.md` |
| `SS-D22-2` | CW Practice | provide timing/speed drills and reproducible scoring | `skills/radio-academy/references/2-cw-practice.md` |
| `SS-D22-3` | Knowledge Assessment | ask and explain structured questions with source links | `skills/radio-academy/references/3-knowledge-assessment.md` |
| `SS-D23-1` | Microcontroller Integration | develop station-adjacent Arduino/ESP32/RPi project guidance | `skills/radio-maker/references/1-microcontroller-integration.md` |
| `SS-D23-2` | Software Interoperability | review open-source radio interfaces and test strategy | `skills/radio-maker/references/2-software-interoperability.md` |
| `SS-D23-3` | Experimental RF Prototyping | build a safe bounded research plan with measurement checks | `skills/radio-maker/references/3-experimental-rf-prototyping.md` |
| `SS-D24-1` | Member Onboarding | prepare skill-based progression for new operators | `skills/clubs-mentoring/references/1-member-onboarding.md` |
| `SS-D24-2` | Training/Event Planning | coordinate authorized workshops and activity calendars | `skills/clubs-mentoring/references/2-trainingevent-planning.md` |
| `SS-D24-3` | Asset/Mentor Governance | maintain consent-based equipment/mentor availability records | `skills/clubs-mentoring/references/3-assetmentor-governance.md` |

**Physical staging root:** `staging/p1-domain-skills/`. Each Skill has only `SKILL.md` plus its three original local `references/*.md`, with frontmatter `name` equal to folder slug, accurate `description` and sections `**Trigger:**`, `**Required context:**`, `**Output contract:**` and `**Refusal/stop condition:**`. Each reference must exactly contain the original `SS-Dnn-n` ID, `**Owner:** SK-Dnn`, exact verbatim `**Responsibility:**`, `**Required input:**`, `**Procedure:**`, `**Output:**` and `**Error/stop:**`. Internal references are not extra independently discoverable host Skills or privileged agents.

**Future cumulative arithmetic:** 21 existing entries +3 = **24/24**; 63 existing SS +9 = **72/72**; 84 old Markdown source files +12 = **96/96**. No D-family ZIP may be described as installable on its own; all count claims refer only to staged source.

## 3. D22 — Radio Academy & CW boundaries

**SK-D22 outcome:** original, adaptable lessons and structured feedback based on topic, learner level, preferred Greek/English, and optional anonymized answers. Give reproducible examples and transparent grading rules, not an actual professional or state-issued licensing result.

- **SS-D22-1 Theory Curriculum:** scope by learner level and topic; explain electrical/RF, antenna, communications and regulatory concepts using traceable ITU/CEPT references and *separate* Greece-specific competent national sources. Missing current Greek syllabus or legal facts -> `INDETERMINATE`, never invented government exam requirements or transmitted-frequency permission.
- **SS-D22-2 CW Practice:** provide text-only timing drills, sample synthetic Morse sequences and explanation; any scoring uses explicit deterministic characters/mistakes/time assumptions, unit-labelled WPM/character spacing, error bars and reproducibility. No real-time audio, speech evaluation, tone generator, device keyer, user microphone or on-air CW reception. Source-registered `academy_exercise` **does not support CW training/scoring**; this is a source procedure proposal, with CW engine `NOT_IMPLEMENTED`.
- **SS-D22-3 Knowledge Assessment:** use newly authored short training questions, factual answer explanations and citations to permissible sources. `academy_exercise` source API supports only `rf_power` or `antenna_basics` and locale `el`/`en` with an optional bounded answer index: no uploaded exam corpus, HAREC/state exam guarantee, official score or certification. Questions cannot be copied from unlicensed examinations; rights/license review required before importing third-party materials.

**Hard stops:** no copyrighted official question-bank ingestion without authorization; no concealed grading or learner identity collection; untrusted examples never trigger account/storage/device actions. Training output must say **TRAINING_ONLY**, not `HAREC_CERTIFIED` or `GREEK_EXAM_PASSED`.

## 4. D23 — Maker, Research & Software Development boundaries

**SK-D23 outcome:** safe *review* of hypothetical low-voltage station-adjacent projects, source-labeled component assumptions, compatibility test plans and non-operative experimental notes.

- **SS-D23-1 Microcontroller Integration:** board/model/voltage/current/interface/version supplied by user; safe block-diagram planning for Arduino/ESP32/Raspberry Pi as candidates; require interface-level 3.3/5V logic and max-current confirmation from a real revisioned vendor datasheet. Do **not** imply verified pinout or protection unless supplied/proven; low-voltage only; no live GPIO/serial/USB execution, flashing, CAT/PTT or mains/high-energy wiring.
- **SS-D23-2 Software Interoperability:** source-only API/driver/licence compatibility matrix for Hamlib/WSJT-X/library examples if independently verified later, bounded test cases and failures; not a running version checker or a connected local device. Use source license/commit revision only after review; no untrusted code execution, downloads, file writes or remote control.
- **SS-D23-3 Experimental RF Prototyping:** paper hypothesis, BOM with user-provided component names, measurement checklist, calibration/uncertainty and safety stop. Existing `maker_project_review` accepts a user-provided project name, `supply_voltage_v` strictly positive <=30, 1..24 component labels, and returns `certified:false`. It is NOT electrical/RF/EMC compliance, heat/current testing, physical construction permission, or a soldering/repair procedure for hazardous equipment.

**Hard stops:** no direct or automatic TX, no dangerous mains, HV, high-current, battery pack modification, RF amplifier keying or physical construction certification; refer potentially dangerous work to qualified oversight. User examples must not contain credentials, private ham station ports, or vendor manuals copied wholesale.

## 5. D24 — Clubs, Community & Mentoring boundaries

**SK-D24 outcome:** classroom-ready group onboarding and workshop designs with synthetic inputs and privacy-minimized governance templates; no private club directory or real booking.

- **SS-D24-1 Member Onboarding:** skill-level progression and mentor checklists for pseudonymous sample roles, no mandatory callsign; do not suggest revealing contact lists or infer club membership from call signs.
- **SS-D24-2 Training/Event Planning:** synthetic/permissioned workshop agenda with duration, attendance range, accessibility, learning objectives and organization-rights questions. Existing `club_workshop_plan` supports `antenna_basics` or `digital_modes`, `participants` 1..100, `duration_minutes` 30..240, returns `simulated:true`. It does **not** book a venue, add calendar events, or verify instructor attendance and permits.
- **SS-D24-3 Asset/Mentor Governance:** consent-based **proposed schema only** for pseudonymous equipment aliases, responsible authorized roles, retention/deletion and scope separation. Actual member data, serial numbers, personal locations or mentor availabilities must not be ingested, persisted, exported, guessed or disclosed without future verified tenant-specific authorization; `club.data.read` role is conceptual, not an operational club database.

**Hard stops:** minors' private data, contact details, exact club member rosters, payment/vendor logins, surprise mass messages, third-party calendar/event publishing, personal-profile correlation, learner scores and station location must stay out of tests and artifacts. Teacher/student use is informational, not a safeguarding or qualification certification workflow.

## 6. MCP/tool mapping and data honesty

| Registered development source method | Domain | **Actual supported local contract** | Must never imply |
|---|---|---|---|
| `academy_exercise`, M36 | D22 | two hard-coded bilingual RF/antenna questions; optional supplied answer index | CW engine, adaptive exam certification, external question bank |
| `maker_project_review`, M37 | D23 | <=30 V low-voltage conceptual supplied project/components (1..24), `certified:false` | validated circuitry, active MCU/GPIO, electrical approval |
| `club_workshop_plan`, M38 | D24 | deterministic synthetic agenda 30..240 min, 1..100 participants, `simulated:true` | member database, calendar access, event booking |

All 38 methods are source registered on an unmerged Draft with SDK coverage; **not connected provider services or a running ChatGPT account plugin**. No new MCP interface changes in this phase. Future Engines E16 Academy/CW and E17 Maker/Clubs remain separate P2 tasks. Unavailable action => `NOT_IMPLEMENTED`; missing evidence => `INDETERMINATE`; disallowed data/physical operation => `REFUSE` / scope denied. Verified educational citations do not grant execution rights.

## 7. Provenance, copyright, eligibility and consent

Review [the companion research and risk register](../../research/2026-10-18-qrvai-p1-5-family-d-source-and-risks.md) for candidate sources, revision controls and rights status. ITU-R M.1544-1 and CEPT T/R 61-02 are **international qualification references**, not confirmation of today's Greek question pool, legal authorization or republication licence. Greece-specific legal or exam detail needs verified competent national authority, applicable date/class and interpretation; absent -> `INDETERMINATE`. Published documentation availability alone does not establish reuse rights.

D23 manufacturer, MCU and open-source dependencies require vendor-model/revision, measured vs assumed quantities and license before code/manual ingestion. D24 club governance requires valid processing basis, role-scoped access, data minimization and retention/deletion policy; the current stage contains **only synthetic examples and templates**, no personal records. Source references/candidates are unreviewed and unconnected unless later separately verified.

## 8. Selective routing and Greek/English source-only QA

Use existing P1.4 audit/test architecture (`scripts/p1/registry.py`, `scripts/p1/audit_domain_skills.py`, `scripts/p1/build_staging_archive.py`, `tests/p1/*` and the P1-only GitHub workflow). Future implementation extends it additively. Model routing accuracy is **not** established by static fixtures.

**Minimum Family D fixture acceptance:** at least **18 distinct paired EL/EN scenarios** (6 per D owner, 2 per each of 9 procedures), and at least **6 purposeful multi-domain routes**, spanning `D22+B07` (unit lesson), `D22+A04` (Greek exam vs operating rights), `D23+B11` (paper rig-bridge compatibility), `D23+A05` (RF/electrical risk), `D24+D22` (workshop with education), `D24+A02` (drill-only training) and optionally `D24+C21` (event logistics vs actual activation). Extra negative/fail-closed cases cover fake official certification, plagiarized question prompts, CW audio/tool false promise, circuit safety, live CAT/PTT/TX, club roster disclosure, identity injection, minors/consent, pretend event booking, missing revision and unsupported language.

**Required fixture fields:** stable ID, owner D22/23/24, exact `SS-Dnn-n`, genuinely different Greek/English prompts, 1..3 ordered selected domain IDs, risk class, expected bounded outcome, source kind, reason/factual fixture basis, explicit forbidden claim assertions. Enumerate allowed outcomes (`PARTIAL`, `INDETERMINATE`, `NOT_IMPLEMENTED`, `REFUSE`, `IDEAL_MODEL`), reject fabricated `CERTIFIED` / `AUTHORIZED` / `CONNECTED` labels and untrusted instructions. No sensitive real callsigns, phone/email, IDs, addresses, serial numbers, live club member, school or minors' data in fixtures. Include mutation tests for duplicates, wrong SS owner, no Greek text, privilege escalations, unsupported route and unsafe source kinds.

**Existing P1.4 48-case and inherited A/B corpora** must stay unchanged and be re-evaluated. Do not claim 100% ChatGPT model success from 18 expected examples.

## 9. Strict source archive and CI acceptance

- Existing `staging/p1-domain-skills` source tree retains the **84-file P1.4** contents exactly; the inherited immutable 84-file source snapshot is copied into a scratch subset of exactly its prior 21 owners to compare existing ZIP SHA256 `344b7e7806406738a495d52554d686c27edf2c21c039ea66159943f18fc1076f`.
- Add exactly 12 canonical D Markdown source files and no other files inside the source staging tree, so final archive is **96/96** entries: 24 `SKILL.md` and 72 owner-local `references/*.md`.
- Run existing `audit_stage` and deterministic `build_review_zip`/`validate_review_zip` across all 24 owners, against exact canonical allowlist, then repeat ZIP build to assert byte identity; record **new actual ZIP SHA256** from CI, never invent it.
- Preserve predecessor inherited 28-file, 52-file, 84-file archives and sealed V0 12-file SHA; do not mutate their baselines to force green checks.
- Negative tests: unexpected 97th entry/`plugin.json`/`.env`, wrong SS duty or SK owner, path traversal, symlink, duplicate casefold path, >1MiB source, high ZIP ratio, contaminated QA fixture, unapproved API/deploy token or hidden student/club profile.
- Add P1-only CI counters `P1_STAGE=24/24,72/72`, `P1_STAGE_ARCHIVE_FILES=96`, D fixture totals and `P1_D_EXTERNAL_ACCOUNTS=NOT_CONNECTED`, `P1_D_DEVICE_ACTIONS=NOT_ENABLED`, `P1_D_CLUB_DATA=NOT_PERSISTED`; protect workflow with no writable token, secrets, dispatch or deploy. Gate same SHA: P1 Python + existing V0 Python (49+) + RF Node/TS (178+) with completed success, exact 96-file ZIP fingerprint, author review and GitHub receipt.
- Code/test/files written only after owner review of **this written spec**, then separately reviewed Native TDD or Subagent implementation plan. CI at the future plan-Draft SHA is **not** proof of D Skill implementation.

## 10. Explicit P1-G0–P1-G7 stage exit matrix

| Gate | Future source-only pass condition | Product capability not proven |
|---|---|---|
| G0 identity | unchanged registry 4 Families, 24 domains, 72 SC/SS, all D identities | host catalog exposure |
| G1 Skills | new 3 D `SKILL.md` and cumulative 24 exactly, YAML/frontmatter and stops | 24 installed Skills |
| G2 Sub-skills | 9 exact duties/paths, cumulative 72 refs; no omissions/duplicates | 72 executable agents |
| G3 bilingual routing | ≥18 D bilingual static cases, all 9 SS, ≥6 mixed, full prior QA | empirical ChatGPT routing |
| G4 safety/rights | copyright, official exam, CW, electrical/rig, club privacy, consent and unsupported tool failures | official training approval, rights licences, connected devices |
| G5 V0 and ancestor regression | prior 28/52/84 staged snapshots, V0 five Skills, original 12-file fingerprint | installed V0 and runtime provider stability |
| G6 full source ZIP | exact 96 Markdown entries, deterministic digest, all hostile ZIP negatives | installable plugin |
| G7 final SHA evidence | actual P1/V0/Node+TS PASS at identical final implementation+ledger SHA, scoped author COMMENT audit | independent review, production, publication, real host E2E |

The **P1 SOURCE STAGING COMPLETE** phrase becomes permissible only upon real final D implementation SHA evidence and audit. It never implies finished P2–P6 Engines, Orchestrators, UI, legal/rights approvals or a market release.

## 11. Known risks and decisions still needing owner signoff

1. **Official syllabi:** international curricula are background only; Greek official syllabus/update rights require review. **Selected:** no official Greek exam preparation certification or third-party exam-bank copy in source fixtures.
2. **CW performance:** actual scoring requires a designed deterministic E16 engine/audio interface and explicit scoring protocol. **Selected:** text-only illustrative drill and declared `NOT_IMPLEMENTED` for live generation/grading.
3. **Manufacturer trust and electrical risks:** component IDs without datasheet revisions cannot justify wiring safety. **Selected:** ≤30V low-voltage conceptual review only and explicit uncertainty.
4. **Club/minor data rights:** future accounts need tenant segregation and explicit data processing controls. **Selected:** no real club member rows, minors or persisted inventory.
5. **Source staging vs release:** 96 files may look finished but are a non-installable review archive. **Selected:** separate P2–P6 and V0–V8 acceptance.
6. **P1.4 preservation:** new D stage must not invalidate old 84-file SHA through whole-root tests. **Selected:** isolate and copy only predecessor 21 owners for inherited archive test.
7. **External research:** linked ITU/CEPT pages are public references; copyright/authority and Greek licensing not verified by link availability. **Selected:** require rights/competent-source gate later.
8. **Time/locale:** Greek and English terms and Morse WPM assumptions must not silently alter scoring; no time-based certainty without declared sampling. **Selected:** typed units and scenario assumptions.

## 12. Owner review / next gate

**This document is the required phase-specific architectural design for discussion.** Creating it and its Draft PR is not authority to create D Skill files, add QA assertions, edit workflows, write a detailed executable TDD plan, merge P1.4 or install a plugin. The earlier owner-approved global P1 specification already provides the fixed architecture; this design specifies Family D risk decisions and measurable closeout gates.

**Next:** owner reviews **this actual written design** and approves/corrects it. On approval, invoke Superpowers writing-plans to author the separate P1.5 detailed step-by-step TDD plan in `docs/superpowers/plans/2026-10-18-qrvai-p1-5-family-d-tdd.md` in a separate Draft plan PR. Owner must then review that plan and deliberately select **Native TDD** or **Subagent-driven** before any new D source/QA/CI implementation work. Prior P1.4 Native approval does not carry forward. No merges, code changes, plugin creation, Vercel deploy or live radio actions without separate authorization.
