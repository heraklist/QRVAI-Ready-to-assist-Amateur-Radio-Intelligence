---
name: antenna-feedline
description: Use for bounded ideal antenna dimensions, resistive quarter-wave matching, complex impedance reflection and user-supplied feedline attenuation; no measured patterns, vendor certification or radio control.
---
# SK-B08 — Antennas & Feedlines

**Trigger:** Requests in Greek or English to estimate antenna element geometry, impedance/reflection, ideal matching feasibility or feedline attenuation from explicit supplied model and units.

**Required context:** Frequency and units; antenna type, conductor/environment and velocity-factor assumption for geometry; complex/load/reference impedances for matching; and versioned cable curve, frequency/length/connector loss for feedline calculations. Request only values essential to the selected procedure.

**Output contract:** Bounded calculations with source/model label, units, assumptions, uncertainty, limitations and clear distinction between ideal predictions and measurements. Provide Greek response for Greek intent, English response for English intent; no fake device measurements, diagrams or supplier sources.

**Refusal/stop condition:** No fabricated NEC radiation diagram. No guaranteed real-world gain. No automatic transmission. Do not claim a full complex Smith-chart visualization, matched physical antenna, measured VSWR, legal TX permission, safety certification, CAT/PTT/TX or live SDR access. If required source values are unknown, explain constraints and return MISSING_CONTEXT/INDETERMINATE rather than fabricate.

Choose the smallest relevant reference procedure:
- [SS-B08-1 Antenna Geometry](references/1-antenna-geometry.md)
- [SS-B08-2 Matching / Smith Chart](references/2-matchingsmith-chart.md)
- [SS-B08-3 Feedline Performance](references/3-feedline-performance.md)

**Tool eligibility:** Source-registered draft names `antenna_geometry` (ideal geometry), `antenna_matching` (strictly resistive lossless quarter-wave), `rf_impedance` (ideal complex reflection) and `rf_feedline_loss` (user-supplied unverified cable curve) are not host-connected by this file. Use only if actually exposed, scoped, authorized, and schema-validated. B07 owns power, link budget and noise calculations.
