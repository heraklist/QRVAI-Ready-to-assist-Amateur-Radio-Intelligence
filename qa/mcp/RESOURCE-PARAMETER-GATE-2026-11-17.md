# QRVAI — OAuth RFC 8707 resource-indicator acceptance gate (2026-11-17)

**Status: BLOCKED / LIVE TOKEN FLOW NOT_EXECUTED** — Draft PR #53, reviewed at baseline SHA `f89336c9f6d9bf8305482a99848a05505e476f9c`. This gate documents what is and is not demonstrated; it grants no deployment, external auth, payment, host integration, or public access approval.

## Known facts, inspected today

- Existing Supabase project `qrvai-auth` (`ujhkqfvxpgpkearukvmh`) reported `ACTIVE_HEALTHY`; read-only Auth schema summary reported **0** users and **0** OAuth clients. Security advisor returned 0 lints; absence of lints is not OAuth authorization proof.
- GitHub `api/mcp.ts` is still a shared-Bearer private preview with `PUBLIC_UNAUTHENTICATED=false`. The stand-alone ES256 verifier is not connected to that endpoint.
- OpenAI requires that ChatGPT send `resource` to the OAuth authorization and token endpoints and that a token be restricted to that resource. Supabase docs confirm custom `aud` claims via Auth hooks keyed by clients but **do not explicitly document** the original `resource` parameter in a hook event.
- Supabase native OAuth scopes currently listed: `openid`, `email`, `profile`, `phone`; custom QRVAI permissions must be server-owned, not inferred from those scopes.
- Previous offline JWT fixtures / discoverability checks are **not** a real signed resource-bound token or a ChatGPT host login. Live discovery re-fetch from this execution environment was not available.

## Release-blocking evidence checklist

| Gate | Minimum evidence | Status |
|---|---|---|
| G1 canonical resource | Exact HTTPS `resource` identifier, 401 challenge and RFC 9728 metadata agree with effective MCP deployment | NOT_EXECUTED |
| G2 authorization request | Captured redacted `resource` and `S256` PKCE at authorization endpoint for the registered client | NOT_EXECUTED |
| G3 token request | Captured redacted **same** `resource` at token endpoint for same code flow | NOT_EXECUTED |
| G4 signed access token | Cryptographically verified `iss`, exact MCP `aud`, `sub`, `client_id`, expiry and permissions source; no raw token retained | NOT_EXECUTED |
| G5 negative cross-resource | Wrong, missing or swapped resource is rejected rather than returning a QRVAI-audience token | NOT_EXECUTED |
| G6 provider metadata | Public issuer metadata presents compatible `S256`, exact issuer, client registration mode / callback rules; record real HTTP receipts | NOT_EXECUTED |
| G7 hosted endpoint | `/api/mcp` independently verifies token plus server-owned user/client grants and fails closed for missing/revoked users | NOT_EXECUTED |
| G8 ChatGPT host | Real OAuth linking, `tools/list`, permitted call, negative denied call, exact SHA receipts | NOT_EXECUTED |

No synthetic test result or source-code inspection should be rewritten as a live PASS. URLs, timestamps and sanitized evidence should be added **only after real execution**.

## Near-term implementation constraints

1. Keep `OAUTH_MCP_HTTP_WIRED=false` in the Vercel metadata route, and keep `PUBLIC_UNAUTHENTICATED=false` in `api/mcp.ts`. Do not rely on an environment variable alone to signal OAuth capability.
2. Do not enable DCR yet. The previously observed issuer metadata lacked `registration_endpoint` and `authorization_response_iss_parameter_supported`. Prefer a pre-registered restricted client initially, with **the exact callback URI displayed by ChatGPT**, then re-evaluate CIMD / DCR with fresh metadata.
3. No Auth hook may grant permissions from user-editable `user_metadata` or a reported callsign. Treat `aud=authenticated`, scope-less access tokens and unverified client identities as DENY.
4. Do not bypass Vercel authentication, create a permanent share link, change DNS or promote to production to make the flow easier.

## Primary sources

- OpenAI Plugins OAuth and MCP requirements: https://developers.openai.com/plugins/build/auth
- Supabase OAuth server flows and scope limitations: https://supabase.com/docs/guides/auth/oauth-server/oauth-flows
- Supabase Custom Access Token Hook input claims: https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook
- Supabase token security and client-based audience examples: https://supabase.com/docs/guides/auth/oauth-server/token-security
- Architecture decision: ../../docs/architecture/ADR-0014-supabase-oauth-mcp-compatibility.md

---

<!-- QRVAI-LIVE-OAUTH-DISCOVERY-2026-11-17 -->
## Live read-only provider recheck — 2026-11-17 (no credential/token operations)

**Observed on the dedicated project** `ujhkqfvxpgpkearukvmh`:

- Supabase project status: `ACTIVE_HEALTHY` in `eu-central-1` (project API).
- `GET https://ujhkqfvxpgpkearukvmh.supabase.co/.well-known/oauth-authorization-server/auth/v1` returned **HTTP 200**, `application/json` via an uncached read-only fetch. Exact issuer: `https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1`; advertised authorization and token endpoints: `/auth/v1/oauth/authorize`, `/auth/v1/oauth/token`; advertised JWKS URI: `/auth/v1/.well-known/jwks.json`.
- Metadata advertises authorization code flow and PKCE methods **`S256` and `plain`**. QRVAI must require `S256` regardless of the weaker method being advertised.
- This **observed** discovery document **does not advertise** `registration_endpoint` or `authorization_response_iss_parameter_supported`. That is not evidence that client registration is operable; leave DCR disabled for the pilot.
- Read-only SQL `SELECT (SELECT count(*) FROM auth.users), (SELECT count(*) FROM auth.oauth_clients)` returned **0 users and 0 OAuth clients**. Supabase security advisor reported no lints; neither result establishes an authorized user session.
- Supabase upstream issue [supabase/auth#2610](https://github.com/supabase/auth/issues/2610) remains **OPEN** as checked 2026-11-17. The latest retrieved upstream discussion documents live hosted OAuth tokens returning `aud: authenticated` despite `resource` in both authorization and token exchange. Newer upstream source validation of the URI does **not** demonstrate audience binding to this MCP resource. Do not relax exact-`aud` verification.
- Canonical QRVAI Vercel `qrvai-rf-mcp` had a `READY`, protected preview deployment for PR #53 HEAD `c518220a0d0d1b7b532f737fbc84a5840ba75343`. Reading Vercel env-variable **names** (`decrypt=false`) returned **HTTP 403**; do not infer absent settings or circumvent authorization.
- Plugin Creator reports existing private plugin `plugins_6acf47f502dc8191bf542fe040d484d8` at `0.1.0-preview.4` contains **8 Skills-only package files** and no MCP gateway configuration.

**Gate update (not an approval):** **G6 = PARTIAL (issuer discovery only)**. The actual `resource` propagation, token-exchange preservation, resource-bound `aud`, negative cross-resource tests, OAuth client registration, user grant mapping, mounted secured `/api/mcp`, externally reachable private host, and real ChatGPT `tools/list` remain **NOT_EXECUTED / BLOCKED**. The historical G6 row above states `NOT_EXECUTED` at its earlier baseline; this section is its dated follow-up, not retroactive proof.

### Architecture decision and execution sequence

1. **Do not bind unscoped Supabase `aud=authenticated` access tokens to QRVAI MCP.** Await verified RFC 8707 support in the actual deployed issuer, or review a separate standards-compliant resource-token issuer/broker using Supabase only for user identity; do not silently change auth provider.
2. Agree on **one canonical HTTPS MCP URL** with a reachable pilot deployment and locked-down protections. RFC 9728 resource identifier, OAuth `resource`, issued `aud`, and `/api/mcp` verifier must match precisely. A protected Vercel preview is not host-reachable by default.
3. Run a **controlled private login + consent** with a registered client and invitation-only user; capture redacted authorization and token request receipts, **never access tokens or credentials**. Run swapped/missing-resource negatives.
4. Wire `src/http/oauth-verify.ts` and `src/http/verified-mcp.ts` to the actual Vercel handler **only after** evidence for required issuer/audience/client/user binding. Enforce server-owned grants, no user-metadata authorization, and resource-sensitive quotas.
5. Maintain `PUBLIC_UNAUTHENTICATED=false` and `OAUTH_MCP_HTTP_WIRED=false` until gates pass; then secure end-to-end ChatGPT host tests before a guarded update of the **existing private plugin ID**. Production, public exposure, payments, and main merge remain separately gated.

**Current status: provider discovery VERIFIED; MCP OAuth integration BLOCKED; no live user/token/host certification.**

## 2026-11-17 — Automatable read-only issuer-discovery probe (latest PR #53)

- Added `src/http/oauth-issuer-discovery.ts`, `scripts/probe-oauth-issuer.mjs`, offline contract tests `test/oauth-issuer-discovery.spec.ts` and `npm run probe:oauth` (manual only). The probe makes **one unauthenticated GET** to the pinned project's RFC 8414 discovery URL; it checks exact issuer, pinned auth/token/JWKS endpoints, authorization-code grant/response and S256 PKCE advertisement, and prints a JSON audit **without access tokens, requests containing secrets, client registration, or consent**. Malformed discovery fails closed.
- Even if discovery `PASS`, the audit **always records** `resourceParameterToAudience=NOT_EXECUTED`, `issuedTokenSignature=NOT_EXECUTED`, `signedClientBinding=NOT_EXECUTED`, `chatgptOAuthHost=NOT_EXECUTED` and `productionOAuthReady=false`. No metadata-only shortcut may mark G2/G3/G4/G5/G7/G8 complete.
- External read-only issue check: Supabase [auth#2610](https://github.com/supabase/auth/issues/2610) remains **OPEN** (last updated 2026-10-06). A source-level `resource` request parser does not establish that the live authorization/token exchange will issue `aud=https://<canonical-mcp>/api/mcp`. The canonical QRVAI Vercel project still reports SSO protection enabled; its preview at commit `8d066a1` is READY, `target:null`, not an unprotected production endpoint.
- Read-only `qrvai-auth` inspection still has **zero Auth users** and **no `public.qrvai_mcp_grants` table**. Vercel project environment-variable inventory refused access with HTTP **403**; do not infer environment state from that error.
- **Gates remain unchanged:** no live test of `resource` propagation, no signed audience-specific token, no authorized host flow, no DB changes, no user/client creation, no Vercel DNS/share-link/protection bypass and no ChatGPT private plugin upgrade. Requires separate approved authenticated test to advance.

This probe augments the earlier issuer metadata receipt but is **not** an RFC 8707 conformance claim.

## 2026-11-17 — Fresh public HTTPS evidence (read-only, no login)

Fetched the real **public** endpoints via uncached remote HTTP retrieval, with **no credentials, token exchange, consent, login, temporary Vercel share link, or protection bypass**:

| Endpoint | Observed response | Security conclusion |
|---|---|---|
| `https://ujhkqfvxpgpkearukvmh.supabase.co/.well-known/oauth-authorization-server/auth/v1` | **200 application/json**: issuer `https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1`; exact `/oauth/authorize`, `/oauth/token`, `/.well-known/jwks.json`; `authorization_code`, `refresh_token`, PKCE `S256` **and** `plain`; scope list now includes `offline_access` | **Issuer discovery observed**; QRVAI requires **S256** and must not treat advertised `plain` as permission to use it; a listed scope is not tested authorization or token issuance |
| `https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1/.well-known/jwks.json` | **200 application/json**; at least one public `kty=EC`, `crv=P-256`, `alg=ES256`, `use=sig` verification key | **Public asymmetric verification key observed**, but no access token was minted or signature validated; actual access-token algorithm / audience remains unproven |
| `https://qrvai-rf-mcp.vercel.app/.well-known/oauth-protected-resource/api/mcp` | **404 HTML**, `DEPLOYMENT_NOT_FOUND` | **Canonical host not reachable for MCP discovery.** Preview `READY` / `target:null` does not satisfy G1/G7 |

Source observation: uncached public HTTP retrieval 2026-11-17; response/status and JSON shape inspected without relying on cached documents. No full credential or token was obtained or stored. The Auth project read-only SQL still shows **0 users**, and no `qrvai_mcp_grants` table exists.

**Gate interpretation:** G6 stays **PARTIAL** (issuer metadata/JWKS discovered, but DCR/registered client/callback and login are unverified); G1 **BLOCKED** (canonical 404); G2–G5 and G7–G8 **NOT_EXECUTED**. `supabase/auth#2610` remains open, and neither custom `aud` hooks nor the advertised `offline_access` prove that a real `resource` request returns an appropriately bound JWT. **Do not** make `OAUTH_MCP_HTTP_WIRED=true` or lower strict `aud`, issuer, PKCE or per-client-grant requirements.


## 2026-11-17 — Vercel production assignment & composed *offline* OAuth pilot

Live Vercel project inventory, **read-only**:
- Project `qrvai-rf-mcp`, team `heraklists-projects`: exactly one attached domain `qrvai-rf-mcp.vercel.app` (`verified=true`, `gitBranch=null`); deployment protection `enabled=true`, `deploymentType=all_except_custom_domains`.
- `list_deployments(target=production)` returned **one production deployment**, `dpl_BCYbo8hwzVrZvibrAvNrJaub97U7`, SHA `e53a64d53cf86321e3e5c4670433d3e4f169a17e`, state **CANCELED**; no READY production target was returned. Recent PR #53 deploy `bba4693` is **READY Preview** (`target:null`).
- Direct canonical HTTP GET already returned **404 DEPLOYMENT_NOT_FOUND**. **Diagnosis: verified domain but no eligible READY production deployment**, not a missing DNS association. This is **not approval to promote** a preview, disable access protection or deploy shared Bearer OAuth-incomplete code to production.

Added `src/http/supabase-oauth-pilot.ts` and `test/supabase-oauth-pilot.spec.ts`, with tests in `npm test`:
- **Offline composed server-only handler, NOT mounted** on `api/mcp.ts`: exact pinned QRVAI issuer, canonical HTTPS MCP audience, asymmetric ES256 JWKS validation, signed `client_id`, `openid` *identity scope only*, fresh private Supabase `sb_secret_*` grant lookup, per-grant permissions and SDK-filtered tools.
- No fallback to an unauthenticated client, shared Bearer token, user metadata, OAuth-provided QRVAI permissions or alias origin. Tests exercise signed synthetic ES256 JWTs, authorizations, disabled/expired/missing grants and unavailable DB, wrong issuer/audience, wrong client, hostile preview alias, and missing credentials. Injected fetches are **test-only fixtures**, not evidence of user login.
- `PUBLIC_UNAUTHENTICATED=false` and `OAUTH_MCP_HTTP_WIRED=false` remain unchanged. This composed library is **not** referenced by either Vercel route. No new token, user, OAuth client, database table, environment key, DNS, production deployment or plugin package was created.

**Gates stay G1 BLOCKED, G6 PARTIAL, G2–G5 / G7–G8 NOT_EXECUTED.** Next genuinely required step is a real resource-indicator-compliant issuer + host access/production security design; a synthetic JWT test must not be reported as an end-to-end host pass.
