# QRVAI International Academy — offline interactive prototype

This is a functioning **local static** bilingual Academy explorer, visually based on `ui/rf-workbench`. It presents the canonical 9 modules and 27 original EN/EL micro-lessons, three lessons per module, via a library picker, search, level filtering, safe activity and expandable answer. It never sends data to an external service, collects accounts or learner answers, operates a radio, or implies legal authority.

## Run offline

From the repository root:

```sh
python3 -m http.server 8000 --directory ui
```

Then open `http://localhost:8000/academy/` (the existing RF calculator preview is at `/rf-workbench/`). The app has no third-party dependencies; internet access is not required after loading the local files.

## Source of truth and reproducibility

The authoritative lesson content lives in `mcp/qrvai-rf-worker/src/academy/`. `ui/academy/data.mjs` is a **generated offline browser bundle**. It is checked in for static hosting, never edited by hand. After editing canonical micro-lessons:

```sh
node ui/academy/build-data.mjs
node ui/academy/build-data.mjs --check
node --experimental-strip-types --test ui/academy/test/*.test.mjs
```

The first command updates the generated bundle; `--check` blocks CI on drift, the tests verify exact EN/EL content parity and static privacy/accessibility markup contracts. Do not add external analytics, user storage, or callsign/coordinates to this prototype.

## Safety and status

- **Implemented:** real browser code for 9-module picker, 27 bilingual micro-lessons, language switch, search and level filter, self-check reveal; offline and no per-user personal data.
- **Not verified:** actual browser screenshots and visual regression QA; real keyboard/screen-reader testing; WCAG 2.2 AA measured contrast; mobile device interaction; user testing and editorial peer review; hosted MCP Apps integration.
- **Not implemented:** detailed national licensing or examination courses, complete textbook-length chapters, CW audio generation, learner accounts, adaptive grades, payments, ChatGPT OAuth plugin linking, PTT/CAT/TX, emergency dispatch.
- **Legal boundary:** a lesson is educational only and confers no national privilege. A new `regulatory_context` research endpoint is separate and does not certify permission.
- Work-mode Product Design review and a chosen actual visual target are still required before counting this browser code as production-approved UX.
