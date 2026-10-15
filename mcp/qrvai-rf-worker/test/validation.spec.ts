import { test } from "node:test";
import assert from "node:assert/strict";
import { convertPower, PowerInputError } from "../src/rf/power.ts";

const invalid: Array<[string, unknown]> = [
  ["null", null], ["array", [100, "W"]], ["string input", "100 W"],
  ["missing unit", {value:100}], ["missing value", {unit:"W"}],
  ["string coercion", {value:"100",unit:"W"}], ["boolean coercion",{value:true,unit:"W"}],
  ["null power", {value:null,unit:"W"}], ["invalid unit", {value:1,unit:"watts"}],
  ["extra callsign", {value:100,unit:"W",callsign:"PRIVATE"}],
  ["additional undefined", {value:100,unit:"W",other:undefined}],
  ["zero W", {value:0,unit:"W"}], ["negative mW",{value:-2,unit:"mW"}],
  ["NaN", {value:Number.NaN,unit:"dBm"}], ["Infinity",{value:Infinity,unit:"dBm"}],
  ["positive dBm overflow", {value:271,unit:"dBm"}],
  ["negative dBm underflow", {value:-271,unit:"dBm"}],
  ["far too large W", {value:1e30,unit:"W"}],
  ["dBW above max", {value:241,unit:"dBW"}],
];
for(const [name,value] of invalid){
  test("rejects invalid power input: "+name, () => {
    assert.throws(()=>convertPower(value), (error: unknown) =>
      error instanceof PowerInputError && ["INVALID_INPUT","OUT_OF_RANGE"].includes(error.code)
    );
  });
}
test("rejects inherited/prototype pollution and hidden keys",()=>{
  const inherited=Object.create({value:100,unit:"W"});
  const hidden=Object.defineProperty({value:100,unit:"W"}, "hidden",{value:"private"});
  const symbol={value:100,unit:"W",[Symbol("secret")]:"private"};
  for(const payload of [inherited,hidden,symbol]){
    assert.throws(()=>convertPower(payload),PowerInputError);
  }
});
test("no clipping at inclusive +/-270 dBm",()=>{
  assert.equal(convertPower({value:-270,unit:"dBm"}).dBm,-270);
  assert.equal(convertPower({value:270,unit:"dBm"}).dBm,270);
  assert.throws(()=>convertPower({value:270.00001,unit:"dBm"}),PowerInputError);
});
test("null prototype with only allowed fields is accepted",()=>{
  const input=Object.assign(Object.create(null),{value:1,unit:"W"});
  assert.equal(convertPower(input).dBW,0);
});
