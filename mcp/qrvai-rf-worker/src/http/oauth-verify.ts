import {createPublicKey,verify as verifySignature,type KeyObject} from "node:crypto";

export type OAuthVerifierSettings={
  issuer:string;
  audience:string;
  requiredScope:string;
  /** Only for issuer-signed, client-bound Supabase OAuth access tokens that omit a JWT scope claim. */
  allowMissingScopeClaimOnClientBoundToken?:boolean;
  jwksUrl:string;
  /** Asymmetric JWT algorithm must be explicitly pinned. Legacy RS256 is the default; Supabase ES256 is opt-in. */
  acceptedAlgorithm?:"RS256"|"ES256";
  fetchJwks?:typeof fetch;
  nowSeconds?:number;
};

type JwtHeader={alg?:unknown;kid?:unknown;crit?:unknown};
type JwtClaims={iss?:unknown;aud?:unknown;exp?:unknown;nbf?:unknown;scope?:unknown;scp?:unknown;sub?:unknown;client_id?:unknown};
type Jwk={kty?:string;crv?:string;use?:string;key_ops?:string[];alg?:string;kid?:string;[key:string]:unknown};
const reject=(reason:string):never=>{throw new Error("OAuth access token rejected: "+reason);};
const decode=(segment:string):Record<string,unknown>=>{
  if(!/^[A-Za-z0-9_-]+$/.test(segment))return reject("invalid JWT encoding");
  const bytes=Buffer.from(segment,"base64url");
  if(bytes.toString("base64url")!==segment)return reject("invalid JWT encoding");
  try{
    const value:unknown=JSON.parse(bytes.toString("utf8"));
    if(!value||typeof value!=="object"||Array.isArray(value))return reject("invalid JWT object");
    return value as Record<string,unknown>;
  }catch{return reject("invalid JWT object");}
};
function httpsUrl(value:string,reason:string):URL{
  let url:URL;
  try{url=new URL(value);}catch{return reject(reason);}
  if(url.protocol!=="https:"||!url.hostname||url.username||url.password||url.search||url.hash||(url.href!==value&&!(url.pathname==="/"&&url.origin===value)))return reject(reason);
  return url;
}
/**
 * Opt-in cryptographic primitive, not an MCP authorization decision.
 * Standard Supabase scopes cannot grant QRVAI internal permissions; a separate
 * server-owned identity/client grant and resource-binding check are required.
 * The deployed /api/mcp endpoint remains on its separate shared-Bearer gate.
 */
async function validateToken(token:string,settings:OAuthVerifierSettings,requireClientId:boolean):Promise<{subject:string;scopes:string[];clientId:string|null}>{
  const issuer=httpsUrl(settings.issuer,"issuer HTTPS configuration required");
  httpsUrl(settings.audience,"audience HTTPS configuration required");
  if(!settings.requiredScope)return reject("required scope configuration missing");
  const algorithm=settings.acceptedAlgorithm??"RS256";
  if(algorithm!=="RS256"&&algorithm!=="ES256")return reject("unsupported verifier algorithm configuration");
  const jwksUrl=httpsUrl(settings.jwksUrl,"JWKS HTTPS endpoint required");
  if(jwksUrl.origin!==issuer.origin)return reject("JWKS issuer origin mismatch");
  const pieces=token.split(".");
  if(pieces.length!==3||pieces.some(p=>!p))return reject("malformed JWT");
  const header=decode(pieces[0]) as JwtHeader;
  const claims=decode(pieces[1]) as JwtClaims;
  if(header.alg!==algorithm||typeof header.kid!=="string"||!header.kid||header.crit!==undefined)return reject("unsupported JWT algorithm or kid");
  if(claims.iss!==settings.issuer)return reject("issuer mismatch");
  const audiences=Array.isArray(claims.aud)?claims.aud:[claims.aud];
  if(audiences.length!==1||audiences[0]!==settings.audience)return reject("audience mismatch");
  const now=settings.nowSeconds??Math.floor(Date.now()/1000);
  if(typeof claims.exp!=="number"||!Number.isInteger(claims.exp)||claims.exp<=now)return reject("expired token");
  if(claims.nbf!==undefined&&(typeof claims.nbf!=="number"||claims.nbf>now))return reject("token not active");
  if(typeof claims.sub!=="string"||!claims.sub)return reject("subject missing");
  // The client identifier is an issuer-signed JWT claim, never a request parameter.
  if(requireClientId&&(typeof claims.client_id!=="string"||!/^[-A-Za-z0-9._:]{1,256}$/.test(claims.client_id)))return reject("OAuth client identity missing");
  const scopes=typeof claims.scope==="string"?claims.scope.split(/\s+/).filter(Boolean):Array.isArray(claims.scp)&&claims.scp.every(s=>typeof s==="string")?claims.scp as string[]:[];
  // Supabase returns the granted OIDC scope at its token endpoint, but its
  // documented access JWT can omit scope/scp. This narrow exception applies
  // ONLY to a strictly signed client_id flow with an independent grant store.
  // Tokens that expressly contain a wrong/malformed scope still fail closed.
  const noScopeClaim=claims.scope===undefined&&claims.scp===undefined;
  if(!scopes.includes(settings.requiredScope)&&!(
    requireClientId===true&&settings.allowMissingScopeClaimOnClientBoundToken===true&&noScopeClaim
  ))return reject("insufficient scope");
  const response=await (settings.fetchJwks??fetch)(jwksUrl,{method:"GET",headers:{accept:"application/json"},redirect:"error",signal:AbortSignal.timeout(3000)});
  if(!response.ok)return reject("JWKS retrieval failed");
  const doc:unknown=await response.json();
  if(!doc||typeof doc!=="object"||!("keys" in doc)||!Array.isArray(doc.keys))return reject("invalid JWKS");
  const keys=doc.keys as Jwk[];
  const matches=keys.filter(k=>
    k.kid===header.kid&&
    k.kty===(algorithm==="ES256"?"EC":"RSA")&&
    (algorithm!=="ES256"||k.crv==="P-256")&&
    (k.use===undefined||k.use==="sig")&&
    (k.alg===undefined||k.alg===algorithm)&&
    (k.key_ops===undefined||k.key_ops.includes("verify"))
  );
  if(matches.length!==1)return reject("JWT signing key mismatch");
  let key:KeyObject;
  try{key=createPublicKey({key:matches[0] as import("node:crypto").JsonWebKey,format:"jwk"});}catch{return reject("invalid JWKS signing key");}
  const signature=Buffer.from(pieces[2],"base64url");
  if(signature.toString("base64url")!==pieces[2]||(algorithm==="ES256"&&signature.length!==64))return reject("invalid JWT signature encoding");
  const valid=algorithm==="ES256"
    ?verifySignature("sha256",Buffer.from(pieces[0]+"."+pieces[1]),{key,dsaEncoding:"ieee-p1363"},signature)
    :verifySignature("RSA-SHA256",Buffer.from(pieces[0]+"."+pieces[1]),key,signature);
  if(!valid)return reject("invalid JWT signature");
  return {subject:claims.sub,scopes,clientId:typeof claims.client_id==="string"?claims.client_id:null};
}
/** Backwards-compatible cryptographic primitive. No internal QRVAI grants are inferred here. */
export async function validateOAuthAccessToken(token:string,settings:OAuthVerifierSettings):Promise<{subject:string;scopes:string[]}>{
 const {subject,scopes}=await validateToken(token,settings,false);
 return {subject,scopes};
}
/** OAuth client binding must use the signed client_id of the exact resource-audience token.
 * An OAuth login without an explicit signed client identifier is insufficient for grants.
 */
export async function validateOAuthAccessTokenWithClient(token:string,settings:OAuthVerifierSettings):Promise<{subject:string;scopes:string[];clientId:string}>{
 const verified=await validateToken(token,settings,true);
 if(!verified.clientId)return reject("OAuth client identity missing");
 return {subject:verified.subject,scopes:verified.scopes,clientId:verified.clientId};
}
