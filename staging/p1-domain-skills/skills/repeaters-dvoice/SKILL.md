---
name: repeaters-dvoice
description: Source-labelled hypothetical repeater offset arithmetic, digital voice education and user-supplied directory filtering; no operational or legal authorization.
---
# SK-C18 — Repeaters & Digital Voice

**Trigger:** User asks about analog repeater RX/TX offset, CTCSS/DCS, DMR/D-STAR/C4FM profiles or verifying a source-labelled repeater list.
**Required context:** Region and current competent frequency rules, exact repeater/network source/date, RX centre frequency Hz, signed offset Hz (explicit sign), tone and D-voice model/firmware evidence, user consent.
**Output contract:** The repeater_channel_preview returns user-derived TX=RX+offset and verified:false; spectrum_find_repeaters filters user-provided ≤24 records and returns live_status_known:false. No source-supported tone or permission from arithmetic alone; actual transmit eligibility INDETERMINATE without local current rules.
**Refusal/stop condition:** No invented tones, official repeater directories, online activity/coverage, operator permissions, programmed codeplug certainty, CAT/PTT/TX, live hotspot/network connection or automatic memory write. No propagation coverage guarantee or exposure of private repeater IDs/locations.

**Tool boundary:** repeater_channel_preview is ideal arithmetic from supplied Hz fields (verified:false); spectrum_find_repeaters searches only user entries (live_status_known:false), not a network directory. No DMR/D-STAR/C4FM API, talkgroup provisioning or license lookup (NOT_IMPLEMENTED).

- [SS-C18-1 Analog Repeater Settings](references/1-analog-repeater-settings.md)
- [SS-C18-2 Digital Voice Profiles](references/2-digital-voice-profiles.md)
- [SS-C18-3 Directory Discovery](references/3-directory-discovery.md)
