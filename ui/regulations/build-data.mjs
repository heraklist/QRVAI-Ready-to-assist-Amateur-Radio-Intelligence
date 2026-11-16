/** Deterministic offline source-pointer bundle from canonical national packs.
 * --check blocks CI if browser source presentation diverges from the backend.
 * No HTTP data fetching, no legal advice, no user data, no unsafe evaluation.
 */
import {readFileSync,writeFileSync} from "node:fs";
const src=readFileSync(new URL("../../mcp/qrvai-rf-worker/src/live/country-packs.ts",import.meta.url),"utf8");
const begin="export const COUNTRY_PACKS: readonly CountryPack[]=Object.freeze([";
const a=src.indexOf(begin),b=src.indexOf("\n]);",a);
if(a<0||b<0)throw Error("Canonical source-pack structure changed");
const body=src.slice(a,b+4).replace(begin,"export const COUNTRY_PACKS=Object.freeze([");
const out=['/** GENERATED from src/live/country-packs.ts. Do not hand-edit. */',
  body,
  'export const SOURCE_DISCOVERY_ONLY=true;',
  'export const COUNTRY_BY_CODE=new Map(COUNTRY_PACKS.map(pack=>[pack.country_code,pack]));',
  ''].join("\n");
const destination=new URL("./data.mjs",import.meta.url);
if(process.argv.includes("--check")){
  if(readFileSync(destination,"utf8")!==out){console.error("Regulatory browser source-pack bundle drift");process.exitCode=1;}
  else console.log("PASS static national source pack bundle matches authoritative registry");
}else{writeFileSync(destination,out,"utf8");console.log("Wrote static national source registry bundle");}
