# QRVAI V0 — Native TDD and Per-task Review Ledger

**Implementation plan:** [2026-10-14 clean-slate plan](../../docs/superpowers/plans/2026-10-14-qrvai-v0-clean-slate-foundation.md)  
**Base architecture commit:** `e1c08cacb4f733d55a649828dbbb89e9a7d53ace`  
**Feature branch:** `feat/qrvai-v0-native-reviewed` → [Draft PR #4](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4)  
**Execution approach:** Native implementer, GitHub Actions Python 3.11 tests, per-task *author second-pass review*. **Independent reviewer is NOT_EXECUTED**; no separate worker was available. Never describe this as verified independent code review.

## Per-task TDD and review evidence

| Task | Work completed (candidate) | Last GREEN commit | Actual CI (success) | Reviewer gate |
|---|---|---|---|---|
| 1 | Agent Plugins 1.0 manifest + validation | `e6c52bf` | [#38632754960](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38632754960), 2 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6177814571) |
| 2 | `qrvai-core` and routing | `3fff1b4` | [#38633007135](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38633007135), 4 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6177844006) |
| 3 | Family A Skill (5 domains, 15 SC) | `185ce44` | [#38633245011](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38633245011), 7 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6177875144) |
| 4 | Family B Skill (8 domains, 24 SC) | `da587f6` | [#38633426029](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38633426029), 9 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6177897277) |
| 5 | Family C Skill (8 domains, 24 SC) | `d9f84ec` | [#38633585122](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38633585122), 11 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6177916084) |
| 6 | Family D Skill (3 domains, 9 SC) — fixed leaked registry summary | `408c15f` | [#38633841292](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38633841292), 13 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6177948724) |
| 7 | Exact 24/72 registry audit, 16 QA prompts | `472e9e2` | [#38634082412](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38634082412), 16 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6177982632) |
| 8 | Clean 12-file ZIP builder + strict negative tests | `e927ad1` | [#38634304494](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38634304494), 20 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6178009959) |
| 9 | No identity re-use / account deletion gate | `9d5f4e5` | [#38634452413](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38634452413), 23 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6178029785) |
| 10 | Host receipt verifier (no false @-test PASS) | `d3f9798` | [#38634657934](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38634657934), 28 tests | [comment](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4#issuecomment-6178057490) |

### Final-review Critical/Important regression and fix

Final author-review found: a host report could have had overall `BLOCKED` with apparently complete per-case fields and yet pass `validate_host_report`. Also an empty expected-case set was accepted. Added failing tests in `c89bb0e` (GitHub Actions RED), fixed the validator in `0f6e2c0`, and observed green [GitHub Actions #38634860977](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38634860977) **30 tests passed**. The fix requires overall `PASS` plus nonempty expected case coverage.

**Review-only archive build:** [Actions #38634957731](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38634957731) ran 30/30 tests, catalog audit and generated exactly 12 ZIP members; SHA-256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`. GitHub artifact `qrvai-v0-clean-draft-not-installed` ID `11927623018` with seven-day retention. **This is NOT a private plugin release, host install or @-invocation test.**

## Explicit execution rulings and limits

1. **Ruling — remote isolation:** no local QRVAI checkout or live git worktree was available in the container, and the container could not reach GitHub. Implement on a GitHub feature branch via its connected API; execute reproducible test cycles on the actual GitHub Actions runner. **Cost if wrong:** weaker local debugging/worktree procedure, but immutable GitHub commits and CI receipts preserve exact evidence.
2. **Ruling — request for reviewer per task:** there is no real isolated reviewer worker exposed here. The native implementer completed a **separate scoped author code-review pass after every task**, recorded with GitHub comment and actual CI data, explicitly **NOT** claiming a different agent/person did it. **Cost if wrong:** author's blind spots are not eliminated; an independent reviewer should inspect Draft PR #4 before any merge or account creation.
3. **Ruling — legacy plugin source deletion:** owner-created private record `plugins_6acf47f502dc8191bf542fe040d484d8` was observed still present. Uninstall status `not_installed` does not prove record deletion. **Cost if wrong:** duplicate/conflicting @QRVAI identity or unintended source lineage. Keep creation gate BLOCKED.
4. **Ruling — host @-test:** test fixture/CI cannot actually prove ChatGPT client composer @ routing; `@QRVAI` remains a product requirement until a newly created plugin is installed. **Cost if wrong:** a valid Skills ZIP could still be uncallable on an unsupported host. Report NOT_EXECUTED.

## Final acceptance separation

| Property | Current status | Evidence |
|---|---|---|
| Newly authored five Skills and 24/72 mapping | CI-verified structural checks | 30 passing tests, immutable branch |
| ZIP allows only new files and no MCP endpoint | CI-verified | 12 entries, repeatable archive SHA |
| Per-task author reviews | Documented | 10 linked PR review comments |
| Independent reviewer | **NOT_EXECUTED** | No worker dispatch receipt |
| Legacy account created-plugin deletion | **BLOCKED / unverified** | Earlier Plugin Creator metadata still resolves old record |
| New private plugin account creation | **NOT_EXECUTED** | No `create_plugin` call |
| New ChatGPT plugin installation and `@QRVAI` E2E | **NOT_EXECUTED** | No host-invocation receipt |
| Merge, publish, PTT, CAT actions | **NOT_EXECUTED** | Outside scope |

**Human review required:** inspect source and CI evidence in Draft PR #4, resolve old creator-source identity and separately authorize private creation. No account or device mutation was conducted.
