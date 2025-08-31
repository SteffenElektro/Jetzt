import React from "react";
import Login from "./Login";
import { fetchPowerFlow } from "./api";
import PowerCard from "./PowerCard";
import type { PowerFlow } from "./types";

function useInterval(cb: () => void, ms: number) {
  const ref = React.useRef(cb);
  React.useEffect(() => { ref.current = cb; }, [cb]);
  React.useEffect(() => { const id = setInterval(() => ref.current(), ms); return () => clearInterval(id); }, [ms]);
}

export default function App() {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem("sems_token"));
  const [data, setData] = React.useState<PowerFlow | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const d = await fetchPowerFlow();
      setData(d); setErr(null);
    } catch (e:any) {
      setErr(e?.message || "Fehler");
    }
  }, []);

  React.useEffect(() => { if (token) load(); }, [token, load]);
  useInterval(() => { if (token) load(); }, 5000);

  if (!token) return <Login onLogin={() => setToken(localStorage.getItem("sems_token"))} />;

  const gridIntent = data ? (data.grid_w >= 0 ? "good" : "bad") as const : "neutral";
  const gridHint = data ? (data.grid_w >= 0 ? "Einspeisung" : "Netzbezug") : undefined;

  return (
    <div className="container">
      <div className="header">
        <div className="h1">⚡ PV Monitor – Elektrotechnik Langsdorf <span className="badge">SEMS PWA</span></div>
        <div style={{ opacity: 0.8 }}>{data ? new Date(data.ts).toLocaleString("de-DE") : "–"}</div>
        <button onClick={() => { localStorage.removeItem("sems_token"); setToken(null); }}>Abmelden</button>
      </div>
      {err && <div className="card" style={{ borderColor: "rgba(229,115,115,0.5)" }}>{err}</div>}
      <div className="grid">
        <div className="card" style={{ gridColumn: "span 12" }}>
          <h3>Übersicht</h3>
          <div className="row" style={{ gap: 12 }}>
            <PowerCard label="PV-Erzeugung" value={data?.pv_w} />
            <PowerCard label="Hausverbrauch" value={data?.load_w} />
            <PowerCard label="Netz" value={data?.grid_w} hint={gridHint} intent={gridIntent} />
            <PowerCard label="Batterie" value={data?.battery_w ?? null} hint={data?.battery_soc != null ? `SOC: ${data.battery_soc}%` : undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
