# QRVAI P1.2 — Family A Source-Authority Survey (design input only)

**Checked on:** 2026-10-17. **Status:** Public authority candidate/index survey, NOT a consolidated legal memorandum, rule-engine dataset, active RF safety standard, deployment clearance or authorization to transmit. **Geography:** Greece-first, cross-border only with separately verified jurisdictions. **Change control:** before using an assertion, check the primary instrument, modifications, effective date, country, licence class and exception; record the reviewer's identity and check timestamp. These are source *entrypoints* for later research, not embedded RF privileges.

## Candidate primary sources and their restricted roles

| Candidate | Public source and observed metadata | Appropriate Family A use | What this review DOES NOT establish |
|---|---|---|---|
| Greece national frequency allocation | [EETT entry, EKΚΖΣ approval 24549 ΕΞ 2025](https://www.eett.gr/nomiko-plaisio/egkrisi-ethnikou-kanonismou-katanomis-zonon-sychnotiton-ekkzs/), listed 28 July 2025, FEK 4230/Β/04-08-2025 | A03: **candidate** binding allocation instrument, subject to document/annex/footnotes + amendment/effective-date verification | That any listed allocation by itself permits a particular amateur to operate |
| Greece regulatory updates | [EETT radio-spectrum legal index](https://www.eett.gr/parochoi/fasma-radiosychnotiton/nomothetiko-kanonistiko-plaisio/?_sft_plaisio_cat=fasma-radiosychnotiton), which lists 2026 entries as well as 2025 EKΚΖΣ | A03/A04: discover changes and verify relevance; compare authoritative publications and exact FEK revision | That every 2026 regulation shown changes amateur operating privileges or that the index is a consolidated operative text |
| Greece licence administration | [Gov.gr: issue amateur-radio licence](https://www.gov.gr/ipiresies/polites-kai-kathemerinoteta/telepikoinonies/ekdose-adeias-radioerasitekhne), page lists July 13 2026 update | A04: example of Greek administrative procedure and credential classes; check current formal rules | A licence has been issued; that a user's claimed credential is verified; concrete permitted bands/power/emissions |
| Greece foreign-licence procedure | [Gov.gr: foreign licence correspondence (SV0)](https://www.gov.gr/el/services/1001879/ekdoses-adeias-radioerasitekhne-se-antistoikhia-me-adeia-exoterikou-sv0), page lists September 29 2026 update | A04: candidate domestic context for reciprocal licensing, pending validation of all conditions and treaty status | Automatic CEPT portability or that any visitor can transmit without a competent authority's determination |
| Region 1 voluntary recommendations | [IARU Region 1 band-plan landing page](https://www.iaru-r1.org/on-the-air/band-plans/) | A03: distinguish *recommended use* from national legal privileges, edition/date and country overlays | Statutory authority, licence issuance or binding Greek emission/power privileges |
| Disaster-radio training | [ITU-R Recommendation M.1042-4 (02/2026), in force](https://www.itu.int/rec/R-REC-M.1042/en), current recommendation listed approved in 2026 | A01/A02: technical and preparedness context for *tabletop simulations and training only* | Dispatch permission, official activation, emergency precedence, third-party traffic privileges in Greece |
| Greek Civil Protection exercise approach | [Ministry/GGPP release on exercise planning](https://civilprotection.gov.gr/deltia-tupou/kateythyntiries-odigies-gia-shediasmo-diexagogi-askiseon-politikis-prostasias-apo-tin), 25 January 2020 | A01/A02: source candidate for planning/review and training governance | A current municipal incident procedure, official tasking or permission to represent an emergency agency |

**A05 RF exposure:** No official locally applicable power-density threshold, methodology, exception, frequency range or certified limit has been independently verified in this survey. As a consequence, P1.2 must **not** invent or embed an authoritative Greek RF exposure limit, declare compliance/safety, or automatically use a foreign threshold. A05 may state *ideal flux arithmetic only if* the user provides a labelled reference and full modeling assumptions; `rf_exposure_screen` always has `compliance_established=false`.

## Source-precedence data model to test before any operational lookup

The stage is **read-only Markdown**. Define the desired evidence ledger/fixture interface for future authenticated provider adapters, but do not implement an external fetcher or legal authorization engine here.

Each decision-support record should carry:

- `source_id`, `canonical_url`, `issuer`, `kind` = `BINDING_INSTRUMENT` / `ADMINISTRATIVE_GUIDANCE` / `TECHNICAL_RECOMMENDATION` / `USER_SUPPLIED_UNVERIFIED` / `TRAINING_TEMPLATE`.
- `jurisdiction` (and region/municipality if material), `instrument_id`, `publication_date`, `effective_from`, `effective_until`/`repealed_at` where determined from the actual instrument, `amended_by` and `checked_at` timestamps.
- `licensed_class`, `emission`, `frequency_hz` and `power_context` where relevant; `legal_review_status` = `UNREVIEWED` / `REVIEWED` and `reviewer`/`review_evidence` when actually reviewed (do not fabricate).
- `provenance` = `PRIMARY_VERIFIED`, `SECONDARY` or `USER_SUPPLIED_UNVERIFIED`; note that a valid URL alone is not a verified in-force rule; cite precise text/section and as-of-date.

**Rule order:** binding national law and formal licence limitations after version/exception resolution; THEN nonbinding IARU recommendations as distinct context. ITU guidance is not a permit to operate. A government administrative application page is **not itself** an operator-specific authorization. Conflicting/effective-date-unclear/missing primary evidence => `INDETERMINATE` and explain no unsupported permission to transmit; output `ALLOWED` or `NOT_ALLOWED` only for explicitly marked *synthetic rule fixtures* in P1.2, not live Greek conclusions. Cross-border adds host and visitor jurisdictions/recognized arrangements and independent validation.

## Safety, security, freshness and QA boundary

- **Emergency training:** all A01/A02 sample logs must be labelled `EXERCISE ONLY / ΑΣΚΗΣΗ`; use synthetic scenario/location/callsign/roles, never real dispatcher tasks, live NCS messages, activation requests or PTT. ITU recommendations do not bypass local chain of command.
- **Legal:** test band-edge exact values with **synthetic** frequency ranges (inside/at/above), rule expiry, category mismatch, missing emission/power/location/date and source-class confusion. A03/A04 must not produce an unverified `ALLOWED` for a concrete operator.
- **RF safety:** refuse real exposure certification without a reviewed local standard and measurements; ideal far-field input-dependent screening is **not a compliance finding**, and nearby objects/antenna pattern/duty assumptions may invalidate an ideal bound.
- **Electrical:** never instruct unqualified mains, high-voltage, tower, rooftop, grounding, lightning or hazardous modifications; suggest qualified personnel and non-invasive checks.
- **Privacy:** simulated rosters use fake identifiers; user credentials or Taxisnet documents are never requested, stored, uploaded or reused. No live agency contacts, telephone numbers or personally identifiable emergency victim details in source fixtures.
- **Current index checks are not an installed integration:** a researcher accessing the public URLs is not an automated provider adapter and does not confer live freshness on staged Skills.

## P1.2 audit vs actual future capability

Current **P1.1 verified source-only baseline** at `9e1f6a95175dafdc5093f0647eee93465ba4f55a`: 2/24 Domain Skill candidates, 6/72 internal procedures; 44 P1 + 49 V0 + 178 Node RF tests passed; 8-file P1 stage ZIP and 12-file unchanged V0 archive. P1.2 *proposes* a five-Domain/15-reference source increment, to **7/24 Skills, 21/72 procedures, 28 review-only Markdown entries** if implemented and verified after separate written plan approval. Do not claim P1.2 code, legal rule ingestion, primary-source adapter, live routing or plugin creation from this research document.
