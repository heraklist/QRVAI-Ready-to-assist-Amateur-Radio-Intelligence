# Phase 4.2.3 — Declarative MCP authorization policy (Draft)

2026-10-16. Depends on Draft PR #30. **Not activated at runtime**.

- Exact registry is 38 MCP tool names from `IMPLEMENTED_TOOLS`; unknown tools fail closed.
- `qrvai:tools:read`: impersonal deterministic educational calculators and discovery.
- `qrvai:user-data:process`: input-only datasets, unverified supplied station-like data, document excerpts, ADIF, source snippets and synthetic educational operations; no inference that input is publicly shareable.
- `qrvai:station:read`: station snapshot and status, both require an authenticated tenant and resource owner tenant match.
- `qrvai:logs:read`: log award progress, requires tenant match.
- Missing principal, user subject, tenant or matching scope always denies; discovery filters tool names by declared scope.

**Not a live security boundary:** `authz-policy.ts` is pure and is **not** invoked by the registered MCP server, nor yet coupled to an OAuth authorization provider, so end users do not yet get per-tool isolation. The `tenantId` argument must ultimately be produced by trusted server-side resource resolution, never accepted from caller-controlled tool arguments. Resource ownership and consent need real backing persistence or verified data grants; user-supplied previews must not be misrepresented as protected stored accounts. Authorization must be checked independently in both tools/list and tools/call via SDK middleware/registration boundary. Test before use with two real principals, cross-tenant resources, stale/revoked sessions and no default scope.

Provider, issuer, signed aud-scoped tokens, metadata discovery, rate limiting, consent and host handshake remain unverified. Do not merge/publish/promote/disable Vercel deployment protection.
