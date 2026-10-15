import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateFeedlineLoss, FeedlineInputError } from "../src/rf/feedline.ts";

const profile = {
  id: "synthetic-coax", revision: "fixture-1",
  points: [
    {frequency_hz: 10_000_000, loss_db_per_100m: 4},
    {frequency_hz: 1_000_000_000, loss_db_per_100m: 8}
  ]
};
const args = {
  profile, frequency_hz: 100_000_000, length_m: 20,
  connector_loss_db: 0.5, interpolation_method: "log_frequency"
};
function close(actual: number, target: number): void {
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual-target) <= 1e-12*Math.max(1,Math.abs(target)), `${actual} != ${target}`);
}

test("M09 log-frequency interpolation and explicit connector loss",()=>{
  const result = calculateFeedlineLoss(args);
  close(result.interpolated_loss_db_per_100m,6);
  close(result.cable_loss_db,1.2);
  close(result.attenuation_db,1.7);
  close(result.delivered_ratio,10**(-1.7/10));
  assert.equal(result.profile_id,"synthetic-coax");
  assert.equal(result.profile_revision,"fixture-1");
  assert.equal(result.profile_trust,"USER_SUPPLIED_UNVERIFIED");
  assert.equal(result.interpolation_method,"log_frequency");
  assert.equal(result.formula_revision,"M09-v1");
  assert.equal(result.series.length,2);
});
test("M09 exact endpoints require no extrapolation and one evidence knot",()=>{
  const lower=calculateFeedlineLoss({...args,frequency_hz:10_000_000});
  const upper=calculateFeedlineLoss({...args,frequency_hz:1_000_000_000});
  close(lower.interpolated_loss_db_per_100m,4);
  close(upper.interpolated_loss_db_per_100m,8);
  assert.equal(lower.series.length,1);
  assert.equal(upper.series.length,1);
});
test("M09 zero length leaves connectors and zero total loss yields ratio one",()=>{
  const connector=calculateFeedlineLoss({...args,length_m:0});
  close(connector.cable_loss_db,0);
  close(connector.attenuation_db,0.5);
  const zero=calculateFeedlineLoss({...args,length_m:0,connector_loss_db:0});
  assert.equal(zero.attenuation_db,0);
  assert.equal(zero.delivered_ratio,1);
});
test("M09 refuses frequency extrapolation and unsorted/duplicate knots",()=>{
  for(const frequency_hz of [9_999_999,1_000_000_001]){
    assert.throws(()=>calculateFeedlineLoss({...args,frequency_hz}),FeedlineInputError);
  }
  const pts = profile.points;
  for (const points of [
    [...pts].reverse(),
    [pts[0],pts[0]],
    [{frequency_hz:0,loss_db_per_100m:4},pts[1]],
    [{frequency_hz:1e6,loss_db_per_100m:4}, {frequency_hz:2e6,loss_db_per_100m:-1}],
    [pts[0]],
    Array.from({length:17},(_,i)=>({frequency_hz:1e6+i*1e6,loss_db_per_100m:1}))
  ]) {
    assert.throws(()=>calculateFeedlineLoss({...args,profile:{...profile,points}}), FeedlineInputError);
  }
});
test("M09 rejects negative, symbolic, non-finite or extra input fields",()=>{
  for(const input of [
    null,[], "length 20m",
    {...args,length_m:-1},
    {...args,connector_loss_db:-0.1},
    {...args,frequency_hz:Number.POSITIVE_INFINITY},
    {...args,length_m:"20"},
    {...args,interpolation_method:"linear_hz"},
    {...args, extra:"PRIVATE"},
    {...args,profile:{...profile, source_claim:"certified"}},
    {...args,profile:{...profile, id:""}},
    {...args,profile:{...profile, revision:""}},
    {...args,profile:{...profile,points:[{frequency_hz:10e6,loss_db_per_100m:4,extra:1},profile.points[1]]}}
  ]) assert.throws(()=>calculateFeedlineLoss(input),FeedlineInputError);
});
test("M09 rejects inherited and accessor-only input and point properties",()=>{
  const inherited=Object.create(args);
  const accessor=Object.defineProperty({...args}, "length_m",{get(){throw new Error("unsafe getter");}});
  const point=Object.defineProperty({frequency_hz:10e6}, "loss_db_per_100m",{get(){throw new Error("unsafe getter");}});
  const hidden=Object.defineProperty({...args},"hidden",{value:true});
  const symbol={...args,[Symbol("hidden")]:true};
  for(const item of [inherited,accessor,hidden,symbol,{...args,profile:{...profile,points:[point,profile.points[1]]}}]){
    assert.throws(()=>calculateFeedlineLoss(item),FeedlineInputError);
  }
});
test("M09 rejects numeric overflow or ratio underflow instead of false zero",()=>{
  assert.throws(()=>calculateFeedlineLoss({...args,length_m:1e308,
    profile:{...profile,points:[{frequency_hz:10e6,loss_db_per_100m:1e308},{frequency_hz:1e9,loss_db_per_100m:1e308}]}}),FeedlineInputError);
  assert.throws(()=>calculateFeedlineLoss({...args,connector_loss_db:4000}),FeedlineInputError);
});
