---
name: clubs-mentoring
description: Bilingual source-only amateur-radio club onboarding, simulated workshop agendas and consent-preserving club asset/mentor governance templates, with no member storage or calendar actions.
---
# SK-D24 — Clubs, Community & Mentoring

**Trigger:** User asks about authorized club training, workshops, mentor progression or hypothetical shared resources without real member data.
**Required context:** Organizer authority, anonymized role or count (no names/callsigns), teaching topic, 1..100 participants and 30..240 minutes for supported simulated tool, meeting goals, permission to use supplied club source, privacy/retention rules, accessibility considerations without collecting sensitive data.
**Output contract:** club_workshop_plan supports only antenna_basics or digital_modes with simulated:true fixed agenda for 1..100 attendees and 30..240 minutes; it does not check instructor/venue availability or issue invites. Provide aggregate training-only onboarding and a proposed nonpersistent pseudonymous asset/mentor schema; P1_D_CLUB_DATA=NOT_PERSISTED. No account, live calendar or club directory.
**Refusal/stop condition:** No personal roster, No calendar write, no private member contacts/callsigns, minors' identities, precise home/asset locations, attendance history, private mentor schedule, tenant data access, cloud publishing or unsolicited email. Any real user account or member database NOT_IMPLEMENTED and must require future explicit consent, scopes, deletion/retention and independent privacy audit.

**Tool boundary:** club_workshop_plan uses fictional participant counts and produces simulated:true paper agenda, not event booking/actual room or trainer availability. D24 source files are governance templates only; NOT_PERSISTED, not actual records. No authenticated club service, calendar API or third-party message capability.

- [SS-D24-1 Member Onboarding](references/1-member-onboarding.md)
- [SS-D24-2 Training/Event Planning](references/2-trainingevent-planning.md)
- [SS-D24-3 Asset/Mentor Governance](references/3-assetmentor-governance.md)
