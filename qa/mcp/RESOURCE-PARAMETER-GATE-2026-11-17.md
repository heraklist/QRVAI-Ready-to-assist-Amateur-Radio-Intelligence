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
