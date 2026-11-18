import { test } from "node:test";
import assert from "node:assert/strict";
import { validateOAuthAccessToken } from "../src/http/oauth-verify.ts";

const settings={issuer:"https://issuer.example",audience:"https://qrvai.example/api/mcp",requiredScope:"qrvai:tools:read",jwksUrl:"https://issuer.example/keys"};

test("OAuth verifier fails closed without verified issuer / JWKS",async()=>{
  await assert.rejects(()=>validateOAuthAccessToken("header.payload.signature",{issuer:"",audience:settings.audience,requiredScope:settings.requiredScope,jwksUrl:settings.jwksUrl}),/issuer/i);
});
test("OAuth verifier rejects empty, malformed and unsigned access tokens",async()=>{
  for(const token of ["","a.b","e30.e30.sig","eyJhbGciOiJub25lIn0.eyJzdWIiOiJhIn0."]){
    await assert.rejects(()=>validateOAuthAccessToken(token,settings),/token|JWT|signature|algorithm/i);
  }
});
test("OAuth verifier refuses untrusted HTTP JWKS endpoints",async()=>{
  await assert.rejects(()=>validateOAuthAccessToken("a.b.c",{...settings,jwksUrl:"http://issuer.example/keys"}),/JWKS|HTTPS/i);
});
