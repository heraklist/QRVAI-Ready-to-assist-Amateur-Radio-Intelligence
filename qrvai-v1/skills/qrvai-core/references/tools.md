# QRVAI tools — 54 read-only MCP tools (including international context & hobby Academy)

All tools are stateless and read-only. Tools marked **(your data)** only check, filter or summarize records the user pastes into the request; they fetch nothing and verify nothing. Pass arguments exactly as each tool's schema requires and report its assumptions with the result.

## Calculations

| Tool | What it computes |
|---|---|
| `rf_power_convert` | W, mW, dBm, dBW conversion |
| `rf_link_budget` | Received power and margin from explicit gains, losses and path loss |
| `rf_impedance` | Reflection coefficient, VSWR and return loss for R + jX against Z0 |
| `rf_feedline_loss` | Cable and connector loss from a supplied attenuation curve; prefer `log_log` interpolation for coax |
| `antenna_geometry` | Ideal thin-wire dipole and monopole dimensions |
| `antenna_matching` | Lossless quarter-wave transformer |
| `rf_filter_response` | Ideal first-order RC magnitude response |
| `power_autonomy` | Idealized battery runtime |
| `geo_bearing` | Great-circle bearing |
| `propagation_path` | Great-circle distance and free-space path loss only, not an ionospheric forecast |
| `rf_exposure_screen` | Ideal far-field power flux, not a compliance assessment |

## Checks on data the user supplies (your data)

| Tool | What it does |
|---|---|
| `source_lookup` | Search supplied source snippets |
| `regulatory_check_operation` | Compare a frequency with supplied rules; never grants permission |
| `spectrum_band_segments` | Match a frequency against supplied band segments |
| `spectrum_find_repeaters` | Filter supplied repeater records (for a live list use `repeaters_near`) |
| `manual_find` | Search supplied manual excerpts |
| `manual_answer_cited` | Exact matches in supplied manual excerpts |
| `measurements_inspect_trace` | Statistics on supplied RF trace samples |
| `sdr_inspect_iq` | Statistics on supplied IQ samples |
| `adif_validate` | Grammar check of a supplied ADIF snippet |
| `station_get_profile` | Normalize a supplied station snapshot |
| `station_read_status` | Inspect a supplied station status snapshot |
| `station_signal_path` | Describe a supplied signal path |
| `spaceweather_indices` | Inspect a supplied Kp record (for current values use `space_weather_now`) |
| `dx_reception_reports` | Filter supplied reception reports |
| `log_award_progress` | Compare supplied award entity lists |
| `satellite_pass` | Summarize supplied elevation samples (for predictions use `satellite_passes`) |
| `contest_plan` | Sort supplied contest time slots |

## Training, simulation and education

| Tool | What it does |
|---|---|
| `emcomm_drill` | Classroom-only emergency exercise |
| `emcomm_readiness` | Hypothetical training resource gaps |
| `packet_route_preview` | Simulated AX.25/APRS path |
| `digital_setup_guide` | Offline digital-mode setup guide |
| `repeater_channel_preview` | Hypothetical repeater offset arithmetic |
| `equipment_diagnose` | Non-invasive diagnostic checklist |
| `academy_exercise` | Fixed educational questions |
| `maker_project_review` | Low-voltage educational project review |
| `club_workshop_plan` | Offline workshop agenda |
| `core_capabilities` | List the implemented tools |

## Live data (fetched from the provider when called)

Each answer carries its `source`, `fetched_at` and cache age. Quote the source and the observation time; if a tool returns `PROVIDER_UNAVAILABLE`, say the source is unreachable instead of guessing.

| Tool | What it returns | Source |
|---|---|---|
| `space_weather_now` | Kp and G-scale, 24 h Kp forecast peak, 10.7 cm flux, X-ray class | NOAA SWPC |
| `satellite_passes` | AOS, maximum elevation and LOS times with azimuths for amateur satellites | CelesTrak elements, SGP4 |
| `satellite_transmitters` | Uplink and downlink frequencies and modes for a NORAD id | SatNOGS DB |
| `pota_spots` | Current Parks on the Air activators | pota.app |
| `wspr_spots` | Who heard a callsign on WSPR, or what it heard | wspr.live |
| `callsign_info` | DXCC entity, CQ/ITU zones and LoTW last upload for a callsign | AD1C cty.dat, ARRL LoTW |
| `repeaters_near` | Repeaters near a location with offset, tone, distance and bearing | HearHam |
| `contest_calendar` | Contests in the coming days with UTC times | WA7BNM |

## Official legal sources

| Tool | What it does |
|---|---|
| `regulatory_sources` | Tracked laws and recommendations per jurisdiction (GR, CEPT, US, DE, UK, IARU-R1) with their `document_id` |
| `regulation_text` | Live official text: Greek ΦΕΚ by number or `document_id`, EETT documents such as the ΕΚΚΖΣ allocation table (`eett_pdf_url`), or a 47 CFR §97 `us_section`; returns passages with page numbers or an article outline |
| `regulation_changes` | Checks today's official sources against QRVAI's last review: new EETT documents (GR), CEPT T/R 61-01/61-02 updates, US Part 97 amendments and Federal Register documents |

Use these before stating any rule. Quote the passage and page, give the citation, and still answer **INDETERMINATE** about permission when the user's licence class, frequency, mode or power is missing. Never present legal text as legal advice.

## Station calculators

| Tool | What it computes |
|---|---|
| `erp_eirp` | ERP (dipole reference) and EIRP from power, losses and antenna gain in dBi or dBd |
| `cable_catalog` | Datasheet attenuation tables of common coax cables (Aircell, Ecoflex, H155, RG-58, RG-213) |
| `cable_loss` | Loss and delivered power for a catalogued cable; no extrapolation outside the datasheet range |
| `regulatory_context` | Explicit operating-country authority layers, legal-source coverage, INDETERMINATE (never authorization to transmit) |
| `academy_catalog` | International hobby syllabus, EN/EL, nine modules; no national licence/exam courses |

Personal logbook services (LoTW logs, eQSL, Club Log, QRZ) need user authentication and are not available yet.
