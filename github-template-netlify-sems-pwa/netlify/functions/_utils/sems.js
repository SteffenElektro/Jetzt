
import fetch from "node-fetch";
const base = process.env.SEMS_BASEURL || "https://www.semsportal.com";
export async function crossLogin(account, password){
  const url = base + "/api/v1/Common/CrossLogin";
  const res = await fetch(url, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ account, pwd: password }) });
  if(!res.ok) throw new Error("CrossLogin HTTP " + res.status);
  const data = await res.json();
  const token = data?.data?.token || data?.data || data?.token;
  if(!token) throw new Error("No SEMS token");
  return token;
}
export async function getSimpleRealByPowerstationId(token, id){
  const url = base + "/api/v1/PowerStation/GetSimpleRealByPowerstationId";
  const res = await fetch(url, { method: "POST", headers: { "Content-Type":"application/json", "Authorization": token }, body: JSON.stringify({ powerStationId: id }) });
  if(!res.ok) throw new Error("SimpleReal HTTP " + res.status);
  return res.json();
}
