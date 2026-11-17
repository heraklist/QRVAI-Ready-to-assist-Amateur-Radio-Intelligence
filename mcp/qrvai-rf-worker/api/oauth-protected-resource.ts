import {handleProtectedResourceMetadata} from '../src/http/oauth-resource.ts';
/** SOURCE-LEVEL release hold: the deployed /api/mcp still verifies only a shared Bearer secret.
 * No environment variable or metadata configuration may signal OAuth readiness.
 * Flip only in the same reviewed change that wires verified, resource-bound per-user OAuth.
 */
export const OAUTH_MCP_HTTP_WIRED=false;
/** No user authentication occurs here. A separately approved OAuth integration is required for /api/mcp. */
export function handleOAuthMetadataRoute(
  request:Request,
  config:Record<string,string|undefined>=process.env
):Response{
  if(!OAUTH_MCP_HTTP_WIRED)return new Response("OAuth MCP integration not enabled",{status:503,headers:{"cache-control":"no-store"}});
  return handleProtectedResourceMetadata(request,{
    resource:config.QRVAI_OAUTH_RESOURCE,
    authorizationServer:config.QRVAI_OAUTH_ISSUER,
    scopesSupported:['openid']
  });
}
export default {fetch(request:Request):Response{return handleOAuthMetadataRoute(request);}};
