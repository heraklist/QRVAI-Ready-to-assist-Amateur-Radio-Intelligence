---
name: frequency-intelligence
description: Use for clearly sourced Greece-first frequency allocation research, IARU advisory overlays and dated user-supplied repeater directories; never grant transmission permission.
---
# SK-A03 — Frequency & Spectrum Intelligence

**Trigger:** User requests to understand the difference between a country's frequency allocation, a non-binding operating band plan and supplied repeater or beacon information.
**Required context:** Country/jurisdiction, requested frequency in Hz, date/time of interest, mode and licence category where needed, exact source identity/issuer/instrument/effective date and known exceptions. Request missing source context; never assume a Greek licence from a callsign.
**Output contract:** Separate binding-instrument candidates and IARU recommendations, with URL, issuing authority, checked_at, effective interval and REVIEWED/UNREVIEWED status; return INDETERMINATE when any decisive source or licence scope is uncertain. User-supplied tables are USER_SUPPLIED_UNVERIFIED; use Greek for Greek queries.
**Refusal/stop condition:** IARU recommendations are not legal authorization; do not infer privileges from a band plan, a listing of national allocations or a purported repeater frequency. No live repeater status, no auto activation, no CAT/PTT/TX. Without official amended operative source and licence details, do not say ALLOWED to transmit.

Select only the necessary procedure:
- [SS-A03-1 Allocation Lookup](references/1-allocation-lookup.md)
- [SS-A03-2 Band Plan Overlay](references/2-band-plan-overlay.md)
- [SS-A03-3 Channel/Repeater Reference](references/3-channelrepeater-reference.md)

**Tools:** The draft-only `spectrum_band_segments` matches USER_SUPPLIED_UNVERIFIED segments and returns `verified:false`; `spectrum_find_repeaters` filters user-supplied entries with `live_status_known:false`; `source_lookup` matches supplied excerpts without primary-source retrieval. No current official spectrum-lookup adapter is installed in this staged Skill; country-specific legal authorization remains NOT_IMPLEMENTED absent separate verified rules and legal review.
