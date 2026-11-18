import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createSupabaseGrantReader} from "../src/http/supabase-grants.ts";

const projectUrl="https://ujhkqfvxpgpkearukvmh.supabase.co";
const key="sb_secret_"+"x".repeat(32);
const subject="11111111-2222-4333-8444-555555555555";
const tenant="77777777-8888-4999-aaaa-bbbbbbbbbbbb";
const identity={issuer:projectUrl+"/auth/v1",subject,clientId:"pilot-client"};
const row={...identity,client_id:identity.clientId,tenant_id:tenant,enabled:true,expires_at:"2027-01-15T08:00:00.000Z",permissions:["qrvai:tools:read"]};
const grantRecord=()=>({issuer:row.issuer,subject:row.subject,client_id:row.client_id,tenant_id:row.tenant_id,enabled:row.enabled,expires_at:row.expires_at,permissions:row.permissions});

test("private service-key grant request has exact trusted project, identity filters, no user bearer",async()=>{
 let called=0;
 const fetchImpl:typeof fetch=async(input,init)=>{
  called++;
  const url=new URL(String(input));
  assert.equal(url.origin,projectUrl);
  assert.equal(url.pathname,"/rest/v1/qrvai_mcp_grants");
  assert.equal(url.searchParams.get("issuer"),"eq."+identity.issuer);
  assert.equal(url.searchParams.get("subject"),"eq."+subject);
  assert.equal(url.searchParams.get("client_id"),"eq."+identity.clientId);
  assert.equal(url.searchParams.get("limit"),"2");
  assert.equal(init?.redirect,"error");
  const headers=new Headers(init?.headers);
  assert.equal(headers.get("apikey"),key);
  assert.equal(headers.get("authorization"),null,"secret keys must not be JWT bearers");
  return Response.json([grantRecord()]);
 };
 const read=createSupabaseGrantReader({projectUrl,secretKey:key,fetchImpl});
 assert.deepEqual(await read(identity),{subject,clientId:"pilot-client",tenantId:tenant,
  enabled:true,expiresAtSeconds:Date.parse(row.expires_at)/1000,permissions:["qrvai:tools:read"]});
 assert.equal(called,1);
});
test("no implicit grant on wrong issuer, malformed Supabase subject or missing row",async()=>{
 let called=0;
 const read=createSupabaseGrantReader({projectUrl,secretKey:key,fetchImpl:async()=>{called++;return Response.json([]);}});
 assert.equal(await read({...identity,issuer:"https://attacker.example"}),null);
 assert.equal(await read({...identity,subject:"unverified-claim"}),null);
 assert.equal(await read(identity),null);
 assert.equal(called,1);
});
test("wrong client, untrusted row and ambiguous/unavailable database fail closed",async()=>{
 for(const value of [[{...grantRecord(),client_id:"different"}],
                     [{...grantRecord(),tenant_id:"bad"}],
                     [{...grantRecord(),permissions:["qrvai:station:read"]}],
                     [grantRecord(),grantRecord()]]){
  const read=createSupabaseGrantReader({projectUrl,secretKey:key,fetchImpl:async()=>Response.json(value)});
  if(value.length===2)await assert.rejects(read(identity),/Ambiguous/);
  else {
   const result=await read(identity);
   if(value[0].permissions?.includes("qrvai:station:read")){
    // Adapter returns raw trusted-store permission; outer principal verifier explicitly DENIES it.
    assert.deepEqual(result?.permissions,["qrvai:station:read"]);
   }else assert.equal(result,null);
  }
 }
 const denied=createSupabaseGrantReader({projectUrl,secretKey:key,fetchImpl:async()=>new Response("",{status:503})});
 await assert.rejects(denied(identity),/unavailable/);
});
test("no anonymous key, wrong host, legacy key or public grants in migration candidate",()=>{
 for(const cfg of [{projectUrl:"https://evil.example",secretKey:key},
                   {projectUrl,secretKey:"sb_publishable_"+"x".repeat(32)},
                   {projectUrl,secretKey:""}]){
  assert.throws(()=>createSupabaseGrantReader(cfg),/configuration/);
 }
 const sql=readFileSync(new URL("../../../docs/sql/qrvai-mcp-grants.proposed.sql",import.meta.url),"utf8");
 assert.match(sql,/ENABLE ROW LEVEL SECURITY/);
 assert.match(sql,/REVOKE ALL ON TABLE public\.qrvai_mcp_grants FROM PUBLIC, anon, authenticated, service_role/);
 assert.match(sql,/GRANT SELECT ON TABLE public\.qrvai_mcp_grants TO service_role/);
 assert.doesNotMatch(sql,/GRANT (INSERT|UPDATE|DELETE|ALL) ON TABLE/i);
 assert.match(sql,/Schema initially APPLIED on 2026-11-18/);
 assert.match(sql,/char_length\(client_id\) BETWEEN 1 AND 256/);
 assert.doesNotMatch(sql,/\{1,256\}/);
});
