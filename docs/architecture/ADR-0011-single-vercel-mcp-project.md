# ADR-0011 — One Vercel project for QRVAI MCP

Date: 2026-11-16
Status: **Target architecture adopted for development; migration and public release NOT accepted**
Review hub: [Draft PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53)

## Decision

QRVAI uses **one canonical Vercel project, `qrvai-rf-mcp`**, hosting a single Streamable HTTP MCP gateway at `/api/mcp`, backed by the monorepo application in `mcp/qrvai-rf-worker`. Functional domains are modules and MCP tool registrations, **not separate Vercel projects**.

The existing registry contains **52 read-only, source-registered tools** (38 P0 and 14 V1), including education (`academy_exercise`), amateur-radio RF engineering, operating aids, EmComm simulation, space weather, satellites, repeaters, and regulatory-source tools. Registered does not mean live-provider, host, legal, production, or security acceptance.

Do not create additional Vercel projects for individual tools, domain skills, or subsystems by default. New tools should be added to the same registry with namespaced contracts, bounded inputs, explicit provenance, and regression tests. If a future tool needs materially different isolation or trust boundaries, record a separate architecture/security decision rather than silently deploying it into the shared gateway.

## Verified inventory (2026-11-16)

- Team: `heraklists-projects` (Hobby).
- Canonical Vercel project: `qrvai-rf-mcp` (`prj_4c6IeOARTJOqEIaLlMx1rCDTGLKa`), Git-linked to `heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence`.
- The project's Node.js setting was aligned to **24.x** on 2026-11-16 to match `mcp/qrvai-rf-worker/package.json`. A preceding READY preview build showed that Node 24 was selected through the package engine despite the then-stale Node 22 project setting.
- The latest inspected RF deployment, `dpl_6VXo2bVbbmT1341eeoVVLHZL1K3o` at `f8cc9bc62a60dbc0466cb7769bb5bf9be2869356`, is **READY** and `target:null` in Vercel. It is not verified production or ChatGPT acceptance.
- Legacy `qrvai-academy-mcp` project (`prj_7wIx8os1yS9doaptTZLftltknf25`) has READY historic previews and a failed initial production build. Its old deployment Git branch/commit is not currently resolvable through the connected GitHub repository API; its source and any unique OAuth/security behavior have **not** been proven equivalent to the canonical MCP gateway.
- Reads of either project's environment-variable metadata returned **403 Forbidden**; firewall configuration reads returned **404 / access denied**. Neither result proves variables or firewall rules are absent.

## Consolidation rule and preservation gate

1. **Retain the Academy project unchanged** as a legacy reference until a source-level and runtime contract inventory proves whether it contains unique Academy, OAuth, transport or consent behavior. A same-name or similar-purpose `academy_exercise` tool is **not** proof of full parity.
2. Recover or inspect authoritative Academy source, exported MCP tools, authentication/resource metadata, HTTP endpoints, relevant tests, and any active consumers before migration.
3. Implement only missing, reviewed functions in `mcp/qrvai-rf-worker` via modules and SDK registrations, preserving compatible schemas or documenting versioned changes.
4. Verify on an exact reviewed SHA: Node 24 build, full GitHub CI, protected HTTPS `initialize`, `tools/list` and representative `tools/call` including Academy, negative security cases, 14 live-provider bounded scenarios, legal provenance and read-only boundaries.
5. Assess quotas, Firewall rate limiting and Deployment Protection in an authorized owner-scoped session. **Do not** weaken SSO, publish the endpoint, introduce secrets into logs, deploy/promote production or merge `main` merely to satisfy consolidation.
6. After independent acceptance and consumer migration, record a preservation checklist and seek separate approval for pausing, renaming, archiving or deleting the legacy Academy project.

## Operational consequences

- One Git-to-Vercel application deployment target, one MCP discovery URL, one centralized route for monitoring, versioning and controls.
- Internal domain separation remains in source, tests and tool-level authorization (especially for future non-read-only or identity-bound capabilities).
- `qrvai-rf-mcp` remains the existing Vercel project name for continuity; a branding rename is optional and should not disrupt deployment URLs or consumers.
- This ADR updates **development topology only**. Draft PR #53 remains a review branch; public accessibility, Plugin Creator installation and ChatGPT end-to-end operation are separate release gates.
