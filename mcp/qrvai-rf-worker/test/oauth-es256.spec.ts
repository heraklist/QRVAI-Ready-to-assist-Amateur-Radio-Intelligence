import {test} from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,sign,type KeyObject} from "node:crypto";
import {validateOAuthAccessToken} from "../src/http/oauth-verify.ts";
const issuer="https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1";
const audience="https://qrvai-rf-mcp.vercel.app/api/mcp";
const nowSeconds=1_800_000_000;
const base={issuer,audience,jwksUrl:issuer+"/.well-known/jwks.json",requiredScope:"openid",nowSeconds};
const claims={iss:issuer,aud:audience,exp:nowSeconds+300,nbf:nowSeconds-60,sub:"invited-subject",scope:"openid email"};
const ec=()=>generateKeyPairSync("ec",{namedCurve:"prime256v1"});
const rsa=()=>generateKeyPairSync("rsa",{modulusLength:2048});
function token(key:KeyObject,kid:string,patch:Record<string,unknown>={},alg="ES256"){
  const part=(v:unknown)=>Buffer.from(JSON.stringify(v)).toString("base64url");
  const input=part({alg,kid,typ:"at+jwt"})+"."+part({...claims,...patch});
  const signature=sign("sha256",Buffer.from(input),{key,dsaEncoding:"ieee-p1363"}).toString("base64url");
  return input+"."+signature;
}
function setup(publicKeys:object[],settings:Record<string,unknown>={}){
  let count=0;
  const fetchJwks:typeof fetch=async()=>{count++;return new Response(JSON.stringify({keys:publicKeys}),{status:200,headers:{"content-type":"application/json"}})};
  return {settings:{...base,acceptedAlgorithm:"ES256" as const,fetchJwks,...settings},count:()=>count};
}
function jwk(key:KeyObject,kid="key-1",patch:Record<string,unknown>={}){
  return {...key.export({format:"jwk"}),kid,alg:"ES256",use:"sig",key_ops:["verify"],...patch};
}
test("ES256 valid issuer/resource/expiry/scope token verifies against P-256 JWKS only when explicitly pinned",async()=>{
  const pair=ec(),v=setup([jwk(pair.publicKey)]);
  assert.deepEqual(await validateOAuthAccessToken(token(pair.privateKey,"key-1"),v.settings),{subject:"invited-subject",scopes:["openid","email"]});
  assert.equal(v.count(),1);
});
test("ES256 is rejected by RS256 default without fetching keys",async()=>{
  const pair=ec(),v=setup([jwk(pair.publicKey)],{acceptedAlgorithm:undefined});
  await assert.rejects(validateOAuthAccessToken(token(pair.privateKey,"key-1"),v.settings),/algorithm/i);
  assert.equal(v.count(),0);
});
test("ES256 rejects wrong audience, issuer, expired and not yet active tokens before JWKS retrieval",async()=>{
  const pair=ec(),v=setup([jwk(pair.publicKey)]);
  for(const patch of [{aud:"authenticated"},{iss:"https://other.supabase.co/auth/v1"},{exp:nowSeconds},{nbf:nowSeconds+1},{scope:"email"}]){
    await assert.rejects(validateOAuthAccessToken(token(pair.privateKey,"key-1",patch),v.settings));
  }
  assert.equal(v.count(),0);
});
test("ES256 rejects forged key, unknown kid and duplicate matching kids",async()=>{
  const good=ec(),forged=ec(),v=setup([jwk(good.publicKey)]);
  await assert.rejects(validateOAuthAccessToken(token(forged.privateKey,"key-1"),v.settings),/signature/i);
  await assert.rejects(validateOAuthAccessToken(token(good.privateKey,"unknown"),v.settings),/key/i);
  const duplicate=setup([jwk(good.publicKey),jwk(good.publicKey)]);
  await assert.rejects(validateOAuthAccessToken(token(good.privateKey,"key-1"),duplicate.settings),/key/i);
});
test("ES256 pins EC P-256 and rejects RSA or wrong curve/alg/key_ops",async()=>{
  const pair=ec(),wrongType=rsa();
  for(const key of [jwk(wrongType.publicKey),jwk(pair.publicKey,"key-1",{crv:"P-384"}),jwk(pair.publicKey,"key-1",{alg:"RS256"}),jwk(pair.publicKey,"key-1",{key_ops:["sign"]})]){
    const v=setup([key]);
    await assert.rejects(validateOAuthAccessToken(token(pair.privateKey,"key-1"),v.settings),/key/i);
  }
});
test("ES256 rejects algorithm confusion and untrusted JWKS URL before fetching",async()=>{
  const pair=ec(),v=setup([jwk(pair.publicKey)]);
  await assert.rejects(validateOAuthAccessToken(token(pair.privateKey,"key-1",{},"none"),v.settings),/algorithm/i);
  await assert.rejects(validateOAuthAccessToken(token(pair.privateKey,"key-1"),{...v.settings,jwksUrl:"https://attacker.example/jwks"}),/JWKS|issuer/i);
  assert.equal(v.count(),0);
});
test("ES256 supports issuer key rotation only when both P-256 keys exist in JWKS",async()=>{
  const before=ec(),after=ec(),first=token(before.privateKey,"old"),second=token(after.privateKey,"new");
  const v=setup([jwk(before.publicKey,"old"),jwk(after.publicKey,"new")]);
  assert.equal((await validateOAuthAccessToken(first,v.settings)).subject,"invited-subject");
  assert.equal((await validateOAuthAccessToken(second,v.settings)).subject,"invited-subject");
  const rotated=setup([jwk(after.publicKey,"new")]);
  await assert.rejects(validateOAuthAccessToken(first,rotated.settings),/key/i);
});
test("ES256 rejects multi-resource audience to avoid broadly reusable access tokens",async()=>{
  const pair=ec(),v=setup([jwk(pair.publicKey)]);
  await assert.rejects(validateOAuthAccessToken(token(pair.privateKey,"key-1",{aud:[audience,"authenticated"]}),v.settings),/audience/i);
  assert.equal(v.count(),0);
});
test("ES256 rejects unknown verifier algorithm configuration",async()=>{
  const pair=ec(),v=setup([jwk(pair.publicKey)],{acceptedAlgorithm:"HS256"});
  await assert.rejects(validateOAuthAccessToken(token(pair.privateKey,"key-1"),v.settings),/algorithm/i);
  assert.equal(v.count(),0);
});
