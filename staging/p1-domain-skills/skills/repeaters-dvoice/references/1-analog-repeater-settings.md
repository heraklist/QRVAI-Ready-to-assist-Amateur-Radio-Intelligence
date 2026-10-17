# SS-C18-1 — Analog Repeater Settings

**Owner:** SK-C18
**Responsibility:** calculate split/offset/CTCSS/DCS with source
**Required input:** User-supplied RX frequency, explicit signed offset and model/documented CTCSS or DCS setting; country permissions must be separately confirmed.
**Procedure:** Use repeater_channel_preview solely to calculate f_tx=f_rx+Δf; example 145600000 Hz −600000 Hz =145000000 Hz. Label verified:false, avoid assuming 145 MHz TX authorized. Distinguish access tone, subaudible decode and interference concerns; only name codes from a trusted timestamped source.
**Output:** Arithmetic preview and input provenance, unverified tone/status and missing frequency/licence authority.
**Error/stop:** No invented tones, auto VFO/memory writing, PTT, operating permit or active repeater guarantee.

**Source status:** USER_SUPPLIED_UNVERIFIED, verified:false and live_status_known:false; no radio control.
