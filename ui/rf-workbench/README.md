# QRVAI RF Workbench — standalone offline UI preview

Three **working** local browser tools: power conversion; feedline/cable attenuation from two **operator-supplied** reference points with log-log interpolation and strict no-extrapolation; and ideal free-space link budget with a receiver-sensitivity margin. A button transfers cable loss/frequency into the link-budget form.

## Related offline international UIs

The local RF Workbench navigation now links to the independently source-synchronized [Academy](../academy/README.md) (nine modules, 27 EN/EL micro-lessons) and [Rules & Sources](../regulations/README.md) (eight official-source discovery countries, research-only). These are developer previews and not ChatGPT MCP Apps.

## Run

From the repository root, run `python3 -m http.server 8000 --directory ui/rf-workbench`, then open `http://localhost:8000/`. Any ordinary static host works; no backend, accounts, API keys, provider data, or build artifacts are required.

## Verify

From the repository root: `node --test ui/rf-workbench/test/calculations.test.mjs`. CI is defined in `.github/workflows/qrvai-rf-workbench-ci.yml`.

## Status and safety

- **Implemented source**: browser forms, working calculations, validated bounds, accessible labels and live output, optional cable-to-link workflow.
- **Not deployed / not connected to MCP**: no live 54-tool backend, Plugin Creator UI host, official station manuals or legal-source citation workflow. UI is source-only preview until opened/tested on a real browser and authorized deployment.
- **No legal or radio operation claim**: results are educational mathematical models; not coverage certification, equipment measurement, license privileges, automatic TX, PTT/CAT, remote SDR or live logbook access.
- **No vendor cable data**: only user-provided points, which may be inaccurate. Link budget assumes ideal free space and ignores obstacles, noise, multipath, environmental effects and transmitter-regulation constraints.
- **Privacy**: no outbound network requests in app code; form values remain local in-page state. Opening a static host can still send ordinary HTTP requests to that host for files, as with any website.
