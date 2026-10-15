import { test } from "node:test";
import assert from "node:assert/strict";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

test("Cloudflare Worker exposes real stateless modern MCP over /mcp", async () => {
  const { default: worker } = await import("../src/index.ts");
  const received: string[]=[];
  const transport = new StreamableHTTPClientTransport(new URL("https://test.local/mcp"),{
    fetch: async (url, init)=>{
      const request=new Request(url,init);
      received.push(request.method+" "+new URL(request.url).pathname);
      return worker.fetch(request,{},{} as never);
    }
  });
  const client = new Client({name:"qrvai-worker-test",version:"0.1.0"},{versionNegotiation:{mode:"auto"}});
  try {
    await client.connect(transport);
    const tools=await client.listTools();
    assert.deepEqual(tools.tools.map(x=>x.name),["rf_power_convert","rf_link_budget"]);
    const good=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
    assert.equal((good.structuredContent as {dBm:number}).dBm,50);
    const again=await client.callTool({name:"rf_power_convert",arguments:{value:1,unit:"mW"}});
    assert.equal((again.structuredContent as {dBm:number}).dBm,0);
    assert.ok(received.some(x=>x.endsWith("/mcp")));
  } finally { await client.close(); }
});
test("unknown Worker route returns 404",async()=>{
  const {default:worker}=await import("../src/index.ts");
  const response=await worker.fetch(new Request("https://test.local/unknown"),{},{} as never);
  assert.equal(response.status,404);
});


test("review: successful MCP responses never enable wildcard browser CORS", async () => {
  const {default:worker} = await import("../src/index.ts");
  const cors: Array<string|null> = [];
  const transport = new StreamableHTTPClientTransport(new URL("https://qrvai.test/mcp"),{
    fetch: async (url,init) => {
      const result = await worker.fetch(new Request(url,init),{},{} as never);
      cors.push(result.headers.get("access-control-allow-origin"));
      return result;
    }
  });
  const client = new Client({name:"review-cors-test",version:"0.1.0"},{versionNegotiation:{mode:"auto"}});
  try {
    await client.connect(transport);
    const list = await client.listTools();
    assert.deepEqual(list.tools.map(t=>t.name),["rf_power_convert","rf_link_budget"]);
    assert.ok(cors.length>0);
    assert.ok(cors.every(header=>header!=="*"),"MCP handler must not allow arbitrary browser origins");
  } finally { await client.close(); }
});


test("review: MCP SDK refuses hostile browser Origins while allowing origin-less clients", async () => {
  const { default:worker } = await import("../src/index.ts");
  const envelope=JSON.stringify({
    jsonrpc:"2.0",id:1,method:"initialize",
    params:{protocolVersion:"2025-06-18",capabilities:{},clientInfo:{name:"browser-threat-test",version:"0.1.0"}}
  });
  for (const hostileOrigin of ["https://attacker.example", "null", "file://example"]) {
    const result=await worker.fetch(new Request("https://qrvai.test/mcp",{
      method:"POST",
      headers:{
        "content-type":"application/json",
        accept:"application/json, text/event-stream",
        origin:hostileOrigin
      },
      body:envelope
    }),{},{} as never);
    assert.equal(result.status,403,"Origin must be rejected: "+hostileOrigin);
  }
});
