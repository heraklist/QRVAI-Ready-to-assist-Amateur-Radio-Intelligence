import { createMcpHandler } from "agents/mcp/server";
import { createServer } from "./mcp/register.ts";
import { limitMcpRequest } from "./http/limits.ts";

/** Stateless Streamable HTTP Worker. No persistence, credentials or device control. */
export default {
  async fetch(request: Request, env: Record<string, never>, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/mcp") {
      return new Response("Not found", {status: 404, headers: {"content-type": "text/plain"}});
    }
    const checked = await limitMcpRequest(request);
    if (checked instanceof Response) return checked;
    // No browser integration in the first private-plugin slice; do not advertise wildcard CORS.
    return createMcpHandler(createServer, { corsOptions: false })(checked, env, ctx as never);
  }
};
