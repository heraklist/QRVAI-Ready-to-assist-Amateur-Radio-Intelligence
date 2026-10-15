import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateLinkBudget, LinkBudgetInputError } from "../src/rf/link-budget.ts";

const valid = {
  tx_w: 100, tx_gain_dbi: 2, tx_loss_db: 1, path_loss_db: 100,
  rx_gain_dbi: 3, rx_loss_db: 1, rx_sensitivity_dbm: -105
};

test("M08 deterministic reference path yields -47 dBm / 58 dB margin", () => {
  const result = calculateLinkBudget(valid);
  assert.equal(result.tx_dbm, 50);
  assert.equal(result.rx_dbm, -47);
  assert.equal(result.margin_db, 58);
  assert.deepEqual(result.stages.map(stage=>stage.name),[
    "tx_power", "tx_antenna_gain", "tx_path_loss", "propagation_path_loss",
    "rx_antenna_gain", "rx_path_loss", "receiver_sensitivity"
  ]);
});
test("one milliwatt with 100 dB loss has 10 dB sensitivity margin",()=>{
  const r=calculateLinkBudget({...valid,tx_w:0.001,tx_gain_dbi:0,tx_loss_db:0,path_loss_db:100,rx_gain_dbi:0,rx_loss_db:0,rx_sensitivity_dbm:-110});
  assert.ok(Math.abs(r.rx_dbm + 100)<1e-12);
  assert.ok(Math.abs(r.margin_db-10)<1e-12);
});
test("signed negative antenna gain is permitted, negative passive losses are not",()=>{
  assert.equal(calculateLinkBudget({...valid,tx_gain_dbi:-2}).rx_dbm,-51);
  for(const field of ["tx_loss_db","path_loss_db","rx_loss_db"] as const){
    assert.throws(()=>calculateLinkBudget({...valid,[field]:-1}),LinkBudgetInputError);
  }
});
test("missing, extra, nonfinite, zero and symbolic inputs fail closed",()=>{
  for(const candidate of [
    {...valid,tx_w:0}, {...valid,tx_w:-1}, {...valid,tx_w:Number.POSITIVE_INFINITY},
    {...valid,tx_w:"100"}, {...valid, callsign:"PRIVATE"}, {...valid,tx_loss_db:NaN},
    {...valid,path_loss_db:1e308, rx_loss_db:1e308},
    null, [], {"__proto__":1}
  ]) {
    assert.throws(()=>calculateLinkBudget(candidate),LinkBudgetInputError);
  }
});
