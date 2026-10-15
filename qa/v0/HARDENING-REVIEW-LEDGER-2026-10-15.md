# QRVAI V0 Hardening — Native TDD & Review Ledger (2026-10-15)

**Scope/authorization:** Owner approved security, reference integrity, negative tests, QA and CI hardening on existing V0. Do not alter the five-Skill architecture, plugin identity or package contents; **no plugin creation, old-record modification, install, merge or release**.

**Source base:** `feat/qrvai-v0-native-reviewed` at `923fab29e612552fe27dd060327db47b200530ef`.  
**Implementation branch:** `hardening/qrvai-v0-validation-20261015`.  
**PR:** [Draft #5](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/5), targeting *unmerged* V0 branch.  
**Method:** Native TDD, actual GitHub Actions RED and GREEN cycles; after every task, a **separate author second-pass review** in a GitHub PR conversation comment. No independent agent/tool reviewer available: **NOT_EXECUTED**, not to be described as peer certification.

## Task receipts

| Gate | Failing test SHA/run | Passing SHA/run | Evidence / scoped review |
| --- | --- | --- | --- |
| H1 — Fail-closed manifest metadata types and defaultPrompt | `5934c1a` · [RED #38685938858](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38685938858) | `89e1a1e` · [GREEN #38685995926](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38685995926), 32 tests | [Review](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/5#issuecomment-6185016702); no malformed foreign extension, empty/oversized `defaultPrompt` |
| H2 — Missing/path-escaping/unsafe Skill Markdown links | `56b5725` · [RED #38686114126](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38686114126) | `93ffdd0` · [GREEN #38686238769](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38686238769), 34 tests | [Review](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/5#issuecomment-6185048150); first implementation `76ee0e2` was still RED because of regex escaping; fixed source without weakening tests |
| H3 — ZIP checks for tampered links and malformed reference encoding | `b092da5` · [RED #38686339586](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38686339586) | `fbad866` · [GREEN #38686455377](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38686455377), 36 tests | [Review](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/5#issuecomment-6185076874); fixture corrected to real invalid bytes, ZIP checks without extraction |
| H4 — Malformed/unreviewed bilingual QA fields and CI guard | `8d92a5e` · [RED #38686558507](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38686558507) | `35ead99` · [GREEN #38686748298](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38686748298), 38 tests | [Review](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/5#issuecomment-6185118122); typed prompts/claims, known risk classes, QA file changes trigger CI |

## Pre-merge code review regression (H5)

A second, focused review found a **fail-closed bug**: `urllib.parse.urlsplit('https://[')` raises `ValueError`. Both the checked source reference validator and the ZIP reference validator previously let that exception escape instead of reporting a validation error.

- Tests added first in `e44f26f` and `da04f09`; [RED GitHub Actions #38687408565](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38687408565) confirmed **two actual errors** (`Invalid IPv6 URL`).
- Fixes `e7bd172` and `7a4ddfe` catch malformed URL parsing and collect explicit reference errors.
- [GREEN GitHub Actions #38687466161](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38687466161): **40/40 tests passed**, `CLEAN_V0_QA_CORPUS=PASS`, clean ZIP SHA unchanged.
- **Review nature:** verified author follow-up, NOT an independent reviewer. No plugin account creation or host E2E was performed.

## Final repeatable acceptance

**Verified run:** [GitHub Actions #38687466161](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38687466161).

- 40/40 unit tests PASS under Python 3.11 after the pre-merge regression fix.
- `CLEAN_V0_QA_CORPUS=PASS`: check actual QA data before build, independent of a unit fixture.
- Clean ZIP generated from exactly 12 allowlisted V0 source files, no MCP integration and no old data. **SHA-256:** `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`. Its SHA has not changed during hardening, as expected because all modifications are development validators and tests.
- Actual RED evidence exists for each gate, including interim regression failures corrected before moving ahead.
- Four original author second-pass review comments and a pre-merge follow-up regression review. **Independent reviewer not executed**.

## Known limits and release gate (not an approval to install)

1. Reference checker supports **simple inline Markdown links** and present documented V0 files; it is not a full CommonMark parser and does not prove externally hosted HTTPS content is authoritative. Current V0 Skills use six straightforward local links.
2. Structural QA corpus checks do **not** execute a language model on the bilingual safety prompts and do not prove `@QRVAI` composer compatibility.
3. This is a new clean source in GitHub, not a saved plugin. Old Plugin Creator user record `plugins_6acf47f502dc8191bf542fe040d484d8` was last confirmed present and could not be deleted through user-visible menu; **D1 deletion blocked, D2 namespace availability unverified**.
4. The five Skills, 24 domain and 72 sub-capability references remain instructional scope, not 24 separately installed Skills, 72 executable models, or live MCP services.
5. The owner has **not** authorized Plugin Creator account create/install or GitHub merge/visibility change. PR #5 and PR #4 must remain Draft until separate review and approval.

**Engineering handoff:** Review the code diff and CI evidence, obtain a genuinely independent reviewer if feasible; then await old-account identity resolution and explicit private-plugin creation approval. V1 RF calculation engines and MCP tools are separate specifications.
