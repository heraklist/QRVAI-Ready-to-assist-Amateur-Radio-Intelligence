# SS-C18-3 — Directory Discovery

**Owner:** SK-C18
**Responsibility:** filter actual verified repeater metadata and freshness
**Required input:** User-supplied ≤24 repeater rows with id/frequency/location-label and known directory last-verified timestamps.
**Procedure:** Filter provided entries only with spectrum_find_repeaters and match candidate frequency range; label live_status_known:false, source/unverified revision. Recommend how an operator can check official source independently, and note listings may be stale.
**Output:** Candidate repeater matches with freshness/permission caveats and unknown tone, actual availability and location accuracy.
**Error/stop:** No third-party directory API claim, live listening/coverage status, fabricated repeater, sensitive location disclosure or authorization.

**Source status:** USER_SUPPLIED_UNVERIFIED, verified:false and live_status_known:false; no radio control.
