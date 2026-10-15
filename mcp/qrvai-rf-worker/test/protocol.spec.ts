import { test } from "node:test";
import assert from "node:assert/strict";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
const secret="protocol-test-only-secure-token-123456789";
const names=["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss"];
async function fetchMcp(url: URL|string, init: RequestInit): Promise<Response> {
  const {default:handler}=await import("../api/mcp.ts");
  const request=new Request(url,init);
  request.headers.set("authorization","Bearer "+secret);
  return handler(request,secret);
}
test("Vercel exposes stateless modern MCP over /api/mcp",async()=>{
  const transport=new StreamableHTTPClientTransport(new URL("https://test.local/api/mcp"),{fetch:fetchMcp});
  const client=new Client({name:"qrvai-vercel-protocol",version:"0.1.0"},{versionNegotiation:{mode:"auto"}});
  try {
    await client.connect(transport);
    const list=await client.listTools();
    assert.deepEqual(list.tools.map(x=>x.name),names);
    const good=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
    assert.equal((good.structuredContent as {dBm:number}).dBm,50);
    const again=await client.callTool({name:"rf_power_convert",arguments:{value:1,unit:"mW"}});
    assert.equal((again.structuredContent as {dBm:number}).dBm,0);
  } finally {await client.close();}
});
test("unknown Vercel route returns 404",async()=>{
  const response=await fetchMcp("https://test.local/unknown",{method:"POST",body:"{}",headers:{"content-type":"application/json"}});
  assert.equal(response.status,404);
});
test("successful MCP responses never enable wildcard browser CORS",async()=>{
  const values:(string|null)[]=[];
  const transport=new StreamableHTTPClientTransport(new URL("https://test.local/api/mcp"),{
    fetch:async(url,init)=>{
      const response=await fetchMcp(url,init);
      values.push(response.headers.get("access-control-allow-origin"));
      return response;
    }
  });
  const client=new Client({name:"qrvai-cors-test",version:"0.1.0"});
  try{await client.connect(transport);await client.listTools();assert.ok(values.length>0);assert.ok(values.every(x=>x!=="*"));}finally{await client.close();}
});
test("MCP refuses hostile browser Origins while allowing origin-less clients",async()=>{
  const body=JSON.stringify({jsonrpc:"2.0",id:1,method:"initialize",params:{protocolVersion:"2025-06-18",capabilities:{},clientInfo:{name:"browser-threat-test",version:"0.1.0"}}});
  for(const origin of ["https://attacker.example","null","file://example"]){
    const response=await fetchMcp("https://test.local/api/mcp",{method:"POST",headers:{"content-type":"application/json",accept:"application/json, text/event-stream",origin},body});
    assert.equal(response.status,403,origin);
  }
});
