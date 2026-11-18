---
name: packet-networks
description: Privacy-protective paper-only amateur packet networking, AX.25/APRS path explanations and conditional Winlink/mesh plans without real network forwarding.
---
# SK-C17 — Packet Networks

**Trigger:** User requests AX.25/TNC routing explanation, APRS packet interpretation or hypothetical authorized Winlink/mesh infrastructure plan.
**Required context:** Protocol and whether the user has permission, 2–8 synthetic path labels if using draft tool, routing metadata with personal data omitted, jurisdictional third-party traffic rules, equipment/network version and consent.
**Output contract:** The packet_route_preview tool returns simulated:true ordered hops for supplied AX25/APRS labels only; describe source uncertainty, privacy, missing infrastructure and permission. Do not assert that a digipeater heard any packet or that a route/message was sent.
**Refusal/stop condition:** No APRS-IS write, No Winlink send, no actual packet forwarding, mesh configuration or digipeater keying. Never expose private location, home grid at excessive precision, real callsign-linked coordinates, third-party messages, station logs, private message content or protected communications without consent. No PTT or unauthorized third-party traffic.

**Tool boundary:** packet_route_preview is a simulated:true diagram only for an AX25/APRS user-provided path with 2–8 nodes and max 7 resulting hops, never live network state. APRS gateway, Winlink account, mesh adapter and legal decision engine NOT_IMPLEMENTED.

- [SS-C17-1 Packet Frame/Routing](references/1-packet-framerouting.md)
- [SS-C17-2 APRS/Location Ethics](references/2-aprslocation-ethics.md)
- [SS-C17-3 Winlink/Mesh Planning](references/3-winlinkmesh-planning.md)
