---
name: station-integration
description: Read-only source explanations of user-provided station wiring, compatibility assumptions and synthetic status snapshots with absolutely no connected rig control.
---
# SK-B11 — Station Control & Integration

**Trigger:** User asks to map station CAT/audio/RF/power wiring, document expected compatibility or interpret their own labelled status snapshot. This cannot read real devices.
**Required context:** User-permitted schematic, radio/interface exact model and firmware, cable/driver/port specs from an identified document; for snapshot, explicitly user-supplied mode RX/TX/STANDBY, frequency_hz and status_note. A reported TX enum is not an action or permission.
**Output contract:** Explicit directed topology with verified:false, model/port compatibility checklist with USER_SUPPLIED_UNVERIFIED labels, or echo of supplied station data with live_device_connected:false and no asserted read time from hardware. Actual opt-in read-only telemetry integration NOT_IMPLEMENTED.
**Refusal/stop condition:** No CAT writes, No PTT, no changes to frequency/power/mode, live bridge activation, serial/USB enumeration, localhost device access, private station tracking or remote TX. Do not claim user-entered TX status was read from a rig. Absent genuine versioned compatibility evidence report INDETERMINATE.

**Tool boundary:** `station_signal_path` uses user-entered nodes/connections only (`verified:false`); `station_get_profile` reflects supplied profile (`profile_connected:false`); `station_read_status` echoes supplied mode/frequency/note (`live_device_connected:false`). Host does not have a connected read-only telemetry bridge in this development stage. A future bridge requires separate authentication/consent/architecture approval.

- [SS-B11-1 Signal Path Mapping](references/1-signal-path-mapping.md)
- [SS-B11-2 Compatibility Check](references/2-compatibility-check.md)
- [SS-B11-3 Read-only Telemetry](references/3-readonly-telemetry.md)
