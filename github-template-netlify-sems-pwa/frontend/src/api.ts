export async function loginSems(account: string, password: string, stationId: string): Promise<string> {
  const res = await fetch("/api/sems-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, password, stationId })
  });
  if (!res.ok) throw new Error("Login fehlgeschlagen");
  const j = await res.json();
  return j.token as string;
}

function authHeaders() {
  const token = localStorage.getItem("sems_token");
  return token ? { "Authorization": "Bearer " + token } : {};
}

export async function fetchPowerFlow() {
  const res = await fetch("/api/powerflow", { headers: authHeaders() });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}
