# QRVAI V0 — Clean-Slate ChatGPT-first Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one entirely newly authored private QRVAI Skills-only plugin with five functional instruction Skills, traceable 4-Family/24-Domain/72-Sub-capability reference coverage, honest safety/feature boundaries, and verified in-conversation `@QRVAI` invocation on a supported ChatGPT client.

**Architecture:** Portable Agent Plugins 1.0 manifest plus five selectively invoked Skills. Each Family Skill owns newly written, bounded domain/sub-capability references; the central Skill routes conversational intent and discloses that V1 engines/MCP tools are absent. Source and build validators enforce a strict file allowlist, identity separation and no legacy material; actual plugin creation and host acceptance are later, separately gated actions.

**Tech Stack:** Agent Plugins 1.0 (`plugin.json`); Markdown Skills with YAML frontmatter; Python 3.11+; `PyYAML==6.0.2` for safe frontmatter parsing; Python stdlib `unittest`, `json`, `pathlib`, `zipfile`, `hashlib`. GitHub feature branch + Draft PR; Plugin Creator private account workflow **only after identity, owner authorization, plan and archive acceptance gates**. No MCP server or UI runtime for V0.

**Spec:** [`docs/superpowers/specs/2026-10-14-qrvai-v0-clean-install-design.md`](../specs/2026-10-14-qrvai-v0-clean-install-design.md) (v0.7, owner-approved 2026-10-14). Related contracts: [Capability Register](../../architecture/capability-register-v0.5.md), [ChatGPT-first UX](../../architecture/chatgpt-first-experience-v0.5.md), [Skill Register](../../architecture/skill-and-subskill-registry-v0.5.md), [Orchestrators](../../architecture/orchestrator-control-contracts-v0.5.md).

## Global Constraints

- **One clean product identity:** `name: qrvai`, display name `QRVAI`, initial clean version `0.1.0` **only if the old owner-created source record has been removed and the name is available**. Must obtain a new backend plugin ID, distinct from `plugins_6acf47f502dc8191bf542fe040d484d8`.
- **Exactly five host-discoverable Skills:** `qrvai-core`, `qrvai-safety-regulations`, `qrvai-engineering-support`, `qrvai-operating-intelligence`, `qrvai-education-community`. Other 24 specialist Skill IDs / 72 procedure IDs remain future architecture; V0 packages no extra top-level Skills.
- **Four Families/24 Domains/72 Sub-capabilities** represented accurately in V0 newly authored reference text: Family A=A01–A05 (5/15), B=B06–B13 (8/24), C=C14–C21 (8/24), D=D22–D24 (3/9).
- **No legacy source imports, no migration:** exclude every former W01–W21 Skill, 25 private Academy JSON, 53 JPEG, old scripts, archive, receipt, manifest, plugin IDs or settings; no old binary/private data.
- **No `mcp.json`, `.mcp.json`, `.app.json`, `.codex-plugin`, devices, provider credentials or deployed RF services in V0.** Do not fabricate calculators, legal permission, weather/DX/space-weather live reads, simulated antenna measurements, manual page citations, or existing Apps/agents.
- **Safety:** no PTT/transmission, CAT device writes, firmware changes, real emergency dispatch, unauthorized private profile/QSO access, or unjustified `ALLOWED` transmission decision. Greece-first legal research must distinguish binding current national law from IARU guidance and return indeterminate when evidence is insufficient.
- **Primary UX:** invoking the installed new plugin via `@QRVAI` inside an already-existing ChatGPT conversation when a target host supports it; selection UI is fallback. User must not visit a separate portal for V0 guidance. Plain text only is sufficient; no fictitious UI.
- **Packaging:** manifest schema `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`; legal portable Skill paths `skills/<slug>/SKILL.md`; frontmatter `name` and `description`; `shortDescription` at most 30 chars. No unused/unknown portable root top-level fields.
- **Separate approvals:** the owner approved this written V0 design for planning. Implementation is not authorized until the owner **reviews this implementation plan and selects execution method**. New account plugin creation / sharing / merge / publication require their relevant explicit later action approval.
- **Identity block currently active:** last Plugin Creator read still showed old owner-created `qrvai` record and release (old active installation had reported `not_installed`). Uninstall is not saved-record deletion. Do not create another `qrvai` or update the old ID while D1/D2 are blocked.
- **Tests:** one red/green cycle and one reviewable commit per task; no test or host claim without observed execution. CI or local environment must pin exact Python/dependency versions and report observed output before marking PASS.

## Review Focus

Five likely user-facing pitfalls beyond ordinary happy-path tests; each appears below in an owning task's explicit test/QA case:

1. **Missing law or licence**: “Επιτρέπεται FT8 στους 7 MHz;” without country/licence/date must NOT be answered as transmit permission (Tasks 3, 7, 10).
2. **Deceptive manual and injected instructions**: claims of undocumented IC-7300 menus or instructions embedded in untrusted sources must NOT override skill safety policy (Tasks 4, 7, 10).
3. **Unsupported numerical/live backend**: requested Smith Chart, live SFI, NEC pattern or local CAT measurement must be honestly marked unavailable in Skills-only V0 (Tasks 4, 5, 7, 10).
4. **Legacy user/private Academy content**: prior question-bank content must not appear in new references or ZIP, even if requested by old Wxx identifiers (Tasks 6, 7, 8, 10).
5. **Broken or ambiguous `@QRVAI` routing**: old name/record collision or unsupported host must BLOCK creation or record UNSUPPORTED; a mention is not evidence of a successful tool/Skill invocation (Tasks 9, 10).

---

## Exact file map (new source, never copied from legacy plugin)

~~~text
qrvai/
  plugin.json
  skills/
    qrvai-core/
      SKILL.md
      references/product-scope.md
      references/routing.md
    qrvai-safety-regulations/
      SKILL.md
      references/family-a.md
    qrvai-engineering-support/
      SKILL.md
      references/family-b.md
    qrvai-operating-intelligence/
      SKILL.md
      references/family-c.md
    qrvai-education-community/
      SKILL.md
      references/family-d.md
requirements-v0-dev.txt
scripts/__init__.py
scripts/v0/__init__.py
scripts/v0/validate.py
scripts/v0/catalog.py
scripts/v0/audit_content.py
scripts/v0/build_archive.py
scripts/v0/release_gates.py
scripts/v0/verify_host_report.py
tests/v0/test_manifest.py
tests/v0/test_core_skill.py
tests/v0/test_family_a.py
tests/v0/test_family_b.py
tests/v0/test_family_c.py
tests/v0/test_family_d.py
tests/v0/test_catalog_guards.py
tests/v0/test_archive.py
tests/v0/test_identity_gate.py
tests/v0/test_host_contract.py
qa/v0/prompt-cases.json
qa/v0/host-report.example.json
qa/v0/README.md
~~~

These are **planned paths**, not current files. The plugin ZIP includes **only** `qrvai/plugin.json` and the eleven files under `qrvai/skills/` (12 allowed entries); no validators/tests/QA files in plugin archive. The GitHub repo remains the only canonical source for V0.

## Task 1: Portable manifest and deterministic validation baseline

**Files:** create `qrvai/plugin.json`, `requirements-v0-dev.txt`, `scripts/__init__.py`, `scripts/v0/__init__.py`, `scripts/v0/validate.py`; test `tests/v0/test_manifest.py`.

**Interfaces:** `validate_manifest(path: Path) -> list[str]`; `validate_manifest_data(data: dict) -> list[str]`. Subsequent tasks import `validate_skill` from the same module.

- [ ] **Step 1: Write failing test** `TestManifest.test_valid_identity_and_absent_integrations`: `validate_manifest(Path("qrvai/plugin.json")) == []`; parse JSON; assert `name=="qrvai"`, `version=="0.1.0"`, `extensions.com.openai.interface.displayName=="QRVAI"`, `len(shortDescription)<=30`, `"mcpServers" not in manifest`. Add `test_rejects_invalid_display_name_and_overlong_subtitle` using `validate_manifest_data()`.
- [ ] **Step 2: Run red test:** `python -m unittest discover -s tests/v0 -p 'test_manifest.py' -v`. Expected FAIL because validator/package does not yet exist; record output, not a presumed observation.
- [ ] **Step 3: Implement:** `plugin.json` with manifest `$schema` above, name `qrvai`, semver `0.1.0`, author `{"name":"heraklist"}` (verify owner-preferred credit prior to upload), repository URL `https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence`, truthful description, `extensions.com.openai.interface` with `displayName:"QRVAI"`, `shortDescription:"Amateur radio guidance"`, `longDescription` honest Skills-only coverage, `developerName:"QRVAI"`, `category:"Education"`, `capabilities:[]` (no Apps), one Greek default prompt. Pin `PyYAML==6.0.2`. Implement pure, explicit manifest validation rejecting missing schema, invalid slug/SemVer, extra integration keys and empty presentation metadata.
- [ ] **Step 4: Run green test:** same test command, expected PASS. If dependency installed during execution, record `python --version` and `python -m pip show PyYAML`.
- [ ] **Step 5: Commit:** `git add qrvai/plugin.json requirements-v0-dev.txt scripts/__init__.py scripts/v0/__init__.py scripts/v0/validate.py tests/v0/test_manifest.py && git commit -m "feat(v0): add clean portable manifest and validation"`.

## Task 2: Central QRVAI Skill and explicit intent router

**Files:** create `qrvai/skills/qrvai-core/SKILL.md`, `references/product-scope.md`, `references/routing.md`; modify `scripts/v0/validate.py`; test `tests/v0/test_core_skill.py`.

**Interfaces:** `validate_skill(skill_path: Path) -> list[str]` parses frontmatter with `yaml.safe_load`, confirms slug/name and non-empty description. `route_family(intent: str) -> str` is **not** a V0 Python service — routing is declarative in the Skill; the test checks its published contract and later host tests validate observed routing.

- [ ] **Step 1: Write failing tests:** `TestCoreSkill.test_frontmatter_and_routing_contract` checks `validate_skill(core_path)==[]`, that the core instructions explicitly distinguish Families A/B/C/D, prefer only shipped/approved capabilities, use Greek or English matching user locale and never call a non-existent MCP tool. `test_router_does_not_inherit_privileges` asserts references forbid unsolicited profiles, PTT/dispatch and permission escalation.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_core_skill.py' -v`; expected missing file/validator.
- [ ] **Step 3: Implement:** `qrvai-core` frontmatter `name: qrvai-core`; description triggers broad QRVAI radio support and family routing; instructions to ask only essential context; link `references/product-scope.md` (version, roadmap vs shipped, four families, 24 domain identifiers, V1 absent) and `references/routing.md` (prioritize legal/safety flags, choose Family Skill by outcome, no false claims of agent/tool access; no slash-command assumption).
- [ ] **Step 4: Run green:** same test command; expected PASS after parsing real YAML and checking named guardrail phrases.
- [ ] **Step 5: Commit:** `git add qrvai/skills/qrvai-core scripts/v0/validate.py tests/v0/test_core_skill.py && git commit -m "feat(v0): add QRVAI core conversational routing skill"`.

## Task 3: Family A Skill — safety, regulations and simulated emergency training

**Files:** create `qrvai/skills/qrvai-safety-regulations/SKILL.md` and `references/family-a.md`; create `scripts/v0/catalog.py`; test `tests/v0/test_family_a.py`.

**Interfaces:** `extract_domain_ids(text: str) -> set[str]` and `extract_subcapability_ids(text: str) -> set[str]`; `validate_family_reference(path: Path, family: str, domain_ids: set[str], subcapability_ids: set[str]) -> list[str]`. Later Families reuse this parser.

- [ ] **Step 1: Write failing tests:** verify 5 exact IDs `A01..A05` and each `SC-Axx-1/2/3` (15 exact IDs) extracted only from the Family A reference; Skill frontmatter name, safe triggers and localized output present. Add `test_unknown_legal_context_is_indeterminate` checking normative Skill instruction “insufficient authoritative effective law/licence ⇒ INDETERMINATE”, not inferred ALLOWED; `test_emcomm_training_only` checks no dispatch/PTT/official impersonation.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_family_a.py' -v`; expect FAIL.
- [ ] **Step 3: Implement:** transcribe/re-author authorized `A01–A05` and `SC-A01-1..SC-A05-3` intents from current GitHub `capability-register-v0.5.md` into self-contained, **new** `family-a.md`. For each ID include mission, input, scope, output and explicit limits. Main Skill must reject invented legal permission, IARU-as-law and live emergency action; cite only checked primary sources or disclose missing lookup.
- [ ] **Step 4: Run green:** same command; expect PASS; verify exact 5/15 set equality, not just counts.
- [ ] **Step 5: Commit:** `git add qrvai/skills/qrvai-safety-regulations scripts/v0/catalog.py tests/v0/test_family_a.py && git commit -m "feat(v0): add safety and regulations family skill"`.

## Task 4: Family B Skill — engineering and equipment guidance

**Files:** create `qrvai/skills/qrvai-engineering-support/SKILL.md` and `references/family-b.md`; test `tests/v0/test_family_b.py`.

**Interfaces:** reuse `validate_skill` and `validate_family_reference`; include B06–B13 and 24 exact `SC-Bnn-i` IDs.

- [ ] **Step 1: Write failing tests:** `test_all_eight_domains_and_24_subcapabilities` assert exact B06..B13 and matching `SC` sets. `test_no_phantom_engine_manual_or_rig_action` assert prose describes equations as explanatory, with no claim of invoked calculator/NEC solver or VNA measurement; model/firmware-specific manual page requires validated source; CAT/PTT not executed.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_family_b.py' -v`; expect missing Skill.
- [ ] **Step 3: Implement:** new Family B reference from the approved v0.5 domain register, including RF Engineering B07, antennas/feedlines B08, manuals B06, power/SDR/diagnostics and safe educational content. Explicitly differentiate “I can explain the formula” from “a QRVAI numerical Engine was run”; no invented component datasheets or empirical plots.
- [ ] **Step 4: Run green:** same command, expected PASS.
- [ ] **Step 5: Commit:** `git add qrvai/skills/qrvai-engineering-support tests/v0/test_family_b.py && git commit -m "feat(v0): add engineering guidance family skill"`.

## Task 5: Family C Skill — operating, networks and radio intelligence

**Files:** create `qrvai/skills/qrvai-operating-intelligence/SKILL.md` and `references/family-c.md`; test `tests/v0/test_family_c.py`.

**Interfaces:** `validate_skill` and `validate_family_reference`; C14–C21, 24 exact `SC-Cnn-i` IDs.

- [ ] **Step 1: Write failing tests:** `test_eight_domains_and_24_subcapabilities`, `test_no_fake_live_propagation_or_satellite_pass`. Confirm propagation forecasts/space weather, DX, repeater availability, orbit elements and QSO confirmations are NEVER called real/current without verified, timestamped sources. Confirm no silent logbook upload or third-party operation.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_family_c.py' -v`; expect FAIL.
- [ ] **Step 3: Implement:** self-contained C14–C21/SC references and trigger guidance; distinguish timeless operating education from data that would require future V1+ source adapters and authorizations.
- [ ] **Step 4: Run green:** same command, expected PASS.
- [ ] **Step 5: Commit:** `git add qrvai/skills/qrvai-operating-intelligence tests/v0/test_family_c.py && git commit -m "feat(v0): add radio operating family skill"`.

## Task 6: Family D Skill — academy, makers and clubs

**Files:** create `qrvai/skills/qrvai-education-community/SKILL.md` and `references/family-d.md`; test `tests/v0/test_family_d.py`.

**Interfaces:** `validate_skill` and `validate_family_reference`; D22–D24 and 9 `SC-Dnn-i` IDs.

- [ ] **Step 1: Write failing tests:** `test_three_domains_and_nine_subcapabilities`; `test_no_legacy_exam_assets_or_official_certification` checks no W01–W21 Skill imports, no private Academy files or implied access to old questions/images and no false “official exam certification” claim. Club member data requires explicit consent.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_family_d.py' -v`; expect FAIL.
- [ ] **Step 3: Implement:** independent text for Academy/CW D22, Maker D23 and Clubs D24; 9 precise procedural outcomes and training boundaries sourced **only** from current approved public QRVAI design specs. Avoid copying old question banks.
- [ ] **Step 4: Run green:** same command, expected PASS.
- [ ] **Step 5: Commit:** `git add qrvai/skills/qrvai-education-community tests/v0/test_family_d.py && git commit -m "feat(v0): add academy and community family skill"`.

## Task 7: Cross-family traceability, security copy audit and QA corpus

**Files:** create `scripts/v0/audit_content.py`, `qa/v0/prompt-cases.json`, `qa/v0/README.md`; test `tests/v0/test_catalog_guards.py`.

**Interfaces:** `audit_catalog(root: Path) -> dict[str, object]` returns `domain_ids`, `subcapability_ids`, `skill_names` and `violations`; `validate_qa_cases(path: Path) -> list[str]` enforces unique test IDs, required `prompt_el` / `expected_family` / `must_not_claim` and risk class.

- [ ] **Step 1: Write failing tests:** `test_exact_24_72_5_4` asserts exactly 4 Family IDs, exact 24 canonical domain IDs and exact 72 subcapabilities, five true Skill folders, no orphan IDs; `test_absent_legacy_identifiers_and_unverified_services` searches packaged text for prohibited legacy file/artifact paths, fabricated live providers, real CAT/PTT actions or named deployed MCP endpoint. `test_bilingual_intent_and_high_risk_cases` requires at least 12 named Greek/English QA scenarios across all 4 families and each of the five Review Focus pitfalls.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_catalog_guards.py' -v`; expect missing audit module.
- [ ] **Step 3: Implement:** reusable catalog audit reads only `qrvai/`, compares exact sets and family boundaries, returns machine-readable violations. Prompt corpus defines at least: Greek/English introduction; RF `100 W → 50 dBm` as a **general knowledge assertion, not claimed QRVAI tool result**; unsupported Smith/NEC solver; equipment manual without verified revision; unknown Greek FT8 legality; exercise-only EmComm; fake live NOAA propagation request; APRS networking; ADIF upload request; CW lesson; club private assets; adversarial instruction from untrusted manual; old Academy question-bank request. QA expectations distinguish grounded explanation from truly tested host behavior.
- [ ] **Step 4: Run green + regression:** `python -m unittest discover -s tests/v0 -p 'test_*.py' -v`; expected all current task tests PASS; review collected violations.
- [ ] **Step 5: Commit:** `git add scripts/v0/audit_content.py qa/v0 tests/v0/test_catalog_guards.py && git commit -m "test(v0): enforce 24-domain coverage and safe routing corpus"`.

## Task 8: Strict, reproducible fresh package builder and negative provenance tests

**Files:** create `scripts/v0/build_archive.py` and `tests/v0/test_archive.py`.

**Interfaces:** `expected_package_paths() -> tuple[str, ...]` (exact 12 plugin-root-relative paths); `build_archive(plugin_root: Path, output_zip: Path) -> Path`; `validate_archive(archive: Path) -> list[str]`. Package contents are under one `qrvai/` enclosing directory and may include no additional root entries.

- [ ] **Step 1: Write failing tests:** `test_clean_archive_has_exact_12_files` builds ZIP to a temporary directory; compares sorted names to exact allowlist. `test_rejects_legacy_w21_and_secret_files` adds `assets/w21/owner_images/test.jpeg` or `.env` to a temporary staged source and requires **BLOCKED**/validation error, not silent inclusion. `test_reproducible_archive_hash` builds same source twice, asserts SHA256 equality. `test_archive_no_mcp_or_external_endpoint` inspects ZIP contents, not just repo source.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_archive.py' -v`; expected FAIL.
- [ ] **Step 3: Implement:** builder includes exactly manifest, five `SKILL.md` and six approved references; no original legacy files or assets; rejects any unexpected source entry (except directory metadata) and symlink, uses deterministic member order/mtime/UTF-8 and ZIP deflate. `validate_archive` validates contents, manifest/frontmatter and rejects path traversal and excessive size. Save ZIP **outside** plugin source, e.g. local `dist/qrvai-v0-0.1.0.zip`; archive is a **build artifact, not publication**.
- [ ] **Step 4: Run green:** same test command then full `python -m unittest discover -s tests/v0 -p 'test_*.py' -v`; record SHA256 and canonical manifest result.
- [ ] **Step 5: Commit:** `git add scripts/v0/build_archive.py tests/v0/test_archive.py && git commit -m "build(v0): add reproducible allowlisted clean plugin archive"`. Do not add generated ZIP to public GitHub or include any private data.

## Task 9: Fresh identity/deletion preflight and release block (no API mutation)

**Files:** create `scripts/v0/release_gates.py`; test `tests/v0/test_identity_gate.py`.

**Interfaces:** `evaluate_identity_gate(old_record_present: bool, old_plugin_id: str, candidate_package_name: str, candidate_backend_id: str | None) -> str` returns `BLOCKED`, `READY_FOR_CREATION` or `CREATED_DISTINCT`. `verify_release_preflight(manifest_path: Path, evidence: dict) -> list[str]` also rejects missing evidence freshness, source attribution or unapproved ownership. Not a plugin deletion tool.

- [ ] **Step 1: Write failing tests:** `test_old_saved_record_blocks_creation` with `old_record_present=True` returns BLOCKED even when active installation is `not_installed`; `test_new_id_must_differ_from_legacy` rejects equal IDs; `test_absence_plus_authorized_slug_is_necessary_but_not_installation_proof` distinguishes source-record deletion/availability from host activation.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_identity_gate.py' -v`; expect FAIL.
- [ ] **Step 3: Implement:** pure gate evaluator, no plugin mutation endpoint or credential storage. **Current observed evidence is BLOCKED:** personal/private account record `plugins_6acf47f502dc8191bf542fe040d484d8` remains visible; old active-install state `not_installed` does not erase it. At execution time, re-check via authorized Plugin Creator metadata/list tools; owner uses supported account UI/support route to remove saved record. Do not silently change package name, reuse old ID or call `update_plugin`.
- [ ] **Step 4: Run green:** same tests then full suite; expected evaluator PASS **while actual release gate remains BLOCKED** until genuine deletion evidence arrives.
- [ ] **Step 5: Commit:** `git add scripts/v0/release_gates.py tests/v0/test_identity_gate.py && git commit -m "test(v0): enforce distinct fresh plugin identity and source deletion gate"`.

## Task 10: Real ChatGPT host acceptance contract and handoff gate

**Files:** create `scripts/v0/verify_host_report.py`, `tests/v0/test_host_contract.py`, `qa/v0/host-report.example.json`; extend `qa/v0/README.md`.

**Interfaces:** `validate_host_report(report: dict, expected_case_ids: set[str]) -> list[str]`. A complete report must include `plugin_id`, `release_id`, `package_sha256`, `host_client`, `host_version`, `observed_at`, `operator`, per-case `observed_invocation` and `observed_response`, and `actual_outcome: PASS|FAIL|BLOCKED|UNSUPPORTED`; field `execution_status` must be `EXECUTED` for a PASS. No test script can fabricate host evidence.

- [ ] **Step 1: Write failing tests:** `test_not_executed_cannot_pass` rejects sample `NOT_EXECUTED` report marked PASS; `test_missing_host_or_plugin_ids_rejected`; `test_real_mention_must_be_observed` rejects text saying only "plugin created" without observed selection/call; `test_safety_case_failure_blocks_release` enforces all high-risk prompt cases pass.
- [ ] **Step 2: Run red:** `python -m unittest discover -s tests/v0 -p 'test_host_contract.py' -v`; expect FAIL.
- [ ] **Step 3: Implement:** host acceptance validator and **non-executed illustrative report only**. Test protocol after creation: (a) user installs/connects **new** plugin, (b) inspect actual five Skills and no MCP tools, (c) new `@QRVAI` resolves in an existing chat or label host as unsupported, (d) one follow-up preserves context, (e) run all QA prompts and record observed outputs/safety, (f) ensure no legacy duplicate appears, (g) confirm new backend ID/receipt and privacy restrictions. **No creation/installation is executed by writing this test harness.**
- [ ] **Step 4: Run green:** same unit tests and full suite. Distinguish **schema/tests PASS** from **plugin creation NOT_EXECUTED** and **real @-host E2E NOT_EXECUTED**. When all prerequisite gates pass and the owner explicitly authorizes account creation, use `Plugin_Creator.create_plugin` once with the validated ZIP; require `status=created` and new ID, otherwise BLOCKED/FAIL and no retry with old package.
- [ ] **Step 5: Commit:** `git add scripts/v0/verify_host_report.py tests/v0/test_host_contract.py qa/v0/host-report.example.json qa/v0/README.md && git commit -m "test(v0): add truthful host invocation acceptance and release evidence gates"`.

## Integration, review and promotion (not additional implementation by default)

1. Run `python -m unittest discover -s tests/v0 -p 'test_*.py' -v` and archive integrity tests **on exact source commit**; review all error/negative tests, ZIP allowlist, old-file fingerprints, reference counts. Record actual outputs and source SHA.
2. Carry out the approved independent review method (fresh bounded worker only if a true separate verifier was invoked, else state review as non-independent); review code, safety, provenance, package rights and out-of-scope claims.
3. Keep changes on a new V0 implementation branch and a **Draft PR** targeting an explicitly reviewed base; do not replace the architecture Draft PR's changes, force-push it, merge without review, or treat one approval as PR promotion.
4. Resolve **D1/D2**: old creator-source record actually deleted and `qrvai` identity available; if not, **stop creation** and show status. The source and tested archive can be prepared independently.
5. **D4** (requires explicit user authorization at that point): private `create_plugin` with exact validated archive; a new plugin ID and `created` outcome. No public submission/share action without separate approval.
6. **D5**: install/enable through authorized host UI, run the genuine `@QRVAI` chat-invocation matrix and capture evidence without overstating platform support.
7. Submit final release/host receipts to owner review. Merge, broaden visibility or start V1 only upon separate approval.

## Execution status and owner handoff

**As of writing:** specification approved **for plan preparation**. No V0 package files, code, tests, plugin creation, deletion or host execution have been performed by this plan. Actual old creator-source deletion **BLOCKED** until verified through a supported account action.

**Plan approval requested:** review these ten test-first tasks, file paths, five Skills, exact family coverage and D1/D2 identity gate. Choose execution method:
- **Subagent-driven:** independent task implementer/reviewer cycles when an actual worker interface is available; higher isolation/review expense.
- **Native:** one implementation flow with explicit task-by-task red/green commits and a separate whole-branch review gate; simpler for this Skills-only first slice.

**Recommendation:** **Native**, because ten small source-and-validation tasks have tightly shared contract names and no production MCP runtime. Preserve an explicit independent final review where supported, and never claim such review ran without evidence.
