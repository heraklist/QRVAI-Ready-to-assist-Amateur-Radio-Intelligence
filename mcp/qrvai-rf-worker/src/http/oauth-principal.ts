import {validateOAuthAccessTokenWithClient,type OAuthVerifierSettings} from "./oauth-verify.ts";
import type {VerifyBearer} from "./verified-mcp.ts";

/**
 * QRVAI internal permissions are NOT OIDC scopes. Supabase's openid/email/profile
 * neither imply QRVAI tool privileges nor grant cross-user station/log access.
 *
 * Private station/log permissions deliberately stay DISABLED in this adapter:
 * no durable server-owned tenant/resource ownership resolver exists yet.
 */
export type PilotPermission="qrvai:tools:read"|"qrvai:user-data:process";
const pilotPermissions=new Set<PilotPermission>(["qrvai:tools:read","qrvai:user-data:process"]);

export type GrantIdentity=Readonly<{issuer:string;subject:string;clientId:string}>;
/** Returned ONLY from a trusted server-side grant store (e.g. a protected, service-authenticated DB lookup).
 * Never populate this object from a token's user_metadata, HTTP params, callsign or any MCP tool arguments.
 */
export type ServerOwnedGrant=Readonly<{
 subject:string;
 clientId:string;
 tenantId:string;
 enabled:boolean;
 expiresAtSeconds:number;
 permissions:readonly string[];
}>;
export type ReadServerGrant=(identity:GrantIdentity)=>Promise<ServerOwnedGrant|null>;

const validId=(s:unknown)=>typeof s==="string"&&/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(s);

/** Compose signed token validation with independent, revocable, client-bound authorizations.
 * This function intentionally has NO default grant store or token-to-scope fallback.
 * No callers from /api/mcp exist until the RFC 8707 provider and deployment gates pass.
 */
export function createOAuthPilotPrincipalVerifier(settings:OAuthVerifierSettings,readGrant:ReadServerGrant):VerifyBearer{
 return async (token:string)=>{
  const identity=await validateOAuthAccessTokenWithClient(token,settings);
  const lookup:GrantIdentity={issuer:settings.issuer,subject:identity.subject,clientId:identity.clientId};
  const grant=await readGrant(lookup);
  const now=settings.nowSeconds??Math.floor(Date.now()/1000);
  if(!grant||grant.enabled!==true||grant.subject!==lookup.subject||grant.clientId!==lookup.clientId||
     !validId(grant.tenantId)||!Number.isSafeInteger(grant.expiresAtSeconds)||grant.expiresAtSeconds<=now||
     !Array.isArray(grant.permissions)||grant.permissions.length===0||
     !grant.permissions.every(p=>typeof p==="string"&&pilotPermissions.has(p as PilotPermission)))return null;
  const scopes=[...new Set(grant.permissions)] as PilotPermission[];
  // Token's OIDC scopes may authenticate, but can NEVER elevate the server's permissions.
  return {subject:lookup.subject,tenantId:grant.tenantId,scopes,issuer:settings.issuer,audience:settings.audience};
 };
}
