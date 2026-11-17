/** RFC 9728 resource metadata. This does not enable OAuth on /api/mcp or grant tools. */
export type OAuthResourceSettings={
  resource?:string;
  authorizationServer?:string;
  scopesSupported?:readonly string[];
};
const noStore={"cache-control":"no-store"};
function httpsUrl(value:unknown):URL|null{
  if(typeof value!=="string"||!value)return null;
  try{
    const url=new URL(value);
    if(url.protocol!=="https:"||url.username||url.password||url.search||url.hash||url.href!==value)return null;
    return url;
  }catch{return null;}
}
export function handleProtectedResourceMetadata(request:Request,settings:OAuthResourceSettings):Response{
  const resource=httpsUrl(settings.resource);
  const issuer=httpsUrl(settings.authorizationServer);
  const scopes=settings.scopesSupported;
  if(!resource||!issuer||
    (scopes!==undefined&&(!Array.isArray(scopes)||scopes.some(s=>typeof s!=="string"||!/^[a-zA-Z0-9:._-]+$/.test(s))))) {
    return new Response("OAuth resource metadata not configured",{status:503,headers:noStore});
  }
  if(new URL(request.url).origin!==resource.origin)return new Response("Not found",{status:404,headers:noStore});
  if(request.method!=="GET")return new Response("Method not allowed",{status:405,headers:{...noStore,"allow":"GET"}});
  return new Response(JSON.stringify({
    resource:settings.resource,
    authorization_servers:[settings.authorizationServer],
    ...(scopes!==undefined?{scopes_supported:scopes}:{}),
  }),{status:200,headers:{...noStore,"content-type":"application/json; charset=utf-8"}});
}
