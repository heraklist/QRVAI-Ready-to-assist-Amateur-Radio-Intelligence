# SS-C19-1 — Satellite Metadata

**Owner:** SK-C19
**Responsibility:** retrieve amateur spacecraft frequency/mode data and date
**Required input:** Spacecraft name/catalog ID, public frequency/mode candidate, documented UTC reference epoch/version, band entitlement and received metadata source.
**Procedure:** List only source-provided amateur satellite operating metadata with version/last-verified date and distinguish candidate uplink/downlink frequencies from permissions. Six-digit catalog IDs cannot be inserted blindly in legacy 5-digit TLE; future OMM-compatible parsers required and not present.
**Output:** Source-labelled orbital metadata worksheet with UNKNOWN frequency/mode when lacking verified current source; no live station state.
**Error/stop:** No guessed transponder frequencies, stale TLE accepted as current, official permission claim, TX setup or tracking.

**Status:** orbit_computed:false, sample-only telemetry USER_SUPPLIED_ELEVATION_SAMPLES; OMM/SGP4 NOT_IMPLEMENTED.
