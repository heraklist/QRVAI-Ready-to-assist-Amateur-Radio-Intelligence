# QRVAI Wave 2: offline, public, exercise-only MCP tools

Date 2026-10-15. Baseline: exact Wave 1 PR #18 SHA 373793d60ebd3935b6e3071f7c752ff5409c6275. Dependency chain #17 (Vercel) -> #18 (ten tools) -> Wave 2. Draft PR only; no release.

## Selection rationale

Choose candidate M20, M29, M34, M35, M36. These can be implemented as **pure deterministic calculators/formatters** on explicit user-supplied hypothetical input, with no official legal/regulatory dataset, remote provider, personal logs, station profile, device I/O, operator QTH or rights-restricted manuals. Do not implement other candidates as stub registrations. All exercise/simulation outputs must be explicit. Avoid safety certification, actual dispatch or transmission.

## Bounded V1 contracts

- **M20 `station_signal_path`**: {devices:[{id,kind}], connections:[{from,to}]} <=16 devices, <=32 directed connections. Validate unique IDs, endpoints, no self-links, no cycles. Return nodes/edges and warnings array. No inferred electrical compatibility: mark user-supplied unverified topology.
- **M29 `packet_route_preview`**: {protocol:"AX25"|"APRS",path:string[]}, 2–8 node IDs, no repeated entries. Return ordered hops, hop_count, simulated:true, advisory text. No network transmission or live routing.
- **M34 `emcomm_drill`**: {scenario:"power_outage"|"repeater_unavailable",roles:string[]}, <=8 roles, no contacts. Return fixed safe exercise steps, simulated:true, no operational dispatch.
- **M35 `emcomm_readiness`**: {battery_wh,average_load_w,usable_fraction,participants,required_roles}, bounded nonnegative counts. Reuse pure M22 powerAutonomy; return estimated_runtime_h, staffing_gap, simulated:true, no emergency preparedness certification.
- **M36 `academy_exercise`**: {topic:"rf_power"|"antenna_basics",locale:"el"|"en",answer_index?:0|1|2}, deterministic fixed educational multiple-choice question and optional correctness, no personal data or personalized score storage.

## Gates

Write tests first and verify failing RED Actions logs. Implement validated pure engines and strict registered Zod input/output, readOnlyHint, deterministic tests including invalid inputs, protocol lists and Vercel source assertions. Verify green exact SHA via GitHub Actions, V0 ZIP stable tests and Vercel Preview READY. Update implementation register mapping/count. No production merge, bearer-key disclosure, Cloudflare, provider calls, or false host acceptance. Tool descriptions must make simulator/limitations explicit.
