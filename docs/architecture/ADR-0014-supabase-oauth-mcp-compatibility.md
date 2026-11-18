# ADR-0014 — QRVAI private OAuth/PKCE integration: Supabase compatibility gate

Date: 2026-11-17
Status: **Design for review / implementation blocked on provider-resource compatibility; no production approval**
Review hub: [Draft PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53)
Related: [ADR-0010](ADR-0010-verified-principal-http-seam.md), [ADR-0013](ADR-0013-identity-entitlements-quotas.md)

## Goal and current verified boundary

Use a real OAuth 2.1 authorization-code + PKCE user session to authenticate ChatGPT -> QRVAI MCP Streamable HTTP **without** creating a second QRVAI plugin identity, opening public registration, weakening Vercel deployment protection, connecting radios, or implying a live 54-tool host test has passed.

At audited Draft PR #53 baseline commit `f89336c9f6d9bf8305482a99848a05505e476f9c` (2026-11-17):
- `mcp/qrvai-rf-worker/api/mcp.ts` enforces the server-wide `QRVAI_MCP_BEARER_TOKEN` or fails closed; it does **not** verify an individual user's OAuth access token.
- `src/http/oauth-verify.ts` validates synthetic RS256 JWTs with exact issuer, HTTPS audience, signature, expiry, `nbf`, scopes and issuer-owned JWKS; `src/http/verified-mcp.ts` uses an injected verifier and filtered SDK tool registration. Neither is wired into the deployed HTTP handler.
- Source tests see 54 read-only registered tools with an isolated test-only public override. This is not 54 tools connected to a ChatGPT host.
- The current private skills-only plugin is a separate V0 evidence boundary. The V1 live MCP host gate is **NOT_EXECUTED**.
- The dedicated Supabase project **`qrvai-auth`** (`ujhkqfvxpgpkearukvmh`) is now **ACTIVE_HEALTHY** in `eu-central-1`. The Auth schema reported **zero users and zero OAuth clients** on 2026-11-17; this is not proof of a completed login, provider `resource` support, or configured client.

## Proposed deployment topology

- **Authorization server:** the **existing dedicated** `qrvai-auth` Supabase project, retained for **invited private pilot users only**. OAuth server settings, resource-indicator propagation, and any Auth hook must be reviewed before activation. No plan to create payment tables or a public sign-up workflow.
- **Login/consent web UI:** an English-first, Greek-accessible QRVAI web page hosted separately on Vercel or a narrowly scoped application route. It keeps the `authorization_id`, presents the verified requesting client, exactly the requested permissions, and exposes both Approve and Deny; a successful login returns to the pending consent request. Never display secrets, JWTs or authorization codes.
- **Resource server:** existing Vercel `/api/mcp`. When an explicitly enabled *isolated preview* OAuth configuration is valid, advertise RFC 9728 protected-resource metadata and challenge unauthorized requests via `WWW-Authenticate`; otherwise maintain fail-closed behavior and the existing shared-Bearer preview mode. No automatic downgrade from OAuth to shared bearer.
- **Identity/authorization:** validate issuer-discovered JWKS, approved asymmetric algorithm, issuer, **canonical resource audience**, expiry/not-before, client identity and signed subject on every request; map the verified subject/client to server-owned QRVAI entitlements (not user-supplied claims/callsign/tenantId). Private station and log resources remain hidden until server-side ownership is proven.
- **Database:** use Supabase Auth's managed `auth.users` initially. Additional `qrvai_*` tables and RLS are deferred until a concrete tenant, permissions or usage-ledger requirement has been verified. Never expose service-role credentials in the browser.

## Provider compatibility blockers — do not paper over these

1. **Custom scope mismatch:** as documented 2026-11-17, Supabase's OAuth 2.1 server currently supports `openid`, `email`, `profile`, `phone` but **not custom OAuth scopes**; QRVAI's current `qrvai:tools:read` and `qrvai:user-data:process` are *internal authorization permissions*, not requestable Supabase OAuth scopes. An implementation must obtain a trusted app-specific signed claim or server-side allowlist/grant after token validation and map it to those permissions. Standard `email`/authentication alone must **never** grant private user data.
2. **Resource binding:** OpenAI's MCP contract sends `resource` to both authorization and token requests and requires a token restricted to the canonical MCP resource (usually `aud`). Supabase documents Custom Access Token Hooks for setting `aud`, but **end-to-end preservation/validation of the original `resource` parameter with the ChatGPT client has not been demonstrated**. Do not issue broadly reusable `aud=authenticated` tokens as QRVAI MCP access tokens. If the issuer cannot satisfy this without unsafe assumptions, compare a different managed IdP before integration.
3. **Algorithm compatibility:** the repository verifier is RS256-only. Confirm the actual Supabase project's asymmetric signing method and JWKS *before* touching production routing; do not permit `none`, HMAC fallback, or arbitrary remote JWKS URLs.
4. **OpenAI client contract:** verify exact issuer metadata and `iss` callback identification, `S256` PKCE, client identification via supported CIMD/DCR/pre-registration, the actual ChatGPT management-page redirect URI, and an HTTP 401 challenge with `resource_metadata`.
5. **Vercel protection:** preview SSO currently enabled. A READY deployment is not a ChatGPT-reachable OAuth callback or an authenticated MCP invocation. Do not disable protection, create a permanent bypass, publish DNS, or expose an endpoint as a workaround without a separately reviewed access design.
6. **Provider state:** the dedicated Supabase project now exists; no live token issuance, user registration, client registration, Auth hook, or production OAuth enablement is authorized by this ADR.

## Recommended implementation sequence, in the same draft PR

1. Implement a **provider-independent contract test** for RFC 9728 resource metadata, 401 challenge, exact issuer, audience and S256 discovery; keep test fixtures synthetic and fail-closed.
2. Create an isolated credentialed OAuth HTTP path, reusing the existing verified-principal seam. Default remains shared-Bearer private preview until explicit, validated environment configuration. Never infer a principal from an unverified JWT.
3. Implement a trusted client/user-to-internal-permissions adapter. Test uninvited users, unsupported external scopes, absent `aud`, wrong issuer/client, revoked or expired grants, key rotation, two concurrent users and direct RPC bypass. Keep private station/log tools excluded.
4. Once existing Supabase project ownership, provider resource binding and authorization policy are verified, configure **invite-only Auth in that existing project**, the minimum login/consent UI and a securely restricted preview integration. Keep `app_metadata`/server grants authoritative; never use editable `user_metadata` for access decisions. Apply RLS to any exposed custom tables.
5. Only then run an independently observed **real protected HTTPS + ChatGPT OAuth/PKCE + tool/academy** acceptance on the exact deployed Git SHA. Record actual evidence in `qa/mcp/host-report.example.json` successor without setting examples or synthetic tests to PASS. Preserve the current private plugin and the canonical PR.

## Acceptance / non-goals

- OAuth metadata and client registration have conformant, externally verified behavior; tokens are bound to the exact QRVAI MCP resource, not simply logged-in Supabase sessions.
- Failed/weak/missing configuration, forged/malformed/expired/wrong-audience tokens and unauthorized tools never fall through to shared bearer, public test mode or user-chosen tenant scopes.
- Private users see only tools permitted by verified per-user grants; 54 source registrations do not imply 54 tools necessarily granted to every client.
- No public listing, monetization, automated CAT/PTT, actual RF emission, production traffic promotion or claim of host acceptance is authorized by this document.

## Primary references (consulted 2026-11-17)

- Supabase OAuth Server: https://supabase.com/docs/guides/auth/oauth-server
- Supabase OAuth Flows (standard scopes only; custom scopes not yet supported): https://supabase.com/docs/guides/auth/oauth-server/oauth-flows
- Supabase OAuth with MCP: https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication
- Supabase authorization / custom token audience: https://supabase.com/docs/guides/auth/oauth-server/getting-started
- OpenAI plugin MCP OAuth contract: https://developers.openai.com/plugins/build/auth

**Evidence state:** design recorded only. Supabase QRVAI project provisioning, OAuth/PKCE production path, login UI, ChatGPT host invocation and new executable tests: **NOT EXECUTED** by this ADR.

## 2026-11-17 P0 finding — strict provider-resource hold

Official [OpenAI Plugins OAuth requirements](https://developers.openai.com/plugins/build/auth) require the OAuth `resource` indicator in **both** authorization and token exchanges, and a signed access token bound to the canonical MCP resource. The [Supabase OAuth 2.1 flow guide](https://supabase.com/docs/guides/auth/oauth-server/oauth-flows) documents OIDC scopes `openid`, `email`, `profile`, `phone`, **not** app-specific QRVAI scopes; those OIDC scopes must not be treated as QRVAI authorization grants. The [Supabase Custom Access Token Hook guide](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook) documents `user_id`, `claims`, `authentication_method` and a client-ID field in examples but does **not** establish that the hook receives the original OAuth `resource` parameter or that token exchange binds it. Setting `aud` from only a hardcoded client mapping **does not prove RFC 8707 resource propagation**.

- **Verified locally (offline):** a regression test established that Vercel's OAuth metadata route advertised configured metadata despite the HTTP MCP endpoint being shared-bearer only; the route is now source-locked to 503 until the real OAuth integration is reviewed and wired.
- **BLOCKED / NOT_EXECUTED:** no real consent + authorization-code/PKCE + token-exchange receipt proves the `resource` indicator survives both hops and controls signed `aud`. Earlier synthetic ES256 tests prove cryptography only. Project OAuth settings / live discovery may still require independent verification.
- **Next safe provider test:** private invited test user and one exact ChatGPT-registered client, capture **redacted** request fields `resource` at both steps, inspect locally verified JWT `aud`, `client_id`, `scope` and `sub`, and attempt a second-resource negative case; do not store authorization codes, refresh tokens or access tokens in the repo.
- **Decision:** do not enable or advertise live OAuth, wire an OAuth verifier into `/api/mcp`, grant internal tool access from `openid`, or relax audience checks until [resource binding gate](../../qa/mcp/RESOURCE-PARAMETER-GATE-2026-11-17.md) is satisfied. If the provider cannot bind resources without bypasses, choose a standards-conformant managed authorization server or a separately reviewed secure token exchange design.

## 2026-11-17 — Source-level internal OAuth client/grant adapter (G7 preparation)

PR #53 now includes `src/http/oauth-principal.ts` and `test/oauth-grants.spec.ts`:
- The *actual* JWT verifier still validates signed asymmetric algorithm, exact HTTPS `iss` and MCP `aud`, `exp`, `nbf`, trusted JWKS and a configured OIDC scope. A new strict client-bound variant additionally requires an issuer-signed, syntactically valid `client_id`, without changing existing verifier return contracts.
- `createOAuthPilotPrincipalVerifier` maps the signed `(issuer, sub, client_id)` tuple to an injected **trusted server-owned** grant reader. There is **no fallback** to OIDC `openid`, editable user metadata, callsign, or client parameters as a tool grant. Active status, exact identity/client matching, tenant identifier, immutable expiry and permit-list validation are fail-closed.
- Only `qrvai:tools:read` and `qrvai:user-data:process` are eligible *pilot* internal permissions. **Station/log owner-dependent tools intentionally remain excluded**, regardless of what signed token or grant record says, until a real server-side ownership resolver exists. Unsupported permissions cause the whole grant to be rejected.
- Tests cover signed and tampered tokens, missing `client_id`, wrong audience/issuer, OIDC-vs-internal scope isolation, missing/revoked/expired or cross-client grants, grant store failure, actual MCP SDK `tools/list` filtering, and two concurrent identities.
- **NOT wired to Vercel `/api/mcp`**, which remains shared-Bearer-only. There is **no grant database/table, no user invitation or issued token, no live provider resource indicator proof, no durable quota, no approved OAuth host**. A future production grant reader must query a trusted service store per request, account for revocations, and never take subject/tenant/grant data from request-controlled arguments. Existing G1–G8 holds remain.

This prepares source-level authorization, not a G7 production PASS or permission to route traffic.

## 2026-11-17 — Proposed Supabase grant store, NOT APPLIED

- Added a narrowly scoped, review-only SQL candidate in `docs/sql/qrvai-mcp-grants.proposed.sql`, **not** in an auto-run migration directory. It creates no rows or users, grants no public/anon/authenticated table access, enables + forces RLS without client policies, and permits only `SELECT` to Supabase `service_role`. Project Auth subjects are UUIDs and the issuer is constrained to the existing dedicated QRVAI Auth project. No station/log permission can be stored.
- Added `src/http/supabase-grants.ts`, a source-only PostgREST reader locked to the known Supabase project URL. It requires a `sb_secret_*` backend key sent **only in the `apikey` header**, selects grants by exact issuer + subject + OAuth client, enforces a single matching row and never caches successful lookups. HTTP errors, duplicate rows, malicious cross-client/tenant replies and invalid config fail closed. No key was retrieved, deployed, committed, or stored in this repo.
- Added offline tests `test/supabase-grants.spec.ts` with synthetic, non-sensitive API keys and mocked HTTP responses, including source checks of the proposed RLS/ACL. These tests are **not** proof of real database RLS, SQL migration execution, or OAuth resource binding.
- **Real Supabase project unchanged.** Read-only SQL confirmed no `qrvai*` tables in `public` or `qrvai_private` at inspection. The complete G7 live gate still requires reviewed manual grant migration, invited user/client, server secret provisioning, verified RFC 8707 token issuance, and an approved HTTP wiring change, none of which occurred.

Supabase official API-key documentation now recommends `sb_secret_*` in the `apikey` header; do not send such a key as `Authorization: Bearer`. A backend secret bypasses RLS: grant decisions stay server-side and the table ACL must be reviewed before use.

## 2026-11-17 — Public issuer/JWKS vs canonical-host deployment check

The fresh read-only acceptance evidence is recorded in [the resource-indicator gate](../../qa/mcp/RESOURCE-PARAMETER-GATE-2026-11-17.md#2026-11-17--fresh-public-https-evidence-read-only-no-login). The known Supabase issuer returned **HTTP 200** OAuth discovery and **HTTP 200** ES256 P-256 public JWKS, with support for S256 (also advertises plain; do not use). Its reported scopes include `offline_access`, but no authorized token/refresh flow was executed. The canonical Vercel `qrvai-rf-mcp.vercel.app` protected-resource URL returned **HTTP 404 DEPLOYMENT_NOT_FOUND**; a protected READY preview does not establish ChatGPT reachability.

This strengthens G6 discovery only. RFC 8707 resource-to-signed-`aud`, real OAuth client, owned grants and ChatGPT host are **not verified**. Neither production hosting nor the private plugin has been changed.

## 2026-11-18 — Supabase JWT `scope` claim compatibility (source-level)

Official Supabase OAuth 2.1 [flow documentation](https://supabase.com/docs/guides/auth/oauth-server/oauth-flows) shows OAuth scopes (including `openid`) in **the token endpoint JSON response** but does not include a `scope` or `scp` claim in the documented OAuth **access JWT**. Previously the QRVAI pilot's strict JWT scope predicate would reject such validly signed Supabase access tokens even if the provider later issues the correct MCP audience.

The verifier now supports an **explicit, narrow** `allowMissingScopeClaimOnClientBoundToken` mode enabled only by `createSupabaseOAuthPilotHandler`: it permits absence of **both** JWT scope claims ONLY when a signed nonempty OAuth `client_id` is present. An explicitly incorrect JWT scope, issuer, audience, algorithm, signature, client ID, or expired token still fails. A trusted matching **issuer + subject + client_id** grant in the private server-owned store remains mandatory on every request; no OIDC scope ever creates a QRVAI tool permission. The default generic verifier and its old tests continue to require `requiredScope` exactly. An offline regression proves that scope-less Supabase-format JWTs with a grant work while missing signed client IDs and missing grants cannot work.

This fixes a **source compatibility bug**, not Supabase's unresolved RFC 8707 resource-parameter handling, OAuth account/consent/registration, Vercel ingress or ChatGPT host acceptance. The actual Vercel MCP HTTP route remains shared-Bearer-only, and the OAuth pilot stays source-only.

## 2026-11-18 — **REAL** dedicated Supabase grants migration and least-privilege audit

**Database mutation completed:** applied Supabase migration `20261118032317_qrvai_oauth_pilot_grants_rls_read_only_20261118` on the dedicated `qrvai-auth` project `ujhkqfvxpgpkearukvmh`, using the reviewed contents of `docs/sql/qrvai-mcp-grants.proposed.sql`. This **supersedes older historical NOT APPLIED status above**. A live read-only SQL audit confirmed the table exists with **0 rows**, `relrowsecurity=true`, `relforcerowsecurity=true`, **0 RLS policies**, `anon` and `authenticated` have **no SELECT**, and the Supabase `service_role` has **SELECT only (no INSERT/UPDATE)**. Its PostgreSQL role has `BYPASSRLS=true`. At inspection there were still **0 Auth users and 0 OAuth clients**. No secret key was retrieved/provisioned, no grant inserted, and no OAuth endpoint activated.

**Additional source-only candidate:** `docs/sql/qrvai-oauth-audience-hook.proposed.sql` is a **NOT ACTIVE** custom access token hook. It preserves all existing token claims and sets the **single pinned MCP audience** only on non-anonymous Supabase OAuth-client token issuance/refresh when an active unexpired *server-owned* grant exactly matches signed `sub + client_id`. It restricts SQL function invocation to `supabase_auth_admin` and is protected by `SECURITY DEFINER` with empty `search_path`. It is kept inert and must not be activated by a database migration or dashboard configuration before real provider/resource tests; even an active hook cannot prove **RFC 8707** because it does not observe the requested `resource`. Deployment must remain blocked until the actual issuer/server and ChatGPT end-to-end evidence has passed.
