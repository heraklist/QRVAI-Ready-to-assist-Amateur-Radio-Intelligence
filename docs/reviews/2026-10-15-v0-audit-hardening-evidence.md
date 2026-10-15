# QRVAI V0 — Audit Hardening Evidence and Remaining Gates

**Date:** 2026-10-15 · **Candidate:** [Draft PR #11](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/11) · **Base:** `main` commit `e1de9823dbd266c9db86f69ca410f0c176c7a6dd`.

## Scope and executable TDD receipts

The owner requested implementation of prior audit fixes on a separate development branch, not main promotion or release.

- **RED:** commit `ce564e62b576fa469a4a8841c529af6aab821c49`, [Actions #38718810709](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38718810709). New regression checks failed for oversized ZIP, pathological compression ratio, CORE introductory route, and mutable CI Actions references. In addition, an over-broad proposed expected-Family test assertion was caught and corrected before GREEN; CI pinning test's initial matching expression required correction for named steps.
- **GREEN:** commit `ccef7354378df7cee68bc09db4a2264e3e706451`, [Actions #38719188812](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38719188812). 46/46 tests PASS; QA corpus PASS; clean 12-file ZIP SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`. This hash matches the documented V0 baseline because packaged `qrvai/` files did not change.
- **Candidate scope:** ZIP archive metadata preflight rejects oversized/unreasonably compressed/encrypted/unsupported members before any `ZipFile.read`; intro QA routes to `CORE` while Family catalogue remains A–D; `actions/checkout`, `actions/setup-python`, `actions/upload-artifact` are pinned to exact upstream tag-resolved full commits. Added tests explicitly enforce these rules.

The GREEN receipt belongs to the named commit. Any subsequent documentation-only commit requires its own exact-head CI review before promotion.

## Independent Cloudflare read-only inspection

The authorized Cloudflare account's `GET /accounts/{account_id}/workers/scripts` returned an empty script list on 2026-10-15. **No Worker was deployed or modified.** Cloudflare Free plan cost/rate/CPU quotas are not inferred from this endpoint and remain unmeasured.

## Existing RF MCP branch (do not duplicate)

[Draft PR #9](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/9) head `a52a48a358c9d154f8fe62d5057282591b8e0621` includes one undeployed read-only Cloudflare MCP power-conversion tool, strict TypeScript and hostless Worker tests. [Workflow #38709837611](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38709837611) and [#38709837757](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38709837757) are completed SUCCESS for that head. No on-cloud invocation, production CPU/quota evidence, or ChatGPT-host plugin acceptance exists.

## Still open, not misreported as repaired

1. **P0** Old account-created QRVAI record remains present. No deletion or Plugin Creator create/update; [Issue #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3).
2. **P0** Verify exact supported skills-only → MCP account lifecycle, namespace and a separate fresh creation; [Issue #6](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6).
3. **P0** Real ChatGPT supported-client `@QRVAI` end-to-end and safety/permissions tests remain NOT_EXECUTED.
4. **P1** Offline complete official plugin JSON schema validation (bespoke current checks alone are insufficient) needs controlled dependency/schema implementation and separate tests.
5. **P1** Host report is a syntactic validator; independent provenance/host execution cannot be certified from a self-authored PASS JSON fixture.
6. **P1** ZIP checks currently bound expected named members, sizes and ratios; arbitrary external ZIP support still requires resource-limit hardening and fuzzing before that feature is enabled.
7. **P2** QA fixtures validate structure, not LLM answers. Future actual host-response scoring and privacy guard regression needed.
8. **P2** The 24 future Domain Skills, E03/E04 etc, 38 tools and 36 UI candidates remain conceptual except the ONE draft RF MCP tool in PR #9.

**Review:** Author-side source inspection and CI, not separately executed independent reviewer approval. PR #11 remains DRAFT. **No merge / deploy / Plugin Creator / PTT permissions granted.**
