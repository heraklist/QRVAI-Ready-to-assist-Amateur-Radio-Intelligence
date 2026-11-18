---
name: logbook-awards
description: Private, nonpersistent inspection of small supplied ADIF snippets, hypothetical QSO statistics and unverified award progress; no full ADIF certification or QSL service integration.
---
# SK-C20 — Logbook, QSL & Awards

**Trigger:** User requests checking a short synthetic ADIF excerpt, understanding log quality, or evaluating user-supplied award/confirmation counts.
**Required context:** Explicit permission to inspect input, redacted QSO/callsign data, claimed ADIF edition, input size ≤4096 characters, confirmation provenance, named award rule edition and privacy expectations.
**Output contract:** adif_validate provides bounded tag/EOR preview only, saved:false, NOT_IMPLEMENTED for full ADIF 3.1.8 ADI/ADX round-trip/byte-count semantics; log_award_progress compares ≤100 supplied entity labels but returns verified:false and award_certified:false. Report errors/status with missing authority and no official QSL claim.
**Refusal/stop condition:** No LoTW upload, eQSL logins, automatic QSL confirmations, changes to user records, hidden storage of private call logs, silent ADIF mutation, invented award eligibility or actual award certification. Real QSO/callsign data excluded from QA corpus; do not echo private identifiers unnecessarily.

**Tool boundary:** adif_validate accepts ≤4096-character supplied ADIF string and labels saved:false; this is neither comprehensive ADIF 3.1.8 validator nor parser/serializer. log_award_progress accepts ≤100 supplied target/confirmed entity IDs; overlaps are modelled user input and award_certified:false, not real provider/award rules. External award services and logbook writes NOT_IMPLEMENTED.

- [SS-C20-1 ADIF Integrity](references/1-adif-integrity.md)
- [SS-C20-2 QSO Analytics](references/2-qso-analytics.md)
- [SS-C20-3 Award/QSL Assessment](references/3-awardqsl-assessment.md)
