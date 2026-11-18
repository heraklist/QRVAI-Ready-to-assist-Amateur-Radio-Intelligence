import {test} from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,sign, type KeyObject} from "node:crypto";
import {validateOAuthAccessToken} from "../src/http/oauth-verify.ts";

const issuer="https://issuer.example";
const audience="https://qrvai.example/api/mcp";
const settings={issuer,audience,jwksUrl:issuer+"/jwks",requiredScope:"qrvai:tools:read",nowSeconds:1_800_000_000};
const keyPair=()=>generateKeyPairSync("rsa",{modulusLength:2048});
function jwt(key:KeyObject,kid:string,claims:Record<string,unknown>,alg="RS256"){
 const part=(o:unknown)=>Buffer.from(JSON.stringify(o)).toString("base64url");
 const data=part({alg,kid,typ:"at+jwt"})+"."+part(claims);
 return data+"."+sign("RSA-SHA256",Buffer.from(data),key).toString("base64url");
}
const claims={iss:issuer,aud:audience,exp:settings.nowSeconds+300,nbf:settings.nowSeconds-60,sub:"user-A",scope:"qrvai:tools:read"};
function verifier(keys:ReturnType<typeof keyPair>[],kids:string[]){
 const jwks=keys.map((key,i)=>({...key.publicKey.export({format:"jwk"}),kid:kids[i],use:"sig",alg:"RS256"}));
 let fetched=0;
 const fetchJwks:typeof fetch=async()=>{fetched++;return new Response(JSON.stringify({keys:jwks}),{status:200,headers:{"content-type":"application/json"}})};
 return {settings:{...settings,fetchJwks},calls:()=>fetched};
}

test("signed valid RSA access token accepted with verified subject and scope",async()=>{
 const key=keyPair(),v=verifier([key],["key-1"]);
 assert.deepEqual(await validateOAuthAccessToken(jwt(key.privateKey,"key-1",claims),v.settings),{subject:"user-A",scopes:["qrvai:tools:read"]});
 assert.equal(v.calls(),1);
});
test("signed JWT rejects wrong issuer audience scope and time",async()=>{
 const key=keyPair(),v=verifier([key],["key-1"]);
 for(const patch of [{iss:"https://imposter.example"},{aud:"https://other.example/api/mcp"},{scope:"qrvai:other"},{exp:settings.nowSeconds},{nbf:settings.nowSeconds+10},{sub:""}]){
  await assert.rejects(validateOAuthAccessToken(jwt(key.privateKey,"key-1",{...claims,...patch}),v.settings));
 }
 assert.equal(v.calls(),0,"claim mismatch should not issue outgoing JWKS requests");
});
test("signature cannot be swapped to another key or guessed kid",async()=>{
 const good=keyPair(),bad=keyPair(),v=verifier([good],["key-1"]);
 await assert.rejects(validateOAuthAccessToken(jwt(bad.privateKey,"key-1",claims),v.settings),/signature/i);
 await assert.rejects(validateOAuthAccessToken(jwt(good.privateKey,"unknown",claims),v.settings),/key/i);
});
test("rotation accepts previous and new signing keys only if present in trusted JWKS",async()=>{
 const before=keyPair(),after=keyPair();
 const both=verifier([before,after],["old","new"]);
 assert.equal((await validateOAuthAccessToken(jwt(before.privateKey,"old",claims),both.settings)).subject,"user-A");
 assert.equal((await validateOAuthAccessToken(jwt(after.privateKey,"new",claims),both.settings)).subject,"user-A");
 const rotated=verifier([after],["new"]);
 await assert.rejects(validateOAuthAccessToken(jwt(before.privateKey,"old",claims),rotated.settings));
 assert.equal((await validateOAuthAccessToken(jwt(after.privateKey,"new",claims),rotated.settings)).subject,"user-A");
});
test("untrusted issuer or jwks target rejected before network",async()=>{
 const key=keyPair(),v=verifier([key],["key-1"]),token=jwt(key.privateKey,"key-1",claims);
 await assert.rejects(validateOAuthAccessToken(token,{...v.settings,issuer:"https://issuer.example.evil.invalid"}),/issuer/i);
 await assert.rejects(validateOAuthAccessToken(token,{...v.settings,jwksUrl:"https://other.example/jwks"}),/issuer|JWKS/i);
 assert.equal(v.calls(),0);
});
