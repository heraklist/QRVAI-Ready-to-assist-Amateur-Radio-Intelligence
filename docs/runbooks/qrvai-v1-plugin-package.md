# QRVAI V1 plugin package

**Status (2026-11-16):** version 1.0.0 source and builder; international QRVAI adds two offline tools and an explicitly fail-closed server. The actual account test plan now **reuses the original private QRVAI plugin**, upgraded to `0.1.0-preview.4` with four smoke-test skills and no MCP connection. The full 24-domain/54-tool source ZIP is still separate repo build output, **not installed or host-accepted**. No second plugin or public release exists.

V1 is assembled, not hand-copied, so the frozen V0 package in `qrvai/` stays untouched:

| Part | Source |
|---|---|
| `plugin.json` (version 1.0.0) and the `qrvai-core` Skill with its routing and tool references (54 tools) | `qrvai-v1/` |
| 24 Domain Skills, three procedures each | Immutable baseline in `staging/p1-domain-skills/skills/`; exactly eight allowlisted international V1 overlay files from `qrvai-v1/overrides/skills/` substitute Academy and regulatory text at package time |
| `mcp.json` pointing at the deployed MCP endpoint | generated from `--mcp-url` |

```sh
python -m pip install -r requirements-v0-dev.txt
python -m unittest discover -s tests/v1 -p 'test_*.py'

# Release package: only with the real, verified production endpoint.
python -m scripts.v1.build_plugin --mcp-url https://<production-host>/api/mcp

# Draft without tools, for reading the Skills only.
python -m scripts.v1.build_plugin --skills-only
```

The builder refuses to run unless the staged Skills pass their audit, `tools.md` lists exactly the tool names registered in the combined canonical `src/rf/wave1.ts` and international `src/live/tools.ts` registries, `routing.md` names all 24 Skills, and the URL is a real HTTPS `/api/mcp` endpoint (no placeholders, credentials or query strings). Output is a reproducible Skills-only ZIP of **100 files** or a server-connected ZIP of **101 files** (adds `mcp.json`) under `dist/`; only the source package is test-verified, not the ChatGPT host.

**MCP config format:** `mcp.json` at the plugin root is `{"$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json", "mcpServers": {"qrvai": {"type": "streamable-http", "url": ...}}}`, matching OpenAI's plugin build guide (checked 2026-11-15). It is produced in one function, `mcp_config`.

For the initial **skills-only pilot on the old QRVAI identity**, see [private existing-plugin runbook](2026-11-16-existing-private-qrvai-pilot.md). The existing private account update is not the same as shipping this 100-file build.\n\nBefore building any server-connected package: a **protected preview** must pass authorized HTTPS MCP verification and identity/auth compatibility in `mcp/qrvai-rf-worker` with private credentials. Do not remove Vercel Deployment Protection merely to satisfy connectivity. A skills-only ZIP is a development draft, not a connected plugin release; live ChatGPT host acceptance, quota gates and owner approval remain separate.
