# Wave 4: evidence-safe source and operating previews

Base: Wave3 PR #20, Vercel-only, 20 registered draft tools. Scope: M02 source_lookup, M04 regulatory_check_operation, M05 spectrum_band_segments, M06 spectrum_find_repeaters, M17 manual_find. These are **input-grounded offline analysis operations**; not external feeds.

Source lookup: select matching evidence snippets from user-supplied finite catalog; return explicit source ids and user-supplied provenance. Reject unprovided/source unknown claims.
Regulatory check: check operation only against supplied written rule record with identifier, jurisdiction, and permitted/forbidden band ranges; return unverified provisional outcome; no legal certification.
Band segments: inspect input-supplied published-version band records; no asserted country allocations, no automatic legal authority.
Repeater search: filter user-supplied station records by bounds and band; never fabricate live repeater locations, frequencies or operating status.
Manual find: match user-supplied excerpt blocks only; return matching ids; no copyrighted books downloaded or proprietary vendor manual retrieval.

Tests: deterministic TDD RED then GREEN, reject malformed ids/oversized catalogs/nonfinite values, strict MCP schemas, no network, no device control, no live authority claims, registry 25 tools only after CI green, exact Vercel preview SHA and no production rollout.
