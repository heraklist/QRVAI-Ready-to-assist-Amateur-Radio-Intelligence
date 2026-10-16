import {createServer} from "./register.ts";
import {authorizeToolCall,authorizeToolList,type Principal} from "../http/authz-policy.ts";
import {IMPLEMENTED_TOOLS} from "../rf/wave1.ts";

/** Uses public registerTool API, with explicit per-principal registration and no SDK private registry access.
 * Called only with an independently verified principal from a trusted server boundary.
 * Deliberately not connected to deployed Bearer MCP entrypoint yet.
 */
export function createAuthorizedServer(principal:Principal|null){
 const names=IMPLEMENTED_TOOLS.map(tool=>tool.name);
 const allowed=new Set(authorizeToolList(principal,names));
 return createServer(name=>allowed.has(name)&&authorizeToolCall(principal,name));
}
