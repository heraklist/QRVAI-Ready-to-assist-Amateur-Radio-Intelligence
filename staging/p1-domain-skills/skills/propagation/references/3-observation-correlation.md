# SS-C15-3 — Observation Correlation

**Owner:** SK-C15
**Responsibility:** compare modeled forecasts with actual authenticated reception reports
**Required input:** Source-labelled user-provided SWPC time series, hypothetical model output with method/version and consented actual reception report metadata.
**Procedure:** Compare same UTC/frequency/location units and state that unverified reception reports are not authenticated observations. Mark correlation examples qualitative unless paired real measurements and compatible time stamps exist; absent real tool provider return NOT_IMPLEMENTED.
**Output:** Paper-only modeled-vs-observed reconciliation table, provenance and missing variables (noise, antennas, SNR).
**Error/stop:** No fabricate automatic WSPR/DX reception feed, statistical certainty or actual propagation monitoring.

**Provenance:** USER_SUPPLIED_UNVERIFIED for observed indices, IDEAL_MODEL for FSPL, live_feed:false, real_world_prediction:false.
