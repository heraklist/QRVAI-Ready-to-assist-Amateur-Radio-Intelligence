import { test } from "node:test";
import assert from "node:assert/strict";

test("a real SDK v2 server exposes exactly one RF calculator and returns 50 dBm", async () => {
  const { createServer } = await import("../src/mcp/register.ts");
  const { Client, InMemoryTransport } = await import("@modelcontextprotocol/client");
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer();
  const client = new Client({name: "qrvai-native-tests",version:"0.1.0"});
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const result=await client.listTools();
    assert.deepEqual(result.tools.map(t=>t.name),["rf_power_convert"]);
    assert.ok(result.tools[0]?.annotations?.readOnlyHint);
    const good=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
    assert.equal(good.isError,undefined);
    assert.equal((good.structuredContent as {dBm:number}).dBm,50);
    assert.match(JSON.stringify(good.content),/50/);
    const bad=await client.callTool({name:"rf_power_convert",arguments:{value:0,unit:"W"}});
    assert.equal(bad.isError,true);
    const secret=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W",callsign:"PRIVATE"}});
    assert.equal(secret.isError,true);
  } finally {
    await client.close();
    await server.close();
  }
});
