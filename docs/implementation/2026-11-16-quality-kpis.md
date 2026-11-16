# QRVAI International — evidence-driven product, source and safety KPIs

Date: 2026-11-16. This defines metrics and acceptance gates from [ADR-0012](../architecture/ADR-0012-international-first-regulation-and-academy.md) and [ADR-0013](../architecture/ADR-0013-identity-entitlements-quotas.md). It is **not** a production analytics dashboard: no real operator usage, uptime, provider spend or commercial revenue feed was connected.

## Three primary pilot-readiness KPIs

| KPI | Formal definition | Source / grain | Target / gate | Baseline status |
|---|---|---|---|---|
| **MCP contract acceptance** | Registered tool descriptors satisfying exact SDK list, read-only annotations and testable call behavior ÷ registered descriptors at the same commit SHA | GitHub exact-SHA RF Node TDD, tool registry, real protected host E2E separately; unit = tool | 100% in source CI; independently 100% at protected HTTPS host | 54 tools in source at last completed baseline; actual host E2E **UNVERIFIED** |
| **National source provenance completeness** | Reviewed official-pointer pack rows with HTTPS official publisher URL, discovery date, retrieval/access status, legal-force distinction and explicit unverified effective-date/privilege markers ÷ all published pack rows | `COUNTRY_PACKS`, `test/country-packs.spec.ts`; unit = country pack and source | 100% for any pack exposed; any permission engine must be human-verified separately | 8 *discovery* country packs (GR/US/DE/GB/AU/CA/NZ/JP), **0 certified legal permission packs**, no global denominator |
| **Academy bilingual safety coverage** | Module lesson IDs with original nonempty EN+EL explanation, safe practice and self-check answer ÷ the published catalogue's required lesson IDs | `ACADEMY_MODULES` × `ACADEMY_LESSONS`, test/academy-lessons.spec.ts; unit = lesson ID × locale | 27/27 authored micro-lessons in both locales, 100% safety guard flags; full educational chapters require later editorial review | 9 modules × 3 topics; 27 EN/EL micro-lessons added, not 27 textbook chapters |

Primary KPIs are **deployment decision inputs**, not adoption or value measures. A source-count can rise even if legal correctness is poor, so do not infer a country is legally covered merely because a pointer exists. Academy completeness is *micro-lesson* content coverage, not learning-outcome effectiveness.

## Diagnostic and guardrail metrics

| Metric | Definition | Why / action | Current evidence |
|---|---|---|---|
| CI green matrix | passed workflows ÷ triggered required workflows at exact SHA | Block release on any red, skipped or stale check | Must query latest SHA after last code/document change |
| Unsupported-country abstention | unsupported/unknown jurisdiction cases that return INDETERMINATE ÷ all unsupported cases exercised | Stop unsafe recommendations | Unit tests, not external legal certification |
| Country legal currency | date-scoped, reviewer-approved national privilege checks ÷ all published permission claims | Must be 100% before *any* binding permission claim | 0 permission claims offered; no legal-review acceptance |
| HTTP unauthenticated rejection | invalid/missing-credential requests denied ÷ such synthetic tests | Fail closed; avoid accidental public launch | Unit tests; real hosted status unverified |
| Protected-host correctness | real preview MCP initialize/list/call and 401/403/413/429/503 checks passing ÷ named scenarios | Owner security release gate | NOT MEASURED |
| External provider staleness | successful provider calls with observation timestamp within provider-specific freshness policy ÷ calls with expected timestamps | Degrade stale weather/spots/ephemeris | Provider live acceptance NOT MEASURED |
| Budget exceed response | authorized pilot requests rejected by quota when cap reached ÷ quota-bound requests | Prevent runaway costs | In-memory preview guard only; distributed counters NOT MEASURED |
| User identifiers logged | raw JWT/bearer/callsign/location/learner data leakage events | Target zero; inspect sanitized logs and redaction rules | No real production log audit completed |
| Host UX task completion | consented learners/operators completing a chosen representative flow ÷ participants attempting it | Compare layouts on real tasks | NO USER SESSIONS |

## Source data quality controls

- **Uniqueness:** 8 distinct ISO-like country codes (GB, not UK), unique document IDs, 27 distinct lesson IDs, 54 distinct MCP tool names. Check automatically.
- **Completeness:** every document has publisher, official HTTPS URL, observed date, access state and explicit effective-date/permission uncertainty; every micro-lesson EN/EL fields are populated; classify all 54 tools with a nonbillable usage weight.
- **Timeliness:** `discovery_checked_on` means only landing-page accessibility on that date. It is **not** current legal validity or case-by-case operator privilege review.
- **Grain:** avoid combining country-level portal access with per-licence legal authorization. Never divide 8 pointers by a guessed worldwide country count to claim regulatory coverage.
- **Provenance:** direct official DE/GB/CEPT and AU/CA/NZ/JP HTML pages accessed via source discovery on Nov 16, 2026; eCFR official page appears in search results while a direct browser verification produced an access challenge. Earlier Greek/US records reflect previous registry review; do not upgrade their legal authority status.

## Event design — proposed and NOT deployed

`{timestamp_bucket_utc, deployment_sha, tool_family, environment, outcome_code, duration_bucket, quota_denied:boolean, normalized_source_age_bucket}`. No raw bearer, precise operator location, licence identity, callsign, QSO history, lesson answers or user prompts. Add sampling, retention, data access review and explicit owner approval before sending analytics to any third party.

## Decision rule

**Source CI green ≠ plugin host green ≠ legal verdict accepted ≠ public service approved.** Green gate requires exact-sha 5/5 CI, protected host verified, quota/provider rights/security review, source-quality controls, private pilot and owner acceptance. Do not substitute unsupported quality scores or invented revenue targets.
