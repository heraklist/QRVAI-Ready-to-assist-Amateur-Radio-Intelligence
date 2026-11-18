# SS-C15-1 — Space Weather Reading

**Owner:** SK-C15
**Responsibility:** retrieve timestamped solar/geomagnetic measurements and interpretation
**Required input:** User-supplied Kp value 0–9, UTC observed_at and explicit source_label; user question and provenance status.
**Procedure:** Use spaceweather_indices on supplied values only, preserve live_feed:false, compute elapsed observation age only with known current/reference UTC and classify stale/unknown as USER_SUPPLIED_UNVERIFIED. Explain what elevated geomagnetic activity can correlate with qualitatively, never derive live NOAA data.
**Output:** Dated Kp reading and interpretive caveat; if real-time NOAA requested, state NOT_IMPLEMENTED and offer independent primary-source check.
**Error/stop:** No live NOAA assertion, invented F10.7/SFI, ISO time-zone reinterpretation, source spoofing, or legally authorized TX.

**Provenance:** USER_SUPPLIED_UNVERIFIED for observed indices, IDEAL_MODEL for FSPL, live_feed:false, real_world_prediction:false.
