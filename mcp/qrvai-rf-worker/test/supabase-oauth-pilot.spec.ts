import {test} from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {readFileSync} from "node:fs";
import {createSupabaseOAuthPilotHandler,QRVAI_PILOT_PROJECT_URL,QRVAI_PILOT_ISSUER,QRVAI_PILOT_RESOURCE} from "../src/http/supabase-oauth-pilot.ts";

const now=1_800_000_000;
const secret="sb_secret_"+"x".repeat(32);
const subject="11111111-2222-4333-8444-555555555555";
const tenant="77777777-8888-4999-aaaa-bbbbbbbbbbbb";
const clientId="registered-client-1";
const pair=generateKeyPairSync("ec",{namedCurve:"prime256v1"});
const key={...pair.publicKey.export({format:"jwk"}),kid:"key-pilot",use:"sig",alg:"ES256",key_ops:["verify"]};
const claims={iss:QRVAI_PILOT_ISSUER,aud:QRVAI_PILOT_RESOURCE,sub:subject,client_id:clientId,scope:"openid",exp:now+600,nbf:now-60};
const row=(patch:Record<string,unknown>={})=>({
 issuer:QRVAI_PILOT_ISSUER,subject,client_id:clientId,tenant_id:tenant,enabled:true,
 expires_at:"2027-01-15T09:00:00.000Z",permissions:["qrvai:tools:read"],...patch
});
function accessToken(patch:Record<string,unknown>={}){
 const enc=(value:unknown)=>Buffer.from(JSON.stringify(value)).toString("base64url");
 const header=enc({alg:"ES256",kid:"key-pilot",typ:"at+jwt"});
 const body=enc({...claims,...patch});
 const signed=header+"."+body;
 return signed+"."+sign("sha256",Buffer.from(signed),{key:pair.privateKey,dsaEncoding:"ieee-p1363"}).toString("base64url");
}
function request(token?:string,origin="https://qrvai-rf-mcp.vercel.app"){
 return new Request(origin+"/api/mcp",{method:"POST",headers:{
  "content-type":"application/json","accept":"application/json, text/event-stream",
  ...(token?{authorization:"Bearer "+token}:{})
 },body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/list"})});
}
const opts={issuer:QRVAI_PILOT_ISSUER,resource:QRVAI_PILOT_RESOURCE,grantStoreSecretKey:secret};
function fixture(config:{grant?:Record<string,unknown>|null;error?:boolean}={}){
 let jwksCount=0,grantsCount=0;
 const fetchJwks:typeof fetch=async(input,init)=>{
  jwksCount++;
  assert.equal(new URL(String(input)).href,QRVAI_PILOT_ISSUER+"/.well-known/jwks.json");
  assert.equal(init?.method,"GET");
  assert.equal(init?.redirect,"error");
  return Response.json({keys:[key]});
 };
 const fetchGrants:typeof fetch=async(input,init)=>{
  grantsCount++;
  const url=new URL(String(input));
  assert.equal(url.origin,QRVAI_PILOT_PROJECT_URL);
  assert.equal(url.pathname,"/rest/v1/qrvai_mcp_grants");
  assert.equal(url.searchParams.get("issuer"),"eq."+QRVAI_PILOT_ISSUER);
  assert.equal(url.searchParams.get("subject"),"eq."+subject);
  assert.equal(url.searchParams.get("client_id"),"eq."+clientId);
  assert.equal(new Headers(init?.headers).get("apikey"),secret);
  assert.equal(new Headers(init?.headers).has("authorization"),false);
  if(config.error)return new Response("DB unavailable",{status:503});
  return Response.json(config.grant===null?[]:[config.grant??row()]);
 };
 return {
  handler:createSupabaseOAuthPilotHandler({...opts,nowSeconds:now,fetchJwks,fetchGrants}),
  jwksCount:()=>jwksCount,grantsCount:()=>grantsCount
 };
}

test("composed ES256 + client grant + MCP SDK returns only the QRVAI read-authorized tools",async()=>{
 const {handler,jwksCount,grantsCount}=fixture();
 const response=await handler(request(accessToken()));
 assert.equal(response.status,200);
 const payload=await response.json();
 const names=payload.result.tools.map((tool:{name:string})=>tool.name);
 assert.ok(names.includes("rf_power_convert"));
 assert.ok(names.includes("academy_catalog"));
 assert.ok(!names.includes("adif_validate"));
 assert.ok(!names.includes("station_get_profile"));
 assert.ok(!names.includes("log_award_progress"));
 assert.equal(jwksCount(),1);
 assert.equal(grantsCount(),1);
});

test("Supabase access JWT without embedded OIDC scope still requires a signed client_id and independent DB grant",async()=>{
 const {handler,jwksCount,grantsCount}=fixture();
 const res=await handler(request(accessToken({scope:undefined})));
 assert.equal(res.status,200);
 const names=(await res.json()).result.tools.map((tool:{name:string})=>tool.name);
 assert.ok(names.includes("rf_power_convert"));
 assert.ok(!names.includes("adif_validate"));
 assert.ok(!names.includes("station_get_profile"));
 assert.equal(jwksCount(),1);
 assert.equal(grantsCount(),1);
 // Optional scope claim is not a license to accept a non-OAuth/unknown client.
 const noClient=await handler(request(accessToken({scope:undefined,client_id:undefined})));
 assert.equal(noClient.status,401);
 const noGrant=fixture({grant:null});
 assert.equal((await noGrant.handler(request(accessToken({scope:undefined})))).status,401);
});

test("OIDC openid and synthetic JWT permissions never create QRVAI grants",async()=>{
 const {handler}=fixture({grant:row({permissions:["qrvai:user-data:process"]})});
 const result=await handler(request(accessToken({scope:"openid qrvai:tools:read qrvai:station:read"})));
 assert.equal(result.status,200);
 const names=(await result.json()).result.tools.map((tool:{name:string})=>tool.name);
 assert.ok(names.includes("adif_validate"));
 assert.ok(!names.includes("rf_power_convert"));
 assert.ok(!names.includes("station_get_profile"));
});

test("issuer, resource, signed client ID and actual status of server grant fail closed",async()=>{
 const invalidClaims=[
  {aud:"authenticated"},{aud:undefined},{aud:["authenticated",QRVAI_PILOT_RESOURCE]},
  {iss:"https://unrelated.example/auth/v1"},
  {client_id:undefined},{client_id:""}, {scope:"email"},
  {exp:now},{nbf:now+10}
 ];
 for(const patch of invalidClaims){
  const {handler,grantsCount}=fixture();
  const res=await handler(request(accessToken(patch)));
  assert.equal(res.status,401,JSON.stringify(patch));
  assert.equal(grantsCount(),0);
  assert.match(res.headers.get("www-authenticate")||"",/resource_metadata=/);
 }
 for(const input of [{grant:null},{grant:row({enabled:false})},{grant:row({expires_at:"2026-01-01T00:00:00.000Z"})},{error:true}]){
  const {handler}=fixture(input);
  const res=await handler(request(accessToken()));
  assert.equal(res.status,401);
 }
});

test("canonical host mismatch is denied before touching JWKS or the grant store",async()=>{
 const {handler,jwksCount,grantsCount}=fixture();
 const res=await handler(request(accessToken(),"https://qrvai-rf-2wgbnqq3h-heraklists-projects.vercel.app"));
 assert.equal(res.status,403);
 assert.equal(jwksCount(),0);
 assert.equal(grantsCount(),0);
});

test("no OAuth pilot without a pinned issuer, resource, server key or real grant",async()=>{
 assert.throws(()=>createSupabaseOAuthPilotHandler({...opts,resource:"https://other.vercel.app/api/mcp"}),/pinned/);
 assert.throws(()=>createSupabaseOAuthPilotHandler({...opts,issuer:"https://attacker.example"}),/pinned/);
 assert.throws(()=>createSupabaseOAuthPilotHandler({...opts,grantStoreSecretKey:"sb_publishable_public"}),/configuration/);
 const {handler,jwksCount,grantsCount}=fixture({grant:null});
 const res=await handler(request());
 assert.equal(res.status,401);
 assert.equal(jwksCount(),0);
 assert.equal(grantsCount(),0);
});

test("the composed OAuth pilot is not installed in production or implicitly enabled by environment",()=>{
 const route=readFileSync(new URL("../api/mcp.ts",import.meta.url),"utf8");
 const metadata=readFileSync(new URL("../api/oauth-protected-resource.ts",import.meta.url),"utf8");
 assert.doesNotMatch(route,/createSupabaseOAuthPilotHandler/);
 assert.match(route,/PUBLIC_UNAUTHENTICATED = false/);
 assert.match(metadata,/OAUTH_MCP_HTTP_WIRED=false/);
 assert.doesNotMatch(metadata,/OAUTH_MCP_HTTP_WIRED\s*=\s*process\.env/);
});
