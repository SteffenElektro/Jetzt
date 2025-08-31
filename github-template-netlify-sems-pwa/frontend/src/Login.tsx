import React from "react";
import { loginSems } from "./api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [account, setAccount] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [stationId, setStationId] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const token = await loginSems(account.trim(), password, stationId.trim());
      localStorage.setItem("sems_token", token);
      onLogin();
    } catch (e:any) {
      setErr(e?.message || "Login fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "14vh auto" }}>
        <h3>SEMS Login</h3>
        <form onSubmit={handle} className="row" style={{ flexDirection: "column", gap: 12 }}>
          <input placeholder="SEMS E-Mail" value={account} onChange={e=>setAccount(e.target.value)} required />
          <input placeholder="Passwort" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <input placeholder="PowerStation ID" value={stationId} onChange={e=>setStationId(e.target.value)} required />
          {err && <div style={{ color: "var(--danger)" }}>{err}</div>}
          <button type="submit" disabled={busy}>{busy ? "Anmelden..." : "Anmelden"}</button>
        </form>
        <small style={{ color: "var(--muted)" }}>Die Zugangsdaten werden verschlüsselt im Token an die API übergeben (stateless).</small>
      </div>
    </div>
  );
}
