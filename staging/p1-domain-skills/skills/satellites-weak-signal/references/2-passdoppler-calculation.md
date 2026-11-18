# SS-C19-2 — Pass/Doppler Calculation

**Owner:** SK-C19
**Responsibility:** calculate AOS/LOS/doppler using current appropriate orbit model
**Required input:** Observer coordinates (privacy-minimized), UTC time scale and fresh orbital GP/OMM+SGP4 model version for actual forecast; alternatively 1–32 supplied elevation samples.
**Procedure:** With current source tool summarize only which supplied elevation samples are >0° plus peak and sample window; orbit_computed:false. Explain SGP4/AOS/LOS and radial Doppler conceptually but do not invent a pass or infer Doppler without velocities/ephemeris. Document OMM need for six-digit catalog IDs.
**Output:** Sample-only horizon summary, NOT_IMPLEMENTED for genuine orbital Doppler and actual predicted pass windows, clear source age.
**Error/stop:** No computed Doppler, No SGP4 or live sky tracking, stale-element scheduling, hidden CAT/PTT/TX or motor control.

**Status:** orbit_computed:false, sample-only telemetry USER_SUPPLIED_ELEVATION_SAMPLES; OMM/SGP4 NOT_IMPLEMENTED.
