# ADR-0013 — QRVAI identity, metering and quota boundaries

Date: 2026-11-16  
Status: **Design accepted for development review only — NOT a pricing, payment, public-release or account-provisioning decision**  
Review: [Draft PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53), [Issue #59](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/59)  
Related: [ADR-0004](ADR-0004-mcp-security-auth-boundaries.md), [ADR-0010](ADR-0010-verified-principal-http-seam.md), [ADR-0012](ADR-0012-international-first-regulation-and-academy.md)

## Terminology and hard distinctions

- **OAuth access token:** short-lived cryptographically verified server-side proof of a caller and scopes; never the same as a QRVAI prepaid usage credit.
- **ChatGPT subscription:** OpenAI-provided product entitlement; never evidence of a QRVAI paid subscription, usage credits, identity or RF transmit privileges.
- **QRVAI authenticated principal:** subject, tenant, permissions, issuer/audience and expiration derived from verified identity, not a supplied callsign, name, user-language, IP, source-country or unverified JWT.
- **Usage weight:** internal resource-planning points, **NOT** money, credits for sale, provider fees, tokens, API charges or a tariff. Current source weights are non-billable estimates.
- **Subscription/credit grant:** future separately approved state, backed by atomic durable accounting and the payment provider, with refunds, taxation, cancellation, invoices and consumer/privacy reviews.
- **User radio licence:** a distinct national legal matter; never created or implied by account, plan or payment.

## Current source implementation vs absent production controls

1. `api/mcp.ts` is fail-closed when no server-side Bearer secret is configured. In a protected preview, a bearer is a **shared deployment credential**, not a human identity or individual tenant.
2. `src/http/preview-throttle.ts` adds an in-memory best-effort burst ceiling of **60 requests per minute per token fingerprint per warm Node isolate**, with 429 and Retry-After; no raw token is retained in the Map. Instances may have independent counters, so it **cannot** meet any distributed or paid-user quota or fraud-prevention requirement.
3. `src/http/oauth-verify.ts` is a signed-token validation utility; `src/http/verified-mcp.ts`, `authz-policy.ts` and `rpc-authz.ts` demonstrate a verified-principal seam and role/tool limits. **Not wired to the deployed Vercel endpoint**.
4. `src/http/usage-policy.ts` classifies exactly the registered tools as offline, external or private resource and returns a pure usage-budget verdict with conservative 1/5/3 planning weight. All classifications explicitly `chargeable_now=false`. This is **not a billing processor or server-side reservation**.
5. A protected Vercel build in READY state is no proof of effective token, WAF, cache, provider quotas or host-compatible OAuth. The current env metadata and firewall APIs returned 403/404.

## Proposed database and key contracts (not instantiated)

Use a managed transactional durable store with atomic compare-and-update (e.g. PostgreSQL transactions) or a proven distributed quota store. Proposed tables:

| Table | Key / grain | Fields | Safety properties |
|---|---|---|---|
| `qrvai_principal` | internal opaque subject + issuer | tenant, authenticated identity status, revocation marker | No callsign or home address as login identifier; minimal retention |
| `qrvai_entitlement` | tenant + product + effective interval | enabled tools, scopes, caps, plan status, valid dates | Signed server authority; no client privilege escalation |
| `qrvai_usage_reservation` | tenant + unique request ID | tool, integer weight, reserved/committed/released, TTL | Atomic idempotency and crash-safe compensation |
| `qrvai_period_counter` | tenant + period UTC + window | count, weighted units, concurrent reservations | Atomic ceiling; fail closed on store timeout |
| `qrvai_payment_ledger` | payment event ID (future) | provider event, amount and currency if approved, immutable double-entry | Never co-mingle with API secret or usage points |
| `qrvai_audit_event` | event UUID | timestamp, pseudonymous principal, outcome code and coarse tool category | No radio location, raw bearer, private logs or lesson content |

**Transactional lifecycle:** authenticate and validate issuer/audience/time/scopes → resolve tenant ownership server-side → authorize requested tool and resource → atomically reserve period and concurrency budget with unique idempotency key → execute bounded upstream call → finalize or release reservation exactly once → emit redacted counters/latency/outcome. Timeouts, expired identity, unknown tool, missing store, negative budgets, duplicate transaction conflict, failed ownership or upstream quota overrun fail closed.

A distributed quota counter, a separate provider daily limit and a kill switch are **mandatory** before anonymous/public/multi-tenant or paid access. Do not use a per-instance Map for production enforcement.

## Privacy and analytics

Analytics must count only coarse `tool_family`, normalized outcome (success, user-error, auth, quota, provider-error), UTC bucket, duration bucket and a *salted, rotating* opaque tenant pseudonym if truly needed. Do not log raw request args for country, grid locator, callsign, QSO, APRS coordinates, school learner records, live radio station config, JWT or bearer. Individual operator national licences do not belong in general analytics.

No baseline of real usage, active customers, conversion, latency SLO or provider invoices is present. **Never invent prices, paid plans or revenue forecasts** from source-code counts. Instrument a private pilot first with consent, retention policy and provider terms review.

## Separate future launch gates

- [ ] Independent issuer/JWKS/OAuth discovery and signature tests on the real ChatGPT host, with account/tenant-specific scopes, verifier key-rotation tests and revocation policy.
- [ ] Enforce tool/resource ownership on the *deployed* HTTP path; verify selected private resources stay hidden and direct RPC cannot bypass scope.
- [ ] Managed atomic multi-instance request/daily cost quota with concurrency, failover and idempotency; chaos tests across multiple Vercel invocations.
- [ ] Verified provider call caps, official source rights, WAF and DDoS/abuse policy; monitor 429/5xx and stop on unknown run rate.
- [ ] Transparent privacy policy, no unnecessary operator or learner personal data, data deletion and retention controls.
- [ ] Independent financial/legal acceptance of jurisdictional pricing, tax, refunds, cancellation, PSP, receipts and consumer protections **before accepting any payment**.
- [x] Reuse the **existing PRIVATE personal QRVAI** identity for the first **skills-only** pilot (`0.1.0-preview.4`, account read-back verified); [x] eight instructional/safety responses reviewed from user-supplied ChatGPT outputs on 2026-11-17 (**content-level V0 acceptance only**); [ ] independently retained host execution provenance; [ ] later secure 54-tool MCP E2E using the same plugin identity. No public listing or second plugin.
- [ ] An actual subscription must NEVER be represented as a radio transmitting licence.

## Measurable but non-billing acceptance

Before pilot: no anonymous access without a configured auth path, 54/54 registry tools must classify, every quota unit test must deny unknown/unauthorized/over-budget input and 429 must include Retry-After; zero raw tokens in log code. After pilot only: collect actual success/429/5xx counts and owner-review the effective **distributed** limits. Count tests at their exact CI SHA, not as deployed host evidence.

## Separate offline acceptance contracts (2026-11-17)

The pilot is deliberately split into two evidence kinds, neither of which can substitute for the other:

- **V0 reviewed skills-only responses**: `checkV0PilotGates` checks exactly eight reviewed, individually referenced user-supplied outputs, the installed private plugin ID and `0.1.0-preview.4`. The editorial assessment is 8/8 as recorded in the project conversation. It does **not** establish that an independent host trace, MCP call or live tool registry was observed.
- **V1 protected MCP host acceptance**: `checkReleaseGates` checks the exact deployed Git SHA, Vercel preview evidence, **the same private plugin identity** (no replacement ID), actual OAuth/PKCE and verified principal, a ChatGPT-host-observed 54-tool registry and successful live `academy_catalog` invocation, plus same-conversation follow-up. V1 is **NOT_EXECUTED / BLOCKED** until these observations exist.

Run these offline documentary shape checks from the repository root:

```sh
node scripts/check-release-gates.mjs --v0 qa/v0/pilot-report.example.json
node scripts/check-release-gates.mjs --v1 qa/mcp/host-report.example.json
```

Both example JSON files intentionally fail closed and must not be changed to PASS without traceable original evidence. Even a successful documentary shape check never confirms URLs, actual authentication, device actions, OAuth trust or a deployment. Independent host review remains mandatory. Keep Vercel SSO, token protections and private plugin visibility unchanged during this stage.
