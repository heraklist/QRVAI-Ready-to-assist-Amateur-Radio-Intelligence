import { test } from "node:test";
import assert from "node:assert/strict";

test("a real SDK v2 server exposes three RF calculators and returns 50 dBm", async () => {
  const { createServer } = await import("../src/mcp/register.ts");
  const { Client, InMemoryTransport } = await import("@modelcontextprotocol/client");
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer();
  const client = new Client({name: "qrvai-native-tests",version:"0.1.0"});
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const result=await client.listTools();
    assert.deepEqual(result.tools.map(t=>t.name),["rf_power_convert","rf_link_budget","rf_impedance"]);
    assert.ok(result.tools[0]?.annotations?.readOnlyHint);
    const good=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
    assert.notEqual(good.isError,true);
    assert.equal((good.structuredContent as {dBm:number}).dBm,50);
    assert.match(JSON.stringify(good.content),/50/);
    const budget=await client.callTool({name:"rf_link_budget",arguments:{tx_w:100,tx_gain_dbi:2,tx_loss_db:1,path_loss_db:100,rx_gain_dbi:3,rx_loss_db:1,rx_sensitivity_dbm:-105}});
    assert.equal((budget.structuredContent as {rx_dbm:number;margin_db:number}).rx_dbm,-47);
    assert.equal((budget.structuredContent as {rx_dbm:number;margin_db:number}).margin_db,58);
    const impedance=await client.callTool({name:"rf_impedance",arguments:{r_ohm:100,x_ohm:0,z0_ohm:50}});
    assert.ok(Math.abs((impedance.structuredContent as {vswr:number}).vswr - 2) < 1e-12);
    const bad=await client.callTool({name:"rf_power_convert",arguments:{value:0,unit:"W"}});
    assert.equal(bad.isError,true);
    const secret=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W",callsign:"PRIVATE"}});
    assert.equal(secret.isError,true);
  } finally {
    await client.close();
    await server.close();
  }
});
