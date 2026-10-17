# SS-B10-3 — Measurement Reconciliation

**Owner:** SK-B10
**Responsibility:** compare expected and observed metrics with uncertainty
**Required input:** Expected ideal response and actual user-provided (Hz,dB) points, declared Z0/calibration state or missing values.
**Procedure:** Compute deltas on shared units/reference only and name measurement repeatability, calibration/fixture uncertainty, instrument dynamic range and data clipping as distinct unquantified limits. For the supplied three-point example -10/-20/-5 dB, dip is 145 MHz; no S21 measurement guaranteed.
**Output:** Comparison table of predicted vs user-reported magnitudes, error bands only when justified, and explicit SOURCE_UNVERIFIED/INDETERMINATE for calibration.
**Error/stop:** No fabricated precision, phase, independent measurement confirmation, analyzer overload guidance or permission to transmit.

**Provenance:** USER_SUPPLIED_UNVERIFIED. No calibrated VNA, live measurements or device access. Touchstone 2.1 reference is not a file parser.
