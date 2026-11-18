import {createOAuthPilotPrincipalVerifier} from "./oauth-principal.ts";
import {createSupabaseGrantReader} from "./supabase-grants.ts";
import {handleVerifiedMcpRequest} from "./verified-mcp.ts";

/**
 * QRVAI P0: fully composed, server-only OAuth *pilot* request path.
 *
 * NOT exported by any deployed /api route. Source-level release gates remain
 * OAUTH_MCP_HTTP_WIRED=false and PUBLIC_UNAUTHENTICATED=false.
 * No environment flag may enable this module. The host, real RFC 8707
 * resource-bound tokens, client registration, grants schema and quotas must
 * pass separate release gates before mounting it.
 */
export const QRVAI_PILOT_PROJECT_URL="https://ujhkqfvxpgpkearukvmh.supabase.co";
export const QRVAI_PILOT_ISSUER=QRVAI_PILOT_PROJECT_URL+"/auth/v1";
export const QRVAI_PILOT_RESOURCE="https://qrvai-rf-mcp.vercel.app/api/mcp";
const jwksUrl=QRVAI_PILOT_ISSUER+"/.well-known/jwks.json";

export type SupabaseOAuthPilotOptions=Readonly<{
 /** Must be the exact trusted Supabase issuer, never an arbitrary IdP. */
 issuer:string;
 /** Must be the exact canonical, HTTPS MCP resource, never a preview URL. */
 resource:string;
 /** A backend-only sb_secret_* grant-reader key. No browser or anonymous key. */
 grantStoreSecretKey:string;
 /** Injection solely for isolated unit tests, not browser configuration. */
 fetchJwks?:typeof fetch;
 fetchGrants?:typeof fetch;
 nowSeconds?:number;
}>;

/**
 * Composes existing ES256 JWT validation + exact resource audience + signed
 * client_id + a fresh per-request server-owned grant lookup + scoped SDK tools.
 * Failure of any dependency returns a WWW-Authenticate 401 (no shared Bearer
 * or public fallback); host aliases are denied before JWKS/grants are read.
 */
export function createSupabaseOAuthPilotHandler(options:SupabaseOAuthPilotOptions):(request:Request)=>Promise<Response>{
 if(options.issuer!==QRVAI_PILOT_ISSUER||options.resource!==QRVAI_PILOT_RESOURCE){
  throw new Error("OAuth pilot issuer/resource must match pinned QRVAI project and canonical MCP URL");
 }
 const grantReader=createSupabaseGrantReader({
  projectUrl:QRVAI_PILOT_PROJECT_URL,
  secretKey:options.grantStoreSecretKey,
  ...(options.fetchGrants?{fetchImpl:options.fetchGrants}:{})
 });
 const verify=createOAuthPilotPrincipalVerifier({
  issuer:QRVAI_PILOT_ISSUER,
  audience:QRVAI_PILOT_RESOURCE,
  jwksUrl,
  requiredScope:"openid",
  allowMissingScopeClaimOnClientBoundToken:true,
  acceptedAlgorithm:"ES256",
  ...(options.fetchJwks?{fetchJwks:options.fetchJwks}:{}),
  ...(options.nowSeconds!==undefined?{nowSeconds:options.nowSeconds}:{})
 },grantReader);
 const config={issuer:QRVAI_PILOT_ISSUER,audience:QRVAI_PILOT_RESOURCE};
 return (request:Request)=>handleVerifiedMcpRequest(request,verify,config);
}
