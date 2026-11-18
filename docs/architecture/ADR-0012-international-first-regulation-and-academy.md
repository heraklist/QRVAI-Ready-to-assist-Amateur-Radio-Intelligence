# ADR-0012 — International-first QRVAI, jurisdiction packs and hobby-first Academy

Date: 2026-11-16  
Status: **Product-owner-directed target architecture; implementation, international coverage, paid access and release NOT accepted**  
Review hub: [Draft PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53)  
Related: [ADR-0011 — One Vercel MCP project](ADR-0011-single-vercel-mcp-project.md), [Master roadmap](../roadmap/2026-10-14-qrvai-master-roadmap.md)

## Decision and product identity

QRVAI is designed as a **global, ChatGPT-centered amateur-radio assistant for operators and learners in any country**, not as a Greece-only application. The technical/operating knowledge and the QRVAI Academy are globally reusable. National regulations are **versioned, opt-in jurisdiction modules**. Greece is an initial supported *source jurisdiction*, not the product's default identity or the basis for global operating permissions. English is the international baseline for descriptions and international UX; Greek remains a first-class supported language. Respond in the user's language when supported and do not infer a station's regulatory location from user language, account location, IP, callsign prefix or GPS alone.

This is a product-scope correction, not a statement that the existing 52 source-registered read-only MCP tools provide worldwide legal coverage or are host accepted.

## Regulation intelligence — separate normative authority from guidance

Model distinct authorities and scopes:

1. **International framework:** ITU Radio Regulations / international frequency-allocation structure and amateur-service principles. ITU framework is not a direct individual operator licence. Country-specific permission and licensing are national matters.
2. **Regional operating guidance and reciprocal arrangements:** IARU Region 1/2/3 band-plan recommendations; CEPT T/R 61-01, T/R 61-02 and other relevant bilateral, regional or visitor arrangements. Track the regulatory force of each instrument. IARU plans are typically voluntary unless a national administration incorporates them; reciprocal agreements are not blanket global permissions.
3. **National/jurisdiction pack:** official national regulator; national allocation; actual amateur privileges by local licence class; permitted frequencies, emissions, bandwidth/power, station type, special conditions, visitor recognition; source publication/effective/supersession dates, quoted provisions and source retrieval freshness. For international/mobile/portable operation, use **the jurisdiction in which the station operates**, and verify visitor rights rather than assuming home-country authorization carries over.

The response engine must ask only for the missing fields necessary for a specific permission question: operating country/territory, effective date, licence/visitor recognition as applicable, frequency, mode, power and other binding conditions. Do not automatically apply the user's home-country rules to a temporary foreign operation. If the jurisdiction is unimplemented, official primary source is unavailable/outdated, licence equivalence is uncertain, or documents conflict, state **INDETERMINATE**, give factual source pointers and do **not** assert permission to transmit. An educational description of an international/IARU band is **not** a local compliance verdict.

Suggested jurisdiction-pack contract (design only):
- jurisdiction/ISO code and optional subnational scope; regulator/source allowlist; IARU/ITU region metadata;
- allocation/privilege rules keyed by class, date, band, mode, power, station/visitor context;
- source URL, official publisher, instrument ID, version, publication/effective/end dates, pinpoint article/page;
- explicit legal-force classification: binding national rule vs international framework vs recommendation;
- data quality/freshness, tested golden cases and invalid/uncertain cases, human legal reviewer and review cadence.

Existing Greek Gazette/EETT and US eCFR tools remain **limited source adapters**, not complete Greece or USA permission engines and not a global regulatory catalogue. Expand jurisdiction by independently reviewed packs, starting only with authorities whose source access, legal rights, currentness and tests are verified. Never fabricate coverage or legal conclusions.

References (authoritative context): [ITU scope FAQ](https://www.itu.int/net/ITU-R/terrestrial/faq/), [IARU band plans and precedence](https://www.iaru.org/on-the-air/band-plans/), [CEPT T/R 61-01](https://docdb.cept.org/document/925).

## QRVAI Academy — international hobby curriculum, not national licensing/exam school

Core Academy scope: RF fundamentals and electronics; antennas, matching and feedlines; propagation and spectrum literacy; station setup, operating etiquette and QSO technique; Morse/CW; modes including digital and packet/APRS; SDR and satellites; logging and awards; contesting, field and portable operation; building, measuring and safe experimentation; clubs, mentoring and emergency-communications *preparedness simulations only*. Learning materials must be language-adaptable, accessible, source-aware and technically reviewed. Interactive practical labs may be simulations; they never confer a right to transmit.

**National licence applications, country-specific exam question banks, HAREC/CEPT certification preparation and regulatory test syllabi are excluded from the core Academy.** If later requested, such education may become an independently versioned **optional country-specific licensing/credential module**, with local-source governance, separate copy/licence rights, explicit labelling and user choice; its absence does not block Academy access.

The regulatory module may explain why an operating constraint matters during hobby lessons, but the Academy must not silently become a national licence-preparation course.

## Deployment and future commercial model

Keep **one canonical Vercel project `qrvai-rf-mcp` and one MCP gateway `/api/mcp`** (ADR-0011), internally separated into global core, legal/jurisdiction adapters, Academy, source-provider adapters, and future identity/entitlements/usage metering. Do not create one project/plugin per country by default.

Design for a future optional hosted offering: free or community access to selected educational/deterministic features, and potentially metered subscription/credit/API-token entitlements for costly tools, partner data or hosted services. **No pricing, payment processor, token purchase, external API-key exposure or entitlement enforcement is implemented by this ADR.** Distinguish billable usage credits from authentication credentials and from ChatGPT/OpenAI subscriptions/tokens. If implemented, identify principals server-side, verify signed identities, enforce per-user quotas and provider licensing, meter costs without collecting unnecessary QSO/operator personal data, and make billing transparent. A subscription never grants RF operating authority.

## Acceptance and migration gates

1. Update source-of-truth roadmap, capability taxonomy, orchestration policy, plugin manifest and core routing guidance; retain historical Greek-first documents only when clearly superseded.
2. Establish global-vs-jurisdiction response contracts and acceptance tests: unknown country, absent licence, conflicting law/band plan, cross-border visitor, stale source, region mismatch, nonbinding IARU recommendation, partial US/Greek source availability.
3. Check international educational content and learning UX for non-Greek assumptions and exam/licensing leakage; test English + Greek examples; add further languages incrementally.
4. Stage additional **official** national/regional primary sources by provider rights, update frequency and reviewer sign-off before claiming coverage.
5. Require exact-SHA CI, protected HTTPS MCP acceptance, host tests, quota/security/legal review and explicit owner approval for any public or monetized release. Current Draft PR #53 and private protected Vercel previews do not satisfy these conditions.

**Not in scope now:** regulatory advice with guaranteed legality, worldwide country coverage on day one, live radio TX/PTT, emergency dispatch, user billing, public access, production promotion or merging to `main`.
