# QRVAI MCP — canonical HTTPS resource & Vercel host-reachability gate

Date: 2026-11-17 · PR #53 · **Design/CI only; NOT an authorized publication**

## Chosen stable resource identifier (G1 candidate)

`https://qrvai-rf-mcp.vercel.app/api/mcp`

This is the **existing verified project domain** plus the existing Vercel MCP path, not a new host or a new plugin ID. It is a **canonical target**, not evidence that production has the PR #53 code, that a caller can access it, or that OAuth works there. The private plugin remains skills-only until the end-to-end gate.

When the target becomes operational, the **same exact string** must appear in (a) the ChatGPT MCP connector URL and both RFC 8707 `resource` parameters, (b) the RFC 9728 protected-resource `resource` field, (c) the issued, cryptographically verified JWT `aud`, and (d) the MCP verifier expected audience. A preview alias is a **different OAuth resource** and must never share access tokens with this stable host.

## Current deployment evidence and constraints

- Vercel team `heraklists-projects`, project `qrvai-rf-mcp`, Node 24.x; verified project domain `qrvai-rf-mcp.vercel.app`.
- On 2026-11-17 the project reports `ssoProtection.enabled=true`, `deploymentType=all_except_custom_domains`, and the latest PR #53 `c56d660445636746634c47e033d8909070670b5d` preview `READY`, `target=null`. A `READY` build proves **neither ChatGPT network reachability nor production alias assignment**.
- The Vercel-generated deployment URL is protected. Vercel documentation states its deployment protection happens **before** the app route handler; a ChatGPT MCP HTTP client cannot be presumed to inherit a logged-in Vercel team browser session.
- The existing `.vercel.app` domain is a verified project domain, but **not evidence of an OAuth-ready endpoint**. The configured `all_except_custom_domains` protection does not itself qualify it as publicly accessible.
- No new domain/DNS, exception, bypass header or secret, Vercel project protection change, production promotion, merge, OAuth token or external host test was made by this step.

## Safe source contract implemented in this PR

1. Vercel supports both root `/.well-known/oauth-protected-resource` and path-aware `/.well-known/oauth-protected-resource/api/mcp`, routing to the same metadata handler. They remain intentionally **503** because `OAUTH_MCP_HTTP_WIRED=false` until OAuth is actually wired.
2. Metadata source only admits resource paths exactly `/api/mcp`, an HTTPS issuer, a request on the same configured origin, and one of those two well-known paths; wrong aliases return **404** and wrong settings return **503**.
3. The verified-principal MCP seam rejects a request whose actual URL origin is not the configured JWT resource audience, including a preview alias. The current deployed handler still runs its separate shared-bearer preview gate and has **not** been switched to OAuth.
4. No OAuth discovery or user access is advertised prematurely; per-user verified JWT audience **must** be bound to the actual stable endpoint before enabling the path.

## Host-reachability acceptance sequence — not yet executed

1. Inspect exact production domain assignment/target and independently GET metadata and POST a missing-Bearer challenge at the **same** host from a non-Vercel session. Expect a protocol-level `401 WWW-Authenticate: Bearer … resource_metadata="…"`, not HTML login, 302, 403 platform denial, or a static 503 gate. These expectations apply only **after verified OAuth wiring**.
2. Choose an externally reachable HTTPS endpoint via an explicit approved rollout that preserves protection for all previews. If the project remains Vercel-SSO protected and the host sees a Vercel login, **STOP**; do not distribute bypass secrets to ChatGPT, put bypass secrets in the MCP URL, use shareable links or relax deployment protection as an ad-hoc solution.
3. Record sanitized GET/POST receipts, URL (without credentials), status, redirect chain, content-type, exact deployed Git SHA, RFC 9728 metadata and the issuer discovery. No tokens, cookies or authorization codes in CI artifacts/repo.
4. Validate the **Supabase OAuth token issuer** independently for RFC 8707 `resource` on both authorize/token requests and exact JWT `aud`. Supabase's generic `aud=authenticated` is **not** accepted as a QRVAI MCP audience. Do not enable OAuth routing if this gate fails.
5. Once a reviewed resource-bound issuer + private user/client consent + internal entitlements pass, enable the OAuth-only MCP handler in a separately approved deployment; then link the **existing private plugin** and verify real ChatGPT `tools/list`, safe tool calls and denied tools.

**Evidence status:** G1 candidate URL/source invariants prepared; external endpoint reachability, OAuth issuing, principal verification on Vercel, plugin connection, and production access **NOT_EXECUTED / BLOCKED**.

Official references: https://ts.sdk.modelcontextprotocol.io/v2/serving/authorization · https://vercel.com/docs/deployment-protection · https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection · https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication

## External host probes (uncached, unauthenticated) — 2026-11-17

- `GET https://qrvai-rf-mcp.vercel.app/.well-known/oauth-protected-resource`: **404 DEPLOYMENT_NOT_FOUND**, Vercel HTML error page; the verified domain is presently **not mapped to a serving deployment**. This is a live read-only network observation, not a production configuration change.
- `GET https://qrvai-rf-ij2cn7cpy-heraklists-projects.vercel.app/.well-known/oauth-protected-resource/api/mcp`: the external fetch reached a **Vercel protected-deployment login redirect** and ended on `vercel.com/login` HTML, *not* QRVAI OAuth metadata. The tool's final page reported 200 for the Vercel login **after redirect**, which is emphatically **not** a 200 response from the QRVAI OAuth endpoint.
- Hence **G1 network gate remains BLOCKED**, separate from the Supabase RFC 8707 issuer blocker. It would be incorrect to report an operational endpoint simply because the Vercel build is `READY`.
- The source-only verified-principal seam now emits `WWW-Authenticate: Bearer resource_metadata="<canonical host>/.well-known/oauth-protected-resource/api/mcp"` for absent/invalid tokens **only after** configured origin, method, issuer and resource checks. The deployed shared-Bearer handler and disabled metadata route remain unchanged; this header is not yet seen on the real host.
- Release requirement: an explicitly authorized, domain-mapped, externally reachable deployment with OAuth-only authentication and controlled budgets, without granting unauthorized tools, public sign-up, deployment-bypass secrets or browser cookies to a ChatGPT client.
