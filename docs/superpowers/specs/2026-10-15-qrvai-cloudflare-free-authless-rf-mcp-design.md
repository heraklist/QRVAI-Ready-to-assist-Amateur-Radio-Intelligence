# QRVAI — Cloudflare Workers Free, No-Login RF MCP Design

**Date:** 2026-10-15  
**Status updated 2026-10-15:** **OWNER-APPROVED WRITTEN SPEC for implementation planning** — the owner explicitly approved this document in Draft PR #8 and requested a detailed Native TDD implementation plan with per-task review. The plan has now been drafted for its **own, separate owner approval**; no product implementation, Worker, MCP endpoint, Plugin Creator mutation, merge or host acceptance test has been executed.  
**Related:** [V1 upgrade decision / Issue #6](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6) · [Old creator identity blocker / Issue #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3) · [V0 Skills-only source](../../../qrvai/) · [ChatGPT-first requirement](../../architecture/chatgpt-first-experience-v0.5.md)

## 1. Purpose, approved direction, and success criteria

The owner will use QRVAI **personally in existing ChatGPT conversations**. Simplicity matters more than speculative enterprise authentication: avoid recurring OAuth consent/login for ordinary RF calculations. The owner selected **Cloudflare Workers Free** as the target host and agreed that the **first remote MCP service may be anonymous**, provided that it processes **only non-sensitive, deterministic, read-only RF calculations**. The intended ChatGPT plugin remains **private/personal**.

The owner separately approved this **written specification for planning** on 2026-10-15. The owner has **not yet approved the separately drafted implementation plan**, source implementation, deployment, secrets/billing changes, creating/replacing the QRVAI account plugin, public plugin submission, or an automatic merge.

Success means a real Worker hosted on a verified free account serves a standards-compatible remote MCP tool that produces known numeric results with documented units, without requiring the user to log in on each call. A later and separately authorized fresh QRVAI plugin must successfully invoke the tool in a real ChatGPT host while satisfying the owner's **`@QRVAI` in an already-open conversation** requirement, or explicitly mark that host UNSUPPORTED. No host success may be inferred from GitHub unit tests.

**Critical distinction:** `PRIVATE` ChatGPT-plugin discoverability controls who can install/access the *plugin*, not who can call an Internet-facing unauthenticated **Cloudflare `/mcp` URL**. That endpoint is publicly reachable and may consume the shared Workers Free quota. No URL-obscurity claims, caller-identity claims, or false guarantees of exclusive personal use.

## 2. Architectural alternatives and decision

| Option | Everyday friction | Security/compatibility | Decision |
| --- | --- | --- | --- |
| **A. Stateless anonymous read-only Worker** | No OAuth prompts for calculations | Public endpoint; limited to impersonal computations; traffic abuse can exhaust free quota | **SELECTED first slice** |
| B. OAuth for every MCP operation | Account-linking flow; token reuse is host-dependent | Suitable when private data or write operations exist | Deferred, not needed for impersonal RF math |
| C. `mixed` public and authenticated tools | Zero login for calculations, scoped linking for private services | Supported in current OpenAI auth metadata, but lifecycle and host integration require evidence | Possible separate future design, NOT V1 initial slice |

Neither a fake/dummy `mcp.json` nor an empty MCP endpoint may be introduced merely to work around account update limitations. The selected slice contains one **real** tool and one separately reviewable Worker service.

## 3. Components, isolation, and data flow

### Architectural boundary

```text
QRVAI private ChatGPT plugin (future, separately created)
    ├── Existing V0 Skills (instruction and safe routing)
    └── Future MCP registration with real verified URL (not yet present)
           ↓ HTTPS /mcp, Streamable HTTP, auth none
Cloudflare Workers Free — one stateless Worker
           ↓ MCP SDK handler / tool input validation
    rf_power_convert — pure deterministic unit conversion
           ↓ bounded numeric result, units, assumptions, no identity
ChatGPT response in Greek/English (text first; no MCP App required)
```

- **Worker runtime:** Cloudflare Workers with TypeScript and the current supported stateless `createMcpHandler` interface for **Streamable HTTP** on `/mcp`. Use pinned tested versions of runtime, MCP SDK and lockfile in a later approved implementation plan. Do not select deprecated SSE-only implementation templates. Avoid Durable Objects, KV, D1, Workers AI, AI Gateway, Browser Rendering, third-party APIs or a separate identity service for the first slice.
- **MCP protocol:** use the handler's supported `initialize`, `tools/list`, and `tools/call` lifecycle; no custom nonstandard pretending-to-be-MCP POST endpoint. Do not invent complete transport negotiation behavior before implementing and testing with a real client.
- **Tool metadata:** `rf_power_convert` has a precise description, a strict validated JSON input schema, an appropriate read-only/no-side-effect annotation and a machine-readable output with unit labels. The tool performs **no network/subrequests**, device operations, database writes, or external data retrieval.
- **ChatGPT routing:** existing V0 Skills remain unchanged until a separately reviewed integration. Once a real Worker endpoint passes integration testing, a future approved plugin package may include `mcp.json` with the actual HTTPS URL and server auth `none`. No fabricated server address, tool name or current-host availability in V0.
- **User data boundary:** calls must not require or accept call signs, location/QTH, contact information, licence identity, station inventory, ADIF/logbook files, private tokens, messages or radio-control commands. Refuse unknown input keys.

## 4. First tool contract: `rf_power_convert`

**Purpose:** lossless-in-intent (up to defined floating-point precision) conversion among logarithmic and linear power units. This tool does **not** calculate legal transmit permission, RF exposure, antenna gain, propagation, duty cycle or transmitter state.

**Input:** JSON object with exactly two fields: `value` (finite JSON number) and `unit` (one of `W`, `mW`, `dBm`, `dBW`). No free-form text, device credentials or arbitrary computation expressions. Both keys required and `additionalProperties: false`. Reject non-numbers (including booleans), NaN/Infinity, missing data, and zero or negative linear power.

**Bounded operating domain:** compute the equivalent `dBm`; accept only `-270 ≤ dBm ≤ +270`, including for `W`, `mW`, and `dBW` inputs. For valid linear input, `W = 10^((dBm - 30)/10)`, `mW = 10^(dBm/10)`, and `dBW = dBm - 30`. Reject overflow/underflow/out-of-bounds and nonfinite intermediate or output values. A numerical tolerance around the derived bound may be chosen by tested floating-point analysis; never silently clip values.

**Output:** machine-readable fields `W`, `mW`, `dBm`, `dBW`, a unit-convention label and bounded precision/rounding note. No statement that the result measures a real device, is a calibration certificate or authorizes RF transmission. Return the same information in a plain-text fallback for clients that do not render structured results.

**Known reference fixtures:** `100 W → 50 dBm / 20 dBW / 100000 mW`; `1 mW → 0 dBm / -30 dBW`; `1 W → 30 dBm / 0 dBW`. Round-trip and property tests must cover boundaries, near-zero positive linear power, incompatible types and nonfinite input sent programmatically. Future SWR/link-budget/feedline calculators require their **own** independently reviewed tool schemas and numerical tests rather than being asserted here as implemented.

## 5. Anonymous public endpoint threat model

The selected no-login approach is acceptable **only** for impersonal read-only math. Relevant threats and defenses:

- **Quota abuse:** anonymous callers can discover or scrape the endpoint and exhaust a Cloudflare Free shared quota. Set conservative input-size, request-rate and per-invocation budgets, reject methods/paths not required by the supported SDK and inspect actual Free-plan rate limiting/WAF features before choosing them. Platform DDoS protection is not a substitute for authenticated per-user limits, and IP throttling is not a guarantee. Document a graceful `service temporarily unavailable` behavior instead of unlimited retries.
- **Resource exhaustion:** limit inbound payloads **before** parsing when the runtime permits, and impose bounded JSON depth, tool input sizes, computation steps and response size. Avoid unnecessary loops and all external network calls. MCP protocol envelopes add overhead; test actual runtime CPU and memory, not only bare calculation speed.
- **Cross-origin/browser usage:** follow MCP security guidance for relevant `Origin` handling and host headers; do not assume permissive CORS or a hidden URL is an authorization mechanism. Do not break legitimate ChatGPT server-to-server calls with an unsupported origin requirement. Verify the deployed SDK behavior.
- **Sensitive information leakage:** no logging of full request/response bodies or operator identifiers, no analytics SDK, no storage or tracking cookies by design. Operational platform metadata (such as request time and network data) may still be processed by Cloudflare; **do not claim literal zero telemetry**.
- **Safety and physical actions:** never accept or implement CAT/PTT/rig commands, private station data reads/writes, live emergency messaging, personal records, transmission permissions or regulatory decisions in anonymous tools.
- **Dependency and supply-chain security:** lock versions, minimize bundled dependencies, isolate tests, review changes, do not include credentials in GitHub. Deployment credentials (if later needed) remain in supported Cloudflare/GitHub secrets, never pasted into chat.

**Escalation rule:** adding any personal-data, account-scoped, device-control or state-changing operation is a new **protected tier** requiring a separate spec and feasible security model, likely OAuth or another host-supported authorization method. `mixed` access is a future candidate, **not** an implicit grant.

## 6. Workers Free operating and cost envelope

At design time, official Cloudflare material describes **100,000 Workers Free requests per day per account**, a **10 ms CPU budget per HTTP request**, and **50 external subrequests plus 1,000 requests to Cloudflare services per invocation**. These are platform-level ceilings subject to change and sharing with other Workers on the account. The proposed pure RF tool should make **zero subrequests**; MCP protocol handling still consumes Worker CPU. Free-plan quotas do **not** certify that any chosen package, MCP SDK and negotiation path will meet the CPU limit.

Before deployment the implementation team must read the live account's actual plan, enabled features, current Workers usage and applicable limits. No automatic upgrade to a paid plan, new billing resource, hidden premium binding or external API subscription is allowed. Create explicit measurements in a staging or specifically approved controlled Worker deployment and record duration/CPU/requests by exact build SHA. Define a strict failure/stop policy when quotas or CPU constraints are exceeded. Availability is best-effort; not a paid SLA.

**Sources:** [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/) · [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [2026 subrequests change](https://developers.cloudflare.com/changelog/post/2026-02-11-subrequests-limit/) · [Cloudflare MCP transport](https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/) · [Cloudflare MCP handler](https://developers.cloudflare.com/agents/model-context-protocol/apis/handler-api/).

## 7. Plugin lifecycle and ownership gate

The current V0 is a **Skills-only GitHub source tree**, not an installed plugin. The former personal QRVAI creator-record with ID `plugins_6acf47f502dc8191bf542fe040d484d8` remains an unresolved deletion/name-collision obstacle ([Issue #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3)). Never update that record or use a `qrvai-2` workaround without explicit owner approval.

The current [OpenAI public plugin submission documentation](https://developers.openai.com/plugins/deploy/submission) says that adding an MCP server **after creating an existing skills-only plugin is not currently supported** on the public submission path. This documentation **does not conclusively establish** private personal Plugin Creator update semantics. Therefore, **before creating the first new QRVAI private plugin**, independently verify the applicable account lifecycle. The preferred candidate is to build and validate a **real** Cloudflare MCP first, then package that already-verified URL alongside the five existing Skills in the newly created plugin **if allowed by actual current personal-plugin behavior**. Alternatively choose a separately owner-approved V1 identity/recreation path. Do not conflate a source GitHub release or a Worker deployment with approval to call Plugin Creator.

Private Plugin Creator creation requires **separate explicit owner authorization**, old-record/namespace gate resolution, an actual archive inspection and a supported ChatGPT host test. `@QRVAI` invocation (plugin selection) is distinct from MCP **resource mentions**. ChatGPT capability remains NOT_EXECUTED until observed.

**Sources:** [OpenAI plugin packaging/auth](https://developers.openai.com/plugins/build/plugins) · [OpenAI authentication](https://developers.openai.com/plugins/build/auth) · [OpenAI submission lifecycle](https://developers.openai.com/plugins/deploy/submission).

## 8. Review-gated development and testing plan boundaries

**This document is a design, not an implementation plan or build authorization.** When approved, use Superpowers `writing-plans` to author a detailed task-by-task Native TDD plan. Each task gets a RED test, GREEN implementation, repeatable GitHub Actions receipt and clearly labeled **author second-pass** or *actually independently executed* review. Keep all implementation on a separate development branch and Draft PR.

Proposed implementation slices after their own approvals:
1. Pure TypeScript unit-conversion core and domain/property tests, independent of Cloudflare and MCP.
2. Strict MCP input/output contract and negative/fuzz tests; Cloudflare SDK handler with isolated test client.
3. CPU/quota/resource-abuse checks and stateless protocol integration tests.
4. Secure reproducible GitHub build, dependency review and official MCP conformance checks where available.
5. **Separate deployment approval** for a Worker on the verified Cloudflare Free account, real HTTPS protocol smoke tests, observation of quotas and possible rollback.
6. **Separate Plugin Creator authorization** only after the legacy identity and supported upgrade path are resolved; host-driven `@QRVAI` Greek/English acceptance with at least one follow-up message.

**Pass/fail definitions:**
- Unit, boundary, property, malformed JSON and transport-integration tests must run on the exact candidate SHA.
- Verify actual Tool discovery and numeric correctness, not fabricated tool-call results.
- Confirm no authentication prompt is needed on an actually connected supported host. If host attempts unsupported auth, mark UNSUPPORTED/BLOCKED and investigate; never silently add credentials.
- The anonymous endpoint must handle over-limit/invalid requests with bounded errors, not CPU hangs, crashes or accidental device actions.
- **Deployment, plugin installation, public sharing and merge/promotion are distinct separately approved operations.**

## 9. Spec self-review / unresolved external gates

Reviewed the design for ambiguous scope: this **first** service has exactly one read-only calculation tool; future logbook, CAT/PTT, SWR, link budgets, live data and MCP Apps are explicitly **outside** the approved first slice. Public endpoint accessibility and quota exhaustion are accepted trade-offs to make ordinary math login-free.

Open gates are explicit, not hidden implementation placeholders: Cloudflare account Free-plan/usage verification, SDK runtime performance on the **actual** Worker, the personal plugin's supported skills-only→MCP lifecycle, old QRVAI saved-record removal and namespace availability, platform `@QRVAI` behavior, separate code/deployment/creation approvals and any independently executed review.

**Next owner action:** review and approve or amend the [separately drafted Native TDD implementation plan](../plans/2026-10-15-qrvai-cloudflare-free-authless-rf-mcp.md). Specification approval is not authorization for source implementation, Cloudflare deployment or Plugin Creator account creation.
