# QRVAI ChatGPT-first & @-Invocation Contract v0.5

**Date:** 2026-10-14. **State:** DESIGN CANDIDATE, not installed or host-tested.

## 1. Product priority and interpretation

QRVAI must function **first as an invoked ChatGPT plugin** via the installed plugin selector/composer, with natural-language answers and continued follow-ups. Interactive workbenches, web dashboards and local radio hardware are optional additional surfaces, not prerequisites.

**Confirmed by owner (2026-10-14):** the required primary interaction is invoking **@QRVAI inside an already-open ChatGPT conversation**, like invoking other installed plugins. This is a product requirement, not proof that the target host/client supports the exact @ mention after installation. Furthermore, exact availability and composer spelling can only be proven with the real installed plugin and host version, not inferred from a display name or this spec.

## 2. Two distinct @ mechanisms

- **Plugin/MCP server @ invocation:** mention a plugin as a provider in a supported ChatGPT composer, then route requests to its Skills/Tools.
- **Composer At-Mentions extension:** the plugin supplies a typeahead search for internal resources (manuals, stations, saved files, etc.). This is separate from invoking the entire QRVAI plugin. It uses the OpenAI extension metadata `_meta["openai/extensions"]["mentions/search"]` and tools visible to the App. As documented in the OpenAI MCP Extensions support matrix reviewed 2026-10-14, **this individual-item mention feature is Desktop-only** in the documented matrix; Work web/iOS/Android are not listed as supported. The table's Web column refers to **Work browser, not classic ChatGPT**. Host account/client testing remains mandatory.

**Do not claim:** that typing @QRVAI will universally invoke it across all web/mobile/desktop clients before a real host test; that resource mentions are synonymous with plugin mentions; that a named Skill is directly callable with a slash command.

## 3. Four graded conversational entrypaths

1. Primary installed plugin selection or @QRVAI mention: works when host offers the plugin and its actual Skills/Tools are present.
2. Conversation continuation: preserve user intent/context but never inherit new permissions merely due to follow-up.
3. Optional in-thread MCP App visualization: show real calculator/interactive results after normal tool response. The same result must remain intelligible as plain prose/table if UI unsupported.
4. Optional future sidebar/thread entrypoint or resource at-mentions: host-advertised and separately tested enhancement.

## 4. First-use contract

**Input:** user question in Greek/English; optional experience level, station QTH, callsign, licence class, rig inventory. Never require personal data for a generic engineering calculation.

**Route:** recognize intended outcome → determine whether permission/legality/hardware/emergency risk applies → choose simplest adequate Skill/Tool → validate source and units → present answer with assumptions/citations → show interactive instrument if host supports it.

**Output:** concise direct answer, engineering units where appropriate, official regulation source when applicable, uncertainties and next action. If capability is not implemented, say so; never pretend 24 planned Skills or 38 planned MCP tools already exist.

**Onboarding:** a minimal implemented core Skill may help users pick topics and configure language/region. Station inventory/logbook storage needs opt-in. A supported onboarding Skill in a real plugin manifest is optional; no mandatory external account or separate portal for public-domain RF guidance.

## 5. Example expected flows

| User intent in ChatGPT | Correct route | Acceptance boundary |
|---|---|---|
| @QRVAI convert 100 W to dBm | Direct RF tool M07 once implemented | Independently tested 50 dBm, not imagined API |
| @QRVAI find an IC-7300 manual | SK-B06 then M17 or official link | Model/version and rights verified |
| @QRVAI may I transmit FT8 here? | SK-A04 / OR-REG | Country, licence, frequency, emission and current official law, or INDETERMINATE |
| @QRVAI my CAT connection fails | SK-B06/C16 diagnostic workflow | No device writes or automatic PTT |
| @QRVAI design matching and show Smith Chart | B08 + deterministic tool M10/M12 + MCP App when supported | Actual computed points, not fabricated solver |
| @QRVAI create an emergency-net exercise | A01/A02 OR-EMCOMM training workflow | Clearly simulated; never live agency dispatch |

## 6. Plugin packaging and host compatibility

- Proposed package ID is subject to availability; root Agent Plugins 1.0 manifest, correct Skill YAML frontmatter and actual verified MCP endpoint are required. Do NOT invent mcp.json URL.
- Host discoverable Skills live in skills/{name}/SKILL.md. Internal QRVAI "Sub-skills" are references/procedure sections and **not independently host-routable**.
- MCP Apps use ui:// resources and meta UI linkage with sandbox/CSP and text fallback, after host feature negotiation.
- Tool auth is enforced on server per identity/scope; private files, logbooks, club records and read-only rig telemetry are opt-in. Cloud conversations are not an offline station control system.
- Run real installed-client acceptance on desktop, Work web, iOS and Android as available. Mark each tested/unverified/unsupported per version instead of extrapolating.

## 7. Measurable acceptance gates

- [ ] Installed plugin is selectable/mentionable and a real request routes correctly on each explicitly supported tested host.
- [ ] No separate portal required for basic authorized information and calculations.
- [ ] A follow-up reuses context while avoiding new permission grants.
- [ ] A non-UI host receives equivalent numerical/result content with source and assumptions.
- [ ] Missing legal context returns INDETERMINATE; emergency traffic cannot be dispatched; read-only bridge cannot transmit.
- [ ] A plugin/resource mention UX test distinguishes the two systems, including unsupported mobile resource mentions.
- [ ] No unimplemented capability is advertised as live; actual tools list matches release documentation.

**Sources reviewed:** https://github.com/openai/mcp-extensions/blob/main/docs/spec.md ; https://github.com/modelcontextprotocol/ext-apps/blob/main/docs/overview.md ; installed Plugin Creator package/Skills docs (2026-10-14).

**Evidence:** product spec only. No plugin created, no host test executed.


## 8. 2026-10-14 platform implementation clarification

The official OpenAI MCP Extensions changelog [v0.2.0, 2026-10-10](https://github.com/openai/mcp-extensions/blob/main/CHANGELOG.md) adds `openai/mentions: { searchTool: string }` server capability and describes the older per-tool `_meta["openai/extensions"]["mentions/search"]` as deprecated fallback. This concerns mentions of **resources within** a plugin, **not** the simple plugin-level `@QRVAI` invocation. Consequently **no mentions/search MCP tool belongs in V0**, and new resource-mention features later must use the current versioned capability and host tests.

The [V0 clean-install design v0.7](../superpowers/specs/2026-10-14-qrvai-v0-clean-install-design.md) supersedes speculative packaging/install details in older high-level roadmaps. The full owner-specified clean-install gate, new backend identity and zero old-source reuse take precedence.
