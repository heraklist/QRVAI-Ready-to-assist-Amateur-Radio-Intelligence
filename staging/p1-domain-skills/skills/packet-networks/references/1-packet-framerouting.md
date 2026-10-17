# SS-C17-1 — Packet Frame/Routing

**Owner:** SK-C17
**Responsibility:** explain AX.25/TNC, digipeat and packet path behavior
**Required input:** Explicitly synthetic 2–8 AX25/APRS path node aliases, digipeater assumptions and no sensitive real station metadata.
**Procedure:** Use packet_route_preview to connect consecutive supplied labels, count hops and show a hypothetical digipeat/path shape. Explain AX.25 frame/address/SSID concepts conceptually and why a configured path doesn't establish reception or permission.
**Output:** Graph with simulated:true and source USER_SUPPLIED_UNVERIFIED, potential hop limits and topology-only conclusions.
**Error/stop:** No real packet send, live network route lookup, unauthorized third-party traffic or auto-forwarded messages.

**Status:** Offline simulated:true path planning, USER_SUPPLIED_UNVERIFIED; no APRS-IS, Winlink or mesh connection.
