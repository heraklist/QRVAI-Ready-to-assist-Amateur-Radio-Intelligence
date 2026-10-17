# SS-C17-2 — APRS/Location Ethics

**Owner:** SK-C17
**Responsibility:** interpret packet paths and privacy limits
**Required input:** Anonymized user-supplied APRS path, message metadata without payload, consent and regional privacy/third-party traffic sources.
**Procedure:** Describe APRS position/messaging field semantics without disclosing individual coordinates, callsign-to-location linkage, exact home grid or raw messages; redact third-party content. Explain that an APRS-IS feed would require separate opt-in, policies and integration, currently NOT_IMPLEMENTED.
**Output:** Privacy-filtered path narrative, explicit absence of live APRS-IS and legal approval, safe example aliases.
**Error/stop:** No APRS-IS write, precise private location, hidden tracking, public message replay, or scraped operator history.

**Status:** Offline simulated:true path planning, USER_SUPPLIED_UNVERIFIED; no APRS-IS, Winlink or mesh connection.
