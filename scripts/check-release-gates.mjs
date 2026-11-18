/* Offline documentary shape checks only. NEVER launches Vercel, a ChatGPT plugin, CAT or PTT. */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const PRIVATE_PILOT_PLUGIN_ID = "plugins_6acf47f502dc8191bf542fe040d484d8";
const V0_PILOT_VERSION = "0.1.0-preview.4";
const v1Receipts = [
  "vercelPlanVerified", "vercelQuotaVerified", "vercelFunctionObserved",
  "vercelPreviewTargetVerified", "deployedEndpointVerified",
  "authCompatibilityVerified", "existingPrivatePluginVerified",
  "mcpToolRegistryObserved", "oauthHostHandshakeObserved",
  "hostInvocationObserved", "observedFollowUp"
];

const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const nonblank = value => typeof value === "string" && value.trim().length > 0;
const validTimestamp = value => typeof value === "string" && Number.isFinite(Date.parse(value));
const receipt = value => object(value) && value.passed === true
  && typeof value.evidenceUrl === "string" && /^https:\/\//.test(value.evidenceUrl)
  && validTimestamp(value.observedAt);

/**
 * V0: editorial review of eight user-provided skills-only responses.
 * A passing shape check is NOT an independent ChatGPT host trace, MCP invocation,
 * legal authorisation or authorization for a public plugin release.
 */
export function checkV0PilotGates(evidence) {
  if (!object(evidence)) return ["V0 evidence must be an object"];
  const errors = [];
  if (evidence.phase !== "V0_SKILLS_ONLY") errors.push("V0 phase must be V0_SKILLS_ONLY");
  if (evidence.status !== "REVIEWED_PASS")
    errors.push("V0 status must be REVIEWED_PASS only after reviewing all eight responses");
  if (evidence.simulated !== false)
    errors.push("V0 simulated evidence cannot establish reviewed acceptance");
  if (evidence.pluginId !== PRIVATE_PILOT_PLUGIN_ID)
    errors.push("V0 pluginId must preserve the existing private QRVAI identity");
  if (evidence.pluginVersion !== V0_PILOT_VERSION)
    errors.push("V0 pluginVersion must identify the tested skills-only release");
  if (!Array.isArray(evidence.smokeTests) || evidence.smokeTests.length !== 8) {
    errors.push("V0 smokeTests must contain exactly eight response reviews");
    return errors;
  }
  const ids = new Set();
  for (const item of evidence.smokeTests) {
    if (!object(item) || !Number.isInteger(item.id) || item.id < 1 || item.id > 8 || ids.has(item.id)) {
      errors.push("V0 smokeTests must have distinct numbered IDs 1 through 8");
      continue;
    }
    ids.add(item.id);
    if (item.status !== "PASS") errors.push(`V0 test #${item.id} requires reviewed PASS`);
    if (!object(item.evidence) || item.evidence.kind !== "user_supplied_response"
      || !nonblank(item.evidence.reference) || !validTimestamp(item.evidence.reviewedAt))
      errors.push(`V0 test #${item.id} requires a user-response reference and review timestamp`);
  }
  if (ids.size !== 8) errors.push("V0 requires each smoke test ID 1 through 8 exactly once");
  return errors;
}

/**
 * V1: documentary completeness for a protected live ChatGPT MCP host acceptance.
 * Even an empty error list does NOT verify URLs, authentication or cloud actions.
 * Independent review of the actual evidence remains mandatory.
 */
export function checkReleaseGates(evidence) {
  if (!object(evidence)) return ["V1 evidence must be an object"];
  const errors = [];
  if (evidence.phase !== "V1_MCP_HOST")
    errors.push("V1 phase must be V1_MCP_HOST; reviewed V0 responses do not establish MCP acceptance");
  if (evidence.status !== "EXECUTED_PASS")
    errors.push("V1 status must be EXECUTED_PASS only after external observations");
  if (evidence.simulated !== false)
    errors.push("V1 simulated or unspecified provenance cannot authorize release");
  if (!nonblank(evidence.exactSourceSha) || !/^[0-9a-f]{40}$/.test(evidence.exactSourceSha))
    errors.push("exactSourceSha requires the observed full Git SHA");
  for (const name of v1Receipts) {
    if (!receipt(evidence[name]))
      errors.push(name + " requires actual observed receipt (passed, HTTPS URL and timestamp)");
  }

  const plugin = evidence.existingPrivatePluginVerified;
  if (plugin?.pluginId !== PRIVATE_PILOT_PLUGIN_ID || plugin?.visibility !== "private")
    errors.push("existingPrivatePluginVerified must prove the SAME private QRVAI backend identity");

  const registry = evidence.mcpToolRegistryObserved;
  if (registry?.toolCount !== 54 || registry?.source !== "chatgpt_host"
    || registry?.academyCatalogExecuted !== true)
    errors.push("mcpToolRegistryObserved requires 54 LIVE host tools and executed academy_catalog");

  const auth = evidence.authCompatibilityVerified;
  if (!nonblank(auth?.method) || !/oauth/i.test(auth.method) || !/pkce/i.test(auth.method))
    errors.push("authCompatibilityVerified requires observed OAuth authorization-code/PKCE client method");

  const handshake = evidence.oauthHostHandshakeObserved;
  if (handshake?.verifiedPrincipal !== true || handshake?.issuerVerified !== true
    || handshake?.audienceVerified !== true || handshake?.pkceVerified !== true)
    errors.push("oauthHostHandshakeObserved requires verified principal, issuer, audience and PKCE");

  const host = evidence.hostInvocationObserved;
  if (host?.conversationAlreadyOpen !== true || !nonblank(host?.client))
    errors.push("hostInvocationObserved needs real named client and already-open ChatGPT conversation proof");
  const follow = evidence.observedFollowUp;
  if (!nonblank(follow?.conversationId))
    errors.push("observedFollowUp requires same-session conversation evidence");
  if (!nonblank(host?.conversationId) || host.conversationId !== follow?.conversationId)
    errors.push("conversation identifiers must match across original host invocation and observed follow-up");

  const observed = evidence.vercelFunctionObserved;
  if (typeof observed?.durationMs !== "number" || !Number.isFinite(observed.durationMs)
    || observed.durationMs < 0)
    errors.push("vercelFunctionObserved requires measured non-negative Vercel function duration");
  if (evidence.vercelPreviewTargetVerified?.target !== "preview")
    errors.push("vercelPreviewTargetVerified must prove preview, never production");
  return errors;
}

function main() {
  const args = process.argv.slice(2);
  const v0 = args[0] === "--v0";
  const v1 = args[0] === "--v1";
  const file = args[v0 || v1 ? 1 : 0];
  if (!file) {
    console.error("BLOCKED: supply a report JSON path (--v0 for reviewed skills-only, --v1 for protected MCP)");
    process.exitCode = 2;
    return;
  }
  try {
    const data = JSON.parse(readFileSync(file, "utf8"));
    const errors = v0 ? checkV0PilotGates(data) : checkReleaseGates(data);
    if (errors.length) {
      console.error("BLOCKED / NOT_ACCEPTED\n" + errors.join("\n"));
      process.exitCode = 2;
    } else {
      console.log("DOCUMENTARY SHAPE CHECK COMPLETE — INDEPENDENT HOST/EVIDENCE VERIFICATION STILL REQUIRED");
    }
  } catch {
    console.error("BLOCKED: invalid evidence report");
    process.exitCode = 2;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
