import {test} from 'node:test';
import assert from 'node:assert/strict';
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
test('Vercel route publishes metadata only when explicitly configured',async()=>{
  const {handleOAuthMetadataRoute}=await import('../api/oauth-protected-resource.ts');
  const enabled=handleOAuthMetadataRoute(request(),{QRVAI_OAUTH_RESOURCE:settings.resource,QRVAI_OAUTH_ISSUER:settings.authorizationServer});
  assert.equal(enabled.status,200);
  const doc=await enabled.json();
  assert.equal(doc.resource,settings.resource);
  assert.equal(handleOAuthMetadataRoute(request(),{}).status,503);
});
