# QRVAI M09 Feedline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans and test-driven-development; execute each task test-first.

**Goal:** Add audited, deterministic feedline loss from user-supplied versioned attenuation points, exposed through one read-only MCP tool.

**Architecture:** One pure mathematical module and one registration in the existing stateless Worker, with exact input/output schema and no manufacturer catalogue; source evidence remains user-supplied.

**Tech Stack:** TypeScript 5.9, Node 22 tests, Zod 4, MCP SDK 2.3, Cloudflare Workerd/Vitest.

**Spec:** `docs/superpowers/specs/2026-10-15-qrvai-m09-feedline-input-profiles.md`

## Global Constraints
- Keep `qrvai/` Skills-only package byte-identical.
- No external data calls, secret bindings, CAT/PTT, Cloudflare deployment or Plugin Creator writes.
- Require strict data bounds, fail-closed numeric and trust semantics, no extrapolation.

## Review Focus
- Duplicate/unsorted knots, nonfinite/negative losses and 0 Hz must fail.
- Out-of-range request frequencies must fail (not clamp).
- Zero-length cable is valid and connector loss still counted.
- Extremely large attenuation must not produce a false zero delivered ratio.
- Prototype/accessor/symbol extra keys cannot bypass strict internal validation.

### Task 1: Numerical curve core
**Files:** `src/rf/feedline.ts`, `test/feedline.spec.ts`, `qa/mcp/rf-feedline-fixtures.json`, `package.json`.
**Interfaces:** `calculateFeedlineLoss(input: unknown): FeedlineResult`; `FeedlineInputError`.
- [ ] Write golden, boundary, malformed, overflow tests before implementation.
- [ ] Run full Node test command and observe RED missing module.
- [ ] Implement strict validation and log-frequency interpolation; typed finite errors.
- [ ] Run Node tests, TypeScript and confirm GREEN.
- [ ] Commit source and test fixtures.

### Task 2: MCP tool + integration
**Files:** `src/mcp/register.ts`, `test/register.spec.ts`, `test/protocol.spec.ts`, `test/worker.spec.ts`, `test/source-boundary.spec.ts`, `README.md`.
**Interfaces:** `rf_feedline_loss` accepts exact Task 1 fields; strict structured response schema.
- [ ] Test MCP tools/list four names, actual valid and invalid tools/call, and Workerd path first.
- [ ] Observe RED then register one read-only tool (no permissive CORS).
- [ ] Verify Node, Workerd, TypeScript, Python and Wrangler dry-run.
- [ ] Record actual exact SHA, CI run, review conclusions and remaining Cloudflare/Plugin Creator/host gates.

**Integration policy:** create a Draft PR; do not merge or deploy from stale/failed CI; final source integration requires owner release decision.
