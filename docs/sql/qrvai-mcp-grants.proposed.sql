-- Schema APPLIED on 2026-11-18 to dedicated qrvai-auth as Supabase migration 20261118032317.
-- Later production activation remains gated on resource-bound OAuth and host acceptance.
-- Private QRVAI pilot: single user+OAuth client+issuer grant, revoked by enabled=false.
-- Do not run automatically as part of Vercel builds or GitHub Actions.
CREATE TABLE public.qrvai_mcp_grants (
 issuer text NOT NULL CHECK (issuer = 'https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1'),
 subject uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 client_id text NOT NULL CHECK (client_id ~ '^[A-Za-z0-9._:-]{1,256}$'),
 tenant_id uuid NOT NULL,
 enabled boolean NOT NULL DEFAULT false,
 expires_at timestamptz NOT NULL,
 permissions text[] NOT NULL CHECK (
  cardinality(permissions) BETWEEN 1 AND 2 AND
  permissions <@ ARRAY['qrvai:tools:read','qrvai:user-data:process']::text[]
 ),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (issuer, subject, client_id)
);
ALTER TABLE public.qrvai_mcp_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qrvai_mcp_grants FORCE ROW LEVEL SECURITY;
-- No client-facing RLS policies: public, anon and authenticated MUST NOT read grants.
REVOKE ALL ON TABLE public.qrvai_mcp_grants FROM PUBLIC, anon, authenticated, service_role;
-- A backend-only Supabase secret key accesses service_role, but SQL privileges
-- restrict it to read this table. Administrative updates require a separate owner path.
GRANT SELECT ON TABLE public.qrvai_mcp_grants TO service_role;
COMMENT ON TABLE public.qrvai_mcp_grants IS
 'Private QRVAI OAuth grants. Not a public entitlement API. Manual owner review required.';
