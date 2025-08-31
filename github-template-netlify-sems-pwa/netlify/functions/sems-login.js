
import { encryptJson } from "./_utils/crypto.js";
import { ok, bad, readJson, withCors, preflight } from "./_utils/helpers.js";
export async function handler(event){
  if(event.httpMethod === "OPTIONS") return preflight();
  const body = await readJson(new Request("http://x",{ method:"POST", body: event.body }));
  const { account, password, stationId } = body || {};
  if(!account || !password || !stationId) return withCors(bad("account, password, stationId required", 400));
  const token = encryptJson({ account, password, stationId, iat: Date.now() });
  return withCors(ok({ token }));
}
