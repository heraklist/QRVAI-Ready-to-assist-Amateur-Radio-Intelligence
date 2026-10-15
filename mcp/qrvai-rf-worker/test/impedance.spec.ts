import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateImpedance, ImpedanceInputError } from "../src/rf/impedance.ts";
const close = (a:number, b:number): void => assert.ok(Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b)), `${a} != ${b}`);
test("M10 perfect 50 ohm match has reflection 0 and VSWR 1",()=>{
 const a=calculateImpedance({r_ohm:50,x_ohm:0,z0_ohm:50});
 close(a.gamma_magnitude,0); close(a.vswr!,1);
 assert.equal(a.return_loss_db,null);
 assert.equal(a.return_loss_status,"INFINITE");
});
test("M10 100 ohm resistive load has VSWR 2 and return loss 9.542 dB",()=>{
 const a=calculateImpedance({r_ohm:100,x_ohm:0,z0_ohm:50});
 close(a.gamma_re,1/3);close(a.gamma_magnitude,1/3);
 close(a.vswr!,2);close(a.return_loss_db!,20*Math.log10(3));
 assert.equal(a.vswr_status,"FINITE");
});
test("M10 short circuit has infinite VSWR as typed null not JSON Infinity",()=>{
 const a=calculateImpedance({r_ohm:0,x_ohm:0,z0_ohm:50});
 assert.equal(a.gamma_re,-1);assert.equal(a.vswr,null);
 assert.equal(a.vswr_status,"INFINITE");close(a.return_loss_db!,0);
});
test("M10 reactive impedance has nonzero complex Gamma with finite positive RL",()=>{
 const a=calculateImpedance({r_ohm:50,x_ohm:50,z0_ohm:50});
 close(a.gamma_re,0.2);close(a.gamma_im,0.4);
 close(a.gamma_magnitude,Math.sqrt(0.2));assert.ok(a.vswr! > 2);
 assert.ok(a.return_loss_db! > 0);
});
test("M10 rejects active, invalid, extra, nonfinite and overrange inputs",()=>{
 for(const item of [
  null,[],{r_ohm:-1,x_ohm:0,z0_ohm:50},
  {r_ohm:50,x_ohm:0,z0_ohm:0},
  {r_ohm:50,x_ohm:0,z0_ohm:-50},
  {r_ohm:50,x_ohm:Number.POSITIVE_INFINITY,z0_ohm:50},
  {r_ohm:50,x_ohm:0,z0_ohm:50,callsign:"PRIVATE"},
  {r_ohm:50,x_ohm:1e200,z0_ohm:50},
  {r_ohm:"50",x_ohm:0,z0_ohm:50}
 ])assert.throws(()=>calculateImpedance(item),ImpedanceInputError);
});
