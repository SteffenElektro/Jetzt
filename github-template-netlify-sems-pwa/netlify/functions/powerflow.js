
import { decryptJson } from "./_utils/crypto.js";
import { crossLogin, getSimpleRealByPowerstationId } from "./_utils/sems.js";
import { ok, bad, withCors, preflight } from "./_utils/helpers.js";
export async function handler(event){
  if(event.httpMethod === "OPTIONS") return preflight();
  const auth = event.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if(!token) return withCors(bad("Missing token", 401));
  let creds; try { creds = decryptJson(token); } catch { return withCors(bad("Invalid token", 401)); }
  const { account, password, stationId } = creds;
  try{
    const semsToken = await crossLogin(account, password);
    const data = await getSimpleRealByPowerstationId(semsToken, stationId);
    const real = data?.data || data;
    const pv_w = Math.round(real?.power || real?.pvPower || 0);
    const load_w = Math.round(real?.loadPower || real?.consumption || 0);
    const grid_w = Math.round(real?.gridPower || 0);
    const battery_w = Math.round(real?.batteryPower || 0);
    const battery_soc = Math.round(real?.soc || 0);
    return withCors(ok({ ts: new Date().toISOString(), pv_w, load_w, grid_w, battery_w, battery_soc }));
  } catch(e){ return withCors(bad(String(e), 500)); }
}
