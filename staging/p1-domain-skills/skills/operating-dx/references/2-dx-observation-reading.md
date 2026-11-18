# SS-C14-2 — DX Observation Reading

**Owner:** SK-C14
**Responsibility:** distinguish verified spot data from predictions
**Required input:** User-supplied ≤24 reception records with band, ID, station/report and observational UTC/source timestamp if provided.
**Procedure:** Filter supplied records by band via dx_reception_reports; preserve input provenance USER_SUPPLIED_UNVERIFIED and provider_authenticated:false. Treat a five-day-old record as historical, and if time or source absent say present station activity INDETERMINATE. Compare reports, not fabricated live network spots.
**Output:** Scoped filtered observation list, explicit historical/unverified source note and conditions needed to check an actual DX cluster independently.
**Error/stop:** No fabricated real-time DX spots, confirmed communication, callsign-owner lookup, provider authentication claim or third-party details publication.

**Provenance:** USER_SUPPLIED_UNVERIFIED for observations; no live DX cluster, hidden PTT or CAT command.
