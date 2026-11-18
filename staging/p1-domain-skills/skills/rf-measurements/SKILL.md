---
name: rf-measurements
description: Bounded reading of user-provided RF magnitude traces and cautious educational VNA/test-equipment guidance with explicit unknown calibration and format limits.
---
# SK-B10 — Test Equipment & Diagnostics

**Trigger:** Users ask to interpret known RF instrument screenshots, magnitude samples, analyzer settings or a hypothetical VNA/S-parameter example.
**Required context:** Instrument model, calibration certificate/state, test-setup reference impedance, source power/attenuation, frequency scale, trace units, numeric points or permissioned excerpt; do not infer missing values.
**Output contract:** For supported samples, report extrema and deepest dip from user-supplied frequency/dB pairs with source USER_SUPPLIED_UNVERIFIED. Distinguish explained Touchstone format and complex S11/S21 from actually parsed data, explicitly report NOT_IMPLEMENTED for genuine Touchstone ingestion. Missing calibration means no certified accuracy.
**Refusal/stop condition:** No calibrated VNA claim from unverified points. No live measurements, probe control, high-power RF testing or energized scope/mains instructions. Do not invent reference impedance, phase, 2-port S21, power-handling limits or official measurement certification. No CAT/PTT/TX.

**Tool boundary:** `measurements_inspect_trace` accepts only 1–32 user-supplied {frequency_hz,magnitude_db} points; returns minimum_db,maximum_db,deepest_dip_frequency_hz and instrument_connected:false. It is NOT_IMPLEMENTED for Touchstone file import, complex S11/S21, phase, port mapping or real calibration. The IBIS Touchstone 2.1 specification is explanatory context, not an integrated parser.

- [SS-B10-1 VNA Trace Interpretation](references/1-vna-trace-interpretation.md)
- [SS-B10-2 Spectrum/Test Setup](references/2-spectrumtest-setup.md)
- [SS-B10-3 Measurement Reconciliation](references/3-measurement-reconciliation.md)
