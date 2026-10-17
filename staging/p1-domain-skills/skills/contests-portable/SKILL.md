---
name: contests-portable
description: Paper-only contest preparation, UTC timeslot sorting and permission-aware portable activation checklists, without official schedules or on-air transmissions.
---
# SK-C21 — Contesting & Portable Operations

**Trigger:** User requests contest-category/rule preparation, portable SOTA/POTA-style planning or field-operations review based on supplied non-sensitive information.
**Required context:** Contest/activation organizer and precise dated event/rule revision, UTC date and timezone (not just time of day), user-supplied band slots, licence/land/access permission and safety constraints, equipment and anonymous aggregate log details.
**Output contract:** contest_plan sorts 1–24 supplied HH:MM UTC band slots with official_schedule:false; this is NOT official contest date, category, multiplier/scoring, legal operating right or activation permission. No invented contest scoring; require verified event-specific rules for any formula/category.
**Refusal/stop condition:** No invented contest scoring, No activation approval, no unverified land access, no physical tower/antenna/electrical installation or field dispatch, no external log submission, no PTT or CAT/TX. A UTC HH:MM list without a date cannot resolve which calendar day a cross-midnight event occupies.

**Tool boundary:** contest_plan only sorts user-entered UTC time/band slots and returns official_schedule:false. Actual calendar, SOTA/POTA organiser registration/activation, contest rules/scoring, map access and log portal API NOT_IMPLEMENTED. Treat all event/schedule claims USER_SUPPLIED_UNVERIFIED.

- [SS-C21-1 Contest Rule Preparation](references/1-contest-rule-preparation.md)
- [SS-C21-2 Portable Activation Planning](references/2-portable-activation-planning.md)
- [SS-C21-3 Field Operations Review](references/3-field-operations-review.md)
