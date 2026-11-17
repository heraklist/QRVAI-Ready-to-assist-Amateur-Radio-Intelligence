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
