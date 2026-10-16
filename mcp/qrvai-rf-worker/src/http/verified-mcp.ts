import {WebStandardStreamableHTTPServerTransport} from "@modelcontextprotocol/server";
import {createAuthorizedServer} from "../mcp/scoped-server.ts";
import type {Principal} from "./authz-policy.ts";
import {limitMcpRequest} from "./limits.ts";

/** Trusted verifier is responsible for signature, expiration, nbf, issuer, audience, key rotation,
 * revocation policy and scope provenance. No verifier is supplied to the Vercel endpoint.
 */
export type VerifiedPrincipal=Principal&{issuer:string;audience:string};
export type VerifyBearer=(rawToken:string)=>Promise<VerifiedPrincipal|null>;
export type VerifiedMcpConfig={issuer:string;audience:string};
const headers={"cache-control":"no-store"};
const deny=(status:number,reason:string)=>new Response(reason,{status,headers:{"content-type":"text/plain; charset=utf-8",...headers}});
/** Deliberate non-wired seam: never interpret unverified JWT payload as trusted claims. */
export async function handleVerifiedMcpRequest(request:Request,verify:VerifyBearer,config:VerifiedMcpConfig):Promise<Response>{
 const raw=request.headers.get("authorization");
 if(!raw?.startsWith("Bearer ")||!raw.slice(7).trim())return new Response("Unauthorized",{status:401,headers:{"www-authenticate":"Bearer",...headers}});
 const url=new URL(request.url);
 if(url.pathname!=="/api/mcp")return deny(404,"Not found");
 const origin=request.headers.get("origin");
 if(origin!==null&&origin!==url.origin)return deny(403,"Invalid Origin");
 if(request.method!=="POST")return deny(405,"Method not allowed");
 if(!config.issuer||!config.audience||!config.issuer.startsWith("https://")||!config.audience.startsWith("https://"))return deny(503,"OAuth verifier not configured");
 const token=raw.slice(7);
 let principal:VerifiedPrincipal|null=null;
 try{principal=await verify(token);}catch{return new Response("Unauthorized",{status:401,headers:{"www-authenticate":"Bearer",...headers}});}
 if(!principal||principal.issuer!==config.issuer||principal.audience!==config.audience||!principal.subject||!principal.tenantId||!Array.isArray(principal.scopes)){
  return new Response("Unauthorized",{status:401,headers:{"www-authenticate":"Bearer",...headers}});
 }
 if(!principal.scopes.some(s=>["qrvai:tools:read","qrvai:user-data:process"].includes(s)))return deny(403,"No authorized MCP tools");
 const checked=await limitMcpRequest(request);
 if(checked instanceof Response)return checked;
 const server=createAuthorizedServer(principal);
 const transport=new WebStandardStreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
 try{await server.connect(transport);return await transport.handleRequest(checked);}finally{await server.close();}
}
