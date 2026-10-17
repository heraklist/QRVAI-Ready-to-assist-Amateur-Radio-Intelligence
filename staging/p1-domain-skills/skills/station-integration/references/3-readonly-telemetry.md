# SS-B11-3 — Read-only Telemetry

**Owner:** SK-B11
**Responsibility:** retrieve authorized rig state with connected-device fault handling
**Required input:** Explicit consenting user-supplied offline station status snapshot (mode RX/TX/STANDBY, frequency_hz, status_note) and timestamp provenance if provided.
**Procedure:** Treat station_read_status as transformation of user input only: output live_device_connected:false and verified:false. If mode is TX, treat as text reported by user, never key/enable transmitter. Future independently approved opt-in read-only bridge NOT_IMPLEMENTED.
**Output:** Source-labelled user snapshot with not-real-time warning, no inferred PTT, no implicit radio/host connection.
**Error/stop:** No CAT writes, No PTT, live bridge, remote telemetry, serial/USB probing, device secrets, auto frequency change or radio transmission.

**Status:** Offline user-supplied topology/snapshot only, verified:false, live_device_connected:false. Future read-only bridge NOT_IMPLEMENTED. No radio controls.
