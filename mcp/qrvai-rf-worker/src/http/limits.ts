const MAX_BODY_BYTES = 64 * 1024;
const response = (status: number, message: string): Response =>
  new Response(message,{status,headers:{"content-type":"text/plain; charset=utf-8","cache-control":"no-store"}});

/** Transport-level body and Host guard used after Vercel Bearer authentication. */
export async function limitMcpRequest(request: Request): Promise<Request | Response> {
  const expectedHost = new URL(request.url).host.toLowerCase();
  const suppliedHost = request.headers.get("host");
  if (suppliedHost && suppliedHost.toLowerCase() !== expectedHost) {
    return response(403,"Host mismatch");
  }
  if (request.method !== "POST") return request;
  const length = request.headers.get("content-length");
  if (length !== null) {
    if (!/^[0-9]+$/.test(length) || !Number.isSafeInteger(Number(length))) {
      return response(400,"Invalid request length");
    }
    if (Number(length) > MAX_BODY_BYTES) return response(413,"Request too large");
  }
  if (!request.body) return request;
  const reader = request.body.getReader();
  let total = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel().catch(()=>{});
        return response(413,"Request too large");
      }
      chunks.push(value);
    }
  } catch {
    return response(400,"Unreadable request body");
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for(const part of chunks){bytes.set(part,offset);offset+=part.byteLength;}
  const headers = new Headers(request.headers);
  headers.set("content-length",String(total));
  return new Request(request.url,{
    method:"POST",
    headers,
    body:bytes,
    signal:request.signal
  });
}
