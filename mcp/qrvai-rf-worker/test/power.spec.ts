import { test } from "node:test";
import assert from "node:assert/strict";
import { convertPower } from "../src/rf/power.ts";

function close(actual: number, expected: number): void {
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= 1e-12 * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
}

test("100 W is 50 dBm, 20 dBW and 100000 mW", () => {
  const r = convertPower({ value: 100, unit: "W" });
  close(r.W, 100); close(r.mW, 100_000); close(r.dBm, 50); close(r.dBW, 20);
  assert.ok(r.convention.includes("1 mW"));
  assert.ok(r.precisionNote.length > 0);
});
test("1 mW is 0 dBm and -30 dBW", () => {
  const r = convertPower({ value: 1, unit: "mW" });
  close(r.dBm, 0); close(r.dBW, -30); close(r.W, 0.001);
});
test("1 W is 30 dBm and zero dBW", () => {
  const r = convertPower({ value: 1, unit: "W" });
  close(r.dBm, 30); close(r.dBW, 0);
});
test("50 dBm round trip yields 100 W", () => {
  close(convertPower({value: 50, unit: "dBm"}).W, 100);
});
test("inclusive -270 and +270 dBm are finite", () => {
  for(const value of [-270, 270]){
    const r=convertPower({value,unit:"dBm"});
    assert.ok(Object.values(r).every(v => typeof v !== "number" || Number.isFinite(v)));
    close(r.dBm,value);
  }
});
