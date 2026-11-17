import {test} from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {validateOAuthAccessTokenWithClient} from "../src/http/oauth-verify.ts";
import {createOAuthPilotPrincipalVerifier,type ServerOwnedGrant} from "../src/http/oauth-principal.ts";
import {handleVerifiedMcpRequest} from "../src/http/verified-mcp.ts";

const issuer="https://issuer.example",audience="https://qrvai.example/api/mcp",now=1_800_000_000;
const keys=generateKeyPairSync("rsa",{modulusLength:2048});
const jwk={...keys.publicKey.export({format:"jwk"}),kid:"pilot-signer",alg:"RS256",use:"sig"};
let jwksCalls=0;
const settings={issuer,audience,requiredScope:"openid",jwksUrl:issuer+"/jwks",nowSeconds:now,
 fetchJwks:async()=>{jwksCalls++;return Response.json({keys:[jwk]});}};
function signAccess(patch:Record<string,unknown>={}){
 const claims={iss:issuer,aud:audience,sub:"user-a",client_id:"client-1",exp:now+300,nbf:now-60,scope:"openid",...patch};
 const enc=(data:unknown)=>Buffer.from(JSON.stringify(data)).toString("base64url");
 const unsigned=enc({alg:"RS256",kid:"pilot-signer",typ:"at+jwt"})+"."+enc(claims);
 return unsigned+"."+sign("RSA-SHA256",Buffer.from(unsigned),keys.privateKey).toString("base64url");
}
const grant=(overrides:Partial<ServerOwnedGrant>={}):ServerOwnedGrant=>({
 subject:"user-a",clientId:"client-1",tenantId:"tenant-a",
 enabled:true,expiresAtSeconds:now+600,permissions:["qrvai:tools:read"],...overrides
});
const url="https://qrvai.example/api/mcp";
const req=(token:string)=>new Request(url,{method:"POST",headers:{"authorization":"Bearer "+token,
 "content-type":"application/json","accept":"application/json, text/event-stream"},
 body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/list"})});

test("signed JWT binds subject, exact MCP resource, and signed OAuth client_id",async()=>{
 const token=signAccess();
 const identity=await validateOAuthAccessTokenWithClient(token,settings);
 assert.deepEqual(identity,{subject:"user-a",scopes:["openid"],clientId:"client-1"});
 const start=jwksCalls;
 for(const patch of [{client_id:undefined},{client_id:""},{client_id:"client with spaces"},
                      {aud:"authenticated"},{iss:"https://attacker.example"},{scope:"email"},
                      {exp:now},{nbf:now+1}]){
  await assert.rejects(validateOAuthAccessTokenWithClient(signAccess(patch),settings));
 }
 assert.equal(jwksCalls,start,"unsupported identity/resource/scope/time must fail before JWKS access");
});

test("server-owned grant alone determines tool permissions, not signed OIDC or custom JWT scopes",async()=>{
 const token=signAccess({scope:"openid qrvai:user-data:process qrvai:station:read"});
 const verifier=createOAuthPilotPrincipalVerifier(settings,async()=>grant());
 const principal=await verifier(token);
 assert.deepEqual(principal?.scopes,["qrvai:tools:read"]);
 const response=await handleVerifiedMcpRequest(req(token),verifier,{issuer,audience});
 assert.equal(response.status,200);
 const list=(await response.json()).result.tools.map((t:{name:string})=>t.name);
 assert.ok(list.includes("rf_power_convert"));
 assert.ok(!list.includes("adif_validate"));
 assert.ok(!list.includes("station_get_profile"));
 assert.ok(!list.includes("log_award_progress"));
});

test("explicit QRVAI user-data grant allows user-data tools but never unrelated private station tools",async()=>{
 const token=signAccess();
 const verifier=createOAuthPilotPrincipalVerifier(settings,async()=>grant({permissions:["qrvai:user-data:process"]}));
 const response=await handleVerifiedMcpRequest(req(token),verifier,{issuer,audience});
 assert.equal(response.status,200);
 const list=(await response.json()).result.tools.map((t:{name:string})=>t.name);
 assert.ok(list.includes("adif_validate"));
 assert.ok(!list.includes("station_get_profile"));
 assert.ok(!list.includes("rf_power_convert"));
});

test("missing revoked expired wrong-user wrong-client or station/log grants fail closed",async()=>{
 const token=signAccess(),candidates:(ServerOwnedGrant|null)[]=[
  null,grant({enabled:false}),grant({expiresAtSeconds:now}),
  grant({subject:"user-b"}),grant({clientId:"client-2"}),grant({tenantId:""}),
  grant({permissions:[]}),grant({permissions:["qrvai:station:read"]}),
  grant({permissions:["qrvai:tools:read","qrvai:logs:read"]}),
  grant({permissions:["qrvai:tools:read"],expiresAtSeconds:Number.NaN})
 ];
 for(const candidate of candidates){
  const verifier=createOAuthPilotPrincipalVerifier(settings,async()=>candidate);
  assert.equal(await verifier(token),null,"invalid or absent store entitlement must not produce principal");
  const result=await handleVerifiedMcpRequest(req(token),verifier,{issuer,audience});
  assert.equal(result.status,401);
  assert.match(result.headers.get("www-authenticate")??"",/resource_metadata=/);
 }
});

test("uninvited client and tampered JWT cannot reach server grants",async()=>{
 let queried=0;
 const verifier=createOAuthPilotPrincipalVerifier(settings,async()=>{queried++;return grant();});
 await assert.rejects(verifier(signAccess({client_id:undefined})));
 await assert.rejects(verifier(signAccess({aud:"authenticated"})));
 const forged=signAccess();const parts=forged.split(".");
 const tampered=parts[0]+"."+Buffer.from(JSON.stringify({iss:issuer,aud:audience,sub:"user-b",client_id:"client-1",exp:now+300,scope:"openid"})).toString("base64url")+"."+parts[2];
 await assert.rejects(verifier(tampered));
 assert.equal(queried,0);
 const other=await verifier(signAccess({client_id:"client-other"}));
 assert.equal(other,null,"store grant for client-1 cannot be transferred to another signed client");
 assert.equal(queried,1);
});

test("two concurrent OAuth subjects remain scoped to their own server grants",async()=>{
 const verifier=createOAuthPilotPrincipalVerifier(settings,async({subject,clientId})=>{
  if(clientId!=="client-1")return null;
  return subject==="user-a"?grant():
   subject==="user-b"?grant({subject:"user-b",tenantId:"tenant-b",permissions:["qrvai:user-data:process"]}):null;
 });
 const [a,b]=await Promise.all([
  handleVerifiedMcpRequest(req(signAccess({sub:"user-a"})),verifier,{issuer,audience}),
  handleVerifiedMcpRequest(req(signAccess({sub:"user-b"})),verifier,{issuer,audience})
 ]);
 assert.equal(a.status,200);assert.equal(b.status,200);
 const toolsA=(await a.json()).result.tools.map((t:{name:string})=>t.name);
 const toolsB=(await b.json()).result.tools.map((t:{name:string})=>t.name);
 assert.ok(toolsA.includes("rf_power_convert"));
 assert.ok(!toolsA.includes("adif_validate"));
 assert.ok(!toolsB.includes("rf_power_convert"));
 assert.ok(toolsB.includes("adif_validate"));
});

test("grant-store errors return 401 rather than authorizing or using shared bearer",async()=>{
 const verifier=createOAuthPilotPrincipalVerifier(settings,async()=>{throw new Error("grant DB unavailable");});
 const response=await handleVerifiedMcpRequest(req(signAccess()),verifier,{issuer,audience});
 assert.equal(response.status,401);
});
