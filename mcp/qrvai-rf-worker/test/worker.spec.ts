import { describe, expect, it } from "vitest";
import { exports } from "cloudflare:workers";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

describe("actual workerd stateless MCP runtime",()=>{
  it("handles the one RF conversion through Worker fetch", async()=>{
    const transport=new StreamableHTTPClientTransport(new URL("https://qrvai.test/mcp"),{
      fetch: (url,init)=>exports.default.fetch(new Request(url,init))
    });
    const client=new Client({name:"workers-runtime-test",version:"0.1.0"},{versionNegotiation:{mode:"auto"}});
    try {
      await client.connect(transport);
      const list=await client.listTools();
      expect(list.tools.map(t=>t.name)).toEqual(["rf_power_convert"]);
      const result=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
      expect((result.structuredContent as {dBm:number}).dBm).toBe(50);
    } finally {await client.close();}
  });
  it("unknown path is 404", async()=>{
    const response=await exports.default.fetch("https://qrvai.test/not-found");
    expect(response.status).toBe(404);
  });
});
