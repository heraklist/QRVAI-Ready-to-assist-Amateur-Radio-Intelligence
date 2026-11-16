# QRVAI International — implementation, verification and release ledger

**Date:** 2026-11-16  
**Status:** ACTIVE IMPLEMENTATION; PRIVATE / NOT RELEASED; exact-SHA CI and protected-host acceptance separately gated  
**Source of truth:** [Draft PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53), branch `ccr-36da72c5-bv43gt` -> `main`, never promote automatically.  
**Normative architecture:** [ADR-0012: international-first, national jurisdictions, hobby Academy](../architecture/ADR-0012-international-first-regulation-and-academy.md); [ADR-0011: one Vercel MCP backend](../architecture/ADR-0011-single-vercel-mcp-project.md).

## Executive architecture

A single ChatGPT-oriented QRVAI is intended for radio amateurs internationally. Its globally reusable core covers RF engineering, antennas, propagation, radio operating, digital modes, SDR, satellites, CW and maker activities. Official legal intelligence is modular and *scoped to the actual operating jurisdiction*, with ITU international framework and IARU / CEPT regional recommendations explicitly separated from binding national permissions. Greece is one initial source adapter, not the product's default or assumed location. English is an international baseline; Greek is a first-class language.

Core Academy teaches the *hobby*, not national licence applications, exam syllabi, question banks, certification or HAREC courses. National exam help may only be developed as an independently approved optional module, not as a default Academy curriculum.

**Deployment choice remains ONE canonical Vercel project** `qrvai-rf-mcp`, route `/api/mcp`; no project or independent plugin per country, no Cloudflare fallback. The legacy `qrvai-academy-mcp` project must not be deleted before unique archival contents / prior OAuth ideas are reconciled.

## Change inventory — implementation in PR #53 (source; not production)

| Area | Implemented source | User-visible behavior / boundary |
|---|---|---|
| International regulatory context | `mcp/qrvai-rf-worker/src/live/jurisdiction.ts` and M53 `regulatory_context` registration | Explicit operating-country and optional home-country inputs; source coverage GR/US limited official adapters, DE/GB official pointers, no other country pack; ITU, IARU and CEPT tiers; visitor verification prompts; **INDETERMINATE on all actual transmit-permission requests**, even with apparently complete fields |
| Geographic caveats | M53 normalized UK shorthand to ISO `GB`; region metadata is a **mainland hint only** | No callsign/IP/language-based jurisdiction inference; overseas/portable operation requires independent region and national-authority verification |
| International Academy catalogue | `src/academy/catalog.ts` and M54 `academy_catalog` | **9 hobby modules × 3 bilingual EN/EL lesson titles = 27 outline topics**, level filters and outcomes, TRAINING_ONLY. These outlines are **not 27 completed lessons** or personalized learning service; no national exam courses |
| Existing academy practice | Existing `academy_exercise` tool | 2 bounded original static exercises; CW audio, learner accounts, graded exams NOT IMPLEMENTED |
| Tool inventory | `src/live/tools.ts`, `src/mcp/register-live.ts`, tool reference tables and real-SDK inventory contracts | **54 source-registered read-only tools = 38 existing + 14 V1 live/catalog + 2 new offline**; live providers are still subject to upstream availability/licensing |
| Transport security gate | `mcp/qrvai-rf-worker/api/mcp.ts` | **`PUBLIC_UNAUTHENTICATED=false` by default**; without Bearer config, HTTP **503** (fail closed); with configured secret bad/missing bearer **401**; legacy explicit `allowPublic=true` parameter retained solely as an injectable unit-test seam. Source hardening is not effective-deployment verification or full production auth |
| HTTPS verifier | `mcp/qrvai-rf-worker/scripts/verify-https.mjs` | Expects exactly 54 tools and a strong protected Preview bearer. Actual Vercel HTTPS run **NOT EXECUTED**. Vercel SSO remains in place |
| Versioned V1 Skill overlays | `qrvai-v1/overrides/skills/radio-academy/` and `.../regulatory-licensing/`, applied by `scripts/v1/build_plugin.py` | Eight international V1 files override packaged legacy Academy/legal text. Original 24/72 P1 staged source remains byte-for-byte unchanged for historical archive hash checks; other 22 skills retain their prior content |
| V1 Plugin | `qrvai-v1/plugin.json`, core Skill/routing/tools, eight allowlisted `qrvai-v1/overrides/` files, and `scripts/v1/build_plugin.py` | International metadata and 54 source tools. V1 ZIP builder/test does NOT prove actual Plugin Creator creation, installation or ChatGPT host acceptance |
| Design/UX | `ui/rf-workbench` preexisting browser prototype; 36 proposed UI concepts | Offline UI workbench exists for three RF calculators. New Academy/Regulatory product flows are **not** hosted interactive MCP Apps or user-tested design |
| Planning / documentation | This ledger, ADR-0012, Vercel & plugin runbooks and GitHub issues #55–#59 | Links, risks, acceptance criteria and explicit status; no silent releases |

### M54 Academy catalogue syllabus

1. Radio and RF fundamentals — frequency/wavelength/spectrum; AM/FM/SSB; receiving/noise
2. Electronics and measurement — voltage/current/impedance; multimeter/spectrum; RF/electrical safety
3. Antennas and feedlines — dipoles/verticals/polarization; SWR/matching; feedline loss
4. Propagation — line-of-sight/skywave; solar indicators; reception reports
5. Operating practice and QSOs — listening first; reports/phonetics; simulated QSO logging
6. Morse and CW — Morse timing; callsign copy; simulated exchanges
7. Digital modes — decoding/interfaces; FT8/WSPR; packet/APRS privacy
8. SDR and amateur satellites — waterfall; orbital Doppler; receive-only experiments
9. Field, maker and clubs — portable safety; receive-only antenna build; mentoring

All 27 are lesson **titles/outlines**, not authored course chapters. No real RF transmissions, CAT/PTT, accounts, licensed question banks or stored learner PII.

### M53 regulatory source-coverage classes

| Scope | Status | Important limitation |
|---|---|---|
| ITU | International context | Regulations/service framework is not an individual licence or self-executing local permission |
| IARU | Region/band-plan guidance | Nonbinding unless incorporated into actual national rules; mainland-region hints not reliable for overseas territories |
| CEPT | Reciprocal context | T/R 61-01 participation, host implementation and traveller licence equivalence not assumed |
| GR | PARTIAL_OFFICIAL_SOURCE_ADAPTER | Gazette/EETT selected source access only, no validated effective consolidated current privilege engine |
| US | PARTIAL_OFFICIAL_SOURCE_ADAPTER | Selected eCFR/Part 97 official texts only, no verified individual credential/visitor status or complete privileges |
| DE, GB | MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY | Official site pointers, not automatically updated country-specific interpretation |
| All other countries | NO_COUNTRY_PACK | Research abstention: INDETERMINATE and direct operator to primary national authority |

**Never** assert ALLOWED/NOT_ALLOWED in a live operating-permission answer from these source pointers. Human-reviewed national source version, date, licence status, visitor rights and other conditions remain necessary.

## Evidence and test boundary

- First international-branch RF CI observed **217/219 Node tests PASS**, two failures were stale hardcoded **52→54** inventory assumptions. Fixed in current branch by updating `test/live.spec.ts` and `test/protocol.spec.ts`.
- P1/V1 CI first failed from unquoted YAML colon-space and broken legacy responsibility marker. Immediate fixes showed an additional **immutable P1 archive SHA regression** (inherited Family A/C/D hashes). Final remediation restores all eight P1 staged documents exactly to the pre-international baseline and moves international versions into `qrvai-v1/overrides/`; the package builder chooses explicit allowlisted overrides without mutating archived P1 source.
- New `test/international.spec.ts` covers 8 tests: 7 country contexts, coverage distinctions incl GB/UK, visitor treatment, invalid dates/country/power, 9×3 bilingual Academy outlines, real in-memory SDK tools/list 54 with tool calls, and HTTP fail-closed default. First RF run showed **all eight passed**, despite two unrelated stale 52-count fixtures.
- Subsequent final SHA five-workflow matrix must be checked on the last commit: RF Node+TS, P1 immutable staged archives, V1 ZIP with eight overlays, V0 and offline workbench. `READY` Vercel preview is NOT protected HTTPS host acceptance.
- No independent code/security/legal review is claimed from own CI.
- `docs/runbooks/qrvai-rf-mcp-vercel.md` contains historical sections explicitly labelled superseded. Only its new active contract should direct operations; older four-tool/public-first proposals have no release authority.

## Verified control-plane observations (not release evidence)

- **GitHub:** `#53` Draft, open/unmerged; `#54` is a separate older Draft repair PR targeting the branch and should be reconciled against current source before any closure/merge; no merge to `main` made in this implementation.
- **Vercel:** team `team_ct4GFO7f5D2BxLfZ7qBsU9BR`, canonical project `prj_4c6IeOARTJOqEIaLlMx1rCDTGLKa` / `qrvai-rf-mcp`; Node 24 previously configured. Git-linked Preview deployments were returned as READY/BUILDING and `target:null` (do not assert production); Deployment Protection remains protected. No production promotion or protection bypass performed.
- **Vercel access blockers:** project-env metadata read with `decrypt=false` returned **403 forbidden**; active firewall configuration read returned **404 not_found/access denied**. Cannot conclude a Preview secret, WAF or quota rule exists. Need account-authorized proof, not secret extraction or a guess.
- **Plugin Creator:** historical private inactive personal `qrvai`, plugin ID `plugins_6acf47f502dc8191bf542fe040d484d8` version `0.1.0-preview.3`, observed unchanged. First new **distinct-ID** plugin not created in this phase because verified protected MCP endpoint, user/client auth compatibility and account/slug release gates are absent. Do not upload a dummy package or reuse placeholder.
- **Product Design:** user-facing design/plugin Work workflow needs separate cloud browser/surface. 36 UI concepts in roadmap do not imply shipped MCP Apps; offline RF workbench is not ChatGPT embedded UI.
- **Subscriptions/credits:** no pricing, entitlement enforcement, payment, subscription or API token issuance is implemented. A ChatGPT subscription, QRVAI subscription, usage credit and authentication token are different. No costs/purchases made.

## Backlog and implementation gates

| Phase | Workstream | Tracking issue | Required acceptance |
|---|---|---|---|
| P0 | Protected HTTPS 54-tool MCP, quotas, security, provider smoke | [#55](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/55) | exact SHA CI; real nonproduction initialize/list/calls + 401/403/413/503; Node24; provider permissions/rate limiting; human review |
| M2 | Country packs and official-source legal review | [#56](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/56) | source/version/effective-date/legal-force contract, country and visitor negative cases, no fabricated permissions |
| M8 | Full global hobby lessons and Academy UX | [#57](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/57) | original reviewed course content EN/EL, simulated exercises, accessibility and source provenance; no exam bank |
| V1 | Distinct private QRVAI Plugin + real @mention ChatGPT pilot | [#58](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/58) | actual secured endpoint and matched ZIP, new plugin ID, private install, same-chat E2E, separate approval |
| Future | Optional identity/subscription/usage credits | [#59](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/59) | verified identities and quotas; privacy/compliance, provider and billing terms; explicit later owner commercial decision |

**Maintained previous issue dependencies:** [#3 clean-slate identity](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3), [#6 skills-only → MCP upgrade](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6), [#7 post-main hardening](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/7).

**Program phases:** M0 global architecture; M1 RF engineering and workbench; M2 source-governed jurisdictions; M3 manuals/equipment; M4 propagation/DX; M5 digital/logbooks/network; M6 EmComm simulation only; M7 advanced SDR/satellites and read-only station bridge (never autonomous TX/PTT/CAT); M8 worldwide Academy, maker and clubs. Only implemented subset may be called working, and paid/public features remain deferred.

## STOP/RELEASE rules

- No direct TX or emergency dispatch. No regulator advice framed as licence, legal clearance or permission.
- No copying exam questions or assuming international reciprocity. No user identity implied by callsign.
- No public anonymous traffic, paid entitlement, production promotion, SSO bypass, main merge, deleting legacy Vercel project, or plugin publication from this development-authorized work.
- Private protected-preview acceptance must precede any new plugin Creator host connection. Record exact tested SHA, request/response metadata without secrets, privacy/provider rights and human security review.
- All unresolved claims are marked **NOT VERIFIED** / **BLOCKED**, not PASS. Each change after a passing SHA reopens relevant certification gates.

## Evidence conventions

Use `EXECUTED_PASS` only for actual execution receipts at exact source and surface. Local/in-memory SDK CI is **source-only**, Vercel READY is a **build-state**, the actual ChatGPT host requires **separate integration verification**, and worldwide regulatory authority requires **per-country reviewed primary-source acceptance**. This ledger is an execution register and roadmap, not a certification of a finished international release.
