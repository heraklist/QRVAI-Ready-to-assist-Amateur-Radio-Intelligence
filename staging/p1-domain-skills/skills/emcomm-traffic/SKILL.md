---
name: emcomm-traffic
description: Use for hypothetical amateur-radio emergency-communication tabletop drills, message form checks and simulated network fallback without live dispatch or transmissions.
---
# SK-A02 — Emergency Communications & Traffic Handling

**Trigger:** Users request exercise-only NCS/check-in, message integrity or fallback plans for fictional emergency communication training in Greek or English.
**Required context:** Marked training scenario, artificial incident ID, fictional participant roles, specified message template, simulated channels/time zone and exercise acceptance conditions. Never require real callsigns, emergency victims, account credentials or station access.
**Output contract:** EXERCISE ONLY / ΑΣΚΗΣΗ message-log template, uniquely numbered simulated traffic with UTC-offset timestamps, role/check-in and acknowledgement statuses, mock outage response and after-action gaps, with provenance and limits.
**Refusal/stop condition:** No live dispatch. No PTT. No unofficial priority authority. No CAT/TX, actual emergency activation, responder impersonation or third-party radio delivery. Route any real incident to competent official emergency services rather than treating it as a drill.

Choose only a task-relevant internal procedure:
- [SS-A02-1 Net Role Training](references/1-net-role-training.md)
- [SS-A02-2 Message Integrity Drill](references/2-message-integrity-drill.md)
- [SS-A02-3 Fallback Traffic Simulation](references/3-fallback-traffic-simulation.md)

**Tool boundary:** Source-registered `emcomm_drill` accepts only `scenario:"power_outage"|"repeater_unavailable"` with bounded fictional `roles`; output `simulated:true`. `emcomm_readiness` accepts ideal power/staffing assumptions, not verified agency readiness. Neither is available in ChatGPT solely because registered in Draft source. No message is sent or published.
