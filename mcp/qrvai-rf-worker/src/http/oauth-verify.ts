import { createPublicKey, verify as verifySignature, type KeyObject } from "node:crypto";

export type OAuthVerifierSettings={
  issuer:string;
  audience:string;
  requiredScope:string;
  jwksUrl:string;
  fetchJwks?:typeof fetch;
  nowSeconds?:number;
};

type JwtHeader={alg?:unknown;kid?:unknown;typ?:unknown};
type JwtClaims={iss?:unknown;aud?:unknown;exp?:unknown;nbf?:unknown;scope?:unknown;scp?:unknown;sub?:unknown};
type Jwk={kty?:string;use?:string;key_ops?:string[];alg?:string;kid?:string;[key:string]:unknown};

const reject=(message:string):never=>{throw new Error("OAuth access token rejected: "+message);};
const decode=(segment:string):Record<string,unknown>=>{
  if(!/^[A-Za-z0-9_-]+$/.test(segment)) return reject("invalid JWT encoding");
  const bytes=Buffer.from(segment,"base64url");
  if(bytes.toString("base64url")!==segment) return reject("invalid JWT encoding");
  try {
    const value:unknown=JSON.parse(bytes.toString("utf8"));
    if(!value||typeof value!=="object"||Array.isArray(value))return reject("invalid JWT object");
    return value as Record<string,unknown>;
  }catch {return reject("invalid JWT object");}
};

/** Purely opt-in verifier: existing shared-secret MCP adapter is unchanged until issuer onboarding is approved. */
export async function validateOAuthAccessToken(token:string,settings:OAuthVerifierSettings):Promise<{subject:string;scopes:string[]}>{
  if(!settings.issuer||!/^https:\/\/[^/?#]+/.test(settings.issuer))return reject("issuer HTTPS configuration required");
  if(!settings.audience||!/^https:\/\/[^/?#]+/.test(settings.audience))return reject("audience HTTPS configuration required");
  if(!settings.requiredScope)return reject("required scope configuration missing");
  let jwksUrl:URL;
  try{jwksUrl=new URL(settings.jwksUrl);}catch{return reject("JWKS HTTPS endpoint required");}
  if(jwksUrl.protocol!=="https:"||jwksUrl.username||jwksUrl.password||jwksUrl.hash)return reject("JWKS HTTPS endpoint required");
  if(jwksUrl.origin!==new URL(settings.issuer).origin)return reject("JWKS issuer origin mismatch");
  const pieces=token.split(".");
  if(pieces.length!==3||pieces.some(p=>!p))return reject("malformed JWT");
  const header=decode(pieces[0]) as JwtHeader;
  const claims=decode(pieces[1]) as JwtClaims;
  if(header.alg!=="RS256"||typeof header.kid!=="string"||!header.kid)return reject("unsupported JWT algorithm or kid");
  if(claims.iss!==settings.issuer)return reject("issuer mismatch");
  const audience=Array.isArray(claims.aud)?claims.aud:[claims.aud];
  if(!audience.includes(settings.audience))return reject("audience mismatch");
  const now=settings.nowSeconds??Math.floor(Date.now()/1000);
  if(typeof claims.exp!=="number"||!Number.isInteger(claims.exp)||claims.exp<=now)return reject("expired token");
  if(claims.nbf!==undefined&&(typeof claims.nbf!=="number"||claims.nbf>now))return reject("token not active");
  if(typeof claims.sub!=="string"||!claims.sub)return reject("subject missing");
  const scopes=typeof claims.scope==="string"?claims.scope.split(/\s+/).filter(Boolean):Array.isArray(claims.scp)&&claims.scp.every(s=>typeof s==="string")?claims.scp as string[]:[];
  if(!scopes.includes(settings.requiredScope))return reject("insufficient scope");
  const response=await (settings.fetchJwks??fetch)(jwksUrl,{method:"GET",headers:{accept:"application/json"},redirect:"error",signal:AbortSignal.timeout(3000)});
  if(!response.ok)return reject("JWKS retrieval failed");
  const doc:unknown=await response.json();
  if(!doc||typeof doc!=="object"||!("keys" in doc)||!Array.isArray(doc.keys))return reject("invalid JWKS");
  const keys=doc.keys as Jwk[];
  const matches=keys.filter(k=>k.kid===header.kid&&k.kty==="RSA"&&(k.use===undefined||k.use==="sig")&&(k.alg===undefined||k.alg==="RS256")&&(k.key_ops===undefined||k.key_ops.includes("verify")));
  if(matches.length!==1)return reject("JWT signing key mismatch");
  let key:KeyObject;
  try{key=createPublicKey({key:matches[0] as import("node:crypto").JsonWebKey,format:"jwk"});}catch{return reject("invalid JWKS signing key");}
  const valid=verifySignature("RSA-SHA256",Buffer.from(pieces[0]+"."+pieces[1]),key,Buffer.from(pieces[2],"base64url"));
  if(!valid)return reject("invalid JWT signature");
  return {subject:claims.sub,scopes};
}
