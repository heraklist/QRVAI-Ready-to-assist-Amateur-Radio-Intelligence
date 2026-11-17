/**
 * Read-only issuer DISCOVERY gate; NOT a resource-indicator conformance test.
 * Never accept successful RFC 8414 discovery as evidence of RFC 8707 token binding.
 */
export const QRVAI_SUPABASE_ISSUER="https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1";
export const QRVAI_DISCOVERY_URL="https://ujhkqfvxpgpkearukvmh.supabase.co/.well-known/oauth-authorization-server/auth/v1";

const isRecord=(v:unknown):v is Record<string,unknown>=>typeof v==="object"&&v!==null&&!Array.isArray(v);
const includes=(value:unknown,member:string):boolean=>Array.isArray(value)&&value.every(x=>typeof x==="string")&&value.includes(member);

export type OAuthIssuerDiscoveryAudit=Readonly<{
 discovery:"PASS"|"FAIL";
 checks:Readonly<{
  exactIssuer:boolean;
  canonicalAuthorizationEndpoint:boolean;
  canonicalTokenEndpoint:boolean;
  canonicalJwksEndpoint:boolean;
  authorizationCode:boolean;
  pkceS256:boolean;
  authorizationCodeGrant:boolean;
 }>;
 resourceParameterToAudience:"NOT_EXECUTED";
 issuedTokenSignature:"NOT_EXECUTED";
 signedClientBinding:"NOT_EXECUTED";
 chatgptOAuthHost:"NOT_EXECUTED";
 productionOAuthReady:false;
}>;
/** Strict, project-pinned OAuth AS metadata checks. No arbitrary issuer or URL fallback. */
export function auditQrvaiIssuerDiscovery(metadata:unknown):OAuthIssuerDiscoveryAudit{
 const value=isRecord(metadata)?metadata:{};
 const checks={
  exactIssuer:value.issuer===QRVAI_SUPABASE_ISSUER,
  canonicalAuthorizationEndpoint:value.authorization_endpoint===QRVAI_SUPABASE_ISSUER+"/oauth/authorize",
  canonicalTokenEndpoint:value.token_endpoint===QRVAI_SUPABASE_ISSUER+"/oauth/token",
  canonicalJwksEndpoint:value.jwks_uri===QRVAI_SUPABASE_ISSUER+"/.well-known/jwks.json",
  authorizationCode:includes(value.response_types_supported,"code"),
  pkceS256:includes(value.code_challenge_methods_supported,"S256"),
  authorizationCodeGrant:includes(value.grant_types_supported,"authorization_code")
 };
 return {
  discovery:Object.values(checks).every(Boolean)?"PASS":"FAIL",
  checks,
  // No AS metadata field proves it processed resource at authorize AND token
  // and minted a signed audience-specific token for the same MCP resource.
  resourceParameterToAudience:"NOT_EXECUTED",
  issuedTokenSignature:"NOT_EXECUTED",
  signedClientBinding:"NOT_EXECUTED",
  chatgptOAuthHost:"NOT_EXECUTED",
  productionOAuthReady:false
 };
}
