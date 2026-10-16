import { test } from "node:test";
import assert from "node:assert/strict";

test("a real SDK v2 server exposes four RF calculators and returns 50 dBm", async () => {
  const { createServer } = await import("../src/mcp/register.ts");
  const { Client, InMemoryTransport } = await import("@modelcontextprotocol/client");
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer();
  const client = new Client({name: "qrvai-native-tests",version:"0.1.0"});
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const result=await client.listTools();
    assert.deepEqual(result.tools.map(t=>t.name),["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss","core_capabilities","antenna_geometry","antenna_matching","rf_filter_response","power_autonomy","geo_bearing","station_signal_path","packet_route_preview","emcomm_drill","emcomm_readiness","academy_exercise","digital_setup_guide","repeater_channel_preview","contest_plan","maker_project_review","club_workshop_plan","source_lookup","regulatory_check_operation","spectrum_band_segments","spectrum_find_repeaters","manual_find","measurements_inspect_trace","sdr_inspect_iq","manual_answer_cited","equipment_diagnose","adif_validate","station_get_profile","station_read_status","spaceweather_indices","dx_reception_reports","log_award_progress","rf_exposure_screen","propagation_path","satellite_pass"]);
    assert.ok(result.tools[0]?.annotations?.readOnlyHint);
    const good=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
    assert.notEqual(good.isError,true);
    assert.equal((good.structuredContent as {dBm:number}).dBm,50);
    assert.match(JSON.stringify(good.content),/50/);
    const budget=await client.callTool({name:"rf_link_budget",arguments:{tx_w:100,tx_gain_dbi:2,tx_loss_db:1,path_loss_db:100,rx_gain_dbi:3,rx_loss_db:1,rx_sensitivity_dbm:-105}});
    assert.equal((budget.structuredContent as {rx_dbm:number;margin_db:number}).rx_dbm,-47);
    assert.equal((budget.structuredContent as {rx_dbm:number;margin_db:number}).margin_db,58);
    const impedance=await client.callTool({name:"rf_impedance",arguments:{r_ohm:100,x_ohm:0,z0_ohm:50}});
    assert.ok(Math.abs((impedance.structuredContent as {vswr:number}).vswr - 2) < 1e-12);
    const feedline=await client.callTool({name:"rf_feedline_loss",arguments:{profile:{id:"synthetic-coax",revision:"fixture-1",points:[{frequency_hz:10_000_000,loss_db_per_100m:4},{frequency_hz:1_000_000_000,loss_db_per_100m:8}]},frequency_hz:100_000_000,length_m:20,connector_loss_db:0.5,interpolation_method:"log_frequency"}});
    assert.notEqual(feedline.isError,true);
    assert.ok(Math.abs((feedline.structuredContent as {attenuation_db:number}).attenuation_db-1.7)<1e-12);
    assert.equal((feedline.structuredContent as {profile_trust:string}).profile_trust,"USER_SUPPLIED_UNVERIFIED");
    const invalidFeedline=await client.callTool({name:"rf_feedline_loss",arguments:{...{profile:{id:"synthetic-coax",revision:"fixture-1",points:[{frequency_hz:10_000_000,loss_db_per_100m:4},{frequency_hz:1_000_000_000,loss_db_per_100m:8}]},frequency_hz:100_000_000,length_m:20,connector_loss_db:0.5,interpolation_method:"log_frequency"}, frequency_hz:1}});
    assert.equal(invalidFeedline.isError,true);
    const bad=await client.callTool({name:"rf_power_convert",arguments:{value:0,unit:"W"}});
    assert.equal(bad.isError,true);
    const secret=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W",callsign:"PRIVATE"}});
    assert.equal(secret.isError,true);
  } finally {
    await client.close();
    await server.close();
  }
});
