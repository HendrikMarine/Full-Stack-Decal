import React, { useMemo, useState } from "react";
import Reveal from "../components/Reveal";
import { ols } from "../lib/stats";

const W = 560, H = 340, PAD = 40;

function gen(kind) {
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const x = 1 + Math.random() * 9;
    let y;
    if (kind === "linear") y = 2 + 1.5 * x + (Math.random() - 0.5) * 2;
    else if (kind === "noisy") y = 3 + 1.0 * x + (Math.random() - 0.5) * 9;
    else if (kind === "curve") y = 1 + 0.25 * x * x + (Math.random() - 0.5) * 1.5;
    else if (kind === "hetero") y = 2 + 1.5 * x + (Math.random() - 0.5) * x * 2.2; // variance grows with x
    else y = 2 + Math.random() * 14;
    pts.push({ x: +x.toFixed(2), y: +y.toFixed(2) });
  }
  return pts;
}

function parsePairs(text) {
  const out = [];
  text.split(/\n|;/).forEach((line) => {
    const m = line.trim().split(/[,\s\t]+/).map(Number);
    if (m.length >= 2 && isFinite(m[0]) && isFinite(m[1])) out.push({ x: m[0], y: m[1] });
  });
  return out;
}

const MODELS = {
  linear: { label: "Linear", names: ["const", "x"], build: (x) => [1, x], predict: (b, x) => b[0] + b[1] * x },
  quadratic: { label: "Quadratic", names: ["const", "x", "x²"], build: (x) => [1, x, x * x], predict: (b, x) => b[0] + b[1] * x + b[2] * x * x },
  loglog: { label: "Log-log", names: ["const", "ln x"], build: (x) => [1, Math.log(x)], predict: (b, x) => Math.exp(b[0] + b[1] * Math.log(x)), transformY: Math.log, valid: (p) => p.x > 0 && p.y > 0 },
};

function fmt(v, d = 3) { return isFinite(v) ? v.toFixed(d) : "—"; }
function stars(p) { return p < 0.01 ? "***" : p < 0.05 ? "**" : p < 0.1 ? "*" : ""; }

function DataLab() {
  const [pts, setPts] = useState(() => gen("linear"));
  const [kind, setKind] = useState("linear");
  const [model, setModel] = useState("linear");
  const [robust, setRobust] = useState(false);
  const [text, setText] = useState("");
  const [nx, setNx] = useState(""), [ny, setNy] = useState("");

  const m = MODELS[model];
  const usable = useMemo(() => (m.valid ? pts.filter(m.valid) : pts), [pts, m]);

  const fit = useMemo(() => {
    if (usable.length < m.names.length + 1) return null;
    const X = usable.map((p) => m.build(p.x));
    const y = usable.map((p) => (m.transformY ? m.transformY(p.y) : p.y));
    return ols(X, y, m.names);
  }, [usable, m]);

  // axis ranges from data
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const xmin = pts.length ? Math.min(0, ...xs) : 0, xmax = pts.length ? Math.max(10, ...xs) : 10;
  const ymin = pts.length ? Math.min(0, ...ys) : 0, ymax = pts.length ? Math.max(10, ...ys) : 10;
  const sx = (x) => PAD + ((x - xmin) / (xmax - xmin || 1)) * (W - 2 * PAD);
  const sy = (y) => H - PAD - ((y - ymin) / (ymax - ymin || 1)) * (H - 2 * PAD);

  const curve = useMemo(() => {
    if (!fit) return "";
    const n = 60, lo = model === "loglog" ? Math.max(0.01, xmin) : xmin;
    return Array.from({ length: n + 1 }, (_, i) => {
      const x = lo + ((xmax - lo) * i) / n;
      const y = m.predict(fit.beta, x);
      return `${sx(x)},${sy(y)}`;
    }).join(" ");
  }, [fit, m, model, xmin, xmax, ymin, ymax]); // eslint-disable-line react-hooks/exhaustive-deps

  const addPoint = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = xmin + (((e.clientX - rect.left) / rect.width) * W - PAD) / (W - 2 * PAD) * (xmax - xmin);
    const py = ymin + ((H - PAD - ((e.clientY - rect.top) / rect.height) * H) / (H - 2 * PAD)) * (ymax - ymin);
    if (px < xmin || px > xmax || py < ymin || py > ymax) return;
    setPts((p) => [...p, { x: +px.toFixed(2), y: +py.toFixed(2) }]);
  };
  const load = (k) => { setKind(k); setPts(gen(k)); };
  const addManual = () => {
    const x = Number(nx), y = Number(ny);
    if (!isFinite(x) || !isFinite(y) || nx === "" || ny === "") return;
    setPts((p) => [...p, { x, y }]); setNx(""); setNy("");
  };
  const removePoint = (i) => setPts((p) => p.filter((_, j) => j !== i));

  const ticks = (lo, hi) => Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);

  return (
    <div className="page">
      <div className="eyebrow">Data lab</div>
      <h1>Fit a model, <span className="gradient-text">then interrogate it</span></h1>
      <p style={{ maxWidth: 680 }}>
        Live OLS with the full inference table. Load a dataset, click the chart, type your own numbers, or paste a whole column of pairs. Then switch models and standard errors and watch what survives.
      </p>

      <div className="btn-row" style={{ margin: "20px 0 10px" }}>
        {[["linear", "Clean linear"], ["noisy", "Noisy"], ["curve", "Curved"], ["hetero", "Heteroskedastic"], ["random", "Pure noise"]].map(([k, l]) => (
          <button key={k} className={`btn small ${kind === k ? "active" : ""}`} onClick={() => load(k)}>{l}</button>
        ))}
        <button className="btn small" onClick={() => setPts(gen(kind))}>↻ Resample</button>
        <button className="btn small" onClick={() => setPts([])}>Clear</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        <Reveal>
          <div className="panel" style={{ padding: 12 }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", cursor: "crosshair", display: "block" }} onClick={addPoint}>
              {ticks(xmin, xmax).map((t) => (
                <g key={"x" + t}>
                  <line x1={sx(t)} y1={sy(ymin)} x2={sx(t)} y2={sy(ymax)} stroke="rgba(255,255,255,0.06)" />
                  <text x={sx(t)} y={H - 12} fill="#9aa5bd" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{t.toFixed(1)}</text>
                </g>
              ))}
              {ticks(ymin, ymax).map((t) => (
                <g key={"y" + t}>
                  <line x1={sx(xmin)} y1={sy(t)} x2={sx(xmax)} y2={sy(t)} stroke="rgba(255,255,255,0.06)" />
                  <text x={6} y={sy(t) + 3} fill="#9aa5bd" fontSize="10" fontFamily="JetBrains Mono">{t.toFixed(0)}</text>
                </g>
              ))}
              {fit && <polyline fill="none" points={curve} stroke="#ffb454" strokeWidth="2.5" strokeLinejoin="round" style={{ transition: "all 0.4s" }} />}
              {pts.map((p, i) => (
                <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="5" fill="#4ef0c6" opacity="0.85" style={{ animation: "fade-up 0.3s both" }}>
                  <title>({p.x}, {p.y})</title>
                </circle>
              ))}
              {pts.length === 0 && <text x={W / 2} y={H / 2} fill="#9aa5bd" textAnchor="middle" fontSize="14">Click to add points, or type them on the right</text>}
            </svg>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="panel">
            <h3 style={{ marginBottom: 12 }}>Enter your own numbers</h3>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "end" }}>
              <div className="field"><label>x</label><input value={nx} onChange={(e) => setNx(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addManual()} placeholder="3.5" /></div>
              <div className="field"><label>y</label><input value={ny} onChange={(e) => setNy(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addManual()} placeholder="7.2" /></div>
              <button className="btn small primary" onClick={addManual}>Add</button>
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label>Or paste pairs (one "x, y" per line)</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder={"1, 2.3\n2, 4.1\n3, 6.2"} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--panel-border)", color: "var(--text)", borderRadius: 10, padding: 10, fontFamily: "var(--mono)", fontSize: "0.9rem", resize: "vertical" }} />
            </div>
            <div className="btn-row" style={{ marginTop: 8 }}>
              <button className="btn small" onClick={() => { setPts(parsePairs(text)); }}>Replace data</button>
              <button className="btn small" onClick={() => { setPts((p) => [...p, ...parsePairs(text)]); }}>Append</button>
            </div>
            <div style={{ marginTop: 14, maxHeight: 150, overflow: "auto", fontFamily: "var(--mono)", fontSize: "0.78rem" }}>
              {pts.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid var(--panel-border)", color: "var(--muted)" }}>
                  <span>{i + 1}. ({p.x}, {p.y})</span>
                  <button onClick={() => removePoint(i)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="divider" />

      <h2>Econometrics</h2>
      <p style={{ maxWidth: 680 }}>
        Everything below is computed in the browser from the points above. Robust standard errors are HC1. Stars: *** p&lt;0.01, ** p&lt;0.05, * p&lt;0.1.
      </p>
      <div className="btn-row" style={{ margin: "12px 0 20px" }}>
        {Object.entries(MODELS).map(([k, v]) => (
          <button key={k} className={`btn small ${model === k ? "active" : ""}`} onClick={() => setModel(k)}>{v.label}</button>
        ))}
        <button className={`btn small ${robust ? "active" : ""}`} onClick={() => setRobust((r) => !r)}>{robust ? "Robust SE (HC1) on" : "Classical SE"}</button>
      </div>

      {!fit ? (
        <div className="panel">Need at least {m.names.length + 1} {model === "loglog" ? "strictly positive " : ""}points to estimate this model.</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "3fr 2fr", gap: 20 }}>
          <Reveal>
            <div className="panel" style={{ overflowX: "auto" }}>
              <div className="mono" style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 10 }}>
                {model === "loglog" ? "ln y" : "y"} = {fit.coefs.map((c, i) => `${i ? (c.beta < 0 ? " − " : " + ") : ""}${fmt(Math.abs(c.beta))}${i ? "·" + c.name : ""}`).join("")}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ color: "var(--muted)", textAlign: "right" }}>
                    <th style={{ textAlign: "left", padding: "6px 4px" }}>coef</th><th>estimate</th><th>std err</th><th>t</th><th>p</th><th>95% CI</th>
                  </tr>
                </thead>
                <tbody>
                  {fit.coefs.map((c) => {
                    const se = robust ? c.seRobust : c.se, t = robust ? c.tRobust : c.t, p = robust ? c.pRobust : c.p;
                    return (
                      <tr key={c.name} style={{ textAlign: "right", borderTop: "1px solid var(--panel-border)" }}>
                        <td style={{ textAlign: "left", padding: "8px 4px", color: "var(--accent)" }}>{c.name}</td>
                        <td>{fmt(c.beta)}{stars(p)}</td><td>{fmt(se)}</td><td>{fmt(t, 2)}</td>
                        <td style={{ color: p < 0.05 ? "var(--accent)" : "var(--danger)" }}>{fmt(p, 4)}</td>
                        <td>[{fmt(c.beta - (c.ciHi - c.beta) / c.se * se, 2)}, {fmt(c.beta + (c.ciHi - c.beta) / c.se * se, 2)}]</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="grid grid-3" style={{ marginTop: 18, gap: 12 }}>
                <div className="stat"><span className="value" style={{ fontSize: "1.4rem" }}>{fmt(fit.r2)}</span><span className="label">R²</span></div>
                <div className="stat"><span className="value" style={{ fontSize: "1.4rem" }}>{fmt(fit.adjR2)}</span><span className="label">adj. R²</span></div>
                <div className="stat"><span className="value" style={{ fontSize: "1.4rem" }}>{fit.n}</span><span className="label">n (df {fit.df})</span></div>
                <div className="stat"><span className="value" style={{ fontSize: "1.4rem" }}>{fmt(fit.sigma)}</span><span className="label">resid. std. error</span></div>
                <div className="stat"><span className="value" style={{ fontSize: "1.4rem" }}>{fmt(fit.F, 1)}</span><span className="label">F (p {fmt(fit.fP, 4)})</span></div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="panel">
              <h3>Diagnostics</h3>
              {[
                ["Breusch-Pagan", fit.bp, fit.bpP, "heteroskedasticity. If p < 0.05, switch on robust SEs."],
                ["Jarque-Bera", fit.jb, fit.jbP, "residual normality (skew " + fmt(fit.skew, 2) + ", kurtosis " + fmt(fit.kurt, 2) + ")."],
                ["Durbin-Watson", fit.dw, null, "autocorrelation in the order points were entered. ~2 is clean; <1.5 or >2.5 is suspicious."],
              ].map(([name, stat, p, note]) => (
                <div key={name} style={{ padding: "10px 0", borderBottom: "1px solid var(--panel-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }} className="mono">
                    <span>{name}</span>
                    <span>{fmt(stat, 2)}{p != null && <span style={{ color: p < 0.05 ? "var(--danger)" : "var(--accent)" }}> · p {fmt(p, 3)}</span>}</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>Tests {note}</div>
                </div>
              ))}
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 12 }}>Residual plot (vs fitted)</div>
              <svg viewBox="0 0 300 110" style={{ width: "100%", height: "auto", marginTop: 6 }}>
                <line x1="10" y1="55" x2="290" y2="55" stroke="rgba(255,255,255,0.2)" />
                {(() => {
                  const fmin = Math.min(...fit.yhat), fmax = Math.max(...fit.yhat), rmax = Math.max(1e-9, ...fit.resid.map(Math.abs));
                  return fit.resid.map((e, i) => (
                    <circle key={i} cx={10 + ((fit.yhat[i] - fmin) / (fmax - fmin || 1)) * 280} cy={55 - (e / rmax) * 48} r="3" fill="#7c9cff" opacity="0.8" />
                  ));
                })()}
              </svg>
              <p style={{ fontSize: "0.8rem", marginTop: 10 }}>
                Try "Curved" with the Linear model: R² looks fine but the residuals bend. Try "Heteroskedastic" and toggle robust SEs: the estimate doesn't move, the standard errors do.
              </p>
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}

export default DataLab;
