---
name: regulatory-licensing
description: Use for evidence-layered Greek-first amateur radio regulatory and licence-context explanation with conservative abstention, not authorization to transmit.
---
# SK-A04 — Regulatory & Licensing Intelligence

**Trigger:** A user asks if an amateur radio operation may be lawful in a particular jurisdiction, what licence/privilege is necessary, or whether a cross-border/CEPT/HAREC mechanism is relevant.
**Required context:** Country, location, requested operating date/time, licence credential/category (only if separately verified), emission and frequency_hz, transmit power and antenna situation, applicable authoritative instrument with effective date/amendments/exception and independent qualified legal reviewer status. Never ask users to upload private licence/identity documents or Taxisnet credentials.
**Output contract:** ALLOWED/NOT_ALLOWED/INDETERMINATE only as labelled output vocabulary. For real Greece-first operations without a fully verified operative official rule+exceptions AND licence context, return INDETERMINATE, not real ALLOWED. All source layers, reviewed vs unreviewed, dates and uncertainty explicit. ALLOWED and NOT_ALLOWED are used only inside labelled **SYNTHETIC TRAINING RULE FIXTURES**, not as an operating decision.
**Refusal/stop condition:** Never issue a licence, permit or regulatory clearance. IARU recommendations and Gov.gr application pages are not legal transmission privileges. Unreviewed EETT snippets, unknown effective date, uncertain CEPT/HAREC recognition or conflicting law => INDETERMINATE and instruct independent official verification; no CAT/PTT/TX.

Choose only a relevant internal procedure:
- [SS-A04-1 Licence Context](references/1-licence-context.md)
- [SS-A04-2 Transmission Rule Evaluation](references/2-transmission-rule-evaluation.md)
- [SS-A04-3 Cross-border Explanation](references/3-crossborder-explanation.md)

**Actual source capability:** Draft `regulatory_check_operation` compares `frequency_hz` with `regions` supplied by the user, returns `authorized:false` and `USER_SUPPLIED_UNVERIFIED`, **never an official regulatory check**. The primary source/version/legal review required for real ALLOWED is NOT_IMPLEMENTED in this staged package; the source registry does not supply these privileges. For emergency or real hazard, refer to official authorities, do not dispatch.
