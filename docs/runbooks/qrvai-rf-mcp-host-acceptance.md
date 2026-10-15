# QRVAI RF MCP — Host acceptance (NOT EXECUTED)

**Purpose:** a separately authorized private-plugin test after a verified Cloudflare endpoint exists and Issue #3 is resolved. This is a runbook, not a test result.

1. Verify the current and separate authorization for **Cloudflare Worker creation/deployment**; if absent, STOP. Do not modify the old creator record.
2. Confirm Free plan and quotas on the real connected Cloudflare account, then measure the **real deployed** stateless `/mcp` endpoint: authenticate neither the user nor their station information; call real MCP `initialize`, `tools/list` and `tools/call` with 100 W→50 dBm and 1 mW→0 dBm. Capture exact deployed version, HTTPS URL, timestamp, CPU readings and errors.
3. Confirm private/plugin lifecycle actually permits registration of the now-real MCP endpoint alongside the five Skills, and that old `qrvai` backend identity was deleted and name made available. Do not create a replacement or add `qrvai/mcp.json` until independently cleared and **owner explicitly authorizes** new account creation.
4. In a **previously opened ChatGPT conversation** on the owner's target client, use `@QRVAI` if client offers it, then ask for 100 W in dBm. Verify real tool invocation and reply with units and no repeated OAuth consent. Send a second follow-up: 1 mW in dBW; verify context is preserved and the actual tool returns -30 dBW.
5. Record timestamps and verifiable host/source receipts in a new private report; avoid publishing conversation IDs/tokens/callsigns in the public repository. Use a securely redacted reference and do not claim an independently verified result from a fabricated JSON fixture.
6. If ANY gate is unsupported or failed, record **BLOCKED** rather than inventing tools, resource URLs or passing flags. The public GitHub source merge is separate from private account creation and hosting release.

The example `qa/mcp/host-report.example.json` defaults to NOT_EXECUTED, and `scripts/check-release-gates.mjs` returns BLOCKED on it. The CLI validates evidence structure only; it does **not** verify third-party URLs or prove a real Cloudflare/ChatGPT event.
