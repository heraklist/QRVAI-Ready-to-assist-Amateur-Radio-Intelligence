import {test} from "node:test";
import assert from "node:assert/strict";
import {PreviewBurstLimiter} from "../src/http/preview-throttle.ts";

test("private preview limiter enforces a deterministic finite window",()=>{
  const limiter=new PreviewBurstLimiter(2,60_000);
  assert.deepEqual(limiter.check("token_A",1_000),{allowed:true,remaining:1,retry_after_seconds:0,limit:2});
  assert.equal(limiter.check("token_A",1_100).allowed,true);
  const denied=limiter.check("token_A",1_200);
  assert.equal(denied.allowed,false);
  assert.equal(denied.remaining,0);
  assert.equal(denied.retry_after_seconds,60);
  assert.equal(limiter.check("token_A",61_000).allowed,true);
});
test("independent secrets are isolated without raw-token keys",()=>{
  const limiter=new PreviewBurstLimiter(1,30_000);
  assert.equal(limiter.check("key-A",1_000).allowed,true);
  assert.equal(limiter.check("key-A",1_001).allowed,false);
  assert.equal(limiter.check("key-B",1_001).allowed,true);
  assert.equal(limiter.trackedTokenFingerprints(),2);
});
test("finite memory budget fails closed until expired entries can be evicted",()=>{
  const limiter=new PreviewBurstLimiter(1,5_000,1);
  assert.equal(limiter.check("key-A",10_000).allowed,true);
  assert.equal(limiter.check("key-B",10_100).allowed,false);
  assert.equal(limiter.check("key-B",15_000).allowed,true);
});
test("time rollback and absent credentials never expand an authenticated budget",()=>{
  const limiter=new PreviewBurstLimiter(1,5_000);
  assert.equal(limiter.check("",10_000).allowed,false);
  assert.equal(limiter.check("key",10_000).allowed,true);
  assert.equal(limiter.check("key",9_000).allowed,true); // New isolation window after a clock correction
  assert.equal(limiter.check("key",9_001).allowed,false);
});
