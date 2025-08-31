
export function ok(data, status=200){ return new Response(JSON.stringify(data), { status, headers: {"Content-Type":"application/json"} }); }
export function bad(msg, status=400){ return ok({ error: msg }, status); }
export async function readJson(request){ try { return await request.json(); } catch { return {}; } }
function allowOrigin(){ return process.env.CORS_ALLOW_ORIGIN || "*"; }
export function withCors(resp){ const h = new Headers(resp.headers); h.set("Access-Control-Allow-Origin", allowOrigin()); h.set("Access-Control-Allow-Headers","Content-Type, Authorization"); h.set("Access-Control-Allow-Methods","GET,POST,OPTIONS"); return new Response(resp.body, { status: resp.status, headers: h }); }
export function preflight(){ return withCors(new Response(null, { status: 204 })); }
