import React, { useMemo, useState } from "react";
import Reveal from "../components/Reveal";

const W = 560, H = 340, PAD = 36;

function regress(pts) {
  const n = pts.length;
  if (n < 2) return null;
  const mx = pts.reduce((a, p) => a + p.x, 0) / n, my = pts.reduce((a, p) => a + p.y, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const p of pts) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2; syy += (p.y - my) ** 2; }
  if (sxx === 0) return null;
  const b = sxy / sxx, a = my - b * mx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { a, b, r2, mx, my };
}

function gen(kind) {
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const x = Math.random();
    let y;
    if (kind === "linear") y = 0.2 + 0.6 * x + (Math.random() - 0.5) * 0.15;
    else if (kind === "noisy") y = 0.3 + 0.4 * x + (Math.random() - 0.5) * 0.6;
    else if (kind === "curve") y = 0.1 + 0.8 * x * x + (Math.random() - 0.5) * 0.1;
    else y = Math.random();
    pts.push({ x, y: Math.min(1, Math.max(0, y)) });
  }
  return pts;
}

function DataLab() {
  const [pts, setPts] = useState(() => gen("linear"));
  const [kind, setKind] = useState("linear");
  const fit = useMemo(() => regress(pts), [pts]);

  const sx = (x) => PAD + x * (W - 2 * PAD);
  const sy = (y) => H - PAD - y * (H - 2 * PAD);

  const addPoint = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const px = (x - PAD) / (W - 2 * PAD), py = (H - PAD - y) / (H - 2 * PAD);
    if (px < 0 || px > 1 || py < 0 || py > 1) return;
    setPts((p) => [...p, { x: px, y: py }]);
  };

  const load = (k) => { setKind(k); setPts(gen(k)); };

  // histogram of residuals
  const residuals = fit ? pts.map((p) => p.y - (fit.a + fit.b * p.x)) : [];
  const bins = 9;
  const hist = new Array(bins).fill(0);
  residuals.forEach((r) => { const i = Math.min(bins - 1, Math.max(0, Math.floor((r + 0.5) * bins))); hist[i]++; });
  const hmax = Math.max(1, ...hist);

  return (
    <div className="page">
      <div className="eyebrow">Data lab</div>
      <h1>Fit a line, <span className="gradient-text">argue with it</span></h1>
      <p style={{ maxWidth: 640 }}>
        Live least-squares regression. Load a dataset or click anywhere on the chart to add a point and watch the fit move.
      </p>

      <div className="btn-row" style={{ margin: "20px 0" }}>
        {[["linear", "Clean linear"], ["noisy", "Noisy"], ["curve", "Curved (line is wrong)"], ["random", "Pure noise"]].map(([k, l]) => (
          <button key={k} className={`btn small ${kind === k ? "active" : ""}`} onClick={() => load(k)}>{l}</button>
        ))}
        <button className="btn small" onClick={() => setPts(gen(kind))}>↻ Resample</button>
        <button className="btn small" onClick={() => setPts([])}>Clear</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <Reveal>
          <div className="panel" style={{ padding: 12 }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", cursor: "crosshair", display: "block" }} onClick={addPoint}>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <g key={t}>
                  <line x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(1)} stroke="rgba(255,255,255,0.06)" />
                  <line x1={sx(0)} y1={sy(t)} x2={sx(1)} y2={sy(t)} stroke="rgba(255,255,255,0.06)" />
                  <text x={sx(t)} y={H - 10} fill="#9aa5bd" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{t}</text>
                  <text x={12} y={sy(t) + 3} fill="#9aa5bd" fontSize="10" fontFamily="JetBrains Mono">{t}</text>
                </g>
              ))}
              {fit && (
                <line
                  x1={sx(0)} y1={sy(fit.a)} x2={sx(1)} y2={sy(fit.a + fit.b)}
                  stroke="#ffb454" strokeWidth="2.5" strokeLinecap="round"
                  style={{ transition: "all 0.4s cubic-bezier(0.2,0.8,0.2,1)" }}
                />
              )}
              {pts.map((p, i) => (
                <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="5" fill="#4ef0c6" opacity="0.85" style={{ animation: "fade-up 0.3s both" }} />
              ))}
              {pts.length === 0 && <text x={W / 2} y={H / 2} fill="#9aa5bd" textAnchor="middle" fontSize="14">Click to add points</text>}
            </svg>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="panel">
            <div className="stat"><span className="value">{fit ? fit.r2.toFixed(3) : "—"}</span><span className="label">r² (fit quality)</span></div>
            <div className="mono" style={{ margin: "14px 0", fontSize: "0.95rem" }}>
              {fit ? <>y = {fit.a.toFixed(3)} + {fit.b.toFixed(3)}·x</> : "need 2+ points"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{pts.length} points</div>
            <div className="divider" style={{ margin: "16px 0" }} />
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 8 }}>Residual histogram</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
              {hist.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${(h / hmax) * 100}%`, background: i === Math.floor(bins / 2) ? "var(--accent-2)" : "rgba(124,156,255,0.4)", borderRadius: 3, transition: "height 0.3s" }} />
              ))}
            </div>
            <p style={{ fontSize: "0.8rem", marginTop: 12 }}>
              Try "Curved": r² still looks fine, but the residuals bend. The line is confidently wrong. That's the lesson.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default DataLab;
