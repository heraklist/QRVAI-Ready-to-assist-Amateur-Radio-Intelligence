import {handleProtectedResourceMetadata} from '../src/http/oauth-resource.ts';
/** No user authentication occurs here. A separately approved OAuth integration is required for /api/mcp. */
export function handleOAuthMetadataRoute(
  request:Request,
  config:Record<string,string|undefined>=process.env
):Response{
  return handleProtectedResourceMetadata(request,{
    resource:config.QRVAI_OAUTH_RESOURCE,
    authorizationServer:config.QRVAI_OAUTH_ISSUER,
    scopesSupported:['openid']
  });
}
export default {fetch(request:Request):Response{return handleOAuthMetadataRoute(request);}};
