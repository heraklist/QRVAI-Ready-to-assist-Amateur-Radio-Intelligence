import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const sql=readFileSync(new URL("../../../docs/sql/qrvai-oauth-audience-hook.proposed.sql",import.meta.url),"utf8");
test("proposed audience hook is explicit inert, client-bound and grant-dependent",()=>{
 assert.match(sql,/INERT OAuth Custom Access Token Hook/);
 assert.match(sql,/SECURITY DEFINER/);
 assert.match(sql,/SET search_path = ''/);
 assert.match(sql,/oauth_method IS NULL OR/);
 assert.equal((sql.match(/CREATE OR REPLACE FUNCTION/g)||[]).length,1);
 assert.equal(sql.split("$qrvai$").length-1,2);
 assert.match(sql,/oauth_subject IS NULL OR oauth_subject/);
 assert.match(sql,/oauth_method NOT IN/);
 assert.match(sql,/char_length\(oauth_client\) > 256/);
 assert.doesNotMatch(sql,/\{1,256\}/);
 assert.match(sql,/event ->> 'user_id' IS DISTINCT FROM oauth_subject/);
 assert.match(sql,/claims ->> 'client_id'/);
 assert.match(sql,/claims ->> 'is_anonymous'/);
 assert.match(sql,/FROM public\.qrvai_mcp_grants g/);
 assert.match(sql,/g\.client_id = oauth_client/);
 assert.match(sql,/g\.subject::text = oauth_subject/);
 assert.match(sql,/g\.enabled = true/);
 assert.match(sql,/g\.expires_at > now\(\)/);
 assert.match(sql,/qrvai-rf-mcp\.vercel\.app\/api\/mcp/);
 assert.match(sql,/REVOKE ALL ON FUNCTION/);
 assert.match(sql,/GRANT EXECUTE ON FUNCTION .* TO supabase_auth_admin/);
 assert.doesNotMatch(sql,/GRANT EXECUTE ON FUNCTION .* TO authenticated/);
});
