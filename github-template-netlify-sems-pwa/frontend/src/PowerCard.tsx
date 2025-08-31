import React from "react";
export default function PowerCard({ label, value, unit="W", hint, intent="neutral" }:
  { label: string, value?: number|null, unit?: string, hint?: string, intent?: "neutral"|"good"|"bad" }) {
  const color = intent === "good" ? "kpi-up" : intent === "bad" ? "kpi-down" : "";
  return (
    <div className="card">
      <h3>{label}</h3>
      <div className={`value ${color}`}>{value != null ? value.toLocaleString("de-DE") : "–"} <small>{unit}</small></div>
      {hint && <div className="row" style={{ marginTop: 8 }}><small>{hint}</small></div>}
    </div>
  );
}
