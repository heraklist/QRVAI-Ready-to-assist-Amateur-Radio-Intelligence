# ADR-0002 — First clean QRVAI plugin needs a real Vercel MCP endpoint

**Date:** 2026-10-15
**Decision:** VERCEL-ONLY BACKEND; first fresh Plugin Creator release blocked pending verified HTTPS transport, authentication compatibility, and explicit owner release authorization.

## Decision and technical scope

QRVAI uses a single stateless MCP registry with four **implemented** read-only RF tools: `rf_power_convert`, `rf_link_budget`, `rf_impedance`, and `rf_feedline_loss`. The sole intended backend is a **Vercel Node.js Function** at `/api/mcp`. Cloudflare was a historical experiment and is **not** a runtime dependency, backup, or deployment target. The V0 package contains five existing Skills; the proposed catalog of 38 MCP tools is **not** implemented.

A clean new Plugin Creator identity, distinct from the historical account-created `qrvai`, should be assembled from the five V0 Skills and a root `mcp.json` **only when** the actual Vercel HTTPS endpoint, target authentication method and ChatGPT plugin contract are verified. Do not insert dummy MCP URLs or repurpose old plugin IDs.

## Release gates

1. GitHub exact SHA: npm lockfile `npm ci --ignore-scripts`, TypeScript, MCP SDK protocol tests, V0 Python suite, and source integrity PASS.
2. Vercel project root `mcp/qrvai-rf-worker`, Node 22, non-production preview; verify provider reports `target: preview` **before accepting** any deployment. Unexpected production targeting must be canceled.
3. Unique `QRVAI_MCP_BEARER_TOKEN` as a protected Vercel secret; default behavior 503 fail-closed. A static bearer token is **not a claim of ChatGPT OAuth compatibility**. Verify host-required flow, credential management, rotation, rate limiting, quotas and abuse controls.
4. Actual HTTPS evidence: initialize, tools/list, four tools/call, repeated stateless requests, negative authorization and Origin tests, correct response headers, plus Vercel build/runtime logs and cost limits.
5. Only after staging, perform a distinct production approval/promotion. Plugin Creator installation and an actual `@QRVAI` host E2E are **deferred**, not silently assumed.

## Rejected

Cloudflare backend or fallback; anonymous public calculators; staged deployment represented as production proof; skills-only placeholder plugin; reuse of the historical plugin; fake or unverified manufacturer data; unapproved CAT/PTT or radio transmission.

See [Vercel-only MCP runbook](../../docs/runbooks/qrvai-rf-mcp-vercel.md) and [development PR #17](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/17).

## 2026-10-17 source status addendum

The original 2026-10-15 decision above describes the then-current four RF calculators and remains part of the historical design record. As of the cumulative 2026-10-17 Draft development lineage (PRs #36–#38), the repository includes **38 source-registered** MCP methods, including bounded user-input/simulated versions; this is **not a production release** and is not proof of 38 integrated external services. Existing Vercel-only runtime choice, lack of production-grade verified OAuth issuer, and all host/plugin approval and private identity gates remain unchanged. The source-only consolidation is governed by [P0 design](../superpowers/specs/2026-10-16-qrvai-p0-consolidation-design.md) and [P0 TDD plan](../superpowers/plans/2026-10-16-qrvai-p0-consolidation.md). No production promotion, OAuth connection or Plugin Creator create/update/install is authorized by this addendum.
