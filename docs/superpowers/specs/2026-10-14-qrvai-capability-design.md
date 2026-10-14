# QRVAI Master Capability Design v0.3

**Date:** 2026-10-14  
**Status:** DRAFT — awaiting product-owner review  
**Scope:** Functional taxonomy, use cases, system boundaries, interactive experiences and non-functional requirements. This is a design specification, **not** an implementation plan or a claim of working software.  
**Repository:** heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence

## 1. Intent and users

QRVAI shall be a ChatGPT-centered, Greek/English **Amateur Radio Intelligence & Technical Support** ecosystem, supporting licensed and aspiring radio amateurs, emergency-communications volunteers, club mentors, equipment technicians, portable operators and contesters. It combines expert guidance, authoritative source lookup, reproducible calculations, user-authorized data integration and contextual interactive visualizations.

Success means a user can solve a concrete operating or engineering problem with traceable evidence and correct units, without relying on fabricated frequency permissions, propagation claims or undocumented radio settings.

**Initial geographic policy:** Greece-first regulatory coverage with International Telecommunication Union / IARU / CEPT context; technical calculators are international. Every jurisdiction-specific answer must identify the operating location, license class and effective date or clearly state that a legal conclusion cannot be made.

## 2. Delivery approach (architecture decision for review)

Three alternatives considered:
1. **Skills-only:** easiest to distribute; inadequate for reproducible RF calculations, current data and rich visualizations.
2. **Hybrid Skills + MCP tools + MCP Apps** (**recommended**): combines interpretive help, deterministic validated tools, permission-controlled API access and inline dashboards, with a future optional local bridge.
3. **Hardware-centric local application:** superior for offline CAT/SDR but too demanding as the first release and narrows ChatGPT reach.

Adopt **option 2 as proposed direction**, with an independent read-only local station bridge later. A capability is a domain of knowledge/workflows; it is not necessarily its own MCP server. A UI widget is not a new domain. Prefer one controlled integration gateway and a small number of shared engines.

## 3. Functional taxonomy — 24 specializations

### A. Safety, public service and regulations

| ID | Capability | Scope and intended outputs | Interactive candidates |
|---|---|---|---|
| A01 | Civil Protection & Disaster Preparedness | Preparedness plans, go-bags, backup power, volunteer-team roles, training exercises and after-action templates; use officially published guidance. | Readiness checklist, station-availability board, drill timeline |
| A02 | Emergency Communications & Traffic Handling | Net-control training, structured message forms, acknowledgements, exercise logs, resilience and authorized communications planning. No dispatch or autonomous public alerts. | Offline-style message form, traffic flow view, network resilience scenario |
| A03 | Frequency & Spectrum Intelligence | National allocation, operator-specific band limits, IARU recommendations, repeater channels, beacons and verified frequency memories, with provenance. | Frequency/band-plan explorer, compliance boundary view, repeater filter |
| A04 | Regulatory & Licensing Intelligence | Greek licensing and lawful station operation, CEPT/HAREC, portability, RF limits and jurisdiction-specific evidence. | Jurisdiction comparator, license-permission matrix, source timeline |
| A05 | RF Safety, EMC & Interference | RF exposure education, RFI/EMC diagnosis, grounding and risk-aware troubleshooting; calibrated assumptions, no certification by chatbot. | Exposure input worksheet, interference symptom tree, EMC checklist |

### B. Engineering, equipment and technical support

| ID | Capability | Scope and intended outputs | Interactive candidates |
|---|---|---|---|
| B06 | Equipment Support & Manuals Intelligence | Manufacturer/model identification, official manuals, page-cited setup guidance, firmware compatibility, troubleshooting trees and approved file uploads. | Manual viewer with citations, settings wizard, annotated connector diagram |
| B07 | RF Engineering & Calculations | Units, dB/dBm, link budgets, noise figure, Friis/path loss, ERP/EIRP, sensitivity and uncertainty checks. | Interactive link budget, power/units workbench, waterfall-style noise budget |
| B08 | Antennas & Transmission Lines | Dipoles, Yagis, verticals, loops, impedance, baluns, feedlines, attenuation and NEC-compatible modeling as future extension. | Smith chart, SWR curve, coax-loss graph, antenna geometry |
| B09 | Radio Electronics & Circuits | Filters, RF stages, oscillators, amplifiers, matching and safe component-level educational design. | Filter response plot, L/C matching explorer, circuit parameter panel |
| B10 | Test Equipment & Diagnostics | NanoVNA/VNA, spectrum analyzer, oscilloscope and RF meter workflows; interpretation of uploaded measurement files. | S-parameter plot, measurement comparator, calibration checklist |
| B11 | Station Control & Integration | CAT rig status, logging integration, audio/PTT architecture, rotors, external devices; optional **read-only** bridge first. | Signal-path diagram, rig status dashboard, compatibility matrix |
| B12 | Power Systems & Infrastructure | LiFePO4/lead-acid capacity, solar, UPS, load estimates, portable and permanent station resilience. | Runtime estimator, load budget, battery state scenario |
| B13 | SDR & Digital Signal Processing | SDR/IQ concepts, FFT/waterfall, filtering, sampling, spectrogram diagnostics and lawful signal observation. | Spectrum/waterfall viewer, filter response, IQ signal explorer |

### C. Operations, networks and intelligence

| ID | Capability | Scope and intended outputs | Interactive candidates |
|---|---|---|---|
| C14 | Operating & DX Intelligence | HF/VHF operating, callsign/Q-code guidance, split, DX planning and etiquette; no invented live DX spot. | DX cluster filter, operator practice wizard |
| C15 | Propagation & Space Weather | NOAA indices, PSK reception reports where permitted, solar/geomagnetic observations, modeled HF paths with uncertainty. | Propagation heatmap, solar index timeline, path confidence bands |
| C16 | Digital Modes & Computer Radio | FT8/FT4, RTTY, PSK, JS8Call, SSTV and software troubleshooting with documented version-aware settings. | Audio/CAT diagnostic flow, mode configuration comparison |
| C17 | Packet, APRS, Winlink & Mesh | AX.25/TNC, APRS objects and packets, digipeaters, iGates, Winlink readiness and legal mesh deployment. | Packet-route map, digipeater topology, message queue trainer |
| C18 | Repeaters & Digital Voice | FM and DMR/D-STAR/C4FM basics, offsets, tones, codeplugs and gateway/hotspot interoperability. | Repeater coverage explorer, memory builder, network topology |
| C19 | Satellites, EME & Weak Signal | Amateur satellite information, pass prediction, Doppler concept, EME/meteor scatter operation; time/location-sensitive results require checked ephemerides. | Satellite pass timeline, Doppler curve, antenna pointing aid |
| C20 | Logbook, QSL & Awards | ADIF validation/import/export, privacy-preserving QSO stats, award progress, DXCC tracking and confirmations when authorized. | Logbook analytics, award matrix, confirmation dashboard |
| C21 | Contests, Portable & Outdoor Radio | Contest planning, Field Day, POTA/SOTA/IOTA subject to provider terms, portable deployment and ARDF. | Contest score board, pack-weight/power planner, activation checklist |

### D. Education, community and innovation

| ID | Capability | Scope and intended outputs | Interactive candidates |
|---|---|---|---|
| D22 | Amateur Radio Academy & CW | License learning, quizzes, adaptive explanations, practice QSOs and Morse training. | CW trainer, interactive quiz, progress matrix |
| D23 | Maker, Research & Software Development | Arduino/ESP32/Raspberry Pi, DIY RF, station software, open-source tooling and repeatable project guides. | BOM estimator, wiring view, experiment notebook |
| D24 | Clubs, Community & Mentoring | Clubs, workshops, onboarding, mentoring, resource indexes, non-sensitive volunteer coordination and educational events. | Event/calendar view, club equipment inventory, mentor curriculum |

**Catalog invariant:** 24 domains remain identifiers for product mapping; tools, UI components and APIs are selected by shared reusable functionality. Domains can grow by subcapabilities without spawning a service per domain.

## 4. Enhanced RF Engineering design

B07–B13 and A05 together form the **Engineering Suite**. It must cover:
- Electrical/RF mathematics: logarithmic levels, impedance, resonant frequency, Q, VSWR, return loss, mismatch loss, sensitivity, dynamic range, noise temperature, path loss and uncertainty.
- Antenna engineering: dipole, vertical, loop, Yagi, long wire, portable antenna geometries; ground effects, polarization, arrays, matching and feedlines.
- RF chains: filters, preamplifiers, attenuators, amplifiers, protection, harmonics and intermodulation.
- Test lab: calibration, instrument limitations, S11/S21, VNA CSV or Touchstone import (future), measurement provenance.
- Station infrastructure: earthing/grounding education, lightning precautions, AC/DC power, connector compatibility and safe maintenance.
- SDR/DSP: FFT resolution, sample rate, aliasing, filters and visual signal inspection.
- Diagnosing real rigs: model-specific manual retrieval, firmware/version constraints and step-by-step non-destructive troubleshooting.

**Required correctness behavior:** calculators accept explicit units, surface assumptions, return bounded errors, support validation fixtures and do not silently convert antenna gain dBd to dBi or confuse ERP with EIRP.

## 5. Cross-domain interactive experiences

The UI layer supports inline widgets and optional larger workspaces, whenever they materially improve decisions or comprehension. Proposed reusable patterns:
- **Model:** charts, Smith charts, link-budget breakdown, propagation plots, satellite tracks.
- **Explore:** frequency explorer, equipment comparison, band/permission overlays, repeater locator.
- **Diagnose:** manual-linked stepper, radio signal-path wizard, annotated spectrum/measurement viewer.
- **Plan:** emergency-network tabletop, operating window planner, portable power estimator.
- **Learn:** CW practice, adaptive quiz, filter/antenna parameter exploration.
- **Audit:** QSO stats and awards dashboard, source change history, checklists.

Every visualization requires a truth source, defined inputs/units, keyboard/accessibility alternatives, a static/printable equivalent when feasible and explicit behavior for missing/stale data. A widget must not imply compliance or official emergency authority.

## 6. Shared architecture and core contracts

**Layering:** ChatGPT host ↔ QRVAI Skills and MCP Tools/MCP Apps ↔ typed domain services ↔ authoritative sources, per-user storage and optional future local station bridge.

Shared services: (i) jurisdictional rules and source registry; (ii) structured manual/RAG index with citation offsets and licensing flags; (iii) deterministic RF maths; (iv) propagation/time/geospatial; (v) station and operator profile; (vi) provider adapters and cache; (vii) audit and permission policy.

**Canonical response envelope for sourced data:** value, units, source_url/source_id, source_version, effective_at, checked_at, observed_at (when dynamic), jurisdiction, confidence/quality_status, warnings, and cache_freshness. Not every field is populated for every result; absent required context blocks a positive compliance decision.

**Action grades:** read-only informational; local simulation; user-data write requiring consent; hardware state change requiring separate future authorization; transmit/PTT **out of scope**.

**Personal data:** callsign may identify the operator. Store personal station profiles and logs only with clear opt-in, access control, retention/deletion policy and no unauthorized sharing.

## 7. Safety, provenance and third-party licenses

- Distinguish **binding law** from **voluntary band plans** and observed activity.
- Rules engine is deny-by-uncertainty: missing license, location, date, mode or official regulation leads to "not established", never "legal to transmit".
- Emergency capability facilitates training/preparedness and coordination solely under appropriate authority; no fictional agency identity, automatic warnings, autonomous activation or PTT.
- Hardware bridge is opt-in, sandboxed, authenticated, least privilege, read-only in first implementation.
- Uploaded manuals and API contents are treated as untrusted; they never override safety/policy or tool instructions.
- Manufacturer manuals, database exports and APIs have separate redistribution/commercial-use constraints: link or user-supplied material until permission is established.
- Propagation models are probabilistic; real-time data must include timestamps and expiry; unavailable live data cannot be fabricated.
- Inspect data providers for rate limits, subscriptions, restrictions, compatibility and attribution before wiring adapters.

## 8. Nonfunctional requirements / engineering quality

1. Greek and English terminology normalization; preserve original units and callsigns.
2. Tool schemas documented and versioned, with machine-readable validation.
3. Model numerical outputs reproducible from independently tested functions.
4. Sources timestamped, reviewed and automatically flagged when superseded/stale.
5. UI responsive, accessible, and with text/table fallback.
6. Operationally safe degradation on provider outage and unsupported host features.
7. Minimum permissions, no secret-in-repository and auditable sensitive actions.
8. Small independent releases; no launch claim without integration, UX and security verification.

## 9. Proposed acceptance gates (design-level, not test results)

- Regulatory fixtures: boundary frequencies, unsupported jurisdiction, license mismatch, revoked/superseded text, conflicting IARU/national recommendation.
- RF golden cases: W↔dBm, dBi/dBd, SWR/return loss, coax attenuation, link budget with fixed tolerances and invalid-unit inputs.
- Manuals: correct manufacturer/model/version, page traceability, retrieval refusal when rights missing, prompt-injection containment.
- Data: NOAA or other provider stale/outage/429/auth responses, cached data label, no false real-time claims.
- Logs: ADIF parser round-trip, malformed records, UTF-8 and user-data separation.
- Emergency: simulation prominently labeled, no unauthorized frequency, no automatic transmission or dispatch.
- Interactive: static fallback, accessibility, keyboard usage, unit validation, cross-host compatibility assessment.
- Station bridge (later): no PTT invocation; read-only permission tests and disconnected device behavior.

## 10. Scope and review boundaries

**Now:** Record capability catalog, tool candidate list, interactive-tool catalog, source registry and staged roadmap.  
**Next after spec approval:** Create one small implementation plan for the first independent vertical slice, not a giant all-domains plan.  
**Not now:** Write application code; launch an MCP server; create/publish the plugin; connect user radios; scrape copyrighted manuals; send live emergency messages; deploy.

## 11. Questions for review (not blockers to this proposal)

- Primary early users: beginner/general amateurs, technical station operators, volunteer communications teams, or equal coverage?
- First shippable vertical slice: RF interactive calculator + manual support, or frequency compliance + source registry?
- Intended licensing/distribution model (personal/private, open-source, community, commercial) before third-party data agreements.

## 12. Evidence and linked plans

- [Interactive Tools Catalog](../../architecture/interactive-tools-catalog.md)
- [Phased Roadmap](../../roadmap/2026-10-14-qrvai-master-roadmap.md)
- [Research Source Registry](../../research/source-registry.md)
- [Architecture Decision](../../architecture/ADR-0001-hybrid-mcp.md)

As-of review date: 2026-10-14. Source links and legal status must be rechecked at implementation and release time.
