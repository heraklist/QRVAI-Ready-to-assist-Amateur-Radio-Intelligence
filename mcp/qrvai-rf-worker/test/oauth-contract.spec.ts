import { test } from "node:test";
import assert from "node:assert/strict";
import { validateOAuthConfiguration, authorizeScopedTool, buildProtectedResourceMetadata } from "../src/http/oauth-contract.ts";

const configuration = {
  issuer: "https://login.qrvai.example",
  resource: "https://qrvai.example/api/mcp",
  scopes: ["qrvai:tools:read", "qrvai:station:read"]
};

test("OAuth configuration must have a distinct secure issuer and resource URL", () => {
  assert.equal(validateOAuthConfiguration(configuration).issuer, configuration.issuer);
  for (const invalid of [
    { ...configuration, issuer: "http://login.qrvai.example" },
    { ...configuration, issuer: "https://login.qrvai.example/path?token=secret" },
    { ...configuration, resource: "https://qrvai.example/api/mcp?token=abc" },
    { ...configuration, resource: "https://qrvai.example/" },
    { ...configuration, scopes: [] }
  ]) assert.throws(() => validateOAuthConfiguration(invalid));
});

test("protected resource metadata binds issuer, exact resource and advertised scopes", () => {
  const metadata = buildProtectedResourceMetadata(configuration);
  assert.equal(metadata.resource, configuration.resource);
  assert.deepEqual(metadata.authorization_servers, [configuration.issuer]);
  assert.deepEqual(metadata.scopes_supported, configuration.scopes);
});

test("scoped tool access denies missing principal and insufficient or cross-tenant scopes", () => {
  assert.equal(authorizeScopedTool(undefined, "station_read_status", "tenant-1"), false);
  const principal = { subject: "user-1", tenant: "tenant-1", scopes: ["qrvai:tools:read"] };
  assert.equal(authorizeScopedTool(principal, "rf_power_convert"), true);
  assert.equal(authorizeScopedTool(principal, "station_read_status", "tenant-1"), false);
  assert.equal(authorizeScopedTool({ ...principal, scopes: ["qrvai:station:read"] }, "station_read_status", "tenant-2"), false);
  assert.equal(authorizeScopedTool({ ...principal, scopes: ["qrvai:station:read"] }, "station_read_status", "tenant-1"), true);
  assert.equal(authorizeScopedTool(principal, "unknown_tool"), false);
});
