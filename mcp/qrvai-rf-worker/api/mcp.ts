import { timingSafeEqual } from "node:crypto";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server";
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
/**
 * Owner decision (2026-11-14): the first release is PUBLIC and unauthenticated.
 * Every registered tool is a stateless, read-only function of its own request body:
 * nothing is stored, no account or device is reached, so there is nothing private to protect yet.
 * Set this to false when the authentication phase starts; the endpoint then fails closed (503)
 * until QRVAI_MCP_BEARER_TOKEN is configured.
 */
export const PUBLIC_UNAUTHENTICATED = true;

/**
 * Stateless Streamable HTTP. A configured QRVAI_MCP_BEARER_TOKEN is always enforced;
 * with no token the endpoint is public only while `allowPublic` is true.
 */
export async function handleMcpRequest(
  request: Request,
  secret: string | undefined = process.env.QRVAI_MCP_BEARER_TOKEN,
  allowPublic: boolean = PUBLIC_UNAUTHENTICATED
): Promise<Response> {
  if (secret) {
    // A token that is present but weak is a misconfiguration, never a reason to fall back to public.
    if (secret.length<24) return deny(503,"MCP authentication not configured");
    if (!authorized(request.headers.get("authorization"),secret)) {
      return new Response("Unauthorized",{status:401,headers:{...noStore,"www-authenticate":"Bearer"}});
    }
  } else if (!allowPublic) {
    return deny(503,"MCP authentication not configured");
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

/** Vercel Web Standard Function contract; unlike the legacy Node handler it receives Request. */
export default {
  fetch(request: Request): Promise<Response> {
    return handleMcpRequest(request);
  }
};
