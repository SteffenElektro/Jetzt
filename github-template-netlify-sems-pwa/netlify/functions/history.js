
import { decryptJson } from "./_utils/crypto.js";
import { ok, bad, withCors, preflight } from "./_utils/helpers.js";
export async function handler(event){
  if(event.httpMethod === "OPTIONS") return preflight();
  const auth = event.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if(!token) return withCors(bad("Missing token", 401));
  try { decryptJson(token); } catch { return withCors(bad("Invalid token", 401)); }
  const url = new URL(event.rawUrl);
  const days = Math.max(1, Math.min(60, parseInt(url.searchParams.get("days")) || 7));
  const today = new Date();
  const arr = Array.from({ length: days }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (days - 1 - i));
    const pv_wh = Math.round(8000 + Math.random() * 9000);
    const load_wh = Math.round(7000 + Math.random() * 7000);
    const export_wh = Math.max(0, pv_wh - load_wh - Math.round(Math.random() * 1000));
    const import_wh = Math.max(0, load_wh - pv_wh - Math.round(Math.random() * 1000));
    return { day: d.toISOString().slice(0,10), pv_wh, load_wh, export_wh, import_wh };
  });
  return withCors(ok(arr));
}
