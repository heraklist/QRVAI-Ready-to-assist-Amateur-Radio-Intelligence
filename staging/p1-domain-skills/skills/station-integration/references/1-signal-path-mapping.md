# SS-B11-1 — Signal Path Mapping

**Owner:** SK-B11
**Responsibility:** trace CAT, audio, power, tuner and interlocks in the station
**Required input:** User-supplied device IDs and categories, directed CAT/audio/power/RF edges, model IDs, interface pinouts/interlocks and evidence scope.
**Procedure:** Create schematic graph from explicitly provided nodes and edges; classify control vs audio vs power lines and identify unverified physical interlocks/cross-connections. The station_signal_path tool is a diagrammer with verified:false, not a cable validator or station probe.
**Output:** Unverified directed graph, provenance, safety-review questions and missing connection evidence.
**Error/stop:** No device enumeration, physical connection validation, direct CAT writes, PTT, TX or live cabling instructions.

**Status:** Offline user-supplied topology/snapshot only, verified:false, live_device_connected:false. Future read-only bridge NOT_IMPLEMENTED. No radio controls.
