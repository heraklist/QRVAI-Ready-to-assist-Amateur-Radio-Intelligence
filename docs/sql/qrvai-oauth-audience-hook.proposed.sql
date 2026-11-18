-- INERT OAuth Custom Access Token Hook candidate (not configured in Supabase Auth).
-- Registration/consent and RFC 8707 resource binding are independent release gates.
-- This sets a FIXED, narrowly grant-scoped audience for the ONE canonical QRVAI MCP resource.
-- It is NOT proof that Supabase honors OAuth's original "resource" parameter.
-- Do NOT activate this hook until an independent issuer/resource review + private test user.
CREATE OR REPLACE FUNCTION public.qrvai_oauth_client_grant_audience(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $qrvai$
DECLARE
 claims jsonb;
 oauth_client text;
 oauth_subject text;
 oauth_method text;
 has_grant boolean := false;
BEGIN
 claims := event -> 'claims';
 IF jsonb_typeof(claims) IS DISTINCT FROM 'object' THEN
   RAISE EXCEPTION 'QRVAI OAuth hook: invalid claims';
 END IF;
 oauth_client := claims ->> 'client_id';
 oauth_subject := claims ->> 'sub';
 oauth_method := event ->> 'authentication_method';
 -- Only signed Supabase OAuth client tokens are eligible for an MCP audience.
 -- Anonymous, password, magic-link, and unrelated third-party sessions stay unchanged.
 IF oauth_method NOT IN ('oauth_provider/authorization_code', 'token_refresh') OR
    oauth_client IS NULL OR oauth_client !~ '^[A-Za-z0-9._:-]{1,256}$' OR
    oauth_subject IS NULL OR oauth_subject !~ '^[0-9a-fA-F-]{36}$' OR
    claims ->> 'iss' IS DISTINCT FROM 'https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1' OR
    claims ->> 'aud' IS DISTINCT FROM 'authenticated' OR
    claims ->> 'is_anonymous' IS DISTINCT FROM 'false' THEN
   RETURN event;
 END IF;
 -- Owner-controlled, revocable explicit grant. The function cannot be invoked
 -- by anon/authenticated users, and the table is RLS-forced with SELECT-only
 -- privileges to backend service_role (no client-facing access).
 SELECT EXISTS (
   SELECT 1 FROM public.qrvai_mcp_grants g
   WHERE g.issuer = 'https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1'
     AND g.subject::text = oauth_subject
     AND g.client_id = oauth_client
     AND g.enabled = true
     AND g.expires_at > now()
 ) INTO has_grant;
 IF NOT has_grant THEN
   RETURN event;
 END IF;
 RETURN jsonb_set(event, '{claims,aud}',
   to_jsonb('https://qrvai-rf-mcp.vercel.app/api/mcp'::text), false);
END;
$qrvai$;
REVOKE ALL ON FUNCTION public.qrvai_oauth_client_grant_audience(jsonb)
 FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.qrvai_oauth_client_grant_audience(jsonb) TO supabase_auth_admin;
COMMENT ON FUNCTION public.qrvai_oauth_client_grant_audience(jsonb)
 IS 'INERT until manually selected as Supabase Auth custom access token hook. Client-bound fixed MCP audience; not RFC 8707 parameter processing.';
