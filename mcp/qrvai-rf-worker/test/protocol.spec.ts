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
    assert.deepEqual(tools.tools.map(x=>x.name),["rf_power_convert"]);
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
