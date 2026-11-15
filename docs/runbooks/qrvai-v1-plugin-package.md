# QRVAI V1 plugin package

**Status (2026-11-15):** version 1.0.0 source and builder. No plugin has been created or installed, and no production MCP endpoint exists yet.

V1 is assembled, not hand-copied, so the frozen V0 package in `qrvai/` stays untouched:

| Part | Source |
|---|---|
| `plugin.json` (version 1.0.0) and the `qrvai-core` Skill with its routing and tool references (52 tools) | `qrvai-v1/` |
| 24 Domain Skills, three procedures each | `staging/p1-domain-skills/skills/` |
| `mcp.json` pointing at the deployed MCP endpoint | generated from `--mcp-url` |

```sh
python -m pip install -r requirements-v0-dev.txt
python -m unittest discover -s tests/v1 -p 'test_*.py'

# Release package: only with the real, verified production endpoint.
python -m scripts.v1.build_plugin --mcp-url https://<production-host>/api/mcp

# Draft without tools, for reading the Skills only.
python -m scripts.v1.build_plugin --skills-only
```

The builder refuses to run unless the staged Skills pass their audit, `tools.md` lists exactly the tool names registered in `mcp/qrvai-rf-worker/src/rf/wave1.ts`, `routing.md` names all 24 Skills, and the URL is a real HTTPS `/api/mcp` endpoint (no placeholders, credentials or query strings). Output is a reproducible ZIP of 101 files under `dist/`.

**MCP config format:** `mcp.json` at the plugin root is `{"$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json", "mcpServers": {"qrvai": {"type": "streamable-http", "url": ...}}}`, matching OpenAI's plugin build guide (checked 2026-11-15). It is produced in one function, `mcp_config`.

Before building a release package: the endpoint must be publicly reachable (Vercel Deployment Protection currently blocks it) and must pass `npm run verify:https` in `mcp/qrvai-rf-worker`.
