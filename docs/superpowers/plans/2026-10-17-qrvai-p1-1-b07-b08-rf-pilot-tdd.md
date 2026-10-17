# QRVAI P1.1 — B07/B08 RF Domain Skill Pilot — Native TDD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans **only after the owner separately approves THIS plan and selects a method**. Read superpowers:test-driven-development and verification-before-completion before writing source files.

**Status:** WRITTEN PLAN — FOR OWNER REVIEW; P1.1 implementation **NOT_STARTED**.  
**Date:** 2026-10-17.  
**Approved program specification:** `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md` (Draft [PR #39](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/39)).  
**Parent verified engineering source:** P1.0 [Draft PR #40](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/40), immutable baseline `f121ab4da7430971bd19ec52f1bb82dccfb3f9fa`; exact-SHA [P1.0 CI #39009458828](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39009458828): **29/29 P1**, **49/49 V0**, 12-file V0 archive unchanged.  
**Master authority:** `docs/roadmap/2026-10-14-qrvai-master-roadmap.md`, `docs/roadmap/2026-10-14-qrvai-review-gates-v0.5.md` and `docs/roadmap/2026-10-17-qrvai-master-plan-p0-crosswalk.md`; P1 is a cross-cutting workstream, **not a replacement M/V milestone or a product release**.

**Goal:** Stage precisely **two** canonical host-discoverable *candidate* Skills (`SK-B07` and `SK-B08`) and their **six** canonical internal procedural Sub-skills under `staging/p1-domain-skills/`, with strict Python audit, Greek/English RF golden cases, carefully bounded tool references, a reproducible **8-file review-only ZIP**, the existing V0 12-file archive unchanged and actual same-SHA CI evidence. P1.1 source coverage becomes **2/24 Skills and 6/72 Sub-skills**, not 2 production tools or 100% readiness.

**Architecture:** Content-first domain instructions, not a new Python RF engine or MCP contract. Each Skill's frontmatter, named trigger/context/output/stop and links are checked by the existing `scripts/p1/registry.py` + `audit_domain_skills.py`. All numerical examples are explicit user-supplied/ideal physical assumptions; registered MCP calculators are cited by their **exact** SDK names, not automatically called. Source-only P1 CI makes controlled 0→1→2 Skill-stage transitions while keeping V0 49 tests and original strict ZIP hash. No independent "agent" is created per Sub-skill.

**Stack:** Markdown with strict YAML frontmatter; Python 3.11 stdlib `unittest` and existing pinned PyYAML via `requirements-v0-dev.txt`; existing Node 22/TypeScript RF MCP SDK test suite is regression-only; GitHub Actions with existing pinned checkout/setup-python/setup-node actions and read-only permissions. No new product service, runtime npm dependency, plugin manifest, account, credentials or production deployment.

## Authorizations, immutable scope, test truth

- **Current owner approval extends only to preparing this detailed P1.1 plan.** It does not automatically authorize executing it. After review, owner selects **Native TDD** or **Subagent-driven** for P1.1; prior Native choice was only for P1.0.
- **New implementation branch when approved:** branch from this **reviewed P1.1 planning branch** at its verified head; dependent **Draft PR** based on planning branch, **never `main`**. Do not merge/close PR #17–#40 or other inherited Draft PRs.
- **Exactly eight new staged Markdown source files:** two `SKILL.md` entrypoints + six named `references/*.md`. The six references are **internal procedures**, not independent Skills, agents, new scopes or method registrations.
- **Do not edit `qrvai/**, `scripts/v0/**, `tests/v0/**, `mcp/**, `api/**, Vercel prod secrets/routes, Plugin Creator record, station/device code or canonical v0.5 taxonomies. Changes allowed only under `staging/p1-domain-skills/**, `tests/p1/**, `qa/p1/**, and the existing `.github/workflows/p1-domain-skills-ci.yml` unless a separately recorded spec-grounded ruling identifies a required validator defect.
- **Explicit boundary:** NO CAT/PTT/TX, device/SDR link, arbitrary file access, manufacturer lookup, embedded external data acquisition, live propagation, legal transmission permission, official exposure/safety compliance, actual NEC or Smith-chart plots, real-time network operation, host/OAuth/Plugin Creator activation.
- **Exact tool names already registered only in Draft source:** `rf_power_convert`, `rf_link_budget`, `rf_impedance`, `rf_feedline_loss`, `antenna_geometry`, `antenna_matching`. Cite SDK input fields and capabilities precisely; a planned procedure is not a live third-party integration. **`antenna_matching` is ideal lossless quarter-wave resistive matching, not a full complex Smith-chart generator.** No general-purpose noise-figure calculator is thereby proven available.
- **Hard P1.0 CI migration:** baseline workflow currently tests `audit_stage(stage,specs,frozenset())==[]` and prints `P1_STAGE=0/24,0/72`; its companion `tests/p1/test_p1_ci_contract.py` asserts the zero-stage string. Changing only the new Markdown files would break CI. Transition atomically through **B07=1/24,3/72**, then **B07+B08=2/24,6/72** and update workflow + test assertions at the same corresponding GREEN commits.
- **Evidence honesty:** a passing content audit checks *instruction files and static examples*, not actual model reasoning, measured RF data, official RF compliance, host capabilities or installed plugin readiness. User answers must always distinguish ideal model, unverified user curve and measurements.
- **Test commands in this plan:** `python -m unittest discover -s tests/p1 -p 'test_*.py' -v`; `python -m unittest discover -s tests/v0 -p 'test_*.py' -v`; and, in `mcp/qrvai-rf-worker`, `npm ci --ignore-scripts && npm run typecheck && npm test` after pinned Node 22 setup. Record real counts from each run; **do not copy historical counts as if they were fresh**.
- **GitHub Actions execution:** use real exact-commit GitHub CI logs for RED and GREEN where no local checked-out worktree is available; label local runs **NOT_EXECUTED**, never infer success from code review alone. All final verification must rerun at the final QA-ledger SHA.

## Review Focus — five failure classes requiring negative tests

1. **Wrong Skill and reference ownership:** `SK-B07` or `SK-B08` slug/`name` mismatch; missing or swapped `SS-B07-2`/`SS-B08-2`, a seventh reference or duplicated ownership. Task 1 and Task 4 tests require `audit_stage` to fail, not merely string-match generic text.
2. **Unphysical or unsupported RF calculation:** zero/negative W to dBm, zero/negative `z0_ohm`, loss outside supported curve, finite range overflow, missing units, unknown noise bandwidth. Task 3/6 fixtures demand `MISSING_CONTEXT`, `OUT_OF_RANGE` or `INDETERMINATE`, never made-up numbers.
3. **Unsupported antenna/matching claim:** `antenna_matching` falsely billed as complex Smith-chart generator, fabricated NEC pattern, guaranteed real antenna gain or a measured SWR. Task 5/6 content assertions reject those claims and demand **ideal design only**.
4. **Provenance/permissions failure:** guessed vendor cable profile; promised CAT/PTT/TX; IARU band plan declared a Greek operating authorization, or RF screening called certification. Task 3/6 fixtures include explicit fail-closed EL/EN examples.
5. **CI/source artifact contamination:** zero-stage CI assertion left in place, P1 staging ZIP includes extra files, V0 5 Skills/12 archive changed, old V0 SHA check removed, or no RF SDK regression. Task 2/5/7 tests fail on each mutation.

## File and interface map

### Read-only normative inputs
- `docs/architecture/skill-and-subskill-registry-v0.5.md` — exactly two definitions `SK-B07` (`rf-engineering`) / `SK-B08` (`antenna-feedline`) with three filename/owner/responsibility triples each.
- `docs/architecture/capability-register-v0.5.md` — `SC-B07-1..3` → `SS-B07-1..3` and `SC-B08-1..3` → `SS-B08-1..3` (already verified in P1.0).
- `mcp/qrvai-rf-worker/src/mcp/register.ts` — actual read-only SDK names/input contracts, `mcp/qrvai-rf-worker/src/rf/{power,link-budget,impedance,feedline,wave1}.ts` — bounded source calculators. **Never edit these methods in P1.1.**
- `scripts/p1/registry.py` → `load_registry(skill_path: Path, cap_path: Path) -> tuple[DomainSpec,...]`.
- `scripts/p1/audit_domain_skills.py` → `audit_stage(root: Path, specs: tuple[DomainSpec,...], required_ids: frozenset[str]) -> list[str]`.
- `scripts/p1/build_staging_archive.py` → `build_review_zip(stage_root: Path, output_zip: Path, specs: tuple[DomainSpec,...], required_ids: frozenset[str]) -> Path`; `validate_review_zip(archive: Path, expected_paths: frozenset[str]) -> list[str]`.
- `scripts/p1/routing_cases.py` → `validate_routing_cases(path: Path, specs: tuple[DomainSpec,...]) -> list[str]`. Existing `qa/p1/domain-routing-cases.json` already has 18 EL/EN cases over A/B/C/D and eight risk classes; **extend without breaking that minimum**, or keep unchanged and validate additional focused fixtures independently.

### Exactly eight staged source paths (create only after implementation approval)
1. `staging/p1-domain-skills/skills/rf-engineering/SKILL.md` — `SK-B07`.
2. `staging/p1-domain-skills/skills/rf-engineering/references/1-rf-unit-algebra.md` — `SS-B07-1`; *convert W/dBm/dBW and dBi/dBd correctly with exact references*.
3. `staging/p1-domain-skills/skills/rf-engineering/references/2-link-budget-analysis.md` — `SS-B07-2`; *calculate transmit chain, path attenuation and receiver margin*.
4. `staging/p1-domain-skills/skills/rf-engineering/references/3-mismatch-and-noise-metrics.md` — `SS-B07-3`; *compute SWR/return loss, noise figure and sensitivity within assumptions*.
5. `staging/p1-domain-skills/skills/antenna-feedline/SKILL.md` — `SK-B08`.
6. `staging/p1-domain-skills/skills/antenna-feedline/references/1-antenna-geometry.md` — `SS-B08-1`; *estimate physical geometry and expose ground/velocity caveats*.
7. `staging/p1-domain-skills/skills/antenna-feedline/references/2-matchingsmith-chart.md` — `SS-B08-2`; *evaluate impedance locus and matching-network feasibility*.
8. `staging/p1-domain-skills/skills/antenna-feedline/references/3-feedline-performance.md` — `SS-B08-3`; *calculate attenuation, delivered power and mismatch assumptions*.

### Tests and CI to write/update
- **Create** `tests/p1/test_rf_pilot_stage.py`: real source-file audit, exact 4+4 filenames and owner contracts, positive and mutated temp-copy negatives. Stable tests may copy **only one Domain** to a disposable stage, then call `audit_stage(..., frozenset({domain_id}))` to avoid the other Domain's files being treated as extras.
- **Create** `tests/p1/test_rf_pilot_examples.py`: independently asserted physical/numeric golden examples and strict provenance/abstention/safety content contracts. Where testing a documented example, parse the reference's explicitly marked fixed value or a focused golden-case JSON; never self-compute "expected" and "actual" from the same function.
- **Create** `qa/p1/rf-pilot-golden-cases.json`: named EL/EN instructional cases with exact inputs, formula revision/evidence, expected numeric value/tolerance OR explicit fail-closed outcome. Do not invent official legal sources or measured curves.
- **Modify** `.github/workflows/p1-domain-skills-ci.yml`: staged-set transitions, **P1_STAGE=2/24,6/72** at final, on-branch P1/V0/Node RF verification, 8-file staging source ZIP deterministic check, existing strict V0 fingerprint retained.
- **Modify** `tests/p1/test_p1_ci_contract.py`: new final count, RF suite and staging ZIP workflow invariants, regression negatives for stale zero-stage, missing V0 suite, unpinned actions, missing path filters.
- **Create** `qa/p1/P1-1-EVIDENCE-2026-10-17.md`: RED/GREEN runs, RF golden-case ledger, final-SHA P1/V0/RF and ZIP receipt, unresolved host/independent review gates.
- **Do not modify:** `qrvai/**, `scripts/v0/**, `tests/v0/**, `mcp/**, `api/** and normative architecture registers.

### Mandatory Markdown instruction contract for both Skill entrypoints
YAML:
```yaml
---
name: rf-engineering            # B07; B08 name is antenna-feedline
description: Bounded offline RF engineering explanations with typed units; no live hardware access.
---
```
Real content must use truthful, selective descriptions (no "live VNA", "certified"). Required headings/fields: `# SK-B07 ...` / `# SK-B08 ...`, `**Trigger:**`, `**Required context:**`, `**Output contract:**`, `**Refusal/stop condition:**` and 3 Markdown links to exact `references/...md` paths. Every reference must contain `SS-Bxx-n`, `**Owner:** SK-Bxx`, exact canonical `**Responsibility:** ...` wording, `**Required input:**`, `**Procedure:**`, `**Output:**`, `**Error/stop:**`. Reuse `validate_skill` and `validate_local_references` via `audit_stage`, not a parallel parser. Only task-relevant 1–3 procedure references may be selected; do not describe all 72 as eagerly loaded host agents.

---

### Task 1: RED tests — stage B07 ownership and exact procedural set

**Files:** create `tests/p1/test_rf_pilot_stage.py` (initial B07-focused tests; extend for B08 in Task 4).

**Interface:** `SPECS = load_registry(...); STAGE_ROOT = ROOT/"staging/p1-domain-skills"`. For a single-domain audit, copy its staged directory into `TemporaryDirectory()/skills/<slug>` and invoke `audit_stage(temp_stage,SPECS,frozenset({"B07"}))`. Tests should first assert the real source paths are present, not invent their content.

- [ ] **Step 1 (RED):** Write `test_b07_all_four_paths_and_registry_identity`: assert `SK-B07`/`rf-engineering`, three `SS-B07-1..3` filenames exactly from `SPECS`, each real path exists under stage; assert `audit_stage` of a copied B07-only package returns `[]`. Before implementation, absent files cause the expected failure.
- [ ] **Step 2 (run RED):** `python -m unittest discover -s tests/p1 -p 'test_rf_pilot_stage.py' -v`; expect a named B07 missing-file assertion, **not** an unrelated import/fixture error. With GitHub connector only, add test on dependent Draft implementation branch and read the exact-SHA failure log.
- [ ] **Step 3:** Add test `test_reject_misowned_or_missing_b07_reference`: from a valid B07 temporary copy, delete `2-link-budget-analysis.md`; mutate `**Owner:** SK-B07` to `SK-B08`; add orphan reference; in every case `audit_stage(...) != []`. These tests are expected to pass only after the positive staged B07 fixture exists; do not require P1.1 source to be pre-created.
- [ ] **Step 4:** Add test `test_b07_is_not_a_host_plugin_manifest`: no staged `plugin.json`/`mcp.json`; require explicit stop on physical TX or verified measurements in Skill guidance.
- [ ] **Step 5:** Keep this Task marked **RED pending Task 2**; commit only the test file (`test(p1.1): stage B07 canonical file and ownership RED assertions`). **No code/content has been implemented here by design**; do not call Task 1 GREEN until Task 2 passes its missing-file test.

### Task 2: GREEN B07 entrypoint and 3 procedural files; migrate P1 CI to 1/24

**Files:** create the four B07 `staging/...` Markdown files; modify existing `.github/workflows/p1-domain-skills-ci.yml` and `tests/p1/test_p1_ci_contract.py`. Consume Task 1 tests.

**Contract:**
- `SK-B07` `rf-engineering` uses all required Markdown fields/three links; refusal "No invented mathematical results or automatic compliance claim" must survive paraphrase into a direct, testable statement.
- `SS-B07-1` exact `Responsibility: convert W/dBm/dBW and dBi/dBd correctly with exact references`; `rf_power_convert` input strictly `{"value": finite_number, "unit": "W"|"mW"|"dBm"|"dBW"}`, never general exposure authority; clarify dBi/dBd are antenna *gain*, not RF power units; dBd reference ≈2.15 dB below dBi for ideal dipole relation.
- `SS-B07-2` exact responsibility as registry; `rf_link_budget` requires **seven keys** (`tx_w`, `tx_gain_dbi`, `tx_loss_db`, `path_loss_db`, `rx_gain_dbi`, `rx_loss_db`, `rx_sensitivity_dbm`), supplied not inferred.
- `SS-B07-3` exact responsibility as registry; `rf_impedance` inputs `r_ohm`, `x_ohm`, `z0_ohm`; impedance/VSWR/return loss are ideal calculations, not VNA measurements. Thermal noise / noise figure arithmetic requires bandwidth, noise-figure convention and reference temperature; there is **no claim** that `rf_impedance` calculates noise figure.

- [ ] **Step 1 (minimal GREEN content):** Write the four canonical paths with correct frontmatter, `SK/SS` IDs, verbatim registry responsibilities, necessary inputs, bounded outputs, explicit stop/fallback and relative Markdown links. Keep instructions short, actionable and selective; don't duplicate entire program policy.
- [ ] **Step 2:** Change P1 workflow `audit_stage(stage,specs,frozenset())` to `audit_stage(stage,specs,frozenset({"B07"}))`, log `P1_STAGE=1/24,3/72` and keep `P1_REGISTRY=24/72` plus `P1_HOST_E2E=NOT_EXECUTED`. Update `tests/p1/test_p1_ci_contract.py` expected stage value; add `test_reject_old_zero_stage_assumption` asserting the final test-contract routine rejects reverting to `0/24`. Do **not** relax exact V0 ZIP SHA, change qrvai files, or create an installable ZIP.
- [ ] **Step 3 (GREEN):** Run `python -m unittest discover -s tests/p1 -p 'test_rf_pilot_stage.py' -v`; expected all B07 tests pass. Run **full** `python -m unittest discover -s tests/p1 -p 'test_*.py' -v`, then V0 suite; read 0 failures and the real staged 1/24,3/72 evidence.
- [ ] **Step 4 (fail-closed regression):** Delete the middle reference in a temporary copy and verify the existing audit goes red; restore the untouched correct source, rerun focused and full green.
- [ ] **Step 5 (commit):** `git add staging/p1-domain-skills/skills/rf-engineering/ .github/workflows/p1-domain-skills-ci.yml tests/p1/test_p1_ci_contract.py && git commit -m "feat(p1.1): stage canonical B07 Skill and three RF procedures"`. Task 1 is now GREEN; if a green run is missing, do not advance.

### Task 3: B07 physics fixtures and truthfulness (RF power, link budget, mismatch/noise)

**Files:** create `tests/p1/test_rf_pilot_examples.py` and `qa/p1/rf-pilot-golden-cases.json` (start with B07 cases, append B08 in Task 6); update B07 procedure Markdown only when a failing test proves a gap.

**Test contract:** fixtures hold `id`, `domain`, `procedure_id`, `prompt_el`, `prompt_en`, `input_assumptions`, `expected_quantity` or `expected_outcome`, `tolerance`, `source_kind` (`IDEAL_MODEL`/`USER_SUPPLIED_UNVERIFIED`/`INDETERMINATE`), and `must_not_claim`. Require IDs `SS-B07-1/2/3`, bilingual nonblank, explicit units/provenance; no hidden network or real measurements.

- [ ] **Step 1 (RED):** Add `test_b07_numeric_examples_and_provenance` against *documented constants/examples*, separate from code calculating expected values:
  - 100 W → **50 dBm**; 1 mW → **0 dBm**; 1 W → **0 dBW**, all with declared reference units.
  - 1 W Tx = 30 dBm, Tx gain +2 dBi, Tx loss 1 dB, **supplied** path loss 100 dB, Rx gain +2 dBi, Rx loss 1 dB → Rx **−68 dBm**, sensitivity −100 dBm → **32 dB margin**. Explicit 7-field JSON contract; no path loss guess.
  - `r_ohm=100, x_ohm=0, z0_ohm=50` → |Γ| = 1/3, VSWR = **2**, return loss ≈ **9.542425 dB**; note infinitely matched return loss has a sentinel/status and must not be silently printed as finite.
  - Noise-floor/sensitivity educational formula requires *bandwidth, kTB/reference temperature, NF and assumed SNR*; no single numerical sensitivity result without those inputs.
- [ ] **Step 2 (run RED):** `python -m unittest discover -s tests/p1 -p 'test_rf_pilot_examples.py' -v`; expect missing explicit documented examples/case records or provenance, not a syntax error.
- [ ] **Step 3 (GREEN):** Add minimal B07 procedures' worked examples, notation, source-revision disclaimers and negative fixtures to satisfy tests. Every exact calculated result must be independently checked against the existing RF pure math source or an external-free standard formula; no invented measured data, plot or reference page.
- [ ] **Step 4 (negative cases):** `test_b07_rejects_zero_watts_unknown_units_and_missing_path_loss` and `test_b07_noise_requires_bandwidth_and_noise_assumptions`: use static case metadata/guardrails to demand fail-closed outcomes, not guessed RF exposure certification. Verify tests turn red if guardrails removed from a temporary case.
- [ ] **Step 5 (GREEN + commit):** Run focused tests, full P1 suite, then V0; all pass. `git add tests/p1/test_rf_pilot_examples.py qa/p1/rf-pilot-golden-cases.json staging/p1-domain-skills/skills/rf-engineering/ && git commit -m "test(p1.1): lock B07 numeric examples and source-truth stop paths"`.

### Task 4: RED tests — B08 identity, three references and no extra Skill

**Files:** extend `tests/p1/test_rf_pilot_stage.py`. No B08 content yet.

- [ ] **Step 1 (RED):** Add `test_b08_all_four_paths_and_registry_identity`. Expect `SK-B08` with exact slug `antenna-feedline`, the three reference paths `1-antenna-geometry.md`, `2-matchingsmith-chart.md`, `3-feedline-performance.md` and successful B08-only `audit_stage` when files exist.
- [ ] **Step 2 (run RED):** `python -m unittest discover -s tests/p1 -p 'test_rf_pilot_stage.py' -v`; **expected missing B08 path**.
- [ ] **Step 3:** Add `test_b08_reject_wrong_owner_and_extra_files` with temporary-copy mutations: missing `SS-B08-2`, `Owner: SK-B07` on B08 ref, symlink, duplicate extra reference. Tests will become GREEN only after B08 source is created.
- [ ] **Step 4:** Keep P1 CI's current 1/24 count during this RED commit, so the run fails on the new B08 test, not because the CI workflow preemptively expects 2/24.
- [ ] **Step 5 (commit RED):** `git add tests/p1/test_rf_pilot_stage.py && git commit -m "test(p1.1): RED B08 canonical Skill and procedure identity"`.

### Task 5: GREEN B08 entrypoint and 3 procedures; migrate to final 2/24 and 6/72

**Files:** create four exact B08 Markdown paths; modify `.github/workflows/p1-domain-skills-ci.yml` and `tests/p1/test_p1_ci_contract.py`.

**Contract:**
- `SK-B08` `antenna-feedline`: frequency, topology, `z0`, source/load impedance, feedline details, environment; no real gain/diagram certainty, unknown measured field data, certification or radio control.
- `SS-B08-1` verbatim registry responsibility; `antenna_geometry` is **ideal halfwave dipole or quarterwave monopole geometry** with `kind`, `frequency_hz`, `velocity_factor`; account for end effects/environment as unmodeled.
- `SS-B08-2` verbatim registry responsibility; `antenna_matching` supports **strictly resistive lossless quarter-wave transformer**, input keys `source_resistance_ohm`, `load_resistance_ohm`, `frequency_hz`, `velocity_factor`; `rf_impedance` supports Γ/VSWR for a passive complex load, but **neither method promises a plotted Smith chart or full matching-network optimizer**.
- `SS-B08-3` verbatim registry responsibility; `rf_feedline_loss` supports supplied versioned cable curve via `profile:{id,revision,points:[{frequency_hz,loss_db_per_100m},...]}`, `frequency_hz`, `length_m`, `connector_loss_db` and `interpolation_method:"log_frequency"`; the curve is `USER_SUPPLIED_UNVERIFIED`, interpolation **only inside supplied frequency coverage**.

- [ ] **Step 1 (minimal GREEN content):** Create the four canonical B08 paths with YAML, exact owner and reference contract, three literal links and error/stop guidance. No synthetic manufacturer datasheets, measured NEC/Smith plots, PTT or compliance certification.
- [ ] **Step 2 (CI migration):** Change `audit_stage(stage,specs,frozenset({"B07"}))` → `audit_stage(stage,specs,frozenset({"B07","B08"}))`; print `P1_STAGE=2/24,6/72` and update the companion CI-contract test. Add negative test asserting a one-domain allowlist or a stale 0-stage count fails the final P1 CI contract. Do **not** remove V0 fingerprint assertion.
- [ ] **Step 3 (GREEN):** Focused B08 audit test, full `python -m unittest discover -s tests/p1 -p 'test_*.py' -v` and original V0 suite all pass; verified count 2/24,6/72 at exact SHA.
- [ ] **Step 4 (negative test):** Mutate B08 ref `2-matchingsmith-chart.md` owner in a disposable copy and observe audit failure; restore real content and rerun GREEN.
- [ ] **Step 5 (commit):** `git add staging/p1-domain-skills/skills/antenna-feedline/ .github/workflows/p1-domain-skills-ci.yml tests/p1/test_p1_ci_contract.py && git commit -m "feat(p1.1): stage canonical B08 Skill and three antenna procedures"`.

### Task 6: B08 numerical/provenance fixtures + scoped negative routing

**Files:** extend `qa/p1/rf-pilot-golden-cases.json` and `tests/p1/test_rf_pilot_examples.py`; amend B08 references only after RED.

- [ ] **Step 1 (RED golden fixtures):** `test_b08_geometry_matching_feedline_golden_cases`:
  - Ideal halfwave dipole at **14.2 MHz**, velocity factor **0.95**: total wire length = `(299792458 / (2 * 14_200_000)) * 0.95` metres, **not** guaranteed resonant length or real gain; reject missing frequency/velocity factor.
  - Lossless transformer from 50 Ω to 200 Ω strictly resistive: characteristic impedance √(50·200) = **100 Ω**, at documented design frequency only; refuse promise of broadband 50↔200 Ω complex matching.
  - Explicit supplied 3 dB total line/connector loss: delivered fraction `10^(-3/10) ≈ 0.501187`; do not assert this is a verified coax attenuation profile, and distinguish connector from cable losses.
  - For an ideal load 100 + j0 Ω into 50 Ω, use Γ=1/3 and VSWR=2 only as ideal impedance math; no fabricated real-time VNA trace or Smith plot.
- [ ] **Step 2 (run RED):** `python -m unittest discover -s tests/p1 -p 'test_rf_pilot_examples.py' -v`; expected missing B08 golden cases or safety constraints.
- [ ] **Step 3 (GREEN content):** Add exact assumptions, reference temperature/units/geometry limitations, safe formulas and provenance (`IDEAL_MODEL` or `USER_SUPPLIED_UNVERIFIED`), and explicit `NOT_IMPLEMENTED` for unsupported full Smith/NEC visualization.
- [ ] **Step 4 (negative fixtures):** `test_b08_rejects_fake_nec_smith_live_and_extrapolation`: a false claim "full Smith-chart solver" or "manufacturer profile verified" must fail fixture/static truth guard, and out-of-coverage cable frequency must yield `INDETERMINATE`/`OUT_OF_RANGE` rather than extrapolation. Include ≥2 Greek and ≥2 English cases for each Domain overall, plus one mixed B07+B08 scenario.
- [ ] **Step 5 (GREEN + commit):** Rerun focused and full P1/V0 suites, ensure all 6 SS procedure IDs are represented in QA cases, then commit tests, JSON, and affected B08 refs. Do not misrepresent static QA fixtures as host runtime outputs.

### Task 7: Same-SHA P1 + V0 + RF source suites; 8-file staging ZIP

**Files:** modify `.github/workflows/p1-domain-skills-ci.yml` and `tests/p1/test_p1_ci_contract.py`; extend `tests/p1/test_staging_archive.py` only if needed to test eight real staged files.

**Interfaces:**
- Stage authorization fixed to `frozenset({"B07","B08"})`; `audit_stage(stage,specs,ids)==[]`; expected source archive **8 UTF-8 Markdown entries**, exactly 2 SKILL.md and 6 references. `build_review_zip(stage,tmp1,specs,ids)` and repeat at `tmp2`; compare SHA256 and invoke `validate_review_zip` with the explicitly derived `p1-domain-skills/`-prefixed allowlist. **Do not check in, upload or install a staging ZIP.**
- Retain original V0 tests and SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`.
- Regression-only RF suite: pinned `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020`, `node-version: '22'`, `npm ci --ignore-scripts`, `npm run typecheck`, `npm test` from `mcp/qrvai-rf-worker`. No production RF tool/schema changes.

- [ ] **Step 1 (RED CI contracts):** Add `test_p1_ci_rejects_missing_eight_file_zip_or_rf_commands` and `test_p1_ci_rejects_unpinned_node_action_or_skipped_v0`; assert exact workflow command strings, stage 2/24+6/72 and 8-member source archive. Remove one in a temporary workflow text and expect validator errors, but **do not temporarily mutate real workflow**.
- [ ] **Step 2 (run RED):** `python -m unittest discover -s tests/p1 -p 'test_p1_ci_contract.py' -v`; expect failure from missing newly demanded RF/8-file blocks, not syntax.
- [ ] **Step 3 (GREEN CI):** Update P1 workflow to perform P1 test suite, staged owner audit, two deterministic source-only ZIP builds + equality/member audit, V0 suite/strict 12-file unchanged fingerprint, Node 22 RF MCP `typecheck` and `npm test` with read-only permissions/pinned actions. Do not upload the generated artifact, invoke Plugin Creator, touch secrets or Vercel.
- [ ] **Step 4 (GREEN):** Run full P1/V0/RF tests through real Actions, check logs: **exact SHA**, `P1_STAGE=2/24,6/72`, `P1_STAGE_ARCHIVE_FILES=8`, two identical staging ZIP digests, V0 12 unchanged, Node typecheck PASS and all actual Node tests PASS (report count observed). Fix only proven defects with TDD.
- [ ] **Step 5 (archive negatives):** Mutate an 8-file archive in a temporary test with a ninth plugin manifest or path-escape member; `validate_review_zip` must return errors. A symlink/extra reference in source must cause `audit_stage` failure **before** any ZIP creation. Re-run green and commit workflow/tests.
- [ ] **Step 6:** Compare implementation branch to approved planning SHA; inspect no `qrvai/**, `scripts/v0/**, `tests/v0/**, `mcp/** or production/credentials files have changed.

### Task 8: P1.1 evidence ledger, fresh final-SHA verification, review and Draft handoff

**Files:** create `qa/p1/P1-1-EVIDENCE-2026-10-17.md`; only PR metadata/comments besides that.

- [ ] **Step 1:** Inspect actual RED/GREEN receipts for Tasks 1–7 and five Review Focus negative classes, plus per-SS QA cases; document any deviations as `Ruling: ... — reason — risk if wrong` and never hide missing checks.
- [ ] **Step 2:** Write ledger: final proposed source count **2/24 and 6/72**, eight actual paths, tool names and bounded semantics, EL/EN fixture numerator/denominator, P1 and V0 suite counts, original V0 ZIP 12/SHA, stage ZIP 8/SHA from a tested commit; host `NOT_EXECUTED` and independent reviewer `NOT_EXECUTED`. Do not claim deployment or production.
- [ ] **Step 3:** Commit ledger alone; `qa/p1/**` path filter must trigger P1 + V0 + RF suites on the **new final SHA**. No future-run SHA guessed inside its own ledger.
- [ ] **Step 4:** Fetch real GitHub Actions jobs/logs; assert exact final `PR_HEAD_SHA` equals workflow `head_sha`, run `completed/success` and **zero failures**, 2/6 sources and 8/12 ZIP counts. If absent/failed mark `PENDING/BLOCKED`; never call complete based on earlier GREEN.
- [ ] **Step 5:** Whole-branch author review of approved plan ↔ diff; seek a truly independent reviewer before any merge or release. If unavailable, record `INDEPENDENT_REVIEW=NOT_EXECUTED`; an author COMMENT review is not external approval.
- [ ] **Step 6:** Post exact-final-SHA verification receipt to the new Draft implementation PR with observed run links. Leave `main` and all original PRs unchanged, Plugin Creator uncalled, Vercel production untouched and no host OAuth installation.

## P1.1 engineering acceptance gates and decision metrics

| Gate | Source-level P1.1 exit proof | Not implied |
|---|---|---|
| **P1-G0** canonical | 24/72 registry remains unchanged; 2/24 staged owners are B07+B08 exactly | No other Domain has been built |
| **P1-G1** entrypoints | Two valid YAML `SKILL.md`, correct positive/negative triggers and three exact links each | No host import or discovery |
| **P1-G2** procedural responsibilities | 6/72 valid owner-local `SS` refs with exact canonical duties | No six additional public Skills |
| **P1-G3** bilingual cases | Named EL/EN engineering Golden fixtures, negative/routing provenance data verified | No live model evaluation |
| **P1-G4** safety | No fabricated RF measurements, NEC/Smith plots, power-exposure compliance, TX authority, live rig/provider data | No regulator's certification |
| **P1-G5** V0 isolation | Five V0 Skills, passing V0 suite, 12-file original ZIP same hash | No V0/host release upgrade |
| **P1-G6** review-only archive | 8/8 exact staged files, deterministic byte hash and metadata preflight | No plugin archive/install |
| **P1-G7** actual CI and review | Same final SHA, P1+V0+RF green, owner-visible Draft receipt, reviewer gaps recorded | No merge/production permissions |

**No single "plugin readiness %"**: report distinct source staged ratio (2/24, 6/72), tests passed / executed, numerical case errors/tolerances, prohibited claims caught / defined, V0 source checksum, RF suite state and `HOST_E2E=NOT_EXECUTED`. A static provenance check is not a physical instrument validation.

## Pre-flight plan self-review and explicit execution gate

- **Source trace:** exact six procedure names, purposes and filenames verified against 2026-10-14 Skill Registry; six Draft SDK tool names verified against current `register.ts`; test/CI signatures match P1.0 implementation at commit `f121ab4...`.
- **Required interface sequencing:** Task 1 RED B07 tests → Task 2 files/one-Domain CI GREEN → Task 3 numerical tests GREEN → Task 4 RED B08 tests → Task 5 files/two-Domain CI GREEN → Task 6 antenna golden cases GREEN → Task 7 RF/ZIP CI GREEN → Task 8 final-SHA audit. Each failing test is watched on actual source before implementing its targeted change. Do not claim an intermediate deliberate RED as product failure.
- **Spec fit:** 2 SKILL entrypoints + 6 canonical procedure refs, stateless ChatGPT-first instructions, no host/source permission escalation, no V0 modification; P1.2–P1.5 deliberately excluded.
- **Plan limits:** RF calculations reuse existing P0 source, but no new RF engine or JavaScript MCP method is implemented here. Numerical case validation, static Markdown assertions and isolated packaged Skill QA are useful development evidence only; actual host LLM tool calls require separate host acceptance.
- **Critical prerequisite:** **Owner must review and approve THIS written P1.1 plan and explicitly select Native TDD or Subagent-driven execution** before the first `staging/.../SKILL.md` or tests are written. Previous P1.0 Native authorization does **not** carry forward. No merge to `main`, no release, no Plugin Creator create/update/install, no credentialed production or device control.
