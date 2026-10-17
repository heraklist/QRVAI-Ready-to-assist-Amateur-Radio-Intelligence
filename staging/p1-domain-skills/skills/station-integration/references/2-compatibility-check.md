# SS-B11-2 — Compatibility Check

**Owner:** SK-B11
**Responsibility:** match ports, drivers, protocols and versioned settings
**Required input:** Radio/interface model+revision, USB/serial driver/OS, pin voltage/logic isolation, firmware/modes and documented compatibility notes.
**Procedure:** Match claimed connector types/protocol across user-supplied exact model datasheets; separate an electrical compatibility assumption from software driver support. If voltage or firmware is unknown mark INDETERMINATE rather than guarantee compatibility. No port scanning or installation.
**Output:** Checklist of supported claims, conflicting/unknown driver settings and explicit qualification for powered hardware.
**Error/stop:** No unknown voltage adaptation, hidden serial commands, unsafe wiring, live detection, guaranteed rig compatibility or control action.

**Status:** Offline user-supplied topology/snapshot only, verified:false, live_device_connected:false. Future read-only bridge NOT_IMPLEMENTED. No radio controls.
