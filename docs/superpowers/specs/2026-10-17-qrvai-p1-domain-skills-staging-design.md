# QRVAI P1 — Canonical Domain Skills & Sub-skills Staging Design

**Date:** 2026-10-17. **Status:** Written architectural specification for owner review. **No P1 code authorized or implemented.**
**Parent baseline:** [P0 Draft PR #38](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/38), exact commit `85e6341722673f9caa245831355970e08102578f` (unmerged).
**Strategic sources:** [M0–M8 roadmap](../../roadmap/2026-10-14-qrvai-master-roadmap.md), [V0–V8 gates](../../roadmap/2026-10-14-qrvai-review-gates-v0.5.md), [P0 crosswalk](../../roadmap/2026-10-17-qrvai-master-plan-p0-crosswalk.md).
**Normative technical sources:** [Domain/SC Capability Register v0.5](../../architecture/capability-register-v0.5.md), [Skill & Sub-skill Registry v0.5](../../architecture/skill-and-subskill-registry-v0.5.md), [Domain Orchestration Design](2026-10-14-qrvai-domain-orchestration-design.md), [Orchestrator Controls](../../architecture/orchestrator-control-contracts-v0.5.md), [ChatGPT-first Experience](../../architecture/chatgpt-first-experience-v0.5.md).

## 1. Intent, scope, decision context

The owner explicitly requests building QRVAI **according to the original architecture already in GitHub**, not a parallel taxonomy. The existing QRVAI model has **one ChatGPT-first plugin product**, **four Families**, **24 Domain Modules** and **72 functional Sub-capabilities**. A Domain has exactly **one host-discoverable Skill candidate** and **three internal procedural Sub-skills**; Sub-skills are **not** second host Skills, extra MCP tools or LLM agents.

The source currently has **five distinct V0 Core/Family Skills** in `qrvai/skills/`, an intentionally strict **12-file V0 ZIP**, and 38 source-registered draft MCP method names. The 24 Domain Skills/72 procedures are already designed in the Skill Registry but are not packaged as functioning host Skills. The P0 source baseline is tested in Draft, not merged into `main`. Neither source-registration nor source-only instructions prove live host integration.

**P1 source success:** exactly 24 canonical Skill packages with 72 owner-local procedural references staged and audited, selective bilingual routing, source-backed/refusal behavior, reproducible review artifact and **unchanged V0**. This is one crosscutting workstream serving milestones M0–M8 and slices V0–V8; it does not replace the roadmap, install the product, or implement every Engine/UI/orchestrator.

## 2. Options and selected source architecture

**Rejected (A):** put Domain Skills directly under `qrvai/skills`. `scripts/v0/audit_content.py` enforces the exact five-Skill V0 set, and `scripts/v0/build_archive.py` enforces a 12-file allowlist; modifying those gates before host/packaging authorization would destroy the existing reproducible baseline.

**Rejected (B):** fold all procedures into the existing V0 Family references. It does not deliver the 24 separate Domain Skill entrypoints the owner designed.

**Selected (C):** an isolated **development-only** staging tree, keeping each **internal** registry path intact:

```text
staging/p1-domain-skills/skills/<canonical-slug>/SKILL.md
staging/p1-domain-skills/skills/<canonical-slug>/references/<one-of-three-exact-files>.md
scripts/p1/audit_domain_skills.py                 (proposed)
scripts/p1/build_staging_archive.py               (proposed, review-only)
tests/p1/test_registry_contract.py                (proposed)
tests/p1/test_routing_safety.py                   (proposed)
tests/p1/test_staging_archive.py                  (proposed)
qa/p1/domain-routing-cases.json                   (proposed)
qa/p1/execution-evidence.md                      (proposed)
```

The angle-bracket strings are layout notation, **not executable paths or unresolved feature requirements**: Section 3 provides all 96 exact filenames. No `plugin.json` or `mcp.json`, API credentials, live feed, Vercel config, hardware bridge, installation or external upload is put in staging. The existing five-Skill `qrvai/` package and validators remain intact. Source-only staging ZIP is **not** a standalone plugin archive.

## 3. Canonical ownership and physical package inventory

Immutable identity rule: **A01–A05 (5), B06–B13 (8), C14–C21 (8), D22–D24 (3)**. One `SK-<DomainID>` entrypoint per Domain and exactly `SS-<DomainID>-1..3` references. SC IDs name distinct functional Sub-capabilities and link to existing SS procedures; they must not become additional Skills or access grants. Skill slugs and all references are taken literally from the established 2026-10-14 Skill Registry. Registry controls the trigger, required context, output, specific procedure responsibility and refusal condition; this P1 design controls development isolation/QA.

### 3.1 Identity and purpose matrix

| Domain | Host Skill candidate ID and slug | Original domain | Exact three procedural responsibilities |
|---|---|---|---|
| `A01` | `SK-A01` · `civil-protection` | Civil Protection & Disaster Preparedness | `SS-A01-1` Preparedness Baseline; `SS-A01-2` Resilience Design; `SS-A01-3` Exercise Review |
| `A02` | `SK-A02` · `emcomm-traffic` | Emergency Communications & Traffic Handling | `SS-A02-1` Net Role Training; `SS-A02-2` Message Integrity Drill; `SS-A02-3` Fallback Traffic Simulation |
| `A03` | `SK-A03` · `frequency-intelligence` | Frequency & Spectrum Intelligence | `SS-A03-1` Allocation Lookup; `SS-A03-2` Band Plan Overlay; `SS-A03-3` Channel/Repeater Reference |
| `A04` | `SK-A04` · `regulatory-licensing` | Regulatory & Licensing Intelligence | `SS-A04-1` Licence Context; `SS-A04-2` Transmission Rule Evaluation; `SS-A04-3` Cross-border Explanation |
| `A05` | `SK-A05` · `rf-safety-emc` | RF Safety, EMC & Interference | `SS-A05-1` RF Exposure Worksheet; `SS-A05-2` Interference Troubleshooting; `SS-A05-3` Installation Risk Review |
| `B06` | `SK-B06` · `equipment-manuals` | Equipment Support & Manuals Intelligence | `SS-B06-1` Versioned Manual Retrieval; `SS-B06-2` Configuration Walkthrough; `SS-B06-3` Safe Troubleshooting |
| `B07` | `SK-B07` · `rf-engineering` | RF Engineering & Calculations | `SS-B07-1` RF Unit Algebra; `SS-B07-2` Link Budget Analysis; `SS-B07-3` Mismatch and Noise Metrics |
| `B08` | `SK-B08` · `antenna-feedline` | Antennas & Transmission Lines | `SS-B08-1` Antenna Geometry; `SS-B08-2` Matching/Smith Chart; `SS-B08-3` Feedline Performance |
| `B09` | `SK-B09` · `rf-electronics` | Radio Electronics & Circuits | `SS-B09-1` Filter Modeling; `SS-B09-2` RF Chain Explanation; `SS-B09-3` Component Selection Checks |
| `B10` | `SK-B10` · `rf-measurements` | Test Equipment & Diagnostics | `SS-B10-1` VNA Trace Interpretation; `SS-B10-2` Spectrum/Test Setup; `SS-B10-3` Measurement Reconciliation |
| `B11` | `SK-B11` · `station-integration` | Station Control & Integration | `SS-B11-1` Signal Path Mapping; `SS-B11-2` Compatibility Check; `SS-B11-3` Read-only Telemetry |
| `B12` | `SK-B12` · `power-infrastructure` | Power Systems & Infrastructure | `SS-B12-1` Power Budget; `SS-B12-2` Battery Runtime; `SS-B12-3` Backup Scenario |
| `B13` | `SK-B13` · `sdr-dsp` | SDR & Digital Signal Processing | `SS-B13-1` Sampling Foundations; `SS-B13-2` Spectrum/FFT Visualization; `SS-B13-3` DSP Filter Analysis |
| `C14` | `SK-C14` · `operating-dx` | Operating & DX Intelligence | `SS-C14-1` Operating Procedure; `SS-C14-2` DX Observation Reading; `SS-C14-3` Operating Scenario Plan |
| `C15` | `SK-C15` · `propagation` | Propagation & Space Weather | `SS-C15-1` Space Weather Reading; `SS-C15-2` Propagation Scenario; `SS-C15-3` Observation Correlation |
| `C16` | `SK-C16` · `digital-modes` | Digital Modes & Computer Radio | `SS-C16-1` Mode Basics; `SS-C16-2` Audio/CAT Diagnostics; `SS-C16-3` Software Version Guidance |
| `C17` | `SK-C17` · `packet-networks` | Packet, APRS, Winlink & Mesh | `SS-C17-1` Packet Frame/Routing; `SS-C17-2` APRS/Location Ethics; `SS-C17-3` Winlink/Mesh Planning |
| `C18` | `SK-C18` · `repeaters-dvoice` | Repeaters & Digital Voice | `SS-C18-1` Analog Repeater Settings; `SS-C18-2` Digital Voice Profiles; `SS-C18-3` Directory Discovery |
| `C19` | `SK-C19` · `satellites-weak-signal` | Satellites, EME & Weak Signal | `SS-C19-1` Satellite Metadata; `SS-C19-2` Pass/Doppler Calculation; `SS-C19-3` Weak-signal Workflow |
| `C20` | `SK-C20` · `logbook-awards` | Logbook, QSL & Awards | `SS-C20-1` ADIF Integrity; `SS-C20-2` QSO Analytics; `SS-C20-3` Award/QSL Assessment |
| `C21` | `SK-C21` · `contests-portable` | Contests, Portable & Outdoor Radio | `SS-C21-1` Contest Rule Preparation; `SS-C21-2` Portable Activation Planning; `SS-C21-3` Field Operations Review |
| `D22` | `SK-D22` · `radio-academy` | Amateur Radio Academy & CW | `SS-D22-1` Theory Curriculum; `SS-D22-2` CW Practice; `SS-D22-3` Knowledge Assessment |
| `D23` | `SK-D23` · `radio-maker` | Maker, Research & Software Development | `SS-D23-1` Microcontroller Integration; `SS-D23-2` Software Interoperability; `SS-D23-3` Experimental RF Prototyping |
| `D24` | `SK-D24` · `clubs-mentoring` | Clubs, Community & Mentoring | `SS-D24-1` Member Onboarding; `SS-D24-2` Training/Event Planning; `SS-D24-3` Asset/Mentor Governance |

### 3.2 Exact staging paths (relative to `staging/p1-domain-skills/`)

| Owner | Skill entrypoint | Three canonical internal references |
|---|---|---|
| `SK-A01` | `skills/civil-protection/SKILL.md` | `skills/civil-protection/references/1-preparedness-baseline.md`, `skills/civil-protection/references/2-resilience-design.md`, `skills/civil-protection/references/3-exercise-review.md` |
| `SK-A02` | `skills/emcomm-traffic/SKILL.md` | `skills/emcomm-traffic/references/1-net-role-training.md`, `skills/emcomm-traffic/references/2-message-integrity-drill.md`, `skills/emcomm-traffic/references/3-fallback-traffic-simulation.md` |
| `SK-A03` | `skills/frequency-intelligence/SKILL.md` | `skills/frequency-intelligence/references/1-allocation-lookup.md`, `skills/frequency-intelligence/references/2-band-plan-overlay.md`, `skills/frequency-intelligence/references/3-channelrepeater-reference.md` |
| `SK-A04` | `skills/regulatory-licensing/SKILL.md` | `skills/regulatory-licensing/references/1-licence-context.md`, `skills/regulatory-licensing/references/2-transmission-rule-evaluation.md`, `skills/regulatory-licensing/references/3-crossborder-explanation.md` |
| `SK-A05` | `skills/rf-safety-emc/SKILL.md` | `skills/rf-safety-emc/references/1-rf-exposure-worksheet.md`, `skills/rf-safety-emc/references/2-interference-troubleshooting.md`, `skills/rf-safety-emc/references/3-installation-risk-review.md` |
| `SK-B06` | `skills/equipment-manuals/SKILL.md` | `skills/equipment-manuals/references/1-versioned-manual-retrieval.md`, `skills/equipment-manuals/references/2-configuration-walkthrough.md`, `skills/equipment-manuals/references/3-safe-troubleshooting.md` |
| `SK-B07` | `skills/rf-engineering/SKILL.md` | `skills/rf-engineering/references/1-rf-unit-algebra.md`, `skills/rf-engineering/references/2-link-budget-analysis.md`, `skills/rf-engineering/references/3-mismatch-and-noise-metrics.md` |
| `SK-B08` | `skills/antenna-feedline/SKILL.md` | `skills/antenna-feedline/references/1-antenna-geometry.md`, `skills/antenna-feedline/references/2-matchingsmith-chart.md`, `skills/antenna-feedline/references/3-feedline-performance.md` |
| `SK-B09` | `skills/rf-electronics/SKILL.md` | `skills/rf-electronics/references/1-filter-modeling.md`, `skills/rf-electronics/references/2-rf-chain-explanation.md`, `skills/rf-electronics/references/3-component-selection-checks.md` |
| `SK-B10` | `skills/rf-measurements/SKILL.md` | `skills/rf-measurements/references/1-vna-trace-interpretation.md`, `skills/rf-measurements/references/2-spectrumtest-setup.md`, `skills/rf-measurements/references/3-measurement-reconciliation.md` |
| `SK-B11` | `skills/station-integration/SKILL.md` | `skills/station-integration/references/1-signal-path-mapping.md`, `skills/station-integration/references/2-compatibility-check.md`, `skills/station-integration/references/3-readonly-telemetry.md` |
| `SK-B12` | `skills/power-infrastructure/SKILL.md` | `skills/power-infrastructure/references/1-power-budget.md`, `skills/power-infrastructure/references/2-battery-runtime.md`, `skills/power-infrastructure/references/3-backup-scenario.md` |
| `SK-B13` | `skills/sdr-dsp/SKILL.md` | `skills/sdr-dsp/references/1-sampling-foundations.md`, `skills/sdr-dsp/references/2-spectrumfft-visualization.md`, `skills/sdr-dsp/references/3-dsp-filter-analysis.md` |
| `SK-C14` | `skills/operating-dx/SKILL.md` | `skills/operating-dx/references/1-operating-procedure.md`, `skills/operating-dx/references/2-dx-observation-reading.md`, `skills/operating-dx/references/3-operating-scenario-plan.md` |
| `SK-C15` | `skills/propagation/SKILL.md` | `skills/propagation/references/1-space-weather-reading.md`, `skills/propagation/references/2-propagation-scenario.md`, `skills/propagation/references/3-observation-correlation.md` |
| `SK-C16` | `skills/digital-modes/SKILL.md` | `skills/digital-modes/references/1-mode-basics.md`, `skills/digital-modes/references/2-audiocat-diagnostics.md`, `skills/digital-modes/references/3-software-version-guidance.md` |
| `SK-C17` | `skills/packet-networks/SKILL.md` | `skills/packet-networks/references/1-packet-framerouting.md`, `skills/packet-networks/references/2-aprslocation-ethics.md`, `skills/packet-networks/references/3-winlinkmesh-planning.md` |
| `SK-C18` | `skills/repeaters-dvoice/SKILL.md` | `skills/repeaters-dvoice/references/1-analog-repeater-settings.md`, `skills/repeaters-dvoice/references/2-digital-voice-profiles.md`, `skills/repeaters-dvoice/references/3-directory-discovery.md` |
| `SK-C19` | `skills/satellites-weak-signal/SKILL.md` | `skills/satellites-weak-signal/references/1-satellite-metadata.md`, `skills/satellites-weak-signal/references/2-passdoppler-calculation.md`, `skills/satellites-weak-signal/references/3-weaksignal-workflow.md` |
| `SK-C20` | `skills/logbook-awards/SKILL.md` | `skills/logbook-awards/references/1-adif-integrity.md`, `skills/logbook-awards/references/2-qso-analytics.md`, `skills/logbook-awards/references/3-awardqsl-assessment.md` |
| `SK-C21` | `skills/contests-portable/SKILL.md` | `skills/contests-portable/references/1-contest-rule-preparation.md`, `skills/contests-portable/references/2-portable-activation-planning.md`, `skills/contests-portable/references/3-field-operations-review.md` |
| `SK-D22` | `skills/radio-academy/SKILL.md` | `skills/radio-academy/references/1-theory-curriculum.md`, `skills/radio-academy/references/2-cw-practice.md`, `skills/radio-academy/references/3-knowledge-assessment.md` |
| `SK-D23` | `skills/radio-maker/SKILL.md` | `skills/radio-maker/references/1-microcontroller-integration.md`, `skills/radio-maker/references/2-software-interoperability.md`, `skills/radio-maker/references/3-experimental-rf-prototyping.md` |
| `SK-D24` | `skills/clubs-mentoring/SKILL.md` | `skills/clubs-mentoring/references/1-member-onboarding.md`, `skills/clubs-mentoring/references/2-trainingevent-planning.md`, `skills/clubs-mentoring/references/3-assetmentor-governance.md` |

At P1.5, **24 `SKILL.md` + 72 `references/*.md` = exactly 96 canonical Skill Markdown files**. For earlier development slices report partial numerators (such as 2/24 and 6/72), never pretend uncreated files are implemented. Additional scripts/tests/QA live **outside** the staging source ZIP allowlist.

## 4. Runtime-independent instruction contracts

Each `SKILL.md` is a narrow host-discoverable **candidate**. Its YAML frontmatter has `name` exactly equal to the canonical slug and a truthful, selective `description`; sections declare user-facing purpose, positive/negative triggers, parent Domain/Family, minimal context, possible outputs, applicable source authority, three correct SS reference links and stop/fallback conditions. Use Greek for Greek users and English for English requests, and ask for only essential missing inputs. General education must not assume a callsign/account exists.

A `references/<canonical>.md` file has its `SS-D-n` ID, `SK-D` owner, one corresponding canonical responsibility, required inputs, explicit procedure steps, evidence and output, error/abstention and safety constraints. It is **not** an independently activated host Skill, MCP operation or privileged agent. Load only task-relevant procedural files; never eagerly load 72 procedures.

Routing follows the owner's orchestration contracts: **DIRECT** for a single adequate Skill or deterministic result; **LOCAL PROCEDURE** for `SS-D-n` ownership; **cross-Domain composition** only when multiple genuinely separate owners are required. The main Router, `OR-ENG`, `OR-DIAG`, `OR-REG`, `OR-EMCOMM` and specialist model agents remain *conceptual* and are not built by P1. The selected Domain cannot grant tool scope or consent; follow-up conversation context cannot create authority.

Skills may reference MCP *only* via an actually SDK-registered P0 method name with validated input schema and allowed scope. Conceptual dotted `M01–M38` method IDs are not API names; 38 source-registered interfaces are **not** 38 working live services. Lack of official source/provider/host tool must cause a bounded explanation, safe instructional fallback or `NOT_IMPLEMENTED`, not fabricated live results. Tool output may be used only after input, permission, source freshness and safety validation.

The answer contract includes user's language, declared RF units/precision, source version/effective date when genuinely verified, model-vs-observation distinctions, explicit uncertainty/safety messages and readable prose even when a future MCP App is unavailable.

## 5. Mandatory safety and error classes

| Original owner/risk | Requirement |
|---|---|
| A03/A04/A05 national spectrum/legal/exposure | Binding country rules outrank IARU advice. Licence, mode, country, exact band/date/power when relevant; absent/stale source → `INDETERMINATE`, **never permission to transmit**. |
| A01/A02 Emergency/Civil Protection | Training, preparedness and exercises **only**; no agency activation, live dispatch, priority override or PTT. |
| B06/B10/B11/B13 radio/manual/lab/SDR | No invented manufacturer instructions, verified calibration or connected CAT/PTT/TX, remote command, local device, rig-control or repair certification. |
| B07/B08/B09/B12/A05/D23 RF/electrical/experiments | Typed units, bounded numeric data, no safety certification or hazardous internal/high-voltage servicing. |
| C14/C15/C19 DX/weather/satellites | No fake live spots/indices/passes; label user-supplied data and simulated predictions and do not invent freshness or provider agreements. |
| C20/D24 logbook/awards/clubs | No private QSO/callsign/roster persistence or unsolicited echo, no external account access without verified consent/tenant scope. |
| D22 education | No official licensing-exam certification or unlawful reuse of protected question banks. |

Required content test classes: `MISSING_CONTEXT`, `INDETERMINATE`, `SOURCE_UNAVAILABLE`, `STALE_EVIDENCE`, `NOT_IMPLEMENTED`, `SCOPE_DENIED`. These are **text/QA classifications**, not invented MCP wire-level error codes. Untrusted source data never overrides device, legal, simulation or scope boundaries. No destructive or external calls are authorized.

## 6. Reviewable development increments and acceptance ratios

The 96 files are too broad for one atomic review. The following **P1 subphases** are engineering boundaries, *not* replacements for M0–M8 or authorization to implement now.

| Slice | Exact owners and new procedural counts | Cumulative staged count |
|---|---|---|
| **P1.0** parser, validator, independent CI/test framework | 0 Domain Skills, 0 SS | **0/24 · 0/72** |
| **P1.1** safe bounded RF pilot | B07 + B08, 6 SS | **2/24 · 6/72** |
| **P1.2** legal/EmComm risk family | A01–A05, 15 SS | **7/24 · 21/72** |
| **P1.3** remaining engineering equipment/SDR | B06 and B09–B13, 18 SS | **13/24 · 39/72** |
| **P1.4** operating/networks | C14–C21, 24 SS | **21/24 · 63/72** |
| **P1.5** education/community + final QA | D22–D24, 9 SS | **24/24 · 72/72**, 96 files |

The pilot uses already bounded source RF arithmetic and source-only explanations; legal and high-risk constraints are defined from P1.0 even though Family A files arrive in P1.2. Each increment needs its own approved written TDD plan and execution method; its outcomes stay Draft and unmerged.

## 7. Measurable acceptance gates P1-G0–P1-G7

| Gate | Exact evidence required |
|---|---|
| **P1-G0** canonical identity | Machine-compare source registry **24 IDs, 24 unique slugs, 72 SS IDs, 72 exact reference paths**, Family distribution 5/8/8/3, Domain↔SC↔SS ownership. |
| **P1-G1** Skill package contract | Valid YAML `name`/`description`, precise activation/use exclusions, minimum context, output/refusal, safe local reference resolution; no placeholders. |
| **P1-G2** reference fidelity | Exactly 3 named files per staged Skill, declared owner/SS ID, accurate named responsibility and narrow procedural output. |
| **P1-G3** bilingual routing | Greek and English positive, ambiguous, mixed-domain, unsupported host, missing-context, legal, emergency and hardware fixtures; minimal owners and no privilege escalation. |
| **P1-G4** negative safety/evidence | Permission and IARU/legal tests, drill-only EmComm, CAT/PTT/TX requests, unverified live observations, protected manuals, profile/callsign/ADIF data and official certification failures. |
| **P1-G5** V0 unchanged | Original 49+ Python V0 tests, exact five V0 Skills, strict **12-file reproducible ZIP** from `qrvai/` on every P1 subphase. |
| **P1-G6** staged archive only | Deterministic root-relative staging source allowlist, size/traversal/symlink/ZIP bomb guards, exactly current staged files; no manifest, secret or installation. |
| **P1-G7** CI/review provenance | Same-final-SHA P1 CI and V0 results, counts/denominators and source-vs-host statuses; owner review, independent reviewer before any merge/release. |

Create a distinct P1 CI workflow when implementation is approved, path filtered to `staging/p1-domain-skills/**`, `scripts/p1/**`, `tests/p1/**`, `qa/p1/**`, source registries and workflow file. Preserve read-only permissions and pinned third-party actions; **run V0 validation inside P1 workflow** so a P1-only change still proves the old 12-file package was untouched. Do not report percentage of total product feature completeness from source counts.

## 8. Source, authority and release gates

Only a **new Draft P1 design PR** branches from the P0 SHA above. The separate owner approval to **this written specification** permits Superpowers `writing-plans` next, not implementation. Subsequently an **approved written TDD implementation plan plus chosen Native/Subagent execution mode** is required before code or staging Skills are written.

No `main` merge, branch closures, plugin create/update/reuse/install, OAuth issuer registration, Vercel promotion, credential changes, Marketplace listing, ChatGPT `@QRVAI` invocation, remote file/provider integration, CAT/PTT/TX or hardware connection is authorized. Existing P0 author-side review is not an independent review of the 190-commit cumulative chain.

## 9. Source audit and completion semantics

The author-time extraction of the canonical registry yielded **24/24 distinct IDs and slugs, 72/72 SS IDs and reference paths, exactly three references under each owner slug**. This confirms only consistency of existing *planned definitions*: **P1 files staged = 0/24 and 0/72, P1 CI = NOT_EXECUTED, host E2E = NOT_EXECUTED.**

A completed P1 stage eventually means **source-staged, tested, reviewable Skill definitions**, not a connected ChatGPT plugin, full 18-Engine fleet or a deployed 36-widget catalog. Report source counts, test denominators, case provenance, exact SHA and unresolved prerequisites separately.
