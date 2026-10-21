import React, { useMemo, useState } from "react";
import Reveal from "../components/Reveal";

const DISTANCES = { "5K": 5, "10K": 10, "Half": 21.0975, "Marathon": 42.195 };

function fmt(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60);
  return (h ? `${h}:` : "") + `${h ? String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}`;
}

function Running() {
  // Pace calculator
  const [dist, setDist] = useState("10K");
  const [unit, setUnit] = useState("mi");
  const [min, setMin] = useState(50);
  const [sec, setSec] = useState(0);

  const total = min * 60 + sec;
  const km = DISTANCES[dist];
  const perKm = total / km;
  const perMi = perKm * 1.609344;
  const predictions = useMemo(() => {
    // Riegel formula: T2 = T1 * (D2/D1)^1.06
    return Object.entries(DISTANCES).map(([name, d]) => [name, total * Math.pow(d / km, 1.06)]);
  }, [total, km]);

  // Weekly mileage planner
  const [weeks, setWeeks] = useState(8);
  const [start, setStart] = useState(15);
  const [bump, setBump] = useState(10);
  const plan = useMemo(() => {
    const out = [];
    let m = start;
    for (let w = 1; w <= weeks; w++) {
      // every 4th week is a cutback week
      const isCut = w % 4 === 0;
      out.push({ w, miles: isCut ? m * 0.75 : m, cut: isCut });
      if (!isCut) m = m * (1 + bump / 100);
    }
    return out;
  }, [weeks, start, bump]);
  const maxMiles = Math.max(...plan.map((p) => p.miles));

  // Animated runner
  const [speed, setSpeed] = useState(6);

  return (
    <div className="page">
      <div className="eyebrow">Running lab</div>
      <h1>Miles in, <span className="gradient-text">numbers out</span></h1>
      <p style={{ maxWidth: 640 }}>
        Running is the hobby that got me into tracking things. These are the calculators I actually use.
      </p>

      {/* Animated track */}
      <div className="panel" style={{ margin: "24px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <strong>Treadmill</strong>
          <span className="mono" style={{ color: "var(--muted)" }}>{speed.toFixed(1)} mph · {fmt(3600 / speed)}/mi</span>
        </div>
        <div style={{ position: "relative", height: 70, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 40px, transparent 40px 80px)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent 0 40px, rgba(255,255,255,0.04) 40px 80px)", animation: `marquee ${12 / speed}s linear infinite`, width: "200%" }} />
          <div style={{ position: "absolute", left: "48%", top: 10, fontSize: 40, animation: `float ${1.2 / (speed / 6)}s ease-in-out infinite` }}>🏃</div>
        </div>
        <input type="range" min="3" max="12" step="0.1" value={speed} onChange={(e) => setSpeed(+e.target.value)} style={{ marginTop: 14 }} />
      </div>

      <div className="grid grid-2">
        <Reveal>
          <div className="panel">
            <h3>Pace calculator</h3>
            <div className="btn-row" style={{ marginBottom: 16 }}>
              {Object.keys(DISTANCES).map((d) => (
                <button key={d} className={`btn small ${dist === d ? "active" : ""}`} onClick={() => setDist(d)}>{d}</button>
              ))}
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field"><label>Minutes</label><input type="number" min="0" value={min} onChange={(e) => setMin(+e.target.value || 0)} /></div>
              <div className="field"><label>Seconds</label><input type="number" min="0" max="59" value={sec} onChange={(e) => setSec(Math.min(59, +e.target.value || 0))} /></div>
            </div>
            <div className="btn-row" style={{ margin: "16px 0" }}>
              <button className={`btn small ${unit === "mi" ? "active" : ""}`} onClick={() => setUnit("mi")}>per mile</button>
              <button className={`btn small ${unit === "km" ? "active" : ""}`} onClick={() => setUnit("km")}>per km</button>
            </div>
            <div className="stat">
              <span className="value">{fmt(unit === "mi" ? perMi : perKm)}</span>
              <span className="label">pace / {unit}</span>
            </div>
            <div className="divider" style={{ margin: "20px 0" }} />
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 8 }}>Predicted finish times (Riegel)</div>
            {predictions.map(([n, t]) => (
              <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--panel-border)" }}>
                <span>{n}</span><span className="mono">{fmt(t)}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="panel">
            <h3>Mileage build</h3>
            <p style={{ fontSize: "0.9rem", marginTop: 0 }}>Grows weekly volume by a fixed percent, with a cutback every 4th week.</p>
            <div className="field"><label>Weeks: {weeks}</label><input type="range" min="4" max="16" value={weeks} onChange={(e) => setWeeks(+e.target.value)} /></div>
            <div className="field" style={{ marginTop: 10 }}><label>Starting miles/week: {start}</label><input type="range" min="5" max="60" value={start} onChange={(e) => setStart(+e.target.value)} /></div>
            <div className="field" style={{ marginTop: 10 }}><label>Weekly increase: {bump}%</label><input type="range" min="0" max="20" value={bump} onChange={(e) => setBump(+e.target.value)} /></div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, marginTop: 20 }}>
              {plan.map((p) => (
                <div key={p.w} title={`Week ${p.w}: ${p.miles.toFixed(1)} mi`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: "100%", height: `${(p.miles / maxMiles) * 130}px`, borderRadius: 6,
                    background: p.cut ? "var(--accent-3)" : "linear-gradient(180deg, var(--accent), var(--accent-2))",
                    transition: "height 0.4s cubic-bezier(0.2,0.8,0.2,1)",
                  }} />
                  <span className="mono" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{p.w}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }} className="mono">
              <span style={{ fontSize: "0.85rem" }}>Peak: {maxMiles.toFixed(1)} mi</span>
              <span style={{ fontSize: "0.85rem" }}>Total: {plan.reduce((a, p) => a + p.miles, 0).toFixed(0)} mi</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default Running;
