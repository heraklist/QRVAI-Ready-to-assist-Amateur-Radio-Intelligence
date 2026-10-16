# QRVAI Strategic Roadmap & Decision Gates v0.3

**Date:** 2026-10-14  
**Status:** PROPOSED; **not** a detailed engineering implementation plan. Milestones and dependencies are estimates of scope, not delivery dates.  
**Inputs:** [Master Capability Design](../superpowers/specs/2026-10-14-qrvai-capability-design.md), [Domain & Orchestration Design v0.4](../superpowers/specs/2026-10-14-qrvai-domain-orchestration-design.md), [Interactive Catalog](../architecture/interactive-tools-catalog.md).

> **2026-10-17 development coordination (addendum, not a replacement for this proposed roadmap):** [Master Roadmap ↔ P0 Crosswalk](2026-10-17-qrvai-master-plan-p0-crosswalk.md) distinguishes M0–M8 milestones from the current P0 GitHub-source consolidation, maps them to V0–V8, and documents draft-only evidence gates. The original M0–M8 priority order and owner-approval requirements remain unchanged.

## Mission

Build an accurate, accessible and highly specialized amateur-radio plugin that supports knowledge and measured decisions across **24 domain capabilities** and exposes selected **interactive, deterministic and source-based workbenches**. Start in Greek and English; Greece is the first jurisdiction for regulatory research. Do not mistake a capable demo for a legally authoritative service.

## Sequencing logic

Prioritize **small, independently verifiable value slices**. UI is a first-class product feature, not a finishing step. Use domain capabilities as catalog entries, not deployment units. Develop common rules/math/source systems once, reuse them across domains.

### M0 — Product architecture and design sign-off (current)

**Deliverables:** 24-domain capability spec; 36-widget catalog; source/provider register; hybrid-MCP architecture decision; selective domain orchestration spec; staged scope and verification gates.

**Exit gate:** product owner reviews and approves spec, resolves priority of first slice and usage/license approach. No runtime is implied by completion.

### M1 — Deterministic RF Workbench (first suggested independently deliverable slice)

**Domains served:** B07 RF Engineering, B08 Antennas, B12 Station Power (foundation), A05 RF safety (educational-only boundary).

**User outcomes:** reliable engineering arithmetic without external accounts; visual link budgets and plots for RF power, coax losses and SWR.

**Example workbenches:** UI-01, UI-02, UI-03, UI-04; antenna/Smith chart can follow in an M1.1 review.

**Exit evidence:** typed contract tests, analytical reference calculations with tolerances, range/unit checks, accessible fallback, UI tests on actual target client. No acceptance claim without observed test run.

### M2 — Regulatory & Frequency Intelligence (Greek-first)

**Domains served:** A03 frequency, A04 law, A05 RF safety guidance.

**User outcomes:** distinguish statutory allocation from recommended band plans, find source/effective date, model license context and receive ALLOWED/NOT_ALLOWED/INDETERMINATE without fabricated permissions.

**Example workbenches:** UI-17, UI-18 and locator/frequency data model.

**Dependencies:** primary authority texts, legal review for interpretation, source register with version and effective dates, discrepancy tests, rule-engine fixtures.

**Exit evidence:** verified sample cases including boundary frequency, missing license, temporary exceptions, version conflicts and 'do not transmit until verified' response.

### M3 — Manuals, Equipment Support & Digital Troubleshooting

**Domains served:** B06 manuals, B10 measurements introduction, B11 integration, C16 digital modes.

**User outcomes:** find official user manuals, explain settings with page/version references and complete structured non-destructive setup diagnostics.

**Example workbenches:** UI-12, UI-13, UI-31, station-path diagram prototype.

**Dependencies:** rights-aware manual index, vendor/model taxonomy, upload consent and prompt-injection defenses.

**Exit evidence:** source-cited accuracy tests for multiple radio models, refusal on unavailable material, version collision test, safe stepper and text fallback.

### M4 — Propagation, Geospatial & Operating Data

**Domains served:** C14 DX, C15 propagation, C19 satellites groundwork, C18 repeaters groundwork.

**User outcomes:** show observed versus forecast data, analyze solar conditions and plot paths with uncertainty.

**Example workbenches:** UI-20, UI-23, then UI-21/UI-22 as adapter terms and data quality allow.

**Dependencies:** trustworthy NOAA/service adapters, provider terms and API quotas, temporal cache, ephemeris/locator correctness.

**Exit evidence:** provider failures, stale timestamps, bad grid/QTH, forecast uncertainty and localization.

### M5 — Logbook, Digital Networks & Portable Operations

**Domains served:** C20 logbooks, C16 digital modes, C17 packet/APRS, C21 contests/outdoor.

**User outcomes:** validate user-supplied ADIF, summarize QSO/awards, plan legal portable operations and review digital-mode software setups.

**Example workbenches:** UI-32, then UI-29/UI-33 depending on partner data rights.

**Dependencies:** ADIF version interoperability, QSO privacy and per-user authorization, external program rules.

**Exit evidence:** valid/malformed imports, idempotency, privacy isolation, no unauthorized award API reads/writes.

### M6 — Civil Protection & Emergency Communications Preparedness

**Domains served:** A01 and A02, plus B12 resilient power and C17 network communication.

**User outcomes:** training plans, message-form drills, checklists, egress/fallback design and authority-specific resources, without a claim of official emergency authority.

**Example workbenches:** UI-26–28 (simulated), link/failure tabletop.

**Dependencies:** relevant ITU/IARU recommendations, Greek Civil Protection verified procedures, local authority confirmation for any operational deployment, clear training-only labels.

**Exit evidence:** simulation isolation, explicit human authority, no live dispatch, no transmit/PTT actions, correct fallback guidance.

### M7 — Advanced Engineering, Satellites & Local Station Bridge

**Domains served:** B08–B13 and C19; extends C18.

**User outcomes:** measurement viewers, antenna matching, SDR visual analysis, equipment diagnostics, satellite passes, and **optional opt-in read-only** rig integration.

**Example workbenches:** UI-05–11, UI-14–16, UI-24.

**Dependencies:** device-specific safety envelopes, Hamlib/rig capability negotiation, trusted ephemerides, hardware sandboxing, measurement-import test datasets.

**Exit evidence:** simulation/dry-run validation, disconnected hardware handling, read-only controls verified; PTT/automatic TX remain out of scope.

### M8 — Academy, Clubs & Maker Ecosystem

**Domains served:** D22–D24, with cross-domain learning activities.

**User outcomes:** personalized guided instruction, CW practice, club workflows and transparent DIY educational help.

**Example workbenches:** UI-34–36.

**Dependencies:** question-bank licensing, consent on club data, safe electrical demonstrations and localized curriculum.

**Exit evidence:** pedagogical QA, copyright compliance, accessibility and consent.

## Domain coverage map

| Category | IDs | Initially covered by |
|---|---|---|
| Public service & legal | A01–A05 | M2 (A03–A05), M6 (A01–A02) |
| Engineering & support | B06–B13 | M1, M3, M7 (+ M6 power scenarios) |
| Operations, networks & intelligence | C14–C21 | M3–M5, M7 |
| Education & community | D22–D24 | M8 |

A domain can participate in several milestones. This map is a target coverage plan, not a declaration of completeness at any milestone.

## Cross-cutting architecture work

- **Evidence layer:** source IDs, publication/effective dates, access terms, versioned rules and citation anchors.
- **Permissions:** anonymous educational tools versus authenticated personal QSO data versus local-station read-only access.
- **API adaptation:** adapters isolate network failure, rate limit, freshness and terms of service.
- **UX library:** units, charts, provenance panel, text fallback, screen reader and mobile support.
- **Validation:** authoritative golden cases; regressions; seeded synthetic test data; security tests and user workflows.
- **Localization:** Greek-first wording with English equivalents; consistent callsigns, SI and RF units.

## Risks, mitigations and explicit non-goals

| Risk | Mitigation |
|---|---|
| 24 domains overwhelm delivery | Deliver one small slice per spec/plan/test/review cycle |
| Wrong legal answer | Official jurisdiction/version provenance; INDETERMINATE on missing context |
| Copyright/manual use | Official links, upload authorization, no blanket ingestion |
| API instability and cost | Adapter boundary, quotas and visible cache-freshness |
| Unsafe radio behavior | Read-only local bridge; no PTT or TX, human review for future scopes |
| False emergency authority | Simulation-only initial features; reference authorized bodies |
| UI not supported in host | Accessible static fallback and host compatibility gate |
| Disclosing QSO/callsign profiles | Consent, scoped authentication, retention/deletion controls |

**Non-goals for early releases:** autonomous emergency response; spectrum enforcement; professional RF/exposure certification; unapproved third-party API ingestion; autonomous CAT transmission; full native SDR replacement.

## Research and decisions still to resolve

1. Product distribution: fully open source, private community pilot, or mixed hosted service?
2. Priority M1 RF Workbench versus M2 source-backed frequency compliance for the first live slice.
3. Manual ingestion rights and vendor coverage policy.
4. Test device families, platforms and target MCP-host compatibility.
5. Jurisdiction rules review process and update cadence.

## Process from here

- Owner reviews this strategic plan and the written design; amend as needed.
- After explicit design acceptance, create a **detailed, test-first implementation plan for exactly M1 or M2**, following the adopted Superpowers/CodeMaestro workflow.
- Keep each milestone separately testable, and preserve review and authorization boundaries for releases, hardware actions, merge and publication.

_No estimates or acceptance labels here imply code has been written, tested or published._
