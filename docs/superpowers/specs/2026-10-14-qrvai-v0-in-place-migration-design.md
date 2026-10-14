# QRVAI V0 — Existing Plugin In-place Migration Design v0.6

**Date:** 2026-10-14  
**Stage:** WRITTEN DESIGN — owner review required prior to writing an implementation plan or updating the installed release.  
**Primary product intent:** Upgrade the EXISTING private @QRVAI installation into the new ChatGPT-first QRVAI while preserving its plugin identity, existing 21 specialist Skills, Academy intellectual property and any host connections. **Do not create a second QRVAI plugin.**  
**Owner-selected initial milestone:** V0 (conversational invocation/routing and honest advertised features). V1 deterministic RF/MCP tools follows separately.

## 1. Read-only inspection facts (2026-10-14)

Identified the editable **existing personal USER / PRIVATE plugin**, backend id `plugins_6acf47f502dc8191bf542fe040d484d8`, package name `qrvai`, display name `QRVAI`, version `0.1.0-preview.2`, current release `pluginrel_6acf81d87b588191b6e41839785357aa`. A prior release exists: `pluginrel_6acf47f779548191b3be08312c5ca452`, version `0.1.0-preview.1`.

Read-only source inventory through Plugin Creator returned **104 files**, including:
- Root Agent Plugins 1.0 `plugin.json` with valid `name: "qrvai"` and display name `QRVAI`;
- Compatibility overlay `.codex-plugin/plugin.json`;
- **21 discoverable `skills/*/SKILL.md` files**, numbered W01–W21 in their content;
- **25 owner-provided Academy JSON files** (4 category indexes and 21 section files);
- **53 owner-provided JPEG illustrations**, directory `assets/w21/owner_images/`;
- `scripts/w21_bank.py`, `assets/w21/SOURCE_RECEIPT.json`, `README-SMOKE-TEST.md`;
- **No `mcp.json` or `.mcp.json` found**: the installation has no packaged MCP server configuration and no basis for advertising live QRVAI backend tools.

The installed preview's own README identifies the 21 SKILL files as **re-authored smoke-test summaries, not canonical GitHub source blobs**. Its owner Academy corpus receipt states personal/private usage permission has been asserted by the owner, but host asset access and equivalence with official exams have **not** been independently established. Its reference to old upstream "PR #42" and source commit is provenance text only and is **not evidence** that this current repository's Draft PR #1 is that upstream source. Do not overwrite the installed preview from unrelated GitHub historical assumptions.

The current root plugin-level defaultPrompt asks the user to run a smoke test, not to use QRVAI normally. The current longDescription declares a host smoke-test build. The legacy overlay repeats some values and must remain synchronized after any intentional change. Preserve current metadata values that are unrelated to the migration, including author/repository and any icons or future App bindings, exact skill sources and assets.

### Current behavior explicitly NOT verified

Typing `@QRVAI` in a real ChatGPT client, individual specialist Skill selection, direct Academy file reads, executable Python, RF calculators, emergency dispatch, live external data, built-in cross-Skill orchestration, MCP Apps, hosted MCP tools, and transceiver control. The preview's instruction text cannot make these features operational by assertion.

## 2. Choice of migration method

| Approach | Pros | Risk | Verdict |
|---|---|---|---|
| A. Create a new "QRVAI 2" plugin | Fresh structure | Breaks existing @ identity/installation, duplicates assets and distribution | **Rejected** |
| B. Replace all 21 legacy Skills with a 24-domain package immediately | Superficially matches target architecture | High data/content loss risk; incomplete and untested Skills; host-token conflicts | **Rejected** |
| C. **Upgrade in place; preserve old Skills and assets; improve central dispatch and presentation incrementally** | Stable identity, easy rollback, lower regression risk, honest capabilities | Temporary old Wxx/new Domain ID compatibility map needed | **Selected** |

No explicit installation or update approval is inferred merely from the fact that an editable backend ID exists. Separate approval of this written design and resulting implementation plan precedes `update_plugin`.

## 3. Invariants / no-regression constraints

1. Preserve exact existing plugin backend ID, `qrvai` package name and `QRVAI` display name, USER/PRIVATE audience, original account scope and 21 Skill folders.
2. Preserve all **25 JSON + 53 JPEG + one Python script + source receipt** byte-for-byte by overlay semantics unless owner later expressly orders changes. No examination data shall be moved to a publicly accessible Git repository merely for convenience.
3. Preserve old user-facing specialist identity where used; add mapping to canonical family/domain ID but never replace W01–W21 references with an unverified mapping.
4. No new `mcp.json` until a real verified endpoint is deployed (V1, not V0). No `@QRVAI/antenna` fictional routing syntax.
5. Do not claim the Academy content is official, accessible from the host, or automatically executable unless a real asset bridge/reader has passed tests. Protect answer keys from being exposed in practice prompts.
6. No new privacy scope, plugin audience change, external connectivity, firmware alteration, PTT, remote radio state change, or dispatch.
7. Keep previous release ID and complete source inventory as rollback references; updating is not deleting files.
8. Keep user confidence high by distinguishing directly usable **knowledge Skills** from **planned computation/interactive tools**.

## 4. Compatibility map — 21 legacy Skills to new domains

These are PRIMARY intent mappings, not a one-to-one replacement or claim of complete new domain coverage. Multiple W-skills may map to one domain; some future domains have no fully staffed legacy Skill yet.

| Existing Skill ID | Existing package | Main target Domain ID(s) | Migration note |
|---|---|---|---|
| W01 | ham-radio-core | all / router | **Retain and enhance** central ChatGPT-first general routing; no invented runtime agent |
| W02 | ham-research-intelligence | all / source governance | Evidence and freshness triage, never fake searches |
| W03 | ham-jurisdiction-intelligence | A04 | Jurisdiction/license context; must not grant permissions from absent primary law |
| W04 | greek-ham-regulations | A03, A04 | Greece official rule context; advisory band plans separate |
| W05 | world-ham-regulations | A04 | Country-specific law and visitor permits |
| W06 | electronics-fundamentals | B09, D22 | Electrical basics as educational foundation |
| W07 | electronics-rf-design | B07, B09 | Conceptual design; numerical engines not installed |
| W08 | antennas-feedlines | B08 | Antenna design and impedance; no fabricated simulation |
| W09 | measurements-station-safety | B10, A05 | RF exposure/instruments/EMC; safety-first |
| W10 | equipment-sdr | B06, B13 | Rig/model support and SDR basics |
| W11 | operating-practice | C14, C21 | CQ/QSO/contests etiquette |
| W12 | digital-modes | C16, C17, C18 | Digital modes; repeaters/networks have limited coverage |
| W13 | amateur-satellites | C19 | Satellite/EME domain requires actual orbital engine for timing |
| W14 | propagation-dx | C15, C14 | Propagation and DX evidence, no live data without provider |
| W15 | portable-operations | C21, B12 | Portable operations, power planning |
| W16 | logbook-qsl-awards | C20 | ADIF/QSL knowledge; no log connector or upload |
| W17 | raag-community | D24 | Clubs/community, non-official regulatory authority |
| W18 | oea-emergency-communications | A01, A02 | Greek emergency training only |
| W19 | world-emergency-communications | A01, A02 | International EmComm training only |
| W20 | license-sy-sv | D22, A04 | Greek licence education, not legal authority |
| W21 | radio-amateur-academy | D22 | Owner Academy bank and diagrams, preserve all content/rights |

**Known initial gaps:** no dedicated, implemented Skills for B11 station control, B12 energy engineering, C18 repeaters/digital voice, D23 maker workflows, or A03 structured frequency explorer. These are v0.5 backlog, not permission to publish placeholder packages. Domain coverage is partial until a verified slice ships.

## 5. V0 migration change set for the current plugin

### V0a — Preserve identity, release and rollback (preparatory read-only)

- Re-read the exact current plugin release and all text files; compare `plugin.json` and compatibility overlay.
- Record the 104-file inventory and identify any binary/large files required for rollback. A historical plugin release is available; prefer the plugin's release archive only if a complete offline backup is necessary.
- Inspect release history and frozen current `current_release_id`. If it changes while preparing, stop and rebase design.
- Obtain owner approval for the precise changes and write a test-first execution plan.

### V0b — Small in-place Skill migration (proposed, not yet executed)

Target a **minimal and testable overlay**, not 24 brand-new empty Skill folders:

1. Update only `skills/ham-radio-core/SKILL.md` to be a single high-quality QRVAI routing entrypoint for the existing 20 other Skills: exact trigger, task classification, source triage, user locale, direct handling vs bounded specialist guidance, conservative regulatory and safety behavior; no claim of executable backend orchestration.
2. Add `skills/ham-radio-core/references/v0-domain-compatibility.md` with the W01–W21 ↔ A/B/C/D domain map, unimplemented capability labels, honest feature inventory, future V1 plan and source-citation expectations. The reference is a **sub-skill reference**, not another discoverable Skill.
3. Modify root `plugin.json` only for the user-requested V0 focus: update version (proposed `0.1.0-preview.3`, subject to release rules), descriptions to "ChatGPT-first QRVAI preview" accurately describing the retained 21 Skills, and swap the existing **smoke-test defaultPrompt** for a short, useful conversational starter. Preserve author, package name, repository, category and any user-selected visual settings. This is an **intentional owner-requested change** to the smoke-test presentation; retain all other prompts unchanged unless specifically approved.
4. Synchronize only the same version/description/interface fields in existing `.codex-plugin/plugin.json`, preserving legacy Skills path and capabilities/options. Do NOT remove the legacy overlay or add unverified App declarations.
5. Preserve `README-SMOKE-TEST.md`, `assets/w21/` and `scripts/w21_bank.py` unchanged during first migration. A new V0 release note may be added under `references` without touching sensitive exams.

**If the plugin is App-backed or externally synced unexpectedly**, the source-of-truth updater overrides this overlay plan; stop before changing App connections and use corresponding release mechanism.

### Proposed prompt / descriptions

**Plugin displayName:** keep `QRVAI`.  
**shortDescription:** `Amateur Radio AI Assistant` (26 characters; meets <=30 portable constraint).  
**longDescription:** `QRVAI assists radio amateurs in Greek and English with equipment, operating, HF/VHF/UHF, antennas, regulations, learning and preparedness. This early preview uses 21 knowledge Skills; live MCP calculators, station control and interactive instruments are planned but not yet enabled.`  
**defaultPrompt** (proposed, subject to owner's approval): `@QRVAI Βοήθησέ με ως ραδιοερασιτέχνη: εντόπισε την κατάλληλη εξειδίκευση και δώσε τεκμηριωμένη απάντηση στα Ελληνικά. Ξεχώρισε τις τρέχουσες λειτουργίες από τις υπό ανάπτυξη.`

Do not add a list of 24 operational Skills to plugin metadata. Preserve the configured scope and every other manifest field.

## 6. Test-first acceptance contract

**Source/package checks:** previous release blob/ID captured; correct manifest schema and unchanged `name`/displayName; version bump, description limits, both manifests synchronized; exactly 21 existing Skill entrypoints retained; referenced new `references/` file exists; 25 owner JSON, 53 JPEG and W21 script retained; no orphan paths, no unexpected deletion; no `mcp.json` added.

**Behavior tests (target actual host):** `@QRVAI` selects the current plugin; a general educational question triggers W01 appropriately; a targeted antenna question triggers W08 (or is routed to it); Greek legal question does not claim permission without current official rules; Academy quiz request does not pretend to have executed W21 script or accessed owner assets; W13 satellite pass does not fabricate AOS/LOS; attempts to key radio do not cause PTT. Follow-up within same conversation retains topic without unexpected permissions.

**Evidence grades:** PACKAGE_VALIDATED → RELEASE_SAVED → SOURCE_READBACK_VERIFIED → HOST_SELECTED → HOST_SKILL_ROUTED → HOST_FEATURE_VERIFIED. Saving a new preview version is **not proof** that `@QRVAI` route works; testing must use a real user-accessible installed host.

**Rollback:** previous `0.1.0-preview.2` release `pluginrel_6acf81d87b588191b6e41839785357aa` remains a historical baseline. Rollback ability must be assessed from the specific plugin/release workflow; historical download alone is not an automatic rollback action. Preserve all unchanged assets and permission audience; no automatic release reversal on failure without owner-approved safe process.

## 7. Scope exclusions and follow-on work

- Not V0: adding 38 MCP tools, 18 calculation engines, 36 MCP Apps, live data, SQLite/Postgres, OAuth, local transceiver bridge, 24 placeholder Skills, automated RF engineering or official exam engine.
- V1: deterministic RF calculators and real MCP server/interactive workbenches after separate design and test-first plan.
- V2+: source-backed law, licensed manual retrieval, privacy-scoped logs, actual propagation feeds and EmComm training.

## 8. Review and execution boundary

**Current stage:** Investigated and documented. No existing plugin release has been mutated, no ZIP uploaded, no tests executed. User's "let's start V0" authorizes the V0 **initiative and design work**. Under the adopted Superpowers architectural review gate, approval of this exact written design must come first; thereafter create a detailed implementation plan and ask the owner to select execution method before updating the live personal plugin.

**Owner review request:** approve (or revise) a conservative in-place `0.1.0-preview.3` migration that retains all 21 Skills, private Academy assets and plugin identity while improving W01 routing and plugin description. The title/display name and visibility will remain unchanged.

**Related evidence:** [v0.5 Architecture Index](../../README.md), [ChatGPT-first Experience](../../architecture/chatgpt-first-experience-v0.5.md), [Skill/Domain Registry](../../architecture/skill-and-subskill-registry-v0.5.md), [Account update guidance](https://agent-plugins.org/).
