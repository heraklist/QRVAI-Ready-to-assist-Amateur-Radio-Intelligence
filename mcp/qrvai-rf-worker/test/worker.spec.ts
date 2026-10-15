import { describe, expect, it } from "vitest";
import { exports } from "cloudflare:workers";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

describe("actual workerd stateless MCP runtime",()=>{
  it("handles the RF conversion and link budget through Worker fetch", async()=>{
    const transport=new StreamableHTTPClientTransport(new URL("https://qrvai.test/mcp"),{
      fetch: (url,init)=>exports.default.fetch(new Request(url,init))
    });
    const client=new Client({name:"workers-runtime-test",version:"0.1.0"},{versionNegotiation:{mode:"auto"}});
    try {
      await client.connect(transport);
      const list=await client.listTools();
      expect(list.tools.map(t=>t.name)).toEqual(["rf_power_convert","rf_link_budget","rf_impedance"]);
      const result=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
      expect((result.structuredContent as {dBm:number}).dBm).toBe(50);
      const budget = await client.callTool({name:"rf_link_budget",arguments:{tx_w:100,tx_gain_dbi:2,tx_loss_db:1,path_loss_db:100,rx_gain_dbi:3,rx_loss_db:1,rx_sensitivity_dbm:-105}});
      expect((budget.structuredContent as {rx_dbm:number}).rx_dbm).toBe(-47);
      const impedance = await client.callTool({name:"rf_impedance",arguments:{r_ohm:100,x_ohm:0,z0_ohm:50}});
      expect((impedance.structuredContent as {vswr:number}).vswr).toBe(2);
    } finally {await client.close();}
  });
  it("unknown path is 404", async()=>{
    const response=await exports.default.fetch("https://qrvai.test/not-found");
    expect(response.status).toBe(404);
  });
});
