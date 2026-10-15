# QRVAI Release Engineering — Source / Cloud / Plugin / Host Boundaries

**Updated:** 2026-10-15. This ledger captures verifiable technical states and is not a production certification.

## Actual source promotion
- [PR #11](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/11) merged as `ac046f38b55ac72eb919f26dd7e029a10341b90d`: ZIP metadata preflight, CORE routing QA, GitHub Actions SHA pinning. Observed [CI run #38719569477](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38719569477): 46/46 tests PASS and 12-file deterministic ZIP.
- [PR #8](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/8) design merged as `93374307a23db713632172a50dced4a984fe1772`.
- [PR #9](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/9) source merged as `dab390f163b88a2b3e5b0b6f379c0d16f19865ae`. Real source includes 1 stateless, unauthenticated, read-only Cloudflare Workers MCP tool `rf_power_convert` and strict W/mW/dBm/dBW handling. Recorded original head Node/Workerd/TypeScript CI success in [workflow #38709837611](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38709837611), V0 CI in [#38709837757](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38709837757). Post-merge V0 CI [#38724341872](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38724341872) completed SUCCESS.
- [PR #12](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/12) adds offline full official Agent Plugins JSON Schema 2020-12 validation, alongside more restrictive QRVAI packaging policy, tests and status reconciliation. This is distinct from a ChatGPT import/creation acceptance check.

## Cloudflare deployment status
The Cloudflare account was read-only inspected on 2026-10-15; Workers scripts list contained **0 scripts**. The account-settings `default_usage_model: standard` is NOT definitive proof of Free billing plan. Billing-subscription query returned an **authorization error**, so precise subscription and cost/abuse exposure have not been verified. Before public anonymous endpoint exposure, verify actual account plan and available abuse controls in the Cloudflare UI or with appropriately scoped API. No Worker upload can be claimed from source tests or Wrangler dry-run. For an actual Worker release, use the reviewed compiled artifact, exact source SHA, canary test/rollback, and observable CPU/request behavior; do not deploy an improvised handwritten substitute.

## Packaging / ChatGPT separation
Current V0 `qrvai/` 12-file reproducible ZIP is Skills-only. The reviewed future MCP plugin should include a `mcp.json` only with a **real HTTPS deployed and verified** Streamable HTTP endpoint; do not invent URL. The old private QRVAI record is still present under an old owner backend ID and MUST NOT be overwritten. [Issue #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3) must be resolved through supported record deletion/namespace verification or an explicitly owner-approved distinct identity. [Issue #6](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6) tracks skills-only-to-MCP upgrade limitations.

**ChatGPT host verification remains pending by explicit user preference.** No claims of `@QRVAI` host invocation, successful connection, new plugin installation or private release.

## Future extensions
The one proven M07-like capability is RF power conversion. Proposed M08 link budget, M09 feedline loss, M10 impedance/SWR, the remaining 17 engines, domain catalog and UI components are NOT executable as of this ledger. PR #10 is a superseded, alternative M07 planning thread, not permission to duplicate code.

## Evidence wording
Code merged != Worker deployed != endpoint tested != Plugin created != installed in ChatGPT != end-to-end `@QRVAI` verified. Mark each state separately.
