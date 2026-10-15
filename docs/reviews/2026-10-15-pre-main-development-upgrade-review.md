# QRVAI V0 — Pre-main Review and Upgrade Research
**Date:** 2026-10-15 · **Target:** [PR #1](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/1) · **Status:** PRE-MERGE AUDIT; report is NOT a host acceptance receipt, external independent review or plugin release.

## Confirmed present implementation and evidence

- GitHub branch `docs/qrvai-capabilities-v0-3` at original review head `9fdc522a68ccfef579a565de7c5723f610539820`: 5 newly written V0 Skills, 4 Family references, 24 domain and 72 subcapability labels, `plugin.json`, Python validators, deterministic 12-file archive, 16 bilingual structural QA fixtures. No MCP server, Apps, CAT/PTT, emergency dispatch or legacy Academy content in the 12-file artifact.
- [Actions #38688228344](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38688228344) on that exact head returned **40/40 Python tests**, QA corpus check and clean ZIP SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`. A changed head needs its own verification.
- [17 Markdown documents / 66 relative links audit](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/1) found no missing local destination on the reviewed head.
- Formal PR review submissions remained COMMENTED by the owner; no independent APPROVED review or isolated reviewer execution has been demonstrated. Owner conditionally accepted this risk subject to a fresh audit.

## Research of authoritative current standards

1. [Agent Plugins 1.0 canonical specification](https://agent-plugins.org/specification) requires root `plugin.json`, skills at `skills/<name>/SKILL.md`, allows omitted `mcp.json`, requires `author` metadata fields (if present) to be typed strings, and defines strict JSON manifest constraints.
2. [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins) provides ChatGPT/Codex portable examples and keeps plugin-level identity distinct from optional MCP Apps/servers.
3. [OpenAI public submission workflow](https://developers.openai.com/plugins/deploy/submission) currently says **adding an MCP server to an existing skills-only plugin is not supported**. This is evidence about the *public submission workflow*, not proof that every private plugin update route behaves identically. Future QRVAI V1 MCP design must explicitly test or resolve upgrade-path compatibility **before first account creation**.
4. [OpenAI MCP Extensions changelog 0.2.0, 2026-10-10](https://github.com/openai/mcp-extensions/blob/main/CHANGELOG.md) introduced resource-mention discovery via `openai/mentions: {searchTool}`, requiring a read-only tool. This is not the same feature as mentioning the plugin itself (`@QRVAI`). V0 is skills-only and should not add a fictitious mention-search endpoint.
5. [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use) recommends pinning external actions to full-length verified commit SHAs. Current workflow uses `actions/checkout@v4`, `actions/setup-python@v5`, `actions/upload-artifact@v4`; it already limits job permissions to `contents: read`.

## Findings and disposition

| ID | Severity | Evidence in reviewed code | Corrective gate |
|---|---|---|---|
| R1 | IMPORTANT source-validator correctness | `scripts/v0/validate.py::validate_manifest_data` checks only truthiness of `author.name`, not type or allowed author fields. A list-valued `author.name` can be incorrectly accepted, contrary to normative Agent Plugins manifest constraints. | Before main: add RED→GREEN malformed-author fixture(s), fail closed, check actual GitHub CI |
| R2 | IMPORTANT archive-validator parity | `scripts/v0/build_archive.py::validate_archive` checks a Skill frontmatter description for presence rather than string type. Tampering `description` into a nonempty YAML array can pass its frontmatter gate while the source Skill validator rejects it. | Before main: archive mutation negative test → fix, run full suite and build |
| R3 | IMPORTANT CI continuity | `.github/workflows/v0-ci.yml` has `push.branches` set only to a V0 development branch; direct merges to `main` do not trigger the same push validation. `pull_request` does run the branch tests when matching paths change. | Before main: add `main` to push triggers, verify workflow text and CI |
| R4 | RECOMMENDED supply-chain | GitHub Actions external dependencies are referenced by moving major version tags, not immutable full SHAs; dependency file `PyYAML==6.0.2` pins version without hashes. | Separate review task: pin verified official Actions SHAs; use hash-locked Python wheels/allowlisted runner policy if practical |
| R5 | RELEASE BLOCKER, NOT MAIN BLOCKER | Bespoke validators + unit tests do not constitute canonical external JSON-schema validation, host import, permissions verification or real `@QRVAI` routing on supported ChatGPT clients. | Before Plugin Creator: validate with authoritative schema and real platform ingestion/host E2E, preserving NOT_EXECUTED until observed |
| R6 | ACCOUNT BLOCKER, NOT MAIN BLOCKER | Legacy personal QRVAI `plugins_6acf47f502dc8191bf542fe040d484d8` remains discoverable to Plugin Creator; owner UI has no Delete action. | Delete via supported account workflow, verify `qrvai` namespace, explicitly authorize *new* account plugin; never update/reuse old record |
| R7 | PRODUCT ROADMAP RISK | Current OpenAI public submission docs do not support adding an MCP server to an existing skills-only plugin. | Before account creation: choose/test future upgrade route; do NOT add fake MCP server to V0 merely to circumvent platform constraints |
| R8 | FUTURE SECURITY HARDENING | `validate_archive` flags oversized ZIP members but scans and reads afterward; it is intended for own built archives, not a general untrusted ZIP inspection service. | If processing external ZIPs, enforce member and total size limits **before** reads, add decompression-ratio and corrupt ZIP tests |
| R9 | TESTS VS BEHAVIOR | Sixteen prompt scenarios currently check JSON shape and risk categories, not actual model response quality, translations, source provenance or numeric correctness. | Host E2E fixtures with dated response/source receipts, then future numeric-property tests for V1 RF calculations |
| R10 | FUTURE PRODUCT FEATURES | 18 engines, 38 tools, 36 app views and 24 individual domain Skills are designs, not code; advancing all together would inflate scope and liability. | Prioritize deterministic dBm/dBW → loss/link budget → SWR read-only engines in separate owner-reviewed TDD plan; add MCP only with verified platform lifecycle |

## Merge decision criteria

GitHub source merge to public `main` may be considered after **R1–R3** are corrected with relevant CI receipts and a documented review; no claim of independent code review should be made. R4 and R8 are tracked improvements rather than grounds to claim plugin release readiness. R5–R7 remain explicit **plugin creation/release/host blockers** after any GitHub merge.

**Never conflate:** passing Python tests != Agent Plugins platform approval; public GitHub merge != private plugin creation; plugin-level `@QRVAI` != MCP resource mention; source author review != independently executed reviewer.
