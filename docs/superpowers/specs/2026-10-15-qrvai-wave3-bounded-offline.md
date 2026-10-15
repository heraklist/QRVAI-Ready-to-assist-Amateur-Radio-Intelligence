# Wave 3 — bounded offline and user-supplied planning capabilities

Baseline PR #19 head 256eaf097693762ae2c7e3618aa94781fdac09fe. Dependency chain #17 -> #18 -> #19 -> Wave 3. Vercel-only. No production merge, external HTTP providers, persistent personal data, direct transmission, or external regulation assertions.

## Candidate subset
M28 digital_setup_guide: fixed, offline, illustrative receive-only setup checklists for FT8 or APRS. Not device-specific instructions and no transmit automation.
M30 repeater_channel_preview: frequency arithmetic for **user supplied** input and shift; output RX/TX frequency candidate, never assert license, repeater existence or authorization.
M33 contest_plan: bounded user-defined planning slots (UTC hh:mm from user) and band labels, output deterministic sorted plans; no claim of active contest schedules.
M37 maker_project_review: component checklist from user supplied safe low-voltage project sketch, bounded and no hardware safety certificate.
M38 club_workshop_plan: deterministic offline workshop agenda with explicit attendee count, topic and minutes; no club member data or event scheduling claims.

## Conventions and test gates
Every operation pure, side-effect free, throws on invalid input; finite numeric limits and max arrays. Zod strict inputs and structuredContent outputs. Registered tools are explicitly labeled previews, exercises or assumptions; no users' device access, no live external datasets.
RED unit tests committed ahead of implementations and captured from GitHub Actions; GREEN unit suite, tsc, protocol tools/list, Vercel dry build and preview inspect on exact head SHA. Refresh candidate implementation register per-ID, no premature 20/38 until green. Existing PRs remain Draft. Authenticated production MCP proof still separately blocked.
