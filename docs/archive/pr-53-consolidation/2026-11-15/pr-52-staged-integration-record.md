# PR #52 — historical integration record (verbatim source body)

Archived 2026-11-15 from https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/52
HEAD: `4fe9d100ef2c012d3a94d1e45ab372e3494cbdf8`
**Historical, not current state or production acceptance.** This record is superseded by PR #53.

---

# Controlled staging integration (NOT a release PR)

**Owner intent (2026-10-19):** begin gradual integration of canonical GitHub PRs/branches, verifying each change before promotion. The original PRs remain Draft and open; this integrator represents a **separate non-default branch**, not a merge to `main`.

## First staged merge: PR #17

- **Validated original:** [PR #17](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/17) exact HEAD `6bd376a9096a043ca9225bc2d8565f14760062b6`, which was 46 commits ahead/0 behind `main` `dbf71d491d83c3f6c69326402d99bccc2c43358b`.
- **Actual two-parent staging merge commit:** `fc0510b857db4eab5184cd490c866396abe4bdc8`. Parents are `main` `dbf71d4...` + `PR #17` `6bd376a...`; output tree exactly original PR #17 SHA tree `690cb6af18e285a5923269286d21cb07b6c595da`. This is an isolated staged tree merge, not PR #17's GitHub merged state.
- Original PR #17 RF and V0 test runs were [RF #38761998050](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38761998050), [V0 #38761998161](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38761998161) — both `completed/success` at PR #17 SHA. This is NOT same-staging-SHA CI proof; wait for the new PR's Actions before declaring the stage verified.
- [PR #51](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/51) has already completed **P1.5 24/24 Skills,72/72 references and strict 96-file source staging** at head `3979577f0591561a31d992f62209f95e39e7225a`, CI [#39206079773](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39206079773) **123 P1/49 V0/178 Node PASS**; only later source dependency, not yet merged into this integration branch.
- Two non-canonical alternatives [#21](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/21) and [#23](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/23) must NOT be merged; dispositions are already recorded under P0.

## Production release gate / hard stop

**HIGH-RISK CONNECTOR DISCOVERY:** GitHub repository is linked to Vercel `qrvai-rf-mcp` project `prj_4c6IeOARTJOqEIaLlMx1rCDTGLKa` in team `heraklists-projects`, with READY branch-preview auto-deployments. A commit/push on GitHub `main` could therefore trigger a production deployment without separate approval. **DO NOT MERGE this PR or original PRs into `main`** until Git-to-production auto-deploy behavior is safely disabled and verified or the owner separately approves a controlled production consequence after review. Do not silently change Vercel project settings or secrets. Preview deployments may be created automatically by existing Vercel Git integration; no explicit deployment tool has been invoked.

## Merge order and verification requirements

Follow the original linear **#17→#18→#19→#20→#22→#24→#25→#26→#27→#28→#29→#30→#31→#32→#33→#34→#35→#36→#37→#38→#39→#40→#41→#42→#43→#44→#45→#46→#47→#48→#49→#50→#51**, omitting alternate #21 and #23. Retain original PR identity and SHA. Verify ancestry, diff, relevant scope, minimal privileges, same-staging-SHA GitHub CI, immutable previous ZIP hashes and test totals per stage. Do NOT close, rebase, squash or delete existing branches until a separate review/promotion decision. Plan/documentation branches are included in the source lineage; do not interpret merged docs as live capabilities.

**Missing release evidence at creation:** no independent PR #17 APPROVE review, production auto-deploy isolation unverified, original 35 Draft PRs open. This integration PR is an evidence hub and must stay Draft/unmerged until each gate is satisfied; no plugin create/update/install, OAuth secrets, real CAT/PTT/TX, network dispatch or Vercel production promotion.

**CI on this new PR:** pending and must be checked against the exact integration merge SHA `fc0510b857db4eab5184cd490c866396abe4bdc8` before any next stage.

## Staging increment 2 — PR #18 (2026-10-19), verified exact SHA

PR #18 HEAD `373793d60ebd3935b6e3071f7c752ff5409c6275` was 10 commits ahead/0 behind canonical PR #17 HEAD. Integration branch advanced via **another genuine two-parent, no-ff staging merge**: commit `e5d994a24ee5be816d656695db33bd65b613f4e9`, first parent `fc0510b857db4eab5184cd490c866396abe4bdc8`, second parent the unchanged PR #18 HEAD. The complete merged tree equals the PR #18 source tree `2fbb6416a74d2122bc32a7c043d48598e0cae98b`. The original PR #17 and PR #18 remain OPEN/DRAFT/unmerged; neither was retargeted or closed.

**Same SHA CI:** [RF run #39209123066](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39209123066) `completed/success`, **84/84 Node**, **49/49 V0**, TypeScript typecheck; [V0 run #39209123045](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39209123045) `completed/success`, **49/49 V0 Python**. Prior increment PR17 at `fc0510b...`: [RF #39208866555](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39208866555) **77/77 Node** plus [V0 #39208866577](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39208866577) **49/49 Python**, V0 ZIP fingerprint unchanged.

**Observed Vercel side effect:** Existing Git integration automatically created **preview/nonproduction** deploy records `dpl_6kVuK42GpyhwZ2sJ6uMH4cG8gZ9L` (PR17 staged commit) and `dpl_CpYbVxHPuwiPDVNACEa5hS6kMzRY` (PR18 staged commit), both `READY`, `target:null`, branch `integration/qrvai-staged-prs-20261019`. This is not a host acceptance test or permission to deploy production. No production deploy command executed; **main remains exactly `dbf71d491d83c3f6c69326402d99bccc2c43358b`**.

**Status:** staged **2/33 canonical PRs**, next `#19` only after gate review. Alternatives `#21`/`#23` explicitly excluded. Independent approval for #17/#18 still missing. **Do not merge PR #52/main without independently verifying Vercel Git-production isolation, all required reviews and owner deployment authorization; keep Draft.**

## Staging increment 3 — PR #19 (2026-10-19), verified exact SHA

- **Canonical original PR #19** HEAD `256eaf097693762ae2c7e3618aa94781fdac09fe` (14 commits ahead /0 behind PR #18). The previous integration HEAD `e5d994a24ee5be816d656695db33bd65b613f4e9` exactly matched original PR #18 tree `2fbb6416a74d2122bc32a7c043d48598e0cae98b` before staging.
- **Actual two-parent, no-ff staging merge** `4fe9d100ef2c012d3a94d1e45ab372e3494cbdf8`: first parent `e5d994a24ee5be816d656695db33bd65b613f4e9`; second parent original PR #19 HEAD `256eaf097693762ae2c7e3618aa94781fdac09fe`. Tree SHA `2c9211e038bbe1fc98eeca45846f0527c0d33c23` **equals** original PR #19 source tree, with no rewritten original SHA. Scoped increment changed **12 paths**, 15 source-registered (not live connected) read-only RF, emergency simulation, packet planning and fixed educational tools.
- **Same staging SHA GitHub Actions:** [RF #39211700252](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39211700252) `completed/success`, **92/92 Node**, TypeScript `tsc --noEmit` success and **49/49 V0 Python**. [V0 #39211700375](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39211700375) `completed/success`, **49/49 Python** and original **12-file V0 source ZIP** SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f` unchanged.
- **Actual Vercel Git integration side effect:** Existing integration automatically created branch-preview [deployment `dpl_HLSX1ihAgA6uwgFkx8c29AXsog6b`](https://vercel.com/heraklists-projects/qrvai-rf-mcp/HLSX1ihAgA6uwgFkx8c29AXsog6b) **READY**, `target:null`, Git SHA `4fe9d100ef2c012d3a94d1e45ab372e3494cbdf8`, branch `integration/qrvai-staged-prs-20261019`. Not production; this preview is **not** host acceptance and was not launched by an explicit deploy command.
- **Author-side two source/documentation findings, unresolved before release:** (1) `docs/architecture/mcp-implementation-register.md` at the historical #19 tree contains a malformed prefixed concatenation before its `# QRVAI MCP implementation register` heading. Original PR #20 source fixes the malformed header, but is **not staged yet**. (2) `core_capabilities` tool description in `mcp/qrvai-rf-worker/src/mcp/register.ts` still claims **"Discover ten implemented..."** although #19 registers **15** tools. This is an inaccurate exposed descriptor; fix and verify in a separately reviewed later corrective commit/PR before production or host use. Do not silently alter the historical PR #19 source/ancestry during staging.
- **Scope:** 3/33 canonical PRs staged onto isolated integration branch, original #17/#18/#19 remain Draft/open/unmerged; `main` remains `dbf71d491d83c3f6c69326402d99bccc2c43358b`. No direct merge to `main`, no Plugin Creator create/install/update, no OAuth/secrets, ChatGPT live plugin, real member/rig data, transmission/PTT/CAT, or real emergency dispatch. **Production Vercel Git-on-main auto-deploy risk remains unresolved**, so release/promotion is BLOCKED. No independent reviewer APPROVE.
- **Next canonical candidate:** [PR #20](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/20), after separately checking its diff, correct ancestry, source rights, and new same-stage-SHA CI. Exclude diverged #21 and #23.

