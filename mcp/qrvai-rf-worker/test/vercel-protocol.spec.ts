import { test } from "node:test";
import assert from "node:assert/strict";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

test("Vercel MCP API fails closed without configured authentication", async () => {
  const { default: handler } = await import("../api/mcp.ts");
  const response = await handler.fetch(new Request("https://qrvai.example/api/mcp", {method:"POST",headers:{"content-type":"application/json"},body:"{}"}));
  assert.equal(response.status,503);
});

test("Vercel MCP API rejects unauthorized requests when token is configured", async () => {
  const { handleMcpRequest } = await import("../api/mcp.ts");
  const response = await handleMcpRequest(new Request("https://qrvai.example/api/mcp", {method:"POST",headers:{"content-type":"application/json"},body:"{}"}), "qrvai-unit-test-token-not-for-deployment-123456");
  assert.equal(response.status,401);
});

test("Vercel MCP API exposes all four registered read-only RF tools through Streamable HTTP", async () => {
  const { handleMcpRequest } = await import("../api/mcp.ts");
  const transport = new StreamableHTTPClientTransport(new URL("https://qrvai.example/api/mcp"), {
    fetch: (url,init) => { const req=new Request(url,init); req.headers.set("authorization","Bearer qrvai-unit-test-token-not-for-deployment-123456"); return handleMcpRequest(req, "qrvai-unit-test-token-not-for-deployment-123456"); }
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

test("rejects credentials in URL query even when they match the bearer secret",async()=>{
 const {handleMcpRequest}=await import("../api/mcp.ts");
 const secret="qrvai-test-never-deploy-012345678901";
 const res=await handleMcpRequest(new Request("https://qrvai.example/api/mcp?access_token="+secret,{method:"POST",headers:{"content-type":"application/json"},body:"{}"}),secret);
 assert.equal(res.status,401);
});
test("rejects malformed or incorrect bearer credentials before body parsing",async()=>{
 const {handleMcpRequest}=await import("../api/mcp.ts");
 const secret="qrvai-test-never-deploy-012345678901";
 for(const authorization of ["Basic "+secret,"Bearer WRONG","Bearer "+secret+"a","Bearer "+secret+" extra"]){
  const res=await handleMcpRequest(new Request("https://qrvai.example/api/mcp",{method:"POST",headers:{"authorization":authorization.replace(/\n/g,""),"content-type":"application/json"},body:"{bad"}),secret);
  assert.equal(res.status,401);
 }
});
test("rejects hostile Origin, host mismatch and oversized bodies",async()=>{
 const {handleMcpRequest}=await import("../api/mcp.ts");
 const secret="qrvai-test-never-deploy-012345678901";
 const send=(headers:Record<string,string>,body="{}")=>handleMcpRequest(new Request("https://qrvai.example/api/mcp",{method:"POST",headers:{authorization:"Bearer "+secret,"content-type":"application/json",...headers},body}),secret);
 assert.equal((await send({origin:"https://evil.invalid"})).status,403);
 assert.equal((await send({host:"evil.invalid"})).status,403);
 assert.equal((await send({}, "a".repeat(65537))).status,413);
});
test("credentialed requests to non-MCP paths or non-POST verbs are denied",async()=>{
 const {handleMcpRequest}=await import("../api/mcp.ts");
 const secret="qrvai-test-never-deploy-012345678901";
 const headers={authorization:"Bearer "+secret};
 assert.equal((await handleMcpRequest(new Request("https://qrvai.example/other",{method:"POST",headers}),secret)).status,404);
 assert.equal((await handleMcpRequest(new Request("https://qrvai.example/api/mcp",{method:"GET",headers}),secret)).status,405);
});
