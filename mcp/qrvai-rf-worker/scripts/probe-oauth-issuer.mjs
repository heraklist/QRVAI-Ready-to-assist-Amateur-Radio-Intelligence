/**
 * Manual read-only public OAuth metadata check:
 * npm run probe:oauth
 *
 * Performs exactly ONE unauthenticated GET to a pinned Supabase URL.
 * No browser, user login, consent, OAuth registration, access token or
 * protected Vercel request. A PASS only covers issuer discovery.
 */
import {QRVAI_DISCOVERY_URL,auditQrvaiIssuerDiscovery} from "../src/http/oauth-issuer-discovery.ts";
const output=(audit)=>console.log(JSON.stringify(audit,null,2));
try{
 const response=await fetch(QRVAI_DISCOVERY_URL,{
  method:"GET",headers:{accept:"application/json"},redirect:"error",
  signal:AbortSignal.timeout(5000)
 });
 if(!response.ok||!/^application\/json\b/i.test(response.headers.get("content-type")||"")){
  throw new Error("Issuer metadata unavailable or not JSON");
 }
 const audit=auditQrvaiIssuerDiscovery(await response.json());
 output(audit);
 if(audit.discovery!=="PASS")process.exitCode=1;
}catch{
 output({
  discovery:"NOT_VERIFIED", resourceParameterToAudience:"NOT_EXECUTED",
  issuedTokenSignature:"NOT_EXECUTED", signedClientBinding:"NOT_EXECUTED",
  chatgptOAuthHost:"NOT_EXECUTED",productionOAuthReady:false,
  error:"Read-only issuer discovery failed; no host or token assertions were made"
 });
 process.exitCode=1;
}
