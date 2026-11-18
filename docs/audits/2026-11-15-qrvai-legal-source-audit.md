# QRVAI primary-source legal audit — 2026-11-15

**Project:** QRVAI #53 (Draft). **Snapshot investigated:** `ce36f68f99f8362b1c56c0c9a806cefa99a42077` (pre-audit-doc). **Scope:** regulatory source discovery, source identity and freshness, version signals, quote/pinpoint reliability and legal-permission gating. **Not** comprehensive legal advice, authoritative legal review, production certification or a guarantee that all Greek amendments have been found.

## Verification method and evidence levels

- **Legal Source Navigator / Browser Access:** fetched the official ΕΕΤΤ EKKZS registry page over HTTP 200. **Legal Source Navigator / deterministic quote verification:** the exact text `24549 ΕΞ 2025` matched a supplied on-page excerpt, but **PINPOINT_UNVERIFIED** without structural/page markers. Source catalog `GR/EETT` appears with `status: complete`; that is connector coverage metadata, **not** certified legislation.
- **Legal Data Hunter:** Greek legislation search for KYA 24549/2025 returned outdated and irrelevant hits (1983/2006 frequency table, irrelevant gazettes). `resolve_reference("ΦΕΚ Β 4230/2025 ...", hint_country="GR", hint_type="legislation")` returned **not_found**. This **does not** negate the official EETT reference. US legislative search found `US/eCFR::47_CFR_Part_97` but indexed edition dated **2026-03-23**, not current enough alone for a 2026-11-15 permission claim.
- **Firecrawl:** live HTTP 200 scrape of the primary Greek EETT page and the primary U.S. eCFR section 97.301 page (both maxAge=0). Firecrawl government search (US federal, ecfr.gov) located eCFR Part 97, §§97.301 and 97.113. Its filtered web search on the EETT domain yielded no matching web hits (an **index-discovery gap**, not missing legislation).
- **Independent issuer pages:** EETT, CEPT ECO Document Database, and U.S. Government eCFR provide stronger source identification than generic indexes. No downloaded Greek gazette PDF passage was independently reviewed here.

## Jurisdiction-by-jurisdiction register

| Jurisdiction / instrument | Primary link | Identified state as observed 2026-11-15 | Verification / limitations |
|---|---|---|---|
| Greece — ΚΥΑ 24549 ΕΞ 2025, ΕΚΚΖΣ | [EETT legal record](https://www.eett.gr/nomiko-plaisio/egkrisi-ethnikou-kanonismou-katanomis-zonon-sychnotiton-ekkzs/) — [EETT source PDF](https://www.eett.gr/wp-content/uploads/2025/08/%CE%95%CE%9A%CE%9A%CE%96%CE%A3_2025.pdf) | Decision dated **28-07-2025**, published **ΦΕΚ Β΄4230 / 04-08-2025**; retrieved from publisher site with independent Legal Navigator and Firecrawl HTTP200 | **SOURCE ID VERIFIED.** PDF article/page quotations, latest superseding amendments and exact amateur privileges **NOT VERIFIED**. An allocation table is not itself a station licence. |
| Greece — amateur stations operating terms | Ministry decision **38200/1136/2011**, **ΦΕΚ Β΄1969/2011** and amendment **10800/310/2013**, **ΦΕΚ Β΄648/2013** (existing QRVAI registry; [official National Printing Office](https://www.et.gr/)) | Tracked in QRVAI registry, previously smoke-retrieved according to project docs | **NOT independently re-reviewed in this audit.** Confirm all subsequent amendments/repeals, licence category, mode/power and effective dates using the official gazette and competent administration before any `ALLOWED` conclusion. |
| CEPT — T/R 61-01 | [ECO current record](https://docdb.cept.org/document/925), [implementation status](https://docdb.cept.org/implementation/925) | `Active`; published/updated **18-10-2024** | **STATUS/PUBLICATION METADATA IDENTIFIED**. Check national implementations, license-class equivalence, annexes, temporary-operation conditions; CEPT status alone does not authorize transmission. |
| CEPT — T/R 61-02 | [ECO current record](https://docdb.cept.org/document/926) | `Active`; published/updated **16-02-2024** | **STATUS METADATA IDENTIFIED**, country acceptance/HAREC equivalence and national laws must be separately examined. |
| U.S. — 47 CFR Part 97, §97.301 | [eCFR §97.301](https://www.ecfr.gov/current/title-47/part-97/section-97.301), [Part 97](https://www.ecfr.gov/current/title-47/part-97) | Direct live page reports Title 47 **up to date as of 2026-11-12**; section version timeline includes changes **2026-02-13 and 2026-01-14** | **PRIMARY CURRENT-LABEL/SOURCE IDENTIFIED**. eCFR declares itself authoritative-but-unofficial; inspect linked Federal Register amendments and §§97.303/97.313, operator class, ITU region, jurisdiction before permissions. Page metadata says current as of 11-12, not necessarily today's legal effect. |

## Code findings — `mcp/qrvai-rf-worker/src/live/regulations.ts`

1. `regulation_text` reads raw Greek Gazette/EETT PDFs using `unpdf` and returns page/passage positions. Its live deployment must be verified on **Node 24** with real, official PDF extraction and citation accuracy. Mocked tests and `READY` preview do not certify parser output.
2. `regulation_changes("GR")` searches EETT spectrum-page PDF uploads and tests known Gazette documents' presence; it **does not comprehensively search Gazette amendments**. `new_since_review` counts **all** newer documents regardless of amateur relevance; always display `likely_relevant_to_amateurs` separately. An empty `new_since_review` is **not** proof there are no amendments.
3. `parseEettDocuments` and `parseCeptStatus` depend on particular publisher HTML structures; changed page markup can yield stale/false signals. Exercise source-layout/fail-closed tests.
4. `usSection` fetches the eCFR up-to-date date and machine-readable section XML; compare legal **amendment effective date** separately from publication or ingestion date. Validate link/citation/passage version with direct official source and Federal Register.
5. `sourceRef`, `fetched_at`, `from_cache`, `cache_age_s` should be displayed in the legal UI; legal cache can be served stale across outages and may not reliably represent all effective dates.
6. No `regulation_text` output or `regulation_changes` should be interpreted as licensed permission to transmit. Return **INDETERMINATE** for absent authoritative licence class/region/mode/power/band/effective date or uncertain amendment chain.

## Mandatory next gates

- **LEGAL-G1:** Obtain exact official 2011, 2013 and 2025 Gazette PDFs/IDs; archive title, jurisdiction, gazette ID, official URL, published/effective dates and official amendment/supersession graph. Confirm 2025 ΕΚΚΖΣ is not superseded as of user request date.
- **LEGAL-G2:** For 10–20 representative Greek amateur frequency/mode/power/licence cases verify each *relevant article and table/annex page* with normalized OCR-safe text, a second source quote/pinpoint check and independent human legal or competent-authority review. `INDETERMINATE` as default until supported.
- **LEGAL-G3:** Test eCFR §97.301/§97.303/§97.313 and CEPT implementation country matrices for effective-date discrepancies; include archived and live versions plus contradiction cases.
- **LEGAL-G4:** Record HTTP 404, throttling, PDF bytes too large, anti-bot, changed HTML, parser failures, legal source stale and amendment-lag cases; never synthesize legal allowances.
- **LEGAL-G5:** Present legal answers in Greek/English UI with **source / article / page / jurisdiction / validity date / checked date / review status / uncertainty**. No misleading “green allowed” badge based on an allocation table alone.

**Decision:** source identification **PARTIALLY VERIFIED**; source completeness/currentness **UNVERIFIED**; exact passage/pinpoint **UNVERIFIED**; legal permissions **NOT CERTIFIED / INDETERMINATE**. This audit is an execution receipt for source discovery only, not legal expert sign-off.
