---
name: satellites-weak-signal
description: Offline weak-signal and satellite metadata education; can summarize only supplied elevation samples, never compute orbit prediction or Doppler.
---
# SK-C19 — Satellites & Weak Signal

**Trigger:** User asks for satellite path/elevation and Doppler concepts, possible amateur spacecraft modes, weak-signal EME/meteor scatter or an educational horizon sample summary.
**Required context:** Observer coarse location/time zone, supplied samples with UTC timestamps (max 32), spacecraft/object identity and GP/OMM epoch/version with provenance if discussing future computation, device capabilities and legal mode/frequency permissions.
**Output contract:** satellite_pass reports ONLY sampled elevations above horizon with orbit_computed:false; it cannot generate actual AOS/LOS from a propagator. No computed Doppler, precise future pass or station pointing derived from stale user ephemerides. Source edition, age, time scale and uncertainty required for each external orbital claim.
**Refusal/stop condition:** No computed Doppler, No SGP4 engine, no invented TLE/OMM, guaranteed visibility, operational pass, live satellite network, automated antenna tracking, CAT/PTT/TX or frequency adjustments. Old five-digit TLE cannot encode all six-digit catalog IDs; OMM is a research requirement for a future parser, not present implementation.

**Tool boundary:** satellite_pass consumes 1–32 user-supplied observed_at/elevation_deg records, outputs above-horizon sample count, max elevation and input window; always orbit_computed:false and USER_SUPPLIED_ELEVATION_SAMPLES. OMM/SGP4/TLE ingest, Doppler physics runtime, ephemeris download and real satellite AOS/LOS all NOT_IMPLEMENTED.

- [SS-C19-1 Satellite Metadata](references/1-satellite-metadata.md)
- [SS-C19-2 Pass/Doppler Calculation](references/2-passdoppler-calculation.md)
- [SS-C19-3 Weak-signal Workflow](references/3-weaksignal-workflow.md)
