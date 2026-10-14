# QRVAI V0 — Clean-Slate ChatGPT Plugin Design v0.7

**Date:** 2026-10-14  
**State:** WRITTEN SPEC — architectural owner-review gate; no package created or new plugin installed.  
**Owner directive:** **FULLY abandon in-place migration**. Uninstall/delete the legacy QRVAI, then build a **completely new, independent QRVAI ChatGPT plugin** using only the approved QRVAI v0.5 capability/orchestration architecture. **Do not inherit the old plugin's backend ID, releases, package artifacts, Skills, exam question bank, images, scripts, manifests, private data or configurations.**

## 1. Product purpose and user-visible requirement

QRVAI is a ChatGPT-first, Greek/English Amateur Radio Intelligence assistant. The primary user action is selecting/mentioning the **new @QRVAI** inside an existing ChatGPT conversation. A separate app/dashboard is not required for V0. The plugin must explain and guide the four capability families and 24 domains through bounded, honest, versioned instruction Skills. V0 must never claim that the 38 proposed MCP methods, RF calculators, live regulation engine, 36 MCP Apps or local rig control exist before implementation and host verification.

The old plugin's educational question pool is not part of the new platform by default. Future Academy content will be independently sourced, licensed, versioned and revalidated; no data import from the old private package.

### Old-plugin status, verified

Source audit identified an existing private account-created `qrvai` record, backend ID `plugins_6acf47f502dc8191bf542fe040d484d8`, version `0.1.0-preview.2`, containing 104 files. An explicit uninstall request using this exact ID was attempted, and the platform reported **`not_installed`**, not "deleted". Thus there is **no active ChatGPT installation to uninstall** according to that action, but the private created-plugin account record and its files still exist. Available Plugin Creator tooling supports create/update/list/archive and **does not offer permanent delete of the created record** in this session.

**Do not claim complete deletion or reuse of the old plugin.** Full removal of its saved owner-owned record is a separate blocked account action. To inspect potential user-side deletion: ChatGPT → Plugins → Personal → Created by you → old QRVAI; look for an offered delete action. If unavailable, obtain supported help through ChatGPT support. Never assume 'disable', 'disconnect' or 'uninstall' deletes the saved owner-created source. The old account record may retain its exact private data until actually deleted through a supported process.

## 2. Three alternative approaches

| Approach | Pros | Cons | Verdict |
|---|---|---|---|
| A. Update the old private plugin, deleting all old paths | May retain @ identity | Same backend ID/release lineage, risks orphaned data/references; violates owner explicit clean-install decision | **Rejected** |
| B. Create another plugin with 21 legacy Skills as seed and adapt it | Fastest superficial coverage | Violates no legacy files and weak clean architecture; hidden data migration | **Rejected** |
| C. **Full clean replacement**: independently authored source, new backend ID, new manifest/Skills, no imports from old account record | Clean provenance and contracts; independent release validation | Old saved record must be removed separately; host mention/name conflict and fresh test burden | **Selected** |

The new plugin should be generated exclusively from owner-approved QRVAI architecture docs in **the GitHub repository**; never from old account plugin asset archive. New plugin creation must return status **created**, a **different plugin_id**, and an independently verified file inventory.

## 3. Minimal new V0 architecture

V0 is an actual usable knowledge-routing foundation, **not** a false "entire 24-domain system deployed" claim.

- **Exactly one QRVAI Plugin identity**: proposed package slug `qrvai` if confirmed available after old record removal; display name **QRVAI**. If the old private record reserves/collides with the slug, **stop rather than silently updating the old plugin** or publishing a second ambiguous QRVAI listing. Resolve the conflict with owner before installation.
- **5 first-class Skills proposed**:
  1. `qrvai-core` — primary entrypoint: intent/context recognition, domain selection, source/permissions/safety triage, Greek/English behavior and short capabilities/status summary.
  2. `qrvai-safety-regulations` — Family A expertise: civil preparedness, EmComm TRAINING, frequency/regulatory *research* and RF safety triage. No unsourced transmit clearance.
  3. `qrvai-engineering-support` — Family B expertise: antenna/RF principles, equipment/version/manual workflows and deterministic calculation *intent*. Without an implemented tool, do not pretend calculations were executed by an engine or display simulated measurements.
  4. `qrvai-operating-intelligence` — Family C expertise: operating, digital networks/modes, propagation, satellites, logbook workflows; explain missing live tools/providers.
  5. `qrvai-education-community` — Family D expertise: learning and CW practice planning, maker projects, clubs. No private legacy Academy data or official exam certification.
- **References**, included only as newly authored, reviewed text under these five Skills: canonical 4 Family contracts, 24 Domain contracts, 72 sub-capability descriptions, 4 orchestrator candidates' conceptual boundaries, 36 interactive view *roadmap* descriptions. References are not separately discoverable Skills or executable model agents.
- **No direct MCP tools in V0**: no `mcp.json` unless a real verified server exists. V0 may use standard host capabilities when actually present, but must not claim a QRVAI tool executed without evidence.
- **No MCP Apps or Extensions in V0** unless separately implemented, host-tested and explicitly included in a later approved slice.
- **No user profiles/logbook persistence, background jobs, external provider auth, radio hardware control, PTT or emergency dispatch**.
- The four Orchestrators OR-ENG/OR-DIAG/OR-REG/OR-EMCOMM remain **conceptual bounded workflows** in V0; they are NOT four runtime model agents. The core Skill selects/coordinates guidance and must not invent tool access.

### Domain routing reference

| Family Skill | Target Domain IDs | V0 behavior |
|---|---|---|
| Safety & Regulations | A01–A05 | general source-led guidance, safety, compliance uncertainty and simulated training |
| Engineering & Support | B06–B13 | explanatory technical workflows and equations with explicit unknowns; no tool-side calculations/simulations |
| Operating Intelligence | C14–C21 | modes, operations, forecasts vs observations, logging concepts; no fabricated live data |
| Education & Community | D22–D24 | tutorials, example CW/training plans, maker safety, clubs; no old exam questions |

V1 can introduce the RF numeric engine and actual MCP tools; separate domain Skills should emerge only where independently useful, tested and genuinely maintained. The v0.5 24-Skill/72-procedure register remains a PRODUCT TARGET and does not require 24 empty packaged Skill stubs in V0.

## 4. New source of truth / release architecture

**Source:** this existing public GitHub repository, in an independently reviewable development branch and pull request. This repo currently contains documentation but **no functioning plugin sources**. Approved V0 implementation plan will define the exact repository paths and package production steps; do not treat architectural documents as installable components.

**Package target (design only, not yet created):**

```text
qrvai/
  plugin.json                       # Agent Plugins 1.0 root manifest
  skills/
    qrvai-core/SKILL.md
    qrvai-core/references/
    qrvai-safety-regulations/SKILL.md
    qrvai-safety-regulations/references/
    qrvai-engineering-support/SKILL.md
    qrvai-engineering-support/references/
    qrvai-operating-intelligence/SKILL.md
    qrvai-operating-intelligence/references/
    qrvai-education-community/SKILL.md
    qrvai-education-community/references/
```

No legacy overlay, no W01–W21 files, no `assets/w21`, no `scripts/w21_bank.py`, no unverified MCP URL, no binary exam bank. The future package is made only from the independently authored clean source and exact pinned dependencies (if any).

**Version:** proposed initial clean semver `0.1.0` rather than a continuation of the old `0.1.0-preview.2` release chain. Author metadata and copyright should be owner-confirmed in V0 plan; do not automatically copy old private manifest. Include real repo URL and honest descriptions only. The `shortDescription` must be <=30 characters in the portable format. Package icon and color selection can use new/reviewed assets, never old ones by default.

## 5. Clean account lifecycle, deletion and namespace gates

**D0 — Installation state**: already verified uninstall action reports `not_installed` for the old backend ID. This does **not** prove its saved plugin record has been removed.

**D1 — Source record removal**: existing private plugin record must be actually deleted, not merely disabled, if user requires *full deletion*. This session has **no supported creator-delete endpoint**. User-visible UI may supply deletion; otherwise account/support action required. Verify old private plugin ID is no longer found via eligible metadata/list tool before declaring this gate PASS.

**D2 — Package-name availability**: confirm no existing owned `qrvai` record conflicts with creation semantics. If D1 cannot be satisfied, do NOT silently reuse/update the old plugin; resolving the name/record collision is a blocked decision.

**D3 — New source and package**: implement/review the five new Skills from QRVAI v0.5, validate exact manifest/Skill schemas and traceability to 24 domains. Prove old signatures/source hashes/assets are absent from the package. Do not rely on wording alone; inspect build archive.

**D4 — Fresh creation**: `create_plugin` with owner-approved exact archive once prerequisites pass. Require `status=created` and returned `plugin_id != legacy plugin_id`; unexpected `status=updated` or ID reuse is FAIL and must be reported, not represented as clean.

**D5 — Host activation**: install/enable the new plugin through provided user action and verify actual @QRVAI selection, Skill routing and ordinary follow-up in a supported ChatGPT host. Installation and account plugin creation are separate actions. Do not assert real host behavior without a tested receipt.

**D6 — Regression/privacy**: verify 5 new Skills, 4 Families, 24 Domain labels, no legacy Academy data, no runtime MCP tools, no surprise secondary QRVAI selection and no sensitive tool scopes.

## 6. Test and acceptance matrix

### Identity and clean provenance
- [ ] Existing account private plugin source is **deleted** by an authorized account mechanism (or documented BLOCKED with no claim of complete uninstall); old no-install status observed.
- [ ] A new plugin record has a distinct backend ID and a fresh release chain.
- [ ] Installed active UI has only the intended new QRVAI entry, no duplicate ambiguity.
- [ ] New plugin archive contains none of the old 21 Skills, 25 Academy JSON, 53 JPEG or W21 Python script; SHA/inventory audit.
- [ ] GitHub source is distinct from old account preview; no canonical source attribution carried from older unverified W-skill summaries.

### Functional V0 behavior
- [ ] Greek and English users can select QRVAI and ask questions in any existing ChatGPT conversation on a tested host.
- [ ] A general radio question uses `qrvai-core`; safety/legal routes to Family A; engineering to B; digital/operating to C; teaching to D.
- [ ] Context-specific questions request only missing essential details, not full operator data as a condition of simple help.
- [ ] Unknown current frequency law results in no permission assertion; EmComm operates in training mode.
- [ ] Numerical output is not claimed to originate from an engine unless such engine was actually called; no fictional manual page or satellite pass, no false live weather/propagation data.
- [ ] A request for legacy owner Academy examination questions explains the dataset is not included and does not reproduce unreviewed exam bank.
- [ ] Requests to transmit, use PTT, control CAT hardware or contact official emergency agencies cannot trigger actions.

### Packaging, rights and operations
- [ ] Valid Agent Plugins 1.0 manifest, version and 5 correct YAML-frontmatter Skills.
- [ ] No unreviewed source licenses, pasted private data, static secrets or unverified app IDs/URLs.
- [ ] ChatGPT host actually shows the fresh plugin and correctly routes it; accessibility and no-UI degradation verified.
- [ ] Tested version, plugin ID, tools list and observed test results included in release receipt.

## 7. Timing and approval boundary

The owner has **selected clean replacement rather than migration**. This is a new *architectural* V0 design, not an approval to skip written-spec review and test-first implementation-plan acceptance.

**Work permitted now:** cancel/supersede old V0 in-place design and tracking issue, record true old plugin installation state, author this replacement spec and update the GitHub plan.  
**Not permitted/possible yet:** claim total deletion of owner-created old source, create a new plugin with ambiguous `qrvai` slug, publish new private release, merge, or activate tools before plan/review and D1/D2 gates.

**Owner review request:** verify the new 5-Skill ChatGPT-first V0 strategy and clean deletion/no-legacy rule. Once the owner approves this actual document, create a detailed test-first implementation plan and select its execution mode. V1 remains the separately approved deterministic RF workbench.

**References:** [v0.5 architectural index](../../README.md) · [Capability Register](../../architecture/capability-register-v0.5.md) · [Orchestrator Contracts](../../architecture/orchestrator-control-contracts-v0.5.md) · [ChatGPT-first](../../architecture/chatgpt-first-experience-v0.5.md).
