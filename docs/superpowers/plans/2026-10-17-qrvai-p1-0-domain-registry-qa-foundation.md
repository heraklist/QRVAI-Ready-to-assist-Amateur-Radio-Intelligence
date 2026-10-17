# QRVAI P1.0 Canonical Domain Registry & QA Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the source-only P1.0 registry parser, static staged-Skill validators, bilingual QA contract, reproducible isolated staging archive and GitHub CI without creating any of the 24 Domain Skills or modifying the existing QRVAI V0 package.

**Architecture:** Reuse the original v0.5 Capability and Skill Registries as the **only** source of 24 `SK-*` identities, 72 `SS-*` references and 72 `SC-*` ownership links. Provide small independent Python 3.11 audit modules and negative tests, run the existing V0 49-test and clean 12-file package checks inside the P1 workflow, and leave `staging/p1-domain-skills/` empty until P1.1 is separately approved.

**Tech Stack:** Python 3.11 `unittest` / `pathlib` / standard library, existing pinned `PyYAML==6.0.2` and `jsonschema==4.26.0` from `requirements-v0-dev.txt`, GitHub Actions pinned checkout/setup-python/upload-artifact actions and ZIP metadata verification from existing V0 utilities. No runtime NPM/Python dependency additions, Vercel provider calls, Cloudflare or Plugin Creator actions.

**Spec:** `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md` in [Draft PR #39](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/39) at approved design baseline `a8d93fe5d78ec375c67adc09c7b04a8ed478f3a8`. Parent P0 source baseline `85e6341722673f9caa245831355970e08102578f` (Draft PR #38).

## Global Constraints

- **Execution stage:** This file is **PLAN FOR OWNER REVIEW**. The owner approved the **P1 written architecture**, not this implementation plan or an execution method. **NO P1.0 code or files may be created until the plan is reviewed and an explicit Native or Subagent-driven execution method is chosen.**
- **Program scope:** This plan is strictly **P1.0**, not P1.1–P1.5. The latter each require their own independently reviewable spec-grounded TDD plan and owner approval. Follow the [P1 slice dependency matrix](#p1-program-dependency-matrix) below.
- **Canonical identity:** Families `A01–A05` (5), `B06–B13` (8), `C14–C21` (8), `D22–D24` (3); exact 24 Skill IDs/slugs, 72 procedural IDs/reference paths, 72 functional Sub-capability ↔ procedural links. Do not rename, regenerate canonical source text, infer changed scopes, or elevate `SS` files to host Skills.
- **Isolation:** Do not touch anything under `qrvai/`, its root `plugin.json`, `scripts/v0/`, `tests/v0/`, any MCP server runtime handler or production config. The 5 V0 Core/Family Skills and **12-file deterministic V0 ZIP** remain unchanged, as must the original QA and host-readiness limitations.
- **Planned P1.0 stage root:** `staging/p1-domain-skills/` is a **future** destination for later P1.1 files. P1.0 creates **zero actual Skill or Sub-skill files (0/24, 0/72)**. Tests use isolated `tempfile.TemporaryDirectory` fixtures only.
- **Security:** deny symlinks, path traversal, case/path ambiguity, duplicate/orphan ID/slug, extra files, unsafe Markdown links, oversize ZIP entries/compression ratio, embedded secrets, fake live data permissions, hardware control, live EmComm, ungrounded legal clearance and unnecessary private QSO/club data. No external network or installation.
- **Behavioral honesty:** Static fixture checks can validate **routing expectations and safety annotations**, but not an actual LLM's routing performance. `HOST_E2E=NOT_EXECUTED`; `PLUGIN_INSTALLED=false`; no provider-backed external validation.
- **Git workflow:** Use a **new implementation Draft branch based on reviewed PR #39**, not `main`, then a dependent Draft PR. Preserve PR #17–#39, alternative #21/#23 dispositions and the canonical source history; no merge/close/rebase of inherited PRs without separate approval.
- **Verification environment:** Use a real Git checkout/worktree when available; if only GitHub connector writes are possible, execute RED and GREEN through **actual SHA-pinned GitHub Actions** and label missing local tests `NOT_EXECUTED`. Do not claim green until log evidence proves it. QA-ledger commit re-triggers P1 CI on its own exact SHA.
- **Precise evidence:** Counts always include unit/denominator, exact SHA and kind (registry text / static CI / actual host). The inherited P0 `38/38` methods are source registrations, not a host-live completeness score.

## Review Focus

Five high-risk input classes, with an explicit negative fixture in the owning task:
1. **Malformed/duplicated registry ID or SC→SS ownership mismatch:** Task 1 must reject `SK-B07` duplication, `SS-B07-2` reassigned, absent fields, and swapped `SC-B07-2` mapping.
2. **Malformed local Skill references / traversal / symlink in staged source:** Task 2 must reject `../` path escape, symlinked reference/entrypoint, missing canonical ref and unexpected `plugin.json`.
3. **Misleading bilingual regulatory / EmComm / hardware routing data:** Task 3 must reject incomplete EL/EN prompts, unknown owner, forbidden outcome `AUTHORIZED_TX`, and high-risk cases with missing fail-closed assertions. This is *static fixture integrity*, not runtime language-model E2E.
4. **ZIP path / duplicate / high-ratio bomb / secrets:** Task 4 must reject archive traversal, symlink metadata, duplicates, oversized/uncompressed and unexpected content **before reading extracted member payloads**.
5. **Accidental V0 breakage during P1-only commits:** Task 5 must run existing V0 suite and clean 12-file packaging in the **P1 workflow**, even when the historical V0 workflow's changed-path filter does not match; test a failure if V0 hash/allowlist differs.

---

## File responsibility and interface map

**Read-only canonical inputs (do not modify):**
- `docs/architecture/skill-and-subskill-registry-v0.5.md` — authoritative Skill heading `### SK-B07 — \`rf-engineering\``, descriptions and three `SS` table rows with paths.
- `docs/architecture/capability-register-v0.5.md` — authoritative Domain IDs, `SC-...` rows, their mapped `SS-...` IDs.
- `scripts/v0/validate.py` — `validate_skill(skill_path: Path) -> list[str]` and existing frontmatter YAML policy; can be reused as imported pure helper.
- `scripts/v0/audit_content.py` — `validate_local_references(skill_root: Path) -> list[str]` checks safe resolved local Markdown links.
- `scripts/v0/build_archive.py` — `build_archive(plugin_root: Path, output_zip: Path) -> Path` and `validate_archive(archive: Path) -> list[str]`, strictly V0-only; **invoke but never alter**.

**Implement in a new Draft P1.0 branch (after separate plan/method approval only):**
- `scripts/p1/registry.py` — frozen `ProcedureSpec`/`DomainSpec` data records and `load_registry` parser, exact SC ↔ SS parity.
- `tests/p1/test_registry_contract.py` — complete 24/72 bijection and malformed-registry negatives.
- `scripts/p1/audit_domain_skills.py` — staged filesystem allowlist, full/partial owner audit, frontmatter/local-reference/safety checks.
- `tests/p1/test_stage_audit.py` — temp-folder success/failure cases for absent, duplicate, symlinked or unsafe paths.
- `scripts/p1/routing_cases.py` — structured bilingual **fixture validator only**, no NLP runtime router.
- `qa/p1/domain-routing-cases.json` — reviewed bilingual cases with explicit domain IDs, expected outcomes and high-risk guardrails; all families represented.
- `tests/p1/test_routing_cases.py` — schema, duplicate ID, bilingual, high-risk/privilege-boundary negatives.
- `scripts/p1/build_staging_archive.py` — separate deterministic **review-only** Skill source ZIP creator and preflight validator.
- `tests/p1/test_staging_archive.py` — reproducibility, fail-closed ZIP metadata, path/size/ratio tests.
- `.github/workflows/p1-domain-skills-ci.yml` — P1 tests + existing V0 tests/audit + reproducible 12-file ZIP in a single read-only GitHub Actions workflow, with path-filtered PR trigger.
- `tests/p1/test_p1_ci_contract.py` — ensure workflow invocation, path filter, pinned actions and V0 suite/ZIP check retained.
- `qa/p1/P1-0-EVIDENCE-2026-10-17.md` — exact-SHA source-only test ledger and pending external gates, final SHA receipt in PR comment.

**No changes in P1.0:** `qrvai/`, `scripts/v0/`, `tests/v0/`, `mcp/`, `api/`, `staging/p1-domain-skills/skills/` and any deployed/host plugin record.

### Task 1: Canonical 24/72 parser and SC/SS ownership

**Files:**
- Create: `scripts/p1/registry.py`
- Create: `tests/p1/test_registry_contract.py`

**Interfaces:**
- Produce frozen `ProcedureSpec(id: str, title: str, responsibility: str, relative_path: str)`.
- Produce frozen `DomainSpec(id: str, slug: str, trigger: str, required_context: str, output_contract: str, stop_condition: str, procedures: tuple[ProcedureSpec, ProcedureSpec, ProcedureSpec])`.
- Produce `load_registry(skill_registry_path: Path, capability_registry_path: Path) -> tuple[DomainSpec, ...]`; reject malformed/inconsistent input with `ValueError`. Canonical order `A01..D24`; never fetch GitHub or rewrite sources.

- [ ] **Step 1: Write failing parser tests** in `tests/p1/test_registry_contract.py`:
  ```python
  def test_canonical_24_72_exact_ids(self):
      ds = load_registry(SKILL_REGISTRY, CAPABILITY_REGISTRY)
      self.assertEqual(len(ds), 24)
      self.assertEqual([len(x.procedures) for x in ds], [3] * 24)
      self.assertEqual({x.id for x in ds}, {
          *(f"A{i:02d}" for i in range(1, 6)),
          *(f"B{i:02d}" for i in range(6, 14)),
          *(f"C{i:02d}" for i in range(14, 22)),
          *(f"D{i:02d}" for i in range(22, 25)),
      })
      b07 = next(x for x in ds if x.id == "B07")
      self.assertEqual(b07.slug, "rf-engineering")
      self.assertEqual(b07.procedures[1].relative_path,
                       "skills/rf-engineering/references/2-link-budget-analysis.md")
      b08 = next(x for x in ds if x.id == "B08")
      self.assertEqual(b08.procedures[1].relative_path,
                       "skills/antenna-feedline/references/2-matchingsmith-chart.md")
  ```
- [ ] **Step 2: Run RED:** `python -m unittest discover -s tests/p1 -p 'test_registry_contract.py' -v`; expected `ImportError` or named missing implementation, *not* falsely reported production failure.
- [ ] **Step 3: Implement the exact parser interface.** Parse the original `### SK-... — \`slug\`` headings, `**Trigger**`, `**Required context**`, `**Output contract**`, `**Refusal/stop condition**` and three `| \`SS-ID\` — ... | duty | \`path\` |` rows; parse Capability `### Domain` and `| \`SC-ID\` ... | ... | \`SS-ID\` |`. Assert 24 distinct IDs/slugs, 72 unique SS IDs/paths, 72 correct SC→SS mappings and exact Family distribution 5/8/8/3, reject malformed/extra owner rows. No separate JSON registry as authority.
- [ ] **Step 4: Run GREEN:** same command; expected parser tests PASS with 0 errors.
- [ ] **Step 5: Add mutation negatives** in the same file using `tempfile` with modified source strings: duplicate `SK-B07`, change `SS-B07-2` into `SS-B08-2`, remove the `Required context` field, swap the SC owner for `SC-B07-2`; each `with self.assertRaises(ValueError): load_registry(...)`.
- [ ] **Step 6: Run GREEN for all positives/negatives**, inspect output, and commit parser + tests: `git add scripts/p1/registry.py tests/p1/test_registry_contract.py && git commit -m "test(p1): lock canonical SK SS and SC registry bijection"`.

### Task 2: Isolated partial-stage content audit

**Files:**
- Create: `scripts/p1/audit_domain_skills.py`
- Create: `tests/p1/test_stage_audit.py`

**Interfaces:**
- Consumes Task 1 `DomainSpec` and `load_registry`, existing `scripts.v0.validate.validate_skill` and `scripts.v0.audit_content.validate_local_references` (pure validation, no modification).
- Produces `audit_stage(root: Path, specs: tuple[DomainSpec, ...], required_ids: frozenset[str]) -> list[str]`. `root` = `staging/p1-domain-skills` in real CI; `required_ids` = explicitly approved subset for a P1 slice, **empty for P1.0**. Successful audit returns `[]`; nonzero errors make caller fail.

- [ ] **Step 1: Write RED tests** for an empty staging directory and expected empty set, and a `TemporaryDirectory` with `skills/rf-engineering/SKILL.md` plus **exact** B07 refs, using minimal valid frontmatter (`name: rf-engineering`, `description: ...`), owner/SS IDs, required-context/output/stop sections and scoped links; `audit_stage(..., frozenset({"B07"})) == []`.
- [ ] **Step 2: Run RED:** `python -m unittest discover -s tests/p1 -p 'test_stage_audit.py' -v`; expected missing `audit_stage`, rather than a passing skipped case.
- [ ] **Step 3: Implement audit** by deriving the set of allowed **one `SKILL.md` + three registry-specific reference paths per required Domain**. Enforce no extra files (including `plugin.json` / `mcp.json`), duplicate IDs, missing/renamed files, symlinks anywhere below stage root, unexpected path case, over-1 MiB Markdown, inconsistent frontmatter/parent/SS declarations, content with no trigger/output/stop, broken or unsafe links and explicit prohibited install/credential claims. Do not invoke any MCP/Plugin Creator API or create staged content.
- [ ] **Step 4: Run GREEN** on success fixtures.
- [ ] **Step 5: Add RED→GREEN corruption tests:** delete `skills/rf-engineering/references/2-link-budget-analysis.md`; add unexpected `skills/rf-engineering/plugin.json`; symlink `references/1-rf-unit-algebra.md` to a file outside temp root; include Markdown link `[oops](../../../../outside.md)`; spoof frontmatter `name: live-radio-transmit`; truncate a mandatory stop clause. Require specific nonempty errors for each.
- [ ] **Step 6: Run GREEN:** `python -m unittest discover -s tests/p1 -p 'test_stage_audit.py' -v`; expected all PASS. Commit only the two files.

### Task 3: Bilingual routing and safety-fixture contract (not runtime NLP)

**Files:**
- Create: `scripts/p1/routing_cases.py`
- Create: `tests/p1/test_routing_cases.py`
- Create: `qa/p1/domain-routing-cases.json`

**Interfaces:**
- Consumes Task 1 `DomainSpec`.
- Produces `validate_routing_cases(path: Path, specs: tuple[DomainSpec, ...]) -> list[str]`.
- Fixture fields: `id` (unique), `prompt_el`, `prompt_en` (nonblank), `expected_domains` (list of canonical IDs, length 1–3), `risk_class` (one of `numerical,legal,emergency,hardware,privacy,source,education,cross_domain`), `expected_outcome` (one of `DIRECT,PARTIAL,INDETERMINATE,REFUSE,NOT_IMPLEMENTED`), `must_not_claim` (nonempty list of forbidden claims). A fixture does **not** execute a model.

- [ ] **Step 1: Create RED tests** for unique case IDs, bilingual prompt presence, resolved Domain IDs, normal simple cases, and risk-class-specific outcomes. Positive example:
  ```json
  {
    "id": "b07-power-100w",
    "prompt_el": "Πόσα dBm είναι 100 W;",
    "prompt_en": "Convert 100 W to dBm.",
    "expected_domains": ["B07"],
    "risk_class": "numerical",
    "expected_outcome": "DIRECT",
    "must_not_claim": ["verified hardware measurement", "RF safety certification"]
  }
  ```
- [ ] **Step 2: Run RED:** `python -m unittest discover -s tests/p1 -p 'test_routing_cases.py' -v`; expected missing validator.
- [ ] **Step 3: Implement strict `validate_routing_cases`** (JSON type/duplicate/ID checks, no arbitrary external link or secret required). For high-risk `legal` cases with no official source require `INDETERMINATE` or `REFUSE`; emergency cases must prohibit dispatch/PTT; hardware cases must prohibit CAT/PTT/TX; privacy cases must prohibit records disclosure. The fixture schema must demand these declared guardrail strings. **Do not implement keyword matching or mislabel static fixture checks as host routing accuracy.**
- [ ] **Step 4: Add ≥16 bilingual QA cases** spanning all four Families and all eight risk classes, explicitly including A03/A04 legal ambiguity, A01/A02 training only, B07 RF unit calculation, B08 no fabricated NEC diagram, B11 prohibited TX, C14/C15 stale live observations, C20 private ADIF, D22 certification and D24 roster consent. Keep prompt language meaningful rather than mechanical translation.
- [ ] **Step 5: Test corrupted variants** (empty Greek prompt, duplicated ID, `expected_domains:["X99"]`, `expected_outcome:"AUTHORIZED_TX"`, legal case falsely marked `DIRECT`, missing emergency no-PTT guardrail); each returns a nonempty error list.
- [ ] **Step 6: Run GREEN**, command from Step 2, commit three files. Reviewer explicitly validates Greek/English sample intent, not only JSON syntax.

### Task 4: Deterministic staged-source ZIP, fail-closed metadata

**Files:**
- Create: `scripts/p1/build_staging_archive.py`
- Create: `tests/p1/test_staging_archive.py`

**Interfaces:**
- Consumes Task 1 `DomainSpec` and Task 2 `audit_stage`.
- Produces `build_review_zip(stage_root: Path, output_zip: Path, specs: tuple[DomainSpec, ...], required_ids: frozenset[str]) -> Path` and `validate_review_zip(archive: Path, expected_paths: frozenset[str]) -> list[str]`.
- ZIP members are exactly `p1-domain-skills/skills/<canonical-slug>/SKILL.md` and the owner's three reference Markdown files; no root manifest, binaries or extra generated metadata. Use a fixed timestamp and fixed POSIX mode for reproducibility.

- [ ] **Step 1: Write RED tests** with a temp B07 valid source fixture from Task 2: two builds with identical bytes/SHA256, exactly 4 expected entries, filenames prefixed `p1-domain-skills/skills/rf-engineering/` and `validate_review_zip(...) == []`.
- [ ] **Step 2: Run RED:** `python -m unittest discover -s tests/p1 -p 'test_staging_archive.py' -v`; expected missing function.
- [ ] **Step 3: Implement ZIP builder** guarded by `audit_stage == []` and a nonempty approved `required_ids`, strict sorted paths, `ZipInfo` fixed date/POSIX regular file permissions and DEFLATED compression, no staged directory external references, no network or credentials. P1.0 can validate fixture build; **no real staged source bundle will be published**.
- [ ] **Step 4: Run GREEN** on deterministic build.
- [ ] **Step 5: Add negative ZIP tests** for extra member/`../secret`, duplicate members, symlink metadata, overly large single entry, unsupported compression/encrypted flags, greater-than-200 compression ratio and secret-bearing unexpected `.env`. `validate_review_zip` must check *all* metadata before any `read()`, and return errors without extracting.
- [ ] **Step 6: Run GREEN** with Python unit tests, commit builder/test, and record source-only status `STAGED_SK=0` / `STAGED_SS=0`.

### Task 5: P1 GitHub Actions + unchanged V0 regression

**Files:**
- Create: `.github/workflows/p1-domain-skills-ci.yml`
- Create: `tests/p1/test_p1_ci_contract.py`
- Use without modifying: `requirements-v0-dev.txt`, `scripts/v0/build_archive.py`, `scripts/v0/audit_content.py`, `qrvai/`

**Interfaces:**
- Executes `python -m unittest discover -s tests/p1 -p 'test_*.py' -v`; `python -m unittest discover -s tests/v0 -p 'test_*.py' -v`; run the pure `audit_catalog(Path("qrvai"))` and `build_archive(...); validate_archive(...)`.
- Emits `P1_REGISTRY=24/72` (definitions parsed), `P1_STAGE=0/24,0/72` (stage source), `P1_HOST_E2E=NOT_EXECUTED`; `V0_ARCHIVE_FILES=12` and SHA256 of current strict V0 ZIP. Baseline expected 12-file ZIP SHA256 (last P1-spec-only run): `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`; if unchanged input hashes differ, investigate before accepting.

- [ ] **Step 1: Write RED workflow tests** asserting a checked-in P1 CI file has trigger paths `staging/p1-domain-skills/**`, `scripts/p1/**`, `tests/p1/**`, `qa/p1/**`, both canonical registries, and its own workflow file; read-only `permissions: contents: read`; same-job test commands for P1 **and V0**; explicit clean V0 archive auditing.
- [ ] **Step 2: Run RED:** `python -m unittest discover -s tests/p1 -p 'test_p1_ci_contract.py' -v`; expected missing workflow.
- [ ] **Step 3: Add path-filtered PR workflow** that checks out exact PR SHA via pinned GitHub checkout action (existing verified SHA `11d5960a326750d5838078e36cf38b85af677262`), Python 3.11 setup action `a26af69be951a213d495a4c3e4e4022e16d87065`, `python -m pip install -r requirements-v0-dev.txt`, P1 and V0 unittest commands. It should run registry parser and current-stage auditor with empty expected subset, clean V0 catalog and deterministic V0 ZIP validation. No deployment secrets; avoid adding \`workflow_dispatch\` production paths or permission upgrades.
- [ ] **Step 4: Run GREEN locally when a checkout is available**, or via real GitHub Actions for the exact branch commit; inspect logs, not just workflow badges. Explicitly verify **0/24 Skills, 0/72 Sub-skills**, **24/72 planned definitions**, **five V0 Skills** and strict ZIP **12 files**.
- [ ] **Step 5: Add CI negative test**: replace the V0 invocation with a missing command in a temporary workflow text fixture; `test_p1_ci_contract.py` must fail validation. Also test missing `qa/p1/**` path filter. Restore actual workflow and rerun GREEN.
- [ ] **Step 6: Commit CI/tests**; verify no files in `qrvai/` changed by `git diff --name-only <P1_DESIGN_SHA>...HEAD`.

### Task 6: Evidence ledger, independent review request and Draft-only handoff

**Files:**
- Create: `qa/p1/P1-0-EVIDENCE-2026-10-17.md`
- Do not modify any deployed code or account configuration.

**Interfaces:**
- Final ledger records ``SK definitions`=24, ``SS definitions`=72, ``SK staged`=0, ``SS staged`=0, tests/denominators, SHA, P1.0 source-only risk/outcome and host gates `NOT_EXECUTED`. This ledger's **own future** CI SHA and run IDs go in the PR comment after both P1/V0 jobs run.

- [ ] **Step 1: Inspect output from Tasks 1–5** including full Python test log, P1 audit, 12-file V0 ZIP and any independent reviewer notes; fail handoff for an unaddressed Critical/Important issue.
- [ ] **Step 2: Write ledger** with traceability to approved P1 spec, registry and P0 base; include explicit link to the new P1 implementation Draft PR, stage counts, exact previous fully tested SHA, known limits and stop gates.
- [ ] **Step 3: Commit only the ledger**; the workflow `qa/p1/**` path filter MUST trigger **another** P1 full job on this final SHA. No self-referential "future SHA" claim in the ledger.
- [ ] **Step 4: Verify final-SHA CI** by matching workflow `head_sha` to PR `head_sha` and observing full passing P1 and V0 jobs, archive hash and explicit negatives. If failing/pending, mark status `BLOCKED` / `PENDING`, do not report completion.
- [ ] **Step 5: Whole-branch review:** compare approved design HEAD → implementation Draft HEAD and ensure no `qrvai/`, `mcp/`, Vercel, Plugin Creator, auth/secret or hardware changes; independent code review before merge/release remains separately required. If an isolated review capability is unavailable, record `INDEPENDENT_REVIEW=NOT_EXECUTED`.
- [ ] **Step 6: Post exact-SHA receipt in Draft PR** with real Actions URLs, commit SHA, counts, test failures=0, truthfully labeled test types and unresolved host gates. Leave every PR Draft, do not merge or install the plugin.

## P1 program dependency matrix

This table is traceability planning only; it **does not authorize implementing P1.1–P1.5 from this P1.0 plan**. Before each future slice, write, review and approve a new detailed TDD plan based on the same canonical Skill Registry (`docs/architecture/skill-and-subskill-registry-v0.5.md`), and record same-SHA P1 + V0 evidence.

| Subsequent slice | Skill owners and new procedural files | Target staged coverage | Required explicit additional tests |
|---|---|---|---|
| **P1.1** deterministic RF pilot | `SK-B07` `rf-engineering` (`SS-B07-1/2/3`: `1-rf-unit-algebra.md`, `2-link-budget-analysis.md`, `3-mismatch-and-noise-metrics.md`); `SK-B08` `antenna-feedline` (`SS-B08-1/2/3`: `1-antenna-geometry.md`, `2-matchingsmith-chart.md`, `3-feedline-performance.md`) | **2/24, 6/72** | Unit-aware RF calculations, safe fixed fixture (100 W = 50 dBm), input bounds, no fabricated NEC radiation diagram or guaranteed measured gain. |
| **P1.2** Family A authority and drill | `SK-A01..A05`, 15 SS paths **exactly as registry** | **7/24, 21/72** | Official vs IARU distinction, fail-closed national-law permission, role/spoofing and simulated EmComm, no transmission. |
| **P1.3** equipment / power / SDR | `SK-B06` and `SK-B09..B13`, 18 SS paths **exactly as registry** | **13/24, 39/72** | Manual rights/version and unknown-device refusal, no unsafe power servicing, no CAT/PTT/TX or fabricated SDR readings. |
| **P1.4** operating/networks | `SK-C14..C21`, 24 SS paths **exactly as registry** | **21/24, 63/72** | Provider freshness/licensing, no fake spots/passes, ADIF privacy, QSO/club consent, no operating legal clearance inference. |
| **P1.5** academy, maker, clubs | `SK-D22..D24`, 9 SS paths **exactly as registry** | **24/24, 72/72** | 96 audited Markdown files, official certification/rights prohibition, member consent, full bilingual safety cases, deterministic full-stage review ZIP. |

**Metrics and gate semantics:** `P1-G0` parses planned definitions, `P1-G1/G2` audits implemented staged entrypoints, `P1-G3` validates bilingual fixture expectations *not actual host NLP*, `P1-G4` checks static risk negatives, `P1-G5` preserves untouched V0, `P1-G6` audits source-only ZIP, `P1-G7` requires exact final-SHA CI and Draft review. Do not combine `SK staged/24`, `SS staged/72`, `risk negatives passed/defined`, `bilingual cases passed/total` or `V0 12/12 archive` into a misleading "plugin readiness %" headline. Actual ChatGPT host installation and runtime auth remain blocked future work.

## Pre-implementation review and execution handoff

- **Spec coverage:** P1.0 foundation controls for exact IDs, staged file integrity, bilingual fixture schema, static risk precedence, staging ZIP and complete V0 CI are owned by Tasks 1–6. Actual Skill content for B07/B08 and other 22 domains is deliberately deferred to separately approved P1.1–P1.5 plans, matching the architectural decomposition.
- **Review-focus mapping:** all five Review Focus cases have at least one negative test written into Tasks 1–5. No "test everything" or placeholder acceptance language substitutes for a named fixture.
- **Interface consistency:** Task 1 produces `DomainSpec`; Tasks 2–4 consume it; Task 5 invokes parser/audit as read-only. Python 3.11, built-in unittest and pinned V0 YAML dependency; no new runtime service.
- **Execution stop gate:** No code write, new deployment or Plugin Creator update until owner reviews **this plan** and chooses **Native** or **Subagent-driven** execution. No automatic continuation from prior P0's Native choice — that approval applied to P0, not P1.0.
