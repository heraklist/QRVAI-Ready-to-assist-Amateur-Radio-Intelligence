# SS-C15-2 — Propagation Scenario

**Owner:** SK-C15
**Responsibility:** run bounded path prediction with explicit model assumptions
**Required input:** Two locations/coarse grids, frequency >0 MHz, Earth geometry context, season, UTC time and named ionospheric model if asking path open.
**Procedure:** Compute great-circle/geometric FSPL only via propagation_path and label real_world_prediction:false. Distinguish it from ionospheric F2, sporadic-E, ground wave, HF absorption and VOACAP path prediction, none executed. If user asks for a guaranteed real opening, INDETERMINATE.
**Output:** Distance+theoretical FSPL example with assumptions, explicit no actual HF path forecast and missing model/measurement inputs.
**Error/stop:** No guaranteed path opening, fake ionospheric prediction, claimed received signal, invented model engine or private QTH leakage.

**Provenance:** USER_SUPPLIED_UNVERIFIED for observed indices, IDEAL_MODEL for FSPL, live_feed:false, real_world_prediction:false.
