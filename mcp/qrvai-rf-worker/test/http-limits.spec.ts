import { test } from "node:test";
import assert from "node:assert/strict";
import { limitMcpRequest } from "../src/http/limits.ts";

function bodyRequest(text: string, headers: Record<string,string> = {}): Request {
  return new Request("https://qrvai.test/mcp",{
    method:"POST",
    headers:{"content-type":"application/json",...headers},
    body:text
  });
}
test("rejects body larger than 64 KiB without forwarding",async()=>{
  const response=await limitMcpRequest(bodyRequest("x".repeat(65537)));
  assert.ok(response instanceof Response);
  assert.equal((response as Response).status,413);
});
test("accepts exactly 64 KiB and preserves the payload",async()=>{
  const result=await limitMcpRequest(bodyRequest("x".repeat(65536)));
  assert.ok(result instanceof Request);
  assert.equal((await (result as Request).text()).length,65536);
});
test("large declared Content-Length fails closed without reading stream",async()=>{
  const result=await limitMcpRequest(bodyRequest("{}",{"content-length":"65537"}));
  assert.ok(result instanceof Response);
  assert.equal((result as Response).status,413);
});
test("malformed declared length fails rather than being ignored",async()=>{
  const result=await limitMcpRequest(bodyRequest("{}",{"content-length":"NaN"}));
  assert.ok(result instanceof Response);
  assert.equal((result as Response).status,400);
});
test("spoofed Host is rejected, matching host is allowed",async()=>{
  const rejected=await limitMcpRequest(bodyRequest("{}",{host:"evil.example"}));
  assert.ok(rejected instanceof Response);
  assert.equal((rejected as Response).status,403);
  const accepted=await limitMcpRequest(bodyRequest("{}",{host:"qrvai.test"}));
  assert.ok(accepted instanceof Request);
});
test("safe HTTP preflight does not insert permissive CORS",async()=>{
  const response=await limitMcpRequest(bodyRequest("x".repeat(65537)));
  assert.ok(response instanceof Response);
  assert.equal((response as Response).headers.get("access-control-allow-origin"),null);
});
