import type {ReadServerGrant,ServerOwnedGrant} from "./oauth-principal.ts";

/** A purposely single-project, server-only adapter. No service key is available in
 * the browser; no authorization may fall back to public/anon or user credentials.
 * This is source-ready but NOT deployed until provider resource-binding passes.
 */
const projectUrl="https://ujhkqfvxpgpkearukvmh.supabase.co";
const projectIssuer=projectUrl+"/auth/v1";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Config={projectUrl:string;secretKey:string;fetchImpl?:typeof fetch};
const isObject=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==="object"&&!Array.isArray(v);

/** Read grants on EVERY verification, including revocation. No positive cache.
 * Use only a backend sb_secret_* key; it is sent in apikey, NOT as Bearer.
 * The proposed RLS/ACL migration grants service_role SELECT, never client SELECT.
 */
export function createSupabaseGrantReader(config:Config):ReadServerGrant{
 if(config.projectUrl!==projectUrl||!/^sb_secret_[A-Za-z0-9_-]{16,}$/.test(config.secretKey)){
  throw new Error("Private Supabase grant-store configuration invalid");
 }
 return async ({issuer,subject,clientId}):Promise<ServerOwnedGrant|null>=>{
  if(issuer!==projectIssuer||!uuid.test(subject)||!clientId||clientId.length>256)return null;
  const url=new URL("/rest/v1/qrvai_mcp_grants",projectUrl);
  url.searchParams.set("select","issuer,subject,client_id,tenant_id,enabled,expires_at,permissions");
  url.searchParams.set("issuer","eq."+issuer);
  url.searchParams.set("subject","eq."+subject);
  url.searchParams.set("client_id","eq."+clientId);
  url.searchParams.set("limit","2");
  const response=await (config.fetchImpl??fetch)(url,{
   method:"GET",headers:{"apikey":config.secretKey,"accept":"application/json"},
   redirect:"error",signal:AbortSignal.timeout(3000)
  });
  if(!response.ok)throw new Error("Private grant store unavailable");
  const results:unknown=await response.json();
  if(!Array.isArray(results)||results.length>1)throw new Error("Ambiguous private grant lookup");
  if(results.length===0)return null;
  const row:unknown=results[0];
  if(!isObject(row)||row.issuer!==issuer||row.subject!==subject||row.client_id!==clientId||
     typeof row.tenant_id!=="string"||!uuid.test(row.tenant_id)||
     typeof row.enabled!=="boolean"||typeof row.expires_at!=="string"||
     !Array.isArray(row.permissions)||!row.permissions.every(v=>typeof v==="string"))return null;
  const seconds=Date.parse(row.expires_at)/1000;
  if(!Number.isSafeInteger(seconds))return null;
  return {
   subject:row.subject,clientId:row.client_id,tenantId:row.tenant_id,
   enabled:row.enabled,expiresAtSeconds:seconds,permissions:row.permissions
  };
 };
}
