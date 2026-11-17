import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {handleProtectedResourceMetadata} from '../src/http/oauth-resource.ts';

const settings={resource:'https://qrvai.example/api/mcp',authorizationServer:'https://auth.example/auth/v1',scopesSupported:['openid','email']};
const request=(method='GET',url='https://qrvai.example/.well-known/oauth-protected-resource')=>new Request(url,{method});

test('publishes RFC 9728 OAuth protected resource metadata for configured canonical HTTPS MCP resource',async()=>{
  const res=handleProtectedResourceMetadata(request(),settings);
  assert.equal(res.status,200);
  assert.equal(res.headers.get('cache-control'),'no-store');
  assert.match(res.headers.get('content-type')??'',/application\/json/);
  assert.deepEqual(await res.json(),{resource:settings.resource,authorization_servers:[settings.authorizationServer],scopes_supported:['openid','email']});
});
test('fails closed without a configured resource and authorization issuer',()=>{
  for(const config of [{}, {resource:settings.resource}, {authorizationServer:settings.authorizationServer}]){
    assert.equal(handleProtectedResourceMetadata(request(),config).status,503);
  }
});
test('denies insecure, ambiguous, or credential-bearing issuer/resource URLs',()=>{
  for(const bad of ['http://bad.example','https://name:pass@bad.example','https://bad.example/path?x=1','https://bad.example/#fragment','']){
    assert.equal(handleProtectedResourceMetadata(request(),{...settings,authorizationServer:bad}).status,503);
    assert.equal(handleProtectedResourceMetadata(request(),{...settings,resource:bad}).status,503);
  }
});
test('denies a request for an alias that does not match the protected resource origin',()=>{
  assert.equal(handleProtectedResourceMetadata(request('GET','https://unexpected.example/.well-known/oauth-protected-resource'),settings).status,404);
});
test('does not publish metadata over methods other than GET',()=>{
  const res=handleProtectedResourceMetadata(request('POST'),settings);
  assert.equal(res.status,405);
  assert.equal(res.headers.get('allow'),'GET');
});
test('rejects invalid OAuth scope values rather than rendering untrusted permission metadata',()=>{
  assert.equal(handleProtectedResourceMetadata(request(),{...settings,scopesSupported:['openid','bad"\r\nscope']}).status,503);
});
test('Vercel route must not advertise OAuth until the real MCP HTTP endpoint verifies per-user OAuth',async()=>{
  const {handleOAuthMetadataRoute,OAUTH_MCP_HTTP_WIRED}=await import('../api/oauth-protected-resource.ts');
  assert.equal(OAUTH_MCP_HTTP_WIRED,false);
  const response=handleOAuthMetadataRoute(request(),{
    QRVAI_OAUTH_RESOURCE:settings.resource,
    QRVAI_OAUTH_ISSUER:settings.authorizationServer,
    QRVAI_MCP_OAUTH_ENABLED:'true'
  });
  assert.equal(response.status,503);
  assert.equal(response.headers.get('cache-control'),'no-store');
  assert.equal(handleOAuthMetadataRoute(request(),{}).status,503);
});

test('supports path-aware RFC 9728 discovery at exactly the MCP /api/mcp resource path',async()=>{
  const route='https://qrvai.example/.well-known/oauth-protected-resource/api/mcp';
  const res=handleProtectedResourceMetadata(request('GET',route),settings);
  assert.equal(res.status,200);
  assert.equal((await res.json()).resource,settings.resource);
  const vercel=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
  assert.ok(vercel.rewrites.some((r:{source:string;destination:string})=>r.source==='/.well-known/oauth-protected-resource/api/mcp'&&r.destination==='/api/oauth-protected-resource'));
});
test('metadata refuses wrong resource paths, origin aliases and URL parameters',()=>{
  for(const resource of ['https://qrvai.example','https://qrvai.example/api/mcp/','https://qrvai.example/other']){
    assert.equal(handleProtectedResourceMetadata(request(),{...settings,resource}).status,503);
  }
  for(const invalid of ['https://qrvai.example/.well-known/oauth-protected-resource/other',
                        'https://qrvai.example/.well-known/oauth-protected-resource/api/mcp?foo=1',
                        'https://qrvai-preview.example/.well-known/oauth-protected-resource/api/mcp']){
    assert.equal(handleProtectedResourceMetadata(request('GET',invalid),settings).status,404);
  }
});
