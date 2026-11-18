# ADR-0015 — Separate QRVAI Private from a public metered radio-intelligence product

Date: 2026-11-18
Status: **Decision: product separation accepted; public implementation not yet provisioned**
Tracking: [Consolidated Draft PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53), [OAuth issue #58](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/58).

## User product decision (supersedes the earlier "no second plugin" assumption)

**QRVAI remains strictly PERSONAL and OWNER-ONLY, permanently: exclusively for its owner's own use.** Private does **not** mean a closed beta, invited testers, a private SaaS, an internal team, or any other human users. Exactly one owner is authorized; no third-party accounts, invitations, shared seats, customer usage, subscriptions, credit-metering or public listing are within the QRVAI product's scope. Preserve the existing private Plugin Creator identity `plugins_6acf47f502dc8191bf542fe040d484d8`, its V0 skills-only baseline, its separate private Vercel/Supabase environment and any private OAuth work. Do not publish, rename, repackage as public, or add billing to this private plugin.

A distinct future **PUBLIC product/plugin** will reuse the same domain/RF/education source code, **not the same plugin identity or secrets**. It requires its own brand/name, private user identities, database/storage, OAuth issuer/client registrations, HTTPS domain, MCP deployment, credentials, service entitlements, rate limits and commercial operating policies. The public product is NOT yet created, deployed or approved; naming and commercial launch are separate decisions.

**Superseding access rule:** Earlier QRVAI OAuth runbooks mention an “invited private pilot user/client.” For **QRVAI Private**, that must henceforth mean *only the owner's own identity* and an owner-controlled test client. It must NEVER be interpreted as permission to onboard test users, customers, collaborators, or multiple real users. The public product must have a **distinct account store and OAuth tenant**, and owner-only QRVAI must not be used as the public product's beta environment. Owner-exclusive access must be enforced in code/identity policy, not merely by plugin discoverability being PRIVATE.

This new decision explicitly authorizes a **separate public plugin** later and supersedes previous release guidance that prohibited all new plugin identities. That restriction still applies to any modification of QRVAI Private itself.

## Code sharing and isolation contract

- Keep **one common codebase**, preferably a single repository with `packages/radio-core/` (deterministic RF, educational and source-aware tool logic), `apps/qrvai-private/` and `apps/public-edition/` (independent adapters/configurations). Existing code in `mcp/qrvai-rf-worker/` may be incrementally extracted without disturbing its PR and test suite. Avoid a fork requiring two sets of bugfixes. The public edition can expose only an approved subset of the 54 registry tools at launch; code sharing does NOT imply identical exposure or entitlements.
- Compile-time product identity and environment-specific deployment manifests: all private/public issuer, audience, key IDs, database URLs, webhooks, credit policies, support links and MCP URLs are **distinct and pinned**. No fallback across products. A private user/access token/API key/grant must not work on the public MCP resource, and vice versa.
- **Shared source is not shared access:** public distribution may reuse only reviewed, product-neutral source modules. Never copy personal QRVAI data, private configurations, live tokens, private grants or owner account records into the public edition, nor expose owner-only administrative controls through the public plugin.
- Public tenant IDs must not reuse the existing private Supabase `auth.users` UUID foreign-key assumption if using another identity provider (e.g. Auth0 `sub`). Model external identities as `(issuer, subject)` and map them to internal opaque account IDs. Never use email/callsign as identity or authorization. A separate *public* datastore must not read/write the private `public.qrvai_mcp_grants` table.
- Authentication (OAuth 2.1 authorization code + S256 PKCE, exact RFC 8707 resource audience, verifiable JWKS, signed client binding, secure consent, revocation) is **separate from usage credits and billing**. The private Supabase project is still blocked by the upstream resource/consent issues until its actual provider flow passes. Do not treat a client-specific static audience or a synthetic test as RFC 8707 proof.
- Common radio safety boundaries remain: no actual CAT/PTT, remote transmission, unsupported station ownership or unlicensed spectrum authorization. Both products must retain source and regulatory caveats.

## Public credit system — conceptual Firecrawl-style model, not copied source

**Three different concepts:** OAuth access token identifies the user to ChatGPT/MCP; optional API key authenticates direct API clients; **usage credits** are server-side accounting units, never bearer tokens or LLM context tokens.

Each public account owns a monthly plan allotment, a durable credit ledger, bounded per-tool pricing, rate/concurrency limits and a renewal period. Use **atomic Postgres reserve/commit/refund or debit** by authenticated internal account ID with an idempotency key from a trusted operation ID and unique constraints; prevent duplicate charges, negative balances, multi-instance races, retry replay and cross-user consumption. Server decides tool cost after validation; reject unpriced/new tools, prohibit client-chosen cost, and record audited adjustments. Async/provider-backed tools reserve cost and settle/refund deterministically. Cost formula, actual free quota, expiration/rollover and refund policy remain **TBD, not invented**.

At initial public launch the product can run a free **metered** plan only, no payment credentials, subscriptions, checkout, or silent overage. Later independent **paid entitlements** may grant higher monthly credits and additional concurrency/features, provided privacy, accounting, tax, fraud and applicable platform policies are reviewed. Preserve historical ledger entries when plan tiers change. Explicitly distinguish `credit_balance`, `per-minute requests`, `monthly allotment` and `OAuth access token`.

**OpenAI plugin policy checkpoint (2026-11-18):** Current public plugin guidelines prohibit selling digital credits/subscriptions *within the plugin*, presenting plans, initiating subscriptions, promotional upsells or checkout links. Users with independently obtained paid service entitlements may authenticate and access them, and the plugin may explain an unavailable entitlement or link to a non-transactional information page. Do not use the ChatGPT plugin as a sales funnel or checkout. External business subscriptions, if launched later, must comply with policies prevailing at that date. References:
- https://developers.openai.com/plugins/plugin-guidelines
- https://developers.openai.com/plugins/build/auth
- https://github.com/firecrawl/firecrawl
- https://github.com/firecrawl/firecrawl-docs/blob/main/billing.mdx

## Delivery phases and acceptance

### P0 — Separate identity and boundaries (source-only)
Create a public-product architecture contract, product-neutral core extraction plan, two isolated configuration schemas and fail-closed cross-product tests. The actual private QRVAI plugin and infrastructure do not change. **Current phase.**

### P1 — Public free metered MVP (not yet implemented)
Choose public brand and compliant OAuth provider proven against ChatGPT RFC 8707/PKCE. Provision a **new** isolated public identity tenant, DB, hostname, server, and separately registered public plugin (not QRVAI ID). Implement free credits, atomic ledger/idempotency, revalidation, strict budgets, user self-service data controls and test account; publish privacy policy/support contact. Test resource-bound OAuth, per-user isolation, denied tools, no-credit 429/appropriate entitlement response, parallel and replay. Review public listing guidelines before submission.

### P2 — External commercial accounts/subscriptions (later)
Separate merchant website/backend and payment processor; signed verified webhooks, subscription lifecycle, entitlement synchronization, dispute/refund handling, dunning, reconciliation and abuse controls. Entitlement change must not change OAuth identity or leak credentials. **Do not run subscription checkout, promotion or direct upgrade initiation from the ChatGPT plugin** unless platform policy later expressly allows it.

## Non-goals / current implementation truth

No new public brand, plugin ID, production deployment, OAuth tenant, customer account, billing customer, Stripe account, subscription product, public database or credit balance has been created by this ADR. It does not authorize promotion of the private Preview PR to production, repurposing existing QRVAI OAuth grants for public users, or turning the private plugin public.
