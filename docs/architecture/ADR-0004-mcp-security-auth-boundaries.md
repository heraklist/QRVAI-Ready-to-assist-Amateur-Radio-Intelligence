# ADR-0004 — QRVAI MCP authentication & authorization boundaries

Date: 2026-10-16 · Status: **Proposed / gated** · Depends on Draft PR #27 · Vercel-only

## Observed baseline (not a security certification)

At parent SHA `3b48a3813110540821c2c264df30d39ea91ea034`, the HTTP adapter in `mcp/qrvai-rf-worker/api/mcp.ts` accepts only POST /api/mcp, rejects missing server secret with HTTP 503, uses constant-time comparison for one shared static bearer token, checks Origin and request limits, and returns a stateless JSON Streamable HTTP MCP response. No OAuth authorization server, dynamic client registration, authorization code + PKCE flow, per-user consent, signed/scoped access tokens, refresh-token rotation, or issuer discovery is present in the reviewed adapter. `test/vercel-protocol.spec.ts` locally exercises the 38 registered tools through a test-supplied secret; that does not establish public ChatGPT-host interoperability. The implementation is a **private service-key gateway**, not end-user OAuth.

Vercel SSO/Deployment Protection is a *different layer* from MCP client authentication. A deployment reaching READY does not prove that a ChatGPT host can navigate protected preview access. Never turn off deployment protection merely to make host validation pass.

## Target boundaries and approach (not implemented yet)

1. **Resource server:** keep the MCP adapter on Vercel. Require issuer-bound bearer access tokens, JWT signature validation via cached JWKS, strict algorithms, `iss`, `aud` (canonical HTTPS resource URL), `exp`, `nbf`, and clock-skew bounds. Reject bearer from query strings and never log token values. Introduce token version/rotation and auditable key IDs.
2. **Authorization server:** choose a verified OAuth 2.1/OIDC-compatible provider or explicitly implemented authorization server. ChatGPT compatibility must be independently demonstrated against the host's current requirements; an OIDC ID token is **not** an MCP access token. Implement Protected Resource Metadata discovery and Authorization Server Metadata with actual registered endpoint URLs, only after provider selection.
3. **Client onboarding:** support authorization code + PKCE S256, state, redirect URI allowlisting, per-client consent, access-token expiry, and revocation. Investigate whether ChatGPT integration requires Dynamic Client Registration or Client ID Metadata Documents. Do not assert these requirements without host acceptance evidence.
4. **Authorization per tool:** classification matrix: public-input deterministic offline calculations, user-provided datasets, private station/device state, external provider credentials, and irreversible/high-impact actions. Map scope checks at `tools/list` and `tools/call`; deny by default for station/device/profile/log read/write, not just in the UI. Avoid implying that read-only means public or non-sensitive.
5. **Tenancy:** require a real principal and tenancy identity for profile/status/log/provider integrations; never multiplex all users through the shared `QRVAI_MCP_BEARER_TOKEN`. Prevent confused-deputy and cross-tenant reads; invalidate deleted/revoked user sessions promptly.
6. **Traffic safety:** preserve Host/Origin verification, 64KiB body ceiling and no-store, add Vercel edge/WAF throttling and structured error telemetry without user secrets. Model CORS/preflight separately from bearer authentication; no permissive `*` + credentials.
7. **Secrets:** supply only via Vercel encrypted/sensitive project environment variables and correct environment scopes; do not commit, echo, or paste secrets in PRs or conversations. Prefer least-privilege provider credentials, documented rotation, immediate revocation.
8. **Fail closed:** do not enable new access paths, OAuth discovery, or public deployment before token validation and integration tests cover malformed signatures, wrong issuer/audience/scope, expired/not-before tokens, cross-tenant access, key rotation, invalid Origin, 413 oversized payloads, and denial of unconfigured auth.

## Proposed phases and evidence

| Step | Required evidence | State |
|---|---|---|
| 4.2.1 Current auth boundary audit | Actual adapter and protocol test reviewed | **DOCUMENTED** |
| 4.2.2 Provider/host auth contract | Real host compatibility research; provider tenancy, redirect and DCR choice | **OPEN** |
| 4.2.3 Secure resource-server implementation | TDD RED→GREEN and locally verified signature/scope tests | **OPEN** |
| 4.2.4 Encrypted secrets and preview | Env configuration verified without disclosing values; protected HTTPS test | **OPEN** |
| 4.2.5 Real ChatGPT connection | OAuth authorization, list 38 tools and call representative tools with a real test account | **OPEN** |
| 4.2.6 Independent security review | Dependency, logging, abuse/rate-limit and authorization matrix sign-off | **OPEN** |

**Release rule:** PR remains Draft. Neither merge to `main`, production promotion, deployment-protection relaxation, nor claims of ChatGPT/OAuth readiness are authorized by this decision record.
