# ADR-0002 — First fresh QRVAI plugin should include the already-real MCP server

**Date:** 2026-10-15  
**Decision:** APPROVED AS SOURCE ARCHITECTURE; runtime activation still requires separate proof  
**Scope:** Future clean new Plugin Creator identity and its first private release, not the historical account record.

## Context

The Skills-only V0 package contains exactly five authored Skills but no remote `mcp.json`. New source in GitHub main contains a stateless Cloudflare Worker MCP with three read-only tools: `rf_power_convert`, `rf_link_budget`, and `rf_impedance`. There is no known deployed HTTPS endpoint. Public OpenAI plugin submission guidance states that adding an MCP server to an existing skills-only plugin is not currently supported; this does not by itself prove identical private Plugin Creator behavior.

## Decision

The first **new** account-created QRVAI private plugin should be a clean package with the five existing V0 Skills **and**, only after a real deployed and tested remote endpoint exists, a portable root `mcp.json`. The public endpoint is an independently deployable service; installing a private plugin does NOT restrict anonymous access to a no-OAuth Worker.

Do **not** create a skills-only QRVAI account record as a placeholder, attach a nonexistent or dummy MCP URL, reuse/update the old owner-created `qrvai` plugin ID, import legacy Academy assets, enable PTT/CAT writes, or assert host acceptance prior to a genuine ChatGPT E2E.

## Release gates in order

1. Source integrity and CI on exact merged commit; published canonical JSON Schema validation; license and dependency assessment.
2. Confirm Cloudflare actual plan/billing permission, no-cost posture and abuse controls; deploy the exact verified bundle in controlled staging, measure real CPU and test protocol over HTTPS. Explicitly separate deployment from public exposure.
3. Verify correct URL and transport from real `initialize`, `tools/list`, `tools/call` against staging. Record safe redacted results and rollback plan. Do not infer this from Wrangler dry-run.
4. Assemble first clean, distinct-ID plugin using the actual `mcp.json` URL with V0 Skills, without the old creator record. Resolve account deletion/name collision [Issue #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3).
5. **Deferred at owner's request:** ChatGPT plugin installation and real `@QRVAI` invocation/follow-up on supported clients. Avoid claims of completion until observed.

## Rejected alternatives

- A dummy or publicly unresolved MCP URL.
- In-place update or silent migration from legacy QRVAI.
- A brand-new standalone calculation engine duplicating M07.
- Assuming a merged repository proves account or host deployment.

## Continuing scope

M09 (coax feedline loss) depends on versioned, permissioned real cable profile sources before promising cable-ID/frequency lookups. All remaining Families, 24 Domains, 72 Sub-capabilities, 18 conceptual engines, 38 planned tools and 36 UI concepts remain staged roadmap work. Do not describe them as deployed.

**Host integration pending is an explicit product-stage choice, not evidence that Cloudflare account prerequisites are resolved.**
