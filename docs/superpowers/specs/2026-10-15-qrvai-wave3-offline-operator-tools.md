# QRVAI Wave 3 — bounded offline operator helpers

Date: 2026-10-15. Base: Wave 2 PR #19 at SHA 256eaf097693762ae2c7e3618aa94781fdac09fe. Delivery: Draft PR dependent on #19, #18 and #17; Vercel preview only; no production merge.

## Scope decision
Introduce five of the remaining candidate methods without source fetching, privacy-sensitive log access or radio/device mutation:
- M28 **digital_setup_guide**: abstract generic CAT/audio software connection checklist based on user-supplied operating system, rig and software identifiers. Return *no model-specific commands* and no fictional citations.
- M30 **repeater_channel_preview**: only generate memory settings from *explicit operator-supplied frequency/offset/tone*; cannot lookup repeater IDs, assert legal permissions or program a radio. Distinguish it from conceptual repeater_id/provider directory contract.
- M33 **contest_plan**: generic session/duty schedule using explicit operator-supplied start UTC, event title and minutes; do not assert contest rules without verified source.
- M37 **maker_project_review**: bounded, offline informational BOM review and safe bench checklist with a mandatory unverified warnings field; never certify a build.
- M38 **club_workshop_plan**: offline generic amateur-radio training agenda from explicit topic and participants, no participant identities or club private inventory.

## Acceptance and guardrails
1. Strict versioned Zod inputSchema/outputSchema, data-independent bounded arrays and strings, readOnlyHint, no network/file/device access. Clear simulated/user-supplied status.
2. Explicitly reject misleading operation claims (provider data, legal approval, rig-specific guidance, dispatch); optionally return UNVERIFIED where information is insufficient.
3. Before source implementation, execute failing unit tests via GitHub Actions (RED); fix failing compilation-only tests until meaningful missing-function RED evidence is recorded.
4. Verify in-memory SDK `listTools` names/order, count 20, typed tool calls and invalid paths. Verify Node, Python, TypeScript and Preview READY for exact head SHA.
5. Fix the broken implementation-register table replacement in Wave 2: reconstruct rows from candidate documentation, updating only actually implemented names and marking remaining entries NOT IMPLEMENTED. Wave 3 canonical count 20/38, remaining 18, **source only**.
6. Deployment remains a Vercel protected preview with bearer gate. No ChatGPT connector or production deployment authorized.
