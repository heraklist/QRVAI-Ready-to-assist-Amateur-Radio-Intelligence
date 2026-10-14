# QRVAI Interactive Tools Catalog v0.3

**Date:** 2026-10-14 · **Status:** Proposed designs for review; **zero implemented tools**.

## Why interactive tools?

Use UI when a user must vary inputs, compare scenarios, inspect evidence, understand a spatial/temporal result, inspect a signal or complete a repeatable operational procedure. A narrative answer remains available if the UI host cannot render the widget. Each UI consumes typed, validated tools/services; the model does not calculate critical numbers by improvisation.

### Widget decision criteria

**High value** = common task + numerical/spatial/temporal exploration + clear trusted data + measurable correct answer. **Medium** = useful but data, rights or complexity may delay it. **Research** = expensive, host-dependent or requires sensitive integration. Visual appeal alone is insufficient.

## 1. Engineering, measurements, radio equipment

| ID | Interactive tool | Inputs / outputs | Value | Phase |
|---|---|---|---|---|
| UI-01 | RF Units & Power Workbench | W, dBm, dBW, dBi/dBd, gains and losses → conversions with unit audit | High | P0 |
| UI-02 | Link Budget Explorer | TX power, gain, path loss, feedline, RX sensitivity → margin/waterfall | High | P0 |
| UI-03 | Coax / Feedline Loss Curves | Cable type, frequency, length, connectors → loss versus frequency and delivered power | High | P0 |
| UI-04 | SWR & Return Loss Explorer | Forward/reflected power, Z0, impedance → SWR/return loss; uncertainty notes | High | P0 |
| UI-05 | Smith Chart Matching Lab | Complex impedance, Z0, L/C elements, frequency → impedance locus | High | P1 |
| UI-06 | Dipole/Vertical/Antenna Geometry Lab | Frequency, geometry, installation assumptions → approximate lengths and geometry sketch | High | P1 |
| UI-07 | Antenna Pattern Comparator | Pattern inputs from trusted model or uploaded file → azimuth/elevation comparison | Medium | P2 |
| UI-08 | Filter / RLC Response Studio | R/L/C and topology → frequency response, cutoff, Q | High | P1 |
| UI-09 | VNA S11/S21 Viewer | Uploaded validated Touchstone/CSV → traces, markers, annotations | High | P1 |
| UI-10 | Spectrum / Waterfall Inspection | Authorized sampled waterfall/IQ or image → axes, selections, observation, not unsupported identification | Medium | P2 |
| UI-11 | Station Signal-Path Designer | Radio/interface/PC/PTT/CAT connections → block diagram and compatibility warnings | High | P1 |
| UI-12 | Hardware Setup Wizard | Manufacturer, model, manual version, symptom → documented step-by-step setup | High | P1 |
| UI-13 | Manual Search & Page Viewer | Model, version, official URL / user file → cited sections and relevant settings | High | P1 |
| UI-14 | Portable Power Runtime Planner | Duty cycle, RX/TX watts, battery capacity/chemistry and efficiency → autonomy range | High | P1 |
| UI-15 | RFI / EMC Diagnostic Tree | Interference symptoms, frequency, timing, equipment chain → safe measurement sequence | High | P2 |
| UI-16 | RF Exposure Screening Worksheet | Antenna, power, environment, duty cycle, official local limit → preliminary screen only | Medium | P2 |

## 2. Frequencies, regulations, operations, propagation

| ID | Interactive tool | Inputs / outputs | Value | Phase |
|---|---|---|---|---|
| UI-17 | Band-plan & Frequency Explorer | Country, license, mode, bandwidth, date → layered allocations and recommendations | High | P1 |
| UI-18 | Legal Permission Matrix | National law, license, location, power and frequency → sourced outcome or indeterminate | High | P1 |
| UI-19 | Repeater Finder & Memory Builder | Verified directory, locator, mode/offset/tone → filtered repeaters and memory export | High | P2 |
| UI-20 | Space Weather & Solar Dashboard | Timestamped NOAA metrics → trends, freshness, explanatory overlays | High | P1 |
| UI-21 | HF Propagation Planner | Solar data + path/antenna/date/model → estimated usable windows, uncertainty | High | P2 |
| UI-22 | PSK Reception Map & Trend | Authorized provider query → actual reception observations and density | Medium | P2 |
| UI-23 | Great Circle / Maidenhead Pathfinder | Maidenhead grids or coordinates → distance, azimuth, locator view | High | P1 |
| UI-24 | Satellite Pass & Doppler Tool | Time, QTH, current ephemerides, satellite frequencies → AOS/LOS, Doppler, pointing | Medium | P2 |
| UI-25 | DX Operating Planner | Path, wanted station, band/mode, valid observed feeds → scenario comparison | Medium | P2 |

## 3. Emergency, digital, logbook, learning and community

| ID | Interactive tool | Inputs / outputs | Value | Phase |
|---|---|---|---|---|
| UI-26 | Emergency Station Readiness Board | Training inventory, batteries, antennas, team roles → go/no-go checklist for exercises | High | P2 |
| UI-27 | Emergency Message / Net Trainer | Scenario, NCS role, message form, acknowledgements → simulated traffic log | High | P2 |
| UI-28 | Resilience Topology Scenario | Links, repeaters, batteries, failure injection → conceptual fallback path chart | Medium | P2 |
| UI-29 | APRS / Packet Routing Explorer | Legal, permitted packet metadata → topology, digi/iGate path, timing | Medium | P2 |
| UI-30 | DMR / FM Repeater Programmer | Verified repeater parameters, device profiles → preview/validated channel export | Medium | P2 |
| UI-31 | Digital Mode Setup Troubleshooter | Radio + WSJT-X/FLRig versions, ports, audio route → guided diagnostic flow | High | P1 |
| UI-32 | ADIF Analyzer & Award Heatmap | User-provided log → validation, QSO totals, worked/confirmed gaps | High | P1 |
| UI-33 | Contest Operating Dashboard | User-defined contest and rules + authorized log → progress, duplicates, scoring assumptions | Medium | P2 |
| UI-34 | CW Trainer / Adaptive Quiz | Speed, character groups, practice settings → playback and graded practice | High | P2 |
| UI-35 | DIY Project BOM / Wiring Viewer | BOM, schematic, parts and voltage limits → shopping-independent inventory and connection check | Medium | P3 |
| UI-36 | Club Activities / Asset Overview | Club-authorized calendar and shared equipment inventory → events and availability | Medium | P3 |

## 4. Widget contracts and invariants

Every widget shall specify before build:
- **Problem statement:** who uses it, how often and what decision it improves.
- **Inputs:** types, units, validated ranges, required operating context; no silent defaults for regulatory decisions.
- **Calculation source:** deterministic equation, validated external API, uploaded observation or probabilistic model.
- **Output:** machine-readable result + human explanation + citations + timestamp; reveal stale data.
- **Fallback:** compact textual summary and accessible table; keyboard, screen reader and mobile paths.
- **Errors:** invalid input, no network, provider rate limit, unavailable or restrictive license, unsupported host capabilities.
- **Permissions:** read-only versus explicit user-authorized write; never transmit or change radio state by default.
- **Testing:** numerical golden cases, boundary cases, a11y checks and error-condition snapshot.

Example typed conceptual exchange (not an actual MCP schema):
- RF link-budget input: power_w, tx_gain_dbi, tx_feedline_loss_db, propagation_loss_db, rx_gain_dbi, rx_feedline_loss_db, rx_sensitivity_dbm.
- Output: received_power_dbm, margin_db, assumptions[], formula_revision, warnings[].
- Compliance check: country, license_class, qth, frequency_hz, emission, power_w, at_time, national_rule_revision.
- Compliance output: ALLOWED / NOT_ALLOWED / INDETERMINATE, reason[], authoritative_source[], checked_at.

## 5. Prioritized reusable UX primitives

**First demos (P0/P1):** power converter, link budget, feedline loss graph, SWR plot, interactive manual wizard, frequency/jurisdiction matrix, solar dashboard and ADIF explorer.

**Shared component library:**
1. Unit-aware parameter sliders and number boxes with exact entry.
2. Plot controls: axis units, log scale, comparison overlay, annotation and print/export.
3. Source citation drawer and effective-date badges (not cosmetic accuracy labels).
4. Mobile-friendly stepper with resume/undo and explicit radio-model context.
5. Structured diagram node editor only for simulations; no actuator side effects.
6. Data quality and simulation banner indicating real measurements vs forecasts vs sample data.

## 6. Implementation dependencies (not implementation tasks)

- UI-01–04 depend on RF calculation core and numerical golden tests, **not** external providers.
- UI-12–13 depend on licensed manual retrieval and model/version disambiguation.
- UI-17–18 depend on versioned authoritative national rules; a blank ruleset yields INDETERMINATE.
- UI-20–22 depend on rate-limited, timestamped provider adapters, independent caches and clear outages.
- UI-24 requires verified ephemerides and QTH; stale orbital data invalidate pass precision.
- UI-26–28 require explicit simulation mode, training labels, no impersonation of an authority.
- UI-32 requires consent-bound ADIF imports and no accidental leakage of call/QTH/QSO metadata.

## 7. Success metrics for UI prioritization

Track task-completion time, corrected versus uncorrected invalid parameters, traceable outputs, accessibility, crash-free rendering, latency, percentage of fallback use and user-rated usefulness. A visualization is accepted only if it materially outperforms the corresponding plain-language workflow.

**Implementation/release status:** Nothing in this catalog has been implemented or deployed. Review the master design first, then plan one vertical slice.
