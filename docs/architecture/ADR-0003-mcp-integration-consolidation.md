# QRVAI 4.1 Integration & Consolidation decision record

Date: 2026-10-16. Status: **Draft / review-required**, Vercel-only, no production release.

## Verified snapshot

- Canonical source candidate: PR #26 commit `2d708fc46d1921231c36e910e03b103cfc8617cb`, based on PR #25, PR #24, PR #22, PR #20, PR #19, PR #18 and PR #17.
- GitHub commit compare `main...feat/mcp-wave7-bounded-physics-20261016`: **ahead 131, behind 0**, 48 changed file paths (at audit time). This means branch descends from main, NOT that it is reviewed/ready for main.
- All 38 conceptual tool IDs map to source-registered names on the canonical *draft* branch; many remain synthetic, user-input-only, or unconnected to real authenticated services.
- PR #21 is a parallel Wave3 implementation relative to PR #20; comparison reported **diverged, 13 ahead / 13 behind**, with overlapping register and tests. Do **NOT** auto-merge or automatically cherry-pick it.
- PR #23 is a parallel Wave5 implementation relative to PR #24; comparison reported **diverged, 3 ahead / 12 behind**, with overlapping package/tests. Do **NOT** auto-merge or automatically cherry-pick it.
- PRs #17 through #26 remained **open and Draft** at audit time. Parent chain: #17 → #18 → #19 → #20 → #22 → #24 → #25 → #26. Alternate branches #21 and #23 remain available for deliberate per-change reconciliation. No PR is represented as merged.
- Previous checks: GitHub Actions RF MCP Native TDD and V0 tests passed on exact #26 head SHA; same SHA Vercel preview READY, not credentialed MCP HTTP acceptance or ChatGPT OAuth proof.

## Integration gates / ownership

| Gate | Status | Required proof |
|---|---|---|
| G1: Pick canonical chain and classify alternatives | DOCUMENTED / REVIEW REQUIRED | Diff-by-diff reconciliation of #21 and #23, record any intentionally omitted feature |
| G2: Complete functional registry | SOURCE-ONLY | Verify exact 38 registered tool names and no unintended hidden endpoints |
| G3: Cloudflare-free Vercel runtime | SOURCE-ONLY | Dependency and runtime scan, build & deployment test |
| G4: Deterministic CI | PREVIOUSLY PASS | Fresh same-SHA npm typecheck, full unit/protocol tests, V0 CI |
| G5: Security and credential boundaries | NOT ACCEPTED | Real auth, denial, Origin, oversized payload, provider scopes, secret rotation |
| G6: End-to-end Vercel HTTPS MCP | NOT ACCEPTED | Protected preview credentialed initialize, tools/list, representative tools/call, error-path tests |
| G7: ChatGPT host onboarding | NOT ACCEPTED | Host-supported authentication and user consent; real @QRVAI invocation |
| G8: Science/source fidelity | PARTIAL | Per-tool authoritative model references and explicit unverified/simulated flags |
| G9: Production release | BLOCKED | G1–G8 evidence, review, staging validation, rollback and explicit release authorization |

## Policy and next step

Retain Draft PRs and existing Vercel deployment protection; do not merge, promote, expose bearer secrets or enable production. Reconcile alternative Wave3/Wave5 changes by inspecting concrete patches and tests, then implement any proven missing behavior using TDD on this integration branch. Update the implementation register's stale introduction (which still states 'twenty-five' registered tools) after independent count/protocol checks. Keep distinction between **38 source-registered** and **38 integrated**.

## Wave3 / Wave5 alternative reconciliation — evidence pass 2026-10-16

- **PR #21 (Wave3 alternate):** compared actual `src/rf/wave3.ts` on PR #21 head and canonical #27. Both export the five named operations `digitalSetupGuide`, `repeaterChannelPreview`, `contestPlan`, `makerProjectReview`, `clubWorkshopPlan`, so there is no missing top-level Wave3 operation. However contracts differ materially: alternate M28 requests `rig/software/os` while canonical M28 requests `mode/locale`; alternate M30 uses `frequency_hz/offset_hz/tone_hz`, canonical M30 uses `rx_frequency_hz/offset_hz/...`. **Resolution: do not cherry-pick.** Mark alternate device-oriented input contract as a separate product-design decision requiring compatible schema, provenance and targeted tests, not an implicit replacement.
- **PR #23 (Wave5 alternate):** its GitHub PR patch contains only a Wave5 spec, `package.json` and `test/wave5.spec.ts`; no `src/rf/wave5.ts` implementation or new registered MCP tool in that PR. The canonical branch already exports `measurementsInspectTrace`, `sdrInspectIq`, `manualAnswerCited`, `equipmentDiagnose`, `adifValidate` in its Wave5 module; log award progress is separately implemented. **Resolution: do not cherry-pick incomplete alternate tests onto a different source contract.** Preserve alternate test cases as review candidates and ensure equivalent behavioral assertions after schema alignment.
- Both alternatives remain Draft and unmerged; this reconciliation addresses source coverage and contract conflicts, **not** release acceptance or preservation of every alternate behavior.
- **Same-commit delivery proof:** PR #27 head `9dab6f7fe4438af894b3795f586eb009501c67ff`: GitHub workflow `QRVAI V0 Tests` succeeded and Vercel preview deployment `dpl_2XrMNC2vVJfuvcktBoBVjix3z7HR` reached READY. The registry source contains 38 `registerTool(` declarations. This is build / registration evidence, not credentialed HTTPS MCP acceptance or comprehensive per-tool functional validation.

### Remaining 4.1 conditions

1. Record and approve the alternate Wave3 schema decision; examine test diffs for behavioral gaps; retain a compatibility migration plan rather than silently rewriting the canonical API.
2. Review the Wave5 alternate test assertions against canonical Wave5 semantics; add coverage only with explicit pass/fail TDD evidence.
3. Full same-SHA RF-specific workflow and test-output proof; V0 workflow success alone does not independently demonstrate all 38 MCP tools.
4. After above, proceed to phase 4.2 OAuth / user identity / scoped authorization design, separate from the current bearer-gated private backend.

## 4.1 follow-up verification: precise CI gate & alternate Wave5 assertions (2026-10-16)

- Latest audited PR #27 SHA before this documentation amendment: `5abb8c46f1904cd0f74892cc85c79a805d4814bf`. `QRVAI V0 Tests` run 38849061835 **success**; Vercel preview `dpl_8eyjsHgnQyLDDMzr1JYUW35YWo43` **READY** on this SHA. No RF-specific workflow was triggered for that documentation-only commit: `.github/workflows/qrvai-rf-mcp-ci.yml` has pull_request path filters limited to RF source, QA, workflow, and narrowly selected runbooks. **Do not equate V0 success with same-SHA RF MCP TDD.** The direct RF MCP workflow last passed on Wave7 parent SHA `2d708fc46d1921231c36e910e03b103cfc8617cb` (run 38848134507), whose RF code is unchanged by this docs-only PR.
- PR #23 alternative Wave5 tests reviewed verbatim against canonical Wave5 tests: M15 uses `points/power_dbm` instead of canonical `samples/magnitude_db`; M16 assumes normalized IQ samples and clipping/RMS whereas canonical allows arbitrary IQ samples and computes mean power/peak; M19 alternate symptom `no_receive` differs from canonical `no_receive_audio`; M31 test imports `logAdifValidate` (not canonical `adifValidate`); M32 imports `logAwardProgress` from `wave5.ts` while canonical M32 is separately implemented. Thus directly adopting PR #23 tests would break *by mismatched contracts*, not demonstrate actual production defects. Maintain canonical contracts and separately evaluate M15 sorted peak/mean, M16 clipping thresholds, M31 redaction, M32 DXCC deduplication with explicit schema versioning and RED/GREEN tests, rather than silently changing published MCP interfaces.
- **Disposition:** #21 and #23 remain alternate design/test inputs, not merge candidates. The canonical Draft registry remains 38 tools; cross-branch design choices are documented but not declared feature-equivalent. Stage 4.1 consolidation documentation and branch decision can be considered documented; runtime authorization / end-to-end host gates remain explicitly **OPEN**.
