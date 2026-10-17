# SS-C20-1 — ADIF Integrity

**Owner:** SK-C20
**Responsibility:** parse and round-trip version-aware ADIF with provenance
**Required input:** Rights-permitted anonymized ≤4096-character ADIF example, claimed ADIF v3.1.8 revision, encoding, record delimiters and requirements for real round-trip if requested.
**Procedure:** Use adif_validate only for bounded angle-length tag/EOR detection; label saved:false, NOT_IMPLEMENTED for full ADI/ADX, UTF-8 byte-length, enum validation and standards-complete round-trip. Reject plausible private operator QSO log persistence/upload requests.
**Output:** Record/tag preview and known gaps versus current ADIF 3.1.8 official specification; no claim of complete validation.
**Error/stop:** No LoTW upload, silent log rewrite, raw operator call echo, opaque credential access or guaranteed ADIF 3.1.8 certification.

**Status:** USER_SUPPLIED_UNVERIFIED and saved:false; no official QSL/award verification or file round-trip.
