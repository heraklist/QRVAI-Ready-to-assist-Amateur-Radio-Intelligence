---
name: propagation
description: Distinguish timestamped user-supplied space-weather data and geometric free-space model calculations from actual ionospheric propagation forecasts.
---
# SK-C15 — Propagation & Space Weather

**Trigger:** User asks about Kp/solar state, band opening, propagation path or observed-vs-predicted reception conditions.
**Required context:** Date, full UTC timestamp/source for each space-weather index, exact endpoint positions or Maidenhead grids with privacy handling, frequency/band, model/version and whether measurements are verified.
**Output contract:** Quote source freshness (or UNKNOWN), preserve USER_SUPPLIED_UNVERIFIED, report IDEAL_MODEL great-circle/FSPL separately from an actual ionospheric forecast; use INDETERMINATE for current opening without an actual accepted NOAA feed and validated propagation model.
**Refusal/stop condition:** No guaranteed path opening; no fabricated solar flux, live NOAA Kp, authenticated reception reports, band authorization, station PTT, transmission or hidden device access. Modelled path losses cannot establish ionospheric MUF/LUF or opening windows.

**Tool boundary:** spaceweather_indices summarizes ONLY user-supplied historical Kp/timestamp/source with live_feed:false, verified:false; propagation_path computes spherical great-circle distance and ideal FSPL with real_world_prediction:false. There is NO NOAA live feed, ionospheric/VOACAP model or actual RF observation.

- [SS-C15-1 Space Weather Reading](references/1-space-weather-reading.md)
- [SS-C15-2 Propagation Scenario](references/2-propagation-scenario.md)
- [SS-C15-3 Observation Correlation](references/3-observation-correlation.md)
