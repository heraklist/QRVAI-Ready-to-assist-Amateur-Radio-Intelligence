import {createServer} from "./register.ts";
import {authorizeToolCall,authorizeToolList,type Principal} from "../http/authz-policy.ts";
import {IMPLEMENTED_TOOLS} from "../rf/wave1.ts";

/**
 * Restricted MCP server registry. Registers only authorized tools per verified principal.
 * This is a testable adapter seam, intentionally not wired into the bearer-token HTTP entrypoint.
 */
export function createAuthorizedServer(principal:Principal|null){
 const server=createServer();
 const allowed=new Set(authorizeToolList(principal,IMPLEMENTED_TOOLS.map(tool=>tool.name)));
 // The existing register implementation eagerly registers all handlers. SDK's tool
 // registry is private: avoid mutating it; use supported disable() on registered handles.
 // Only deployment code that has verified an identity may invoke this helper.
 const internal=server as unknown as {_registeredTools?:Record<string,{disable?:()=>void}>};
 if(!internal._registeredTools)throw new Error("MCP SDK tool registry unavailable; deny all");
 for(const [name,handler] of Object.entries(internal._registeredTools)){
  if(!allowed.has(name)||!authorizeToolCall(principal,name))handler.disable?.();
 }
 return server;
}
