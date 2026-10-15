# QRVAI MCP implementation register — 2026-10-15

**Runtime policy:** Vercel Node.js Functions only; no Cloudflare runtime, fallback or connector.

**Implemented in this draft source chain:** twenty RF/core, simulation and education tools in `mcp/qrvai-rf-worker/src/mcp/register.ts`, available through the `/api/mcp` source adapter, gated by Bearer authentication. All remaining candidate catalog contracts are proposals, **NOT registered endpoints**, **NOT deployed**. Exact registered names deliberately differ from the conceptual dotted M07–M10 names; consumer code must use only the registered names. M09 implementation accepts user-provided bounded profiles rather than the proposed vendor cable-ID database.

**Real deployment status:** protected Vercel feature-branch preview READY; HTTPS no-token request returns 503 (expected fail-closed). Real credentialed tools/list, tools/call, production and ChatGPT @QRVAI host acceptance remain blocked/unverified.

| Candidate ID | Concept method | Engine | Access class | Implementation | Registered MCP name |
|---|---|---|---|---|---|
| M01 | `qrvai.core.capabilities` | E18 | public | SOURCE IMPLEMENTED IN DRAFT | `core_capabilities` |
| M02 | `qrvai.source.lookup` | E06/E18 | public | NOT IMPLEMENTED | — |
| M03 | `qrvai.station.get_profile` | E18 | profile.read | NOT IMPLEMENTED | — |
| M04 | `qrvai.regulatory.check_operation` | E01 | public | NOT IMPLEMENTED | — |
| M05 | `qrvai.spectrum.band_segments` | E02 | public | NOT IMPLEMENTED | — |
| M06 | `qrvai.spectrum.find_repeaters` | E02 | public | NOT IMPLEMENTED | — |
| M07 | `qrvai.rf.convert_power` | E03 | public | SOURCE IMPLEMENTED | `rf_power_convert` |
| M08 | `qrvai.rf.link_budget` | E03 | public | SOURCE IMPLEMENTED | `rf_link_budget` |
| M09 | `qrvai.rf.feedline_loss` | E03 | public | SOURCE IMPLEMENTED | `rf_feedline_loss` |
| M10 | `qrvai.rf.impedance` | E03 | public | SOURCE IMPLEMENTED | `rf_impedance` |
| M11 | `qrvai.antenna.geometry` | E04 | public | SOURCE IMPLEMENTED IN DRAFT | `antenna_geometry` |
| M12 | `qrvai.antenna.matching` | E03 | public | SOURCE IMPLEMENTED IN DRAFT | `antenna_matching` |
| M13 | `qrvai.rf.filter_response` | E03 | public | SOURCE IMPLEMENTED IN DRAFT | `rf_filter_response` |
| M14 | `qrvai.rf.exposure_screen` | E01/E03 | public | NOT IMPLEMENTED | — |
| M15 | `qrvai.measurements.inspect_trace` | E05 | user.file.read | NOT IMPLEMENTED | — |
| M16 | `qrvai.sdr.inspect_iq` | E05 | user.file.read | NOT IMPLEMENTED | — |
| M17 | `qrvai.manual.find` | E06 | public | NOT IMPLEMENTED | — |
| M18 | `qrvai.manual.answer_cited` | E06 | public/user.file.read | NOT IMPLEMENTED | — |
| M19 | `qrvai.equipment.diagnose` | E06/E07 | public | NOT IMPLEMENTED | — |
| M20 | `qrvai.station.signal_path` | E07 | public | SOURCE IMPLEMENTED IN DRAFT | `station_signal_path` |
| M21 | `qrvai.station.read_status` | E07 | device.read | NOT IMPLEMENTED | — |
| M22 | `qrvai.power.autonomy` | E08 | public | SOURCE IMPLEMENTED IN DRAFT | `power_autonomy` |
| M23 | `qrvai.spaceweather.indices` | E11 | public | NOT IMPLEMENTED | — |
| M24 | `qrvai.propagation.path` | E09/E10 | public | NOT IMPLEMENTED | — |
| M25 | `qrvai.geo.bearing` | E09 | public | SOURCE IMPLEMENTED IN DRAFT | `geo_bearing` |
| M26 | `qrvai.satellite.pass` | E13 | public | NOT IMPLEMENTED | — |
| M27 | `qrvai.dx.reception_reports` | E11 | public/provider.auth | NOT IMPLEMENTED | — |
| M28 | `qrvai.digital.setup_guide` | E07/E12 | public | SOURCE IMPLEMENTED IN DRAFT | `digital_setup_guide` |
| M29 | `qrvai.packet.route_preview` | E12 | public | SOURCE IMPLEMENTED IN DRAFT | `packet_route_preview` |
| M30 | `qrvai.repeater.channel_preview` | E02/E12 | public | SOURCE IMPLEMENTED IN DRAFT | `repeater_channel_preview` |
| M31 | `qrvai.log.adif_validate` | E14 | user.file.read | NOT IMPLEMENTED | — |
| M32 | `qrvai.log.award_progress` | E14 | logs.read | NOT IMPLEMENTED | — |
| M33 | `qrvai.contest.plan` | E14/E08 | public | SOURCE IMPLEMENTED IN DRAFT | `contest_plan` |
| M34 | `qrvai.emcomm.drill` | E15 | public | SOURCE IMPLEMENTED IN DRAFT | `emcomm_drill` |
| M35 | `qrvai.emcomm.readiness` | E15/E08 | public | SOURCE IMPLEMENTED IN DRAFT | `emcomm_readiness` |
| M36 | `qrvai.academy.exercise` | E16 | public | SOURCE IMPLEMENTED IN DRAFT | `academy_exercise` |
| M37 | `qrvai.maker.project_review` | E17/E03 | public | SOURCE IMPLEMENTED IN DRAFT | `maker_project_review` |
| M38 | `qrvai.club.workshop_plan` | E17 | public/club.data.read | SOURCE IMPLEMENTED IN DRAFT | `club_workshop_plan` |

**Completion count (dependent draft branches, not main):** 20/38 catalog capabilities mapped to actual source MCP registrations; 18 remain unimplemented. Counts do not certify authenticated live endpoint or production integration.

**Readiness gates:** reproducible tests and precise source SHA → authenticated real preview HTTPS protocol proof → Vercel quotas, firewall, token/OAuth fit and safe operations → authorized production release → first new clean Plugin Creator identity and deferred host end-to-end. No fake data, licensed feed substitutions or dummy tools are allowed to fill gaps.

Source of conceptual names/engines/access classes: [candidate v0.5 registry](engine-and-mcp-tool-contracts-v0.5.md).
