import { createMcpHandler } from "agents/mcp/server";
import { createServer } from "./mcp/register.ts";

/** Stateless Streamable HTTP Worker. No persistence, credentials or device control. */
export default {
  async fetch(request: Request, env: Record<string, never>, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/mcp") {
      return new Response("Not found", {status: 404, headers: {"content-type": "text/plain"}});
    }
    return createMcpHandler(createServer)(request, env, ctx as never);
  }
};
