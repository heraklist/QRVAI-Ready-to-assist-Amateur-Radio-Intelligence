# QRVAI RF MCP — Native TDD ledger

Plan: https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/blob/docs/qrvai-cloudflare-free-authless-mcp-design-20261015/docs/superpowers/plans/2026-10-15-qrvai-cloudflare-free-authless-rf-mcp.md

Task 1 RED candidate: pure RF power conversion numeric fixtures, no implementation. Run GitHub Actions for actual observed RED evidence. The real source of truth is the GitHub Actions log and commit SHA. Reviews are **author second-pass** unless separate reviewer execution is independently evidenced.

Ruling R1: Initial Task 1 uses Node.js 22's built-in `node:test` with TypeScript stripping to get an independent, dependency-free RED/green CI before introducing the MCP SDK. The approved plan specified Vitest; the dependency is deferred to the task introducing the MCP/Worker integration, and no dependency-free tests may be removed. This trades a second test harness for an earlier fully observed RED run without making up dependency versions.
