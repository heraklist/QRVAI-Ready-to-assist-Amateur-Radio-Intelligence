import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

type Checkers = {
  checkV0PilotGates: (report: unknown) => string[];
  checkReleaseGates: (report: unknown) => string[];
};

async function readGate(): Promise<Checkers> {
  // @ts-expect-error offline gate is intentionally a plain .mjs module
  return import("../../../scripts/check-release-gates.mjs");
}

const fixture = () => JSON.parse(readFileSync(fileURLToPath(
  new URL("../../../qa/mcp/host-report.example.json", import.meta.url)
), "utf8"));
const receipt = () => ({
  passed: true,
  evidenceUrl: "https://example.invalid/synthetic-receipt",
  observedAt: "2026-11-17T08:00:00Z"
});
const pluginId = "plugins_6acf47f502dc8191bf542fe040d484d8";

function syntheticV0Report(): Record<string, any> {
  return {
    phase: "V0_SKILLS_ONLY",
    status: "REVIEWED_PASS",
    simulated: false,
    pluginId,
    pluginVersion: "0.1.0-preview.4",
    smokeTests: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      status: "PASS",
      evidence: {
        kind: "user_supplied_response",
        reference: `synthetic-test-${i + 1}`,
        reviewedAt: "2026-11-17T08:00:00Z"
      }
    }))
  };
}

/** Synthetic documentary fields — not observed Vercel/ChatGPT execution. */
function syntheticV1Report(): Record<string, any> {
  const report: Record<string, any> = fixture();
  for (const key of [
    "vercelPlanVerified", "vercelQuotaVerified", "vercelFunctionObserved",
    "vercelPreviewTargetVerified", "deployedEndpointVerified",
    "authCompatibilityVerified", "existingPrivatePluginVerified",
    "mcpToolRegistryObserved", "oauthHostHandshakeObserved",
    "hostInvocationObserved", "observedFollowUp"
  ]) report[key] = receipt();
  report.phase = "V1_MCP_HOST";
  report.status = "EXECUTED_PASS";
  report.simulated = false;
  report.exactSourceSha = "a".repeat(40);
  report.existingPrivatePluginVerified.pluginId = pluginId;
  report.existingPrivatePluginVerified.visibility = "private";
  report.mcpToolRegistryObserved.toolCount = 54;
  report.mcpToolRegistryObserved.source = "chatgpt_host";
  report.mcpToolRegistryObserved.academyCatalogExecuted = true;
  report.vercelFunctionObserved.durationMs = 25;
  report.vercelPreviewTargetVerified.target = "preview";
  report.authCompatibilityVerified.method = "oauth-authorization-code-pkce";
  report.oauthHostHandshakeObserved.verifiedPrincipal = true;
  report.oauthHostHandshakeObserved.issuerVerified = true;
  report.oauthHostHandshakeObserved.audienceVerified = true;
  report.oauthHostHandshakeObserved.pkceVerified = true;
  report.hostInvocationObserved.conversationAlreadyOpen = true;
  report.hostInvocationObserved.client = "ChatGPT";
  report.hostInvocationObserved.conversationId = "synthetic-session-A";
  report.observedFollowUp.conversationId = "synthetic-session-A";
  return report;
}

test("V0: eight reviewed skills-only responses can pass without MCP receipts", async () => {
  const { checkV0PilotGates } = await readGate();
  assert.deepEqual(checkV0PilotGates(syntheticV0Report()), []);
});

test("V0: missing or duplicate smoke tests never count as 8/8", async () => {
  const { checkV0PilotGates } = await readGate();
  const report = syntheticV0Report();
  report.smokeTests[7] = report.smokeTests[6];
  assert.ok(checkV0PilotGates(report).length > 0);
  report.smokeTests = report.smokeTests.slice(0, 7);
  assert.ok(checkV0PilotGates(report).length > 0);
});

test("V0: incomplete, simulated, or unsupported plugin identity blocks acceptance", async () => {
  const { checkV0PilotGates } = await readGate();
  for (const bad of [
    { ...syntheticV0Report(), status: "NOT_EXECUTED" },
    { ...syntheticV0Report(), simulated: true },
    { ...syntheticV0Report(), pluginId: "plugins_different" }
  ]) assert.ok(checkV0PilotGates(bad).length > 0);
});

test("V1: the official report template is blocked by default", async () => {
  const { checkReleaseGates } = await readGate();
  const errors = checkReleaseGates(fixture());
  assert.ok(errors.some(x => x.includes("vercelPlanVerified")), errors.join("; "));
  assert.ok(errors.some(x => x.includes("hostInvocationObserved")), errors.join("; "));
  assert.ok(errors.some(x => x.includes("existingPrivatePluginVerified")), errors.join("; "));
});

test("V1: the existing private plugin ID is REQUIRED, not a new plugin ID", async () => {
  const { checkReleaseGates } = await readGate();
  const report = syntheticV1Report();
  assert.deepEqual(checkReleaseGates(report), []);
  report.existingPrivatePluginVerified.pluginId = "plugins_unapproved_new_identity";
  assert.ok(checkReleaseGates(report).some(x => x.includes("existingPrivatePluginVerified")));
});

test("V1: host registry must prove 54 live tools and academy_catalog execution", async () => {
  const { checkReleaseGates } = await readGate();
  for (const changed of [
    { toolCount: 0 }, { toolCount: 53 }, { source: "repository" },
    { academyCatalogExecuted: false }
  ]) {
    const report = syntheticV1Report();
    Object.assign(report.mcpToolRegistryObserved, changed);
    assert.ok(checkReleaseGates(report).some(x => x.includes("mcpToolRegistryObserved")));
  }
});

test("V1: authenticated host handshake and same-session follow-up are mandatory", async () => {
  const { checkReleaseGates } = await readGate();
  const report = syntheticV1Report();
  report.oauthHostHandshakeObserved.pkceVerified = false;
  report.observedFollowUp.conversationId = "synthetic-session-B";
  assert.ok(checkReleaseGates(report).some(x => x.includes("oauthHostHandshakeObserved")));
  assert.ok(checkReleaseGates(report).some(x => x.includes("conversation")));
});

test("V1: simulation, missing provenance, and V0-only acceptance cannot pass", async () => {
  const { checkReleaseGates } = await readGate();
  for (const report of [
    null, {}, syntheticV0Report(),
    { ...syntheticV1Report(), status: "NOT_EXECUTED" },
    { ...syntheticV1Report(), simulated: true }
  ]) assert.ok(checkReleaseGates(report).length > 0);
});
