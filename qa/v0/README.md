# QRVAI V0 prompt and acceptance corpus

Test cases in `prompt-cases.json` are **test prompts**, not observed host replies. Review each case in Greek and English. Record user-visible behavior only once a fresh private plugin is installed.

Expected: Family routing is based on purpose and safety. The tool-less V0 must not claim any live data adapter, manual pages it did not inspect, numerical engine execution, official exam certification, emergency dispatch, device write or reuse of old private Academy records.

At unit-test time, `validate_qa_cases` only validates the schema/coverage of these prompts; it **does not prove model performance**. Actual `@QRVAI` replies remain NOT_EXECUTED until separately authorized private plugin creation and host installation.

## Real host verification receipt

Use `host-report.example.json` as a **non-executed** template. A host acceptance report is accepted only when produced following an actual *new*, owner-approved private plugin creation and installation. Run `validate_host_report(report, ids_from_qa_prompt_cases)` after entering real observed results.

Every record must include exact new backend plugin ID, release ID, **actual** package SHA256, client/version, time, operator, creation status `created`, invocation evidence and observed response for every bilingual QA case. The present example is intentionally BLOCKED/NOT_EXECUTED, not a fabricated success.

### Field checklist

1. Verify creator-source deletion and namespace availability before `create_plugin` (separate account gate); do not touch the old QRVAI backend identity.
2. Compare installed five Skill names against source; confirm no live QRVAI MCP tools.
3. In an **existing** ChatGPT conversation select or mention `@QRVAI`, record actual observable routing, follow-up continuity, and where unsupported explicitly label host UNSUPPORTED rather than guessing.
4. Check safety/permissions and no owner Academy content across all QA prompt cases.
5. Keep plugin creation, installation, public visibility, merges and releases separately authorized. Unit CI cannot perform ChatGPT host invocation.
