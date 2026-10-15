import { timingSafeEqual } from "node:crypto";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server/webStandardStreamableHttp.js";
import { createServer } from "../src/mcp/register.ts";
import { limitMcpRequest } from "../src/http/limits.ts";

const noStore = { "cache-control": "no-store" };
function deny(status: number, detail: string): Response {
  return new Response(detail,{status,headers:{"content-type":"text/plain; charset=utf-8",...noStore}});
}
function authorized(authorization: string | null, secret: string): boolean {
  const prefix="Bearer ";
  if (!authorization?.startsWith(prefix)) return false;
  const received=Buffer.from(authorization.slice(prefix.length),"utf8");
  const expected=Buffer.from(secret,"utf8");
  return received.length===expected.length && timingSafeEqual(received,expected);
}
/** Stateless, per-request authenticated Streamable HTTP. Deployment requires QRVAI_MCP_BEARER_TOKEN. */
export default async function handler(
  request: Request,
  secret: string | undefined = process.env.QRVAI_MCP_BEARER_TOKEN
): Promise<Response> {
  if (!secret || secret.length<24) return deny(503,"MCP authentication not configured");
  if (!authorized(request.headers.get("authorization"),secret)) {
    return new Response("Unauthorized",{status:401,headers:{...noStore,"www-authenticate":"Bearer"}});
  }
  const url=new URL(request.url);
  if (url.pathname!=="/api/mcp") return deny(404,"Not found");
  const origin=request.headers.get("origin");
  if (origin!==null && origin!==url.origin) return deny(403,"Invalid Origin");
  if (request.method!=="POST") return deny(405,"Method not allowed");
  const checked=await limitMcpRequest(request);
  if (checked instanceof Response) return checked;
  const transport=new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator:undefined,
    enableJsonResponse:true
  });
  const server=createServer();
  try {
    await server.connect(transport);
    return await transport.handleRequest(checked);
  } finally {
    await server.close();
  }
}
