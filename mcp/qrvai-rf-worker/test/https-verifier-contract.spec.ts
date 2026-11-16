import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Client, InMemoryTransport} from "@modelcontextprotocol/client";
import {createServer} from "../src/mcp/register.ts";

/**
 * Regression for V1 HTTPS acceptance: the CLI must not reject an otherwise
 * valid deployment because its advertised count lags real SDK registration.
 * No HTTP calls, credentials, deployments or live provider requests.
 */
test("HTTPS acceptance expected count equals real local MCP SDK tools/list", async () => {
  const verifier=readFileSync(new URL("../scripts/verify-https.mjs",import.meta.url),"utf8");
  const declared=verifier.match(/const EXPECTED_TOOL_COUNT\s*=\s*(\d+);/);
  assert.ok(declared,"HTTPS verifier must declare an audited expected count");

  const [clientSide,serverSide]=InMemoryTransport.createLinkedPair();
  const server=createServer();
  const client=new Client({name:"https-acceptance-inventory-contract",version:"1.0.0"});
  try {
    await server.connect(serverSide);
    await client.connect(clientSide);
    const names=(await client.listTools()).tools.map(t=>t.name);
    assert.equal(new Set(names).size,names.length,"SDK registration cannot advertise duplicates");
    assert.equal(Number(declared[1]),names.length,
      `HTTPS acceptance expects ${declared[1]} tools but SDK registers ${names.length}`);
  } finally {
    await client.close();
    await server.close();
  }
});
