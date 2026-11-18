import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {auditQrvaiIssuerDiscovery,QRVAI_SUPABASE_ISSUER} from "../src/http/oauth-issuer-discovery.ts";

const valid={
 issuer:QRVAI_SUPABASE_ISSUER,
 authorization_endpoint:QRVAI_SUPABASE_ISSUER+"/oauth/authorize",
 token_endpoint:QRVAI_SUPABASE_ISSUER+"/oauth/token",
 jwks_uri:QRVAI_SUPABASE_ISSUER+"/.well-known/jwks.json",
 response_types_supported:["code"],
 code_challenge_methods_supported:["S256","plain"],
 grant_types_supported:["authorization_code","refresh_token"]
};

test("valid issuer metadata proves ONLY OAuth discovery, never RFC8707 token audience binding",()=>{
 const result=auditQrvaiIssuerDiscovery(valid);
 assert.equal(result.discovery,"PASS");
 assert.ok(Object.values(result.checks).every(Boolean));
 assert.equal(result.resourceParameterToAudience,"NOT_EXECUTED");
 assert.equal(result.issuedTokenSignature,"NOT_EXECUTED");
 assert.equal(result.signedClientBinding,"NOT_EXECUTED");
 assert.equal(result.chatgptOAuthHost,"NOT_EXECUTED");
 assert.equal(result.productionOAuthReady,false);
});

test("missing or spoofed issuer metadata, endpoints, key location and PKCE S256 fail closed",()=>{
 const bad:unknown[]=[
  null,[],{},{"issuer":QRVAI_SUPABASE_ISSUER},
  {...valid,issuer:"https://attacker.example/auth/v1"},
  {...valid,authorization_endpoint:"https://attacker.example/oauth/authorize"},
  {...valid,authorization_endpoint:valid.authorization_endpoint+"?resource=spoofed"},
  {...valid,token_endpoint:"https://attacker.example/oauth/token"},
  {...valid,jwks_uri:"https://attacker.example/jwks"},
  {...valid,jwks_uri:valid.jwks_uri+"#bad"},
  {...valid,response_types_supported:["token"]},
  {...valid,code_challenge_methods_supported:["plain"]},
  {...valid,code_challenge_methods_supported:"S256"},
  {...valid,grant_types_supported:["refresh_token"]},
  {...valid,grant_types_supported:undefined}
 ];
 for(const candidate of bad){
  const result=auditQrvaiIssuerDiscovery(candidate);
  assert.equal(result.discovery,"FAIL",JSON.stringify(candidate));
  assert.equal(result.productionOAuthReady,false);
 }
});

test("discovery probe is public GET-only; cannot silently enable HTTP OAuth or turn metadata into a G4 PASS",()=>{
 const code=readFileSync(new URL("../scripts/probe-oauth-issuer.mjs",import.meta.url),"utf8");
 assert.match(code,/method:"GET"/);
 assert.match(code,/redirect:"error"/);
 assert.doesNotMatch(code,/method:\s*["']POST["']/);
 assert.doesNotMatch(code,/Authorization:\s*["']/);
 const handler=readFileSync(new URL("../api/oauth-protected-resource.ts",import.meta.url),"utf8");
 assert.match(handler,/OAUTH_MCP_HTTP_WIRED=false/);
 const mcp=readFileSync(new URL("../api/mcp.ts",import.meta.url),"utf8");
 assert.match(mcp,/PUBLIC_UNAUTHENTICATED = false/);
});
