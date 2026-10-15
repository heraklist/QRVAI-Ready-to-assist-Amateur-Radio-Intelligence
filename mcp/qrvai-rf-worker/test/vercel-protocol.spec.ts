import { test } from "node:test";
import assert from "node:assert/strict";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

test("Vercel MCP API fails closed without configured authentication", async () => {
  const { default: handler } = await import("../api/mcp.ts");
  const response = await handler.fetch(new Request("https://qrvai.example/api/mcp", {method:"POST",headers:{"content-type":"application/json"},body:"{}"}));
  assert.equal(response.status,503);
});

test("Vercel MCP API rejects unauthorized requests when token is configured", async () => {
  const { default: handler } = await import("../api/mcp.ts");
  const response = await handler.fetch(new Request("https://qrvai.example/api/mcp", {method:"POST",headers:{"content-type":"application/json"},body:"{}"}), "qrvai-unit-test-token-not-for-deployment-123456");
  assert.equal(response.status,401);
});

test("Vercel MCP API exposes all four registered read-only RF tools through Streamable HTTP", async () => {
  const { default: handler } = await import("../api/mcp.ts");
  const transport = new StreamableHTTPClientTransport(new URL("https://qrvai.example/api/mcp"), {
    fetch: (url,init) => { const req=new Request(url,init); req.headers.set("authorization","Bearer qrvai-unit-test-token-not-for-deployment-123456"); return handler.fetch(req, "qrvai-unit-test-token-not-for-deployment-123456"); }
  });
  const client = new Client({name:"qrvai-vercel-test",version:"0.1.0"});
  try {
    await client.connect(transport);
    const list=await client.listTools();
    assert.deepEqual(list.tools.map(t=>t.name),["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss"]);
    const power=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
    assert.equal((power.structuredContent as {dBm:number}).dBm,50);
    const line=await client.callTool({name:"rf_feedline_loss",arguments:{profile:{id:"synthetic-coax",revision:"fixture-1",points:[{frequency_hz:10_000_000,loss_db_per_100m:4},{frequency_hz:1_000_000_000,loss_db_per_100m:8}]},frequency_hz:100_000_000,length_m:20,connector_loss_db:0.5,interpolation_method:"log_frequency"}});
    assert.ok(Math.abs((line.structuredContent as {attenuation_db:number}).attenuation_db-1.7)<1e-12);
  } finally {await client.close();}
});
