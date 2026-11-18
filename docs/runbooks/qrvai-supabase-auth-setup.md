# QRVAI: Supabase Auth private OAuth/PKCE setup runbook

**Date reviewed:** 2026-11-17
**Review boundary:** [Draft PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53), NOT production acceptance.
**Supabase project:** [qrvai-auth](https://supabase.com/dashboard/project/ujhkqfvxpgpkearukvmh), ID `ujhkqfvxpgpkearukvmh`, heraklist's Org, `eu-central-1`.
**Evidence:** API `get_project` returned `ACTIVE_HEALTHY`; `list_migrations` returned an empty array; security advisors returned zero lints. This **does not prove** OAuth is enabled or policies are correctly configured.

## Purpose

Configure a single-purpose private QRVAI identity provider for a later consent-based ChatGPT OAuth authorization-code + PKCE flow. The Vercel Streamable HTTP MCP endpoint and the **existing private** ChatGPT QRVAI identity remain unchanged until a secure owner-reviewed E2E test. This runbook is an operator checklist; no cloud setting is represented as executed by merely documenting it.

## Immediate owner-only Supabase dashboard steps

1. **Protect admin access:** finish Supabase account MFA recovery codes and backup authentication method privately. Never paste recovery codes, API keys or JWTs into ChatGPT, GitHub or screenshots.
2. **Verify private enrollment:** in `Authentication`, find the email sign-up configuration (usually `Sign In / Providers` → `Email`) and disable **new public user signups**. Keep `Confirm email` enabled. Admin invitations, rather than public self-registration, will provision the first private users. Don't claim this has been changed until observed.
3. **Enable authorization server:** visit `Authentication` → `OAuth Server`. Enable **OAuth 2.1 Server** for this project (Supabase documents the feature as beta).
4. **Consent route:** plan `Authorization Path = /oauth/consent`. The actual full consent URL will be `Site URL + /oauth/consent`; it must point to a REAL deployed QRVAI login/consent UI. **Do not invent a Site URL, publish an incomplete consent route, or invite clients to authorize before that page is implemented and tested.**
5. **Client registration:** leave **Dynamic Client Registration disabled** until a controlled ChatGPT client-registration strategy (CIMD, DCR or exact pre-registered ChatGPT redirect/client ID) and authorization policy are reviewed. In particular, if the ChatGPT host requires DCR, enable it only with explicit consent, redirect-validation and an owner-reviewed registration policy. Do not presume DCR is already active.
6. **Token signing:** inspect `Authentication` → `JWT Signing Keys`. For the current QRVAI `oauth-verify.ts` only **RS256** with issuer-owned HTTPS JWKS is implemented. Do not switch to HS256 or simply accept any signing algorithm; if the available project uses ES256, extend and test the verifier BEFORE a live connection. Never share signing secrets.
7. **URL configuration:** do not set an arbitrary redirect, callback or `Site URL`. Once the consent UI has an actual approved HTTPS host, configure that exact origin and the required callback URIs according to Supabase and ChatGPT's *observed* OAuth management settings.
8. **Evidence:** record settings screenshots with secrets and personal information removed, official OAuth discovery metadata and JWKS key type/algorithm, plus a negative test proving unauthenticated tools remain unavailable.

## Documented Supabase OAuth endpoints (not yet observed as enabled)

- Issuer base: `https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1`
- OAuth server discovery: `https://ujhkqfvxpgpkearukvmh.supabase.co/.well-known/oauth-authorization-server/auth/v1`
- Token endpoint: `https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1/oauth/token`
- JWKS: `https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1/.well-known/jwks.json`

URLs are formed from Supabase's official template and the project ref; **not** evidence of endpoint reachability or enabled OAuth. Do not leak tokens in HTTP query strings.

## Resource server / ChatGPT hard blockers

- `api/mcp.ts` still uses a server-wide shared Bearer secret, not a verified individual OAuth principal.
- A fail-closed RFC 9728 resource-metadata route is staged separately; this does not enable MCP OAuth or ChatGPT tool use.
- Supabase OAuth currently advertises standard scopes (e.g. `openid`) rather than QRVAI's custom internal permissions; the service must apply **server-owned** user/client entitlement mapping **after** cryptographic JWT validation.
- OpenAI requires resource binding: the OAuth `resource` parameter on authorization/token requests must be reflected in the issued access token (typically `aud`) and **validated by the MCP resource server**. This has not been observed for this provider/project. **A generic `aud=authenticated` JWT is not accepted as QRVAI MCP authorization.**
- The issuer must publish `S256` PKCE, suitable client-registration metadata and token-auth methods, and implement a real consent UI with both Approve and Deny using `supabase.auth.oauth.getAuthorizationDetails`, `approveAuthorization` and `denyAuthorization`.
- Vercel Preview deployment protection is on; `READY` alone does not establish ChatGPT OAuth reachability. Do **not** disable Deployment Protection, switch to public access, or bypass an identity check for convenience.
- No extra Postgres schema, permissions/payment table, OAuth user accounts, ChatGPT connector configuration, JWT verifier cutover or production route was created by this runbook.

## Explicit acceptance

**V0 skills-only:** eight reviewed response behaviors, separate from host execution.
**V1 MCP:** `NOT_EXECUTED` until exact-SHA external evidence of a restricted HTTPS endpoint, OAuth/PKCE handshake, correct resource-bound JWT, server-owned per-user grants, host-visible tools, live `academy_catalog` and same-conversation follow-up. Do not treat Supabase admin MFA, user login, or an issued token as radio operator licensing.

## Primary official sources

- Supabase OAuth Server setup: https://supabase.com/docs/guides/auth/oauth-server/getting-started
- Supabase MCP OAuth: https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication
- OpenAI plugin authentication requirements: https://developers.openai.com/plugins/build/auth
- Security boundaries: [ADR-0014](../architecture/ADR-0014-supabase-oauth-mcp-compatibility.md)

**Runbook authoring state:** PROJECT HEALTH VERIFIED; AUTH SETTINGS NOT YET OBSERVED OR MUTATED; V1 HOST NOT EXECUTED.
