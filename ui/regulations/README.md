# QRVAI international official-source explorer — standalone offline preview

This code provides a responsive EN/EL **country-of-operation source discovery interface**, visually aligned with the existing RF Workbench. Eight official country portal/source pointers are shown for GR, US, DE, GB, AU, CA, NZ, JP. ITU, IARU and CEPT are explicitly labelled as international framework, generally voluntary operating guidance and conditional visitor arrangements respectively. **Every national permission verdict is INDETERMINATE**, including supported countries; no frequency/power/visitor eligibility is calculated or claimed.

## Run

From the repository root: `python3 -m http.server 8000 --directory ui`, then open `http://localhost:8000/regulations/`. Access to site content is offline; only **clicking** a reviewed official HTTPS source link opens that external public site.

## Deterministic source sync and CI

The canonical source registry is `mcp/qrvai-rf-worker/src/live/country-packs.ts`. The browser asset `ui/regulations/data.mjs` is generated from it and checked in:

```sh
node ui/regulations/build-data.mjs
node ui/regulations/build-data.mjs --check
node --experimental-strip-types --test ui/regulations/test/*.test.mjs
```

CI checks canonical source parity and that no country is marked as permission-verified. Do not hand-edit the asset or add a browser-side licensing verdict.

## Current safety boundaries

- **Working source:** explicit country selector, visitor warning, English/Greek labels, international/regional source tiers, eight national portals, source-access dates and explanatory caveats.
- **NOT implemented/verified:** jurisdictional legal interpretation, amendments, effective-date matching, overseas territory selection, individual licence authentication, real protected MCP server, live dynamic source extraction, Vercel/ChatGPT embedded UI, browser screenshot/interaction QA, screen-reader/contrast review or qualified legal opinion.
- **Privacy:** no account, callsign, GPS, IP country inference, localStorage, station control, data retention or external network requests in application JavaScript.
- No amount of reading these official source links constitutes permission to transmit. Confirm applicable national law with the competent authority.
