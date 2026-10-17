# SS-A03-3 — Channel/Repeater Reference

**Owner:** SK-A03
**Responsibility:** filter source-verified repeater/beacon/channel metadata with freshness
**Required input:** User-selected, source-labelled repeater, beacon or channel rows with date_checked/source_revision, frequency_hz, location, mode, identification and explicit status unknown.
**Procedure:** Filter bounded user-supplied records via optional source-registered spectrum_find_repeaters with input frequency range and supplied rows, never scrape/download unapproved live services. Check duplicate, inconsistent frequency and stale source timestamps; ask for official metadata if operational accuracy is demanded.
**Output:** USER_SUPPLIED_UNVERIFIED directory subset, timestamps and source revision, with live_status_known:false and no promised coverage/availability.
**Error/stop:** No live repeater status, legal repeater permission, current network coverage guarantee, private operator tracking or fabricated call-sign roster.

**Provenance:** Source entrypoints under `docs/research/2026-10-17-qrvai-p1-2-family-a-authority-survey.md` are candidates, not already reviewed operative rules. USER_SUPPLIED_UNVERIFIED ≠ state-authorized. No live source API or verified frequency access.
