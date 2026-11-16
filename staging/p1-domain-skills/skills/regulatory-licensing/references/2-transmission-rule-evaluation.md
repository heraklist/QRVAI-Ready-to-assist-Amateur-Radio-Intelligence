# SS-A04-2 — Transmission Rule Evaluation

**Owner:** SK-A04
**Responsibility:** apply versioned legal rules to a fully specified operating scenario
**Required input:** Frequency_hz, jurisdiction, calendar date/time, emission/mode, station power, licence context and instrument with exact amendments/effective date/sections and exceptions.
**Procedure:** Use a test-only synthetic rule table SYNTH-A04-001 for educational boundary examples, with explicit exact min/max comparison, timestamp and class constraints. For actual Greek law, consult authoritative operative instrument+amendments and qualified reviewer; absent those, output INDETERMINATE. The draft tool regulatory_check_operation only compares USER_SUPPLIED_UNVERIFIED regions and hardcodes authorized:false; do not re-label matches as permission.
**Output:** For SYNTHETIC TRAINING FIXTURE ONLY, illustrate ALLOWED/NOT_ALLOWED/INDETERMINATE according to mock inputs, always clearly labelled non-operational. Real requests: legal-status uncertainty, cite needed primary source/version and do not transmit until verified.
**Error/stop:** No legal operating authorization from IARU guidance, registry, user snippets or a matching band; fail closed on date, class, emission, power or source ambiguity.

**Authority:** This is an offline development-source Skill, not legal advice or an official licence verification. All real operating cases remain INDETERMINATE without reviewed legal authority. No CAT/PTT/TX.
