import React, { useMemo, useState } from "react";
import Reveal from "../components/Reveal";
import profile from "../data/profile";

const pct = (v, d = 1) => `${(v * 100).toFixed(d)}%`;
const utility = (er, sigma, A) => er - 0.5 * A * sigma * sigma;

function Portfolio() {
  const base = profile.portfolio;
  const [er, setEr] = useState(base.expectedReturn);
  const [sig, setSig] = useState(base.volatility);
  const [A, setA] = useState(base.riskAversion);
  const [rf, setRf] = useState(base.riskFree);
  const [bench, setBench] = useState(base.benchmark);

  const U = utility(er, sig, A);
  const Ub = utility(bench.expectedReturn, bench.volatility, A);
  const Urf = rf; // risk-free has σ = 0
  const sharpe = (er - rf) / sig;
  const sharpeB = (bench.expectedReturn - rf) / bench.volatility;
  // optimal fraction in the risky portfolio for this A (rest in r_f)
  const yStar = (er - rf) / (A * sig * sig);
  const yClamped = Math.max(0, Math.min(1.5, yStar));
  const erC = rf + yClamped * (er - rf), sigC = yClamped * sig;
  const UC = utility(erC, sigC, A);

  // σ–E(r) chart: indifference curve through my portfolio, CAL from r_f through my portfolio
  const W = 560, H = 340, PAD = 44;
  const smax = Math.max(0.35, sig * 1.6, bench.volatility * 1.3), rmax = Math.max(0.3, er * 1.8, bench.expectedReturn * 1.5);
  const sx = (s) => PAD + (s / smax) * (W - 2 * PAD);
  const sy = (r) => H - PAD - (r / rmax) * (H - 2 * PAD);
  const indiff = useMemo(() => Array.from({ length: 61 }, (_, i) => { const s = (smax * i) / 60; return `${sx(s)},${sy(U + 0.5 * A * s * s)}`; }).join(" "), [U, A, smax, rmax]); // eslint-disable-line
  const indiffB = useMemo(() => Array.from({ length: 61 }, (_, i) => { const s = (smax * i) / 60; return `${sx(s)},${sy(Ub + 0.5 * A * s * s)}`; }).join(" "), [Ub, A, smax, rmax]); // eslint-disable-line

  const uCurve = (e, s) => Array.from({ length: 41 }, (_, i) => { const a = (10 * i) / 40; return { a, u: utility(e, s, a) }; });

  return (
    <div className="page">
      <div className="eyebrow">Market portfolio</div>
      <h1>Returns, priced for <span className="gradient-text">risk</span></h1>
      <p style={{ maxWidth: 720 }}>
        I run a market portfolio and I don't judge it by raw return. I score it with mean-variance utility, so a point of volatility costs me something explicit:
      </p>
      <div className="panel" style={{ display: "inline-block", padding: "16px 28px", margin: "8px 0 24px" }}>
        <span className="mono" style={{ fontSize: "1.5rem" }}>U = E(r) − ½ · A · σ²</span>
      </div>

      <p style={{ maxWidth: 720, fontSize: "0.9rem" }}>
        My own account numbers stay private. The sliders start at the Monte Carlo output for Voyant Capital's convergence thesis
        (mean 16.4%, σ ≈ 17.7% implied by the simulation's 10th and 90th percentiles), so the framework runs on real research numbers.
      </p>

      <div className="grid" style={{ gridTemplateColumns: "2fr 3fr", gap: 20 }}>
        <Reveal>
          <div className="panel">
            <h3>{base.label}</h3>
            <div className="field"><label style={{ textTransform: "none" }}>Expected return E(r): {pct(er)}</label><input type="range" min="-0.1" max="0.4" step="0.005" value={er} onChange={(e) => setEr(+e.target.value)} /></div>
            <div className="field" style={{ marginTop: 10 }}><label style={{ textTransform: "none" }}>Volatility σ: {pct(sig)}</label><input type="range" min="0.01" max="0.5" step="0.005" value={sig} onChange={(e) => setSig(+e.target.value)} /></div>
            <div className="field" style={{ marginTop: 10 }}><label style={{ textTransform: "none" }}>Risk aversion A: {A.toFixed(1)}</label><input type="range" min="0" max="10" step="0.1" value={A} onChange={(e) => setA(+e.target.value)} /></div>
            <div className="field" style={{ marginTop: 10 }}><label style={{ textTransform: "none" }}>Risk-free rate r<sub>f</sub>: {pct(rf, 2)}</label><input type="range" min="0" max="0.08" step="0.0025" value={rf} onChange={(e) => setRf(+e.target.value)} /></div>
            <div className="divider" style={{ margin: "18px 0" }} />
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="stat"><span className="value" style={{ color: U >= Ub ? "var(--accent)" : "var(--danger)" }}>{pct(U, 2)}</span><span className="label">utility U</span></div>
              <div className="stat"><span className="value">{sharpe.toFixed(2)}</span><span className="label">Sharpe</span></div>
              <div className="stat"><span className="value" style={{ fontSize: "1.4rem" }}>{pct(Ub, 2)}</span><span className="label">benchmark U</span></div>
              <div className="stat"><span className="value" style={{ fontSize: "1.4rem" }}>{pct(Urf, 2)}</span><span className="label">cash U (= r<sub>f</sub>)</span></div>
            </div>
            <p style={{ fontSize: "0.85rem", marginTop: 14 }}>
              {U > Math.max(Ub, Urf)
                ? `At A = ${A.toFixed(1)}, this portfolio beats both the benchmark and cash on a risk-adjusted basis.`
                : U > Urf
                ? `At A = ${A.toFixed(1)}, this portfolio beats cash but the benchmark scores higher. Either cut σ or accept the ranking.`
                : `At A = ${A.toFixed(1)}, cash wins. The volatility penalty is eating the return.`}
            </p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="panel" style={{ padding: 12 }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
              {[0, 0.1, 0.2, 0.3].filter((s) => s <= smax).map((s) => (
                <g key={"s" + s}><line x1={sx(s)} y1={sy(0)} x2={sx(s)} y2={sy(rmax)} stroke="rgba(255,255,255,0.06)" /><text x={sx(s)} y={H - 14} fill="#9aa5bd" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">σ {pct(s, 0)}</text></g>
              ))}
              {[0, 0.1, 0.2, 0.3].filter((r) => r <= rmax).map((r) => (
                <g key={"r" + r}><line x1={sx(0)} y1={sy(r)} x2={sx(smax)} y2={sy(r)} stroke="rgba(255,255,255,0.06)" /><text x={4} y={sy(r) + 3} fill="#9aa5bd" fontSize="10" fontFamily="JetBrains Mono">{pct(r, 0)}</text></g>
              ))}
              {/* capital allocation line from r_f through my portfolio */}
              <line x1={sx(0)} y1={sy(rf)} x2={sx(smax)} y2={sy(rf + sharpe * smax)} stroke="#7c9cff" strokeWidth="1.5" strokeDasharray="6 4" />
              {/* indifference curves */}
              <polyline points={indiffB} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <polyline points={indiff} fill="none" stroke="#4ef0c6" strokeWidth="2" style={{ transition: "all 0.3s" }} />
              {/* points */}
              <circle cx={sx(0)} cy={sy(rf)} r="5" fill="#9aa5bd" /><text x={sx(0) + 8} y={sy(rf) - 6} fill="#9aa5bd" fontSize="10">cash</text>
              <circle cx={sx(bench.volatility)} cy={sy(bench.expectedReturn)} r="6" fill="#ffb454" /><text x={sx(bench.volatility) + 9} y={sy(bench.expectedReturn) + 4} fill="#ffb454" fontSize="10">{bench.label}</text>
              <circle cx={sx(sigC)} cy={sy(erC)} r="5" fill="#7c9cff" /><text x={sx(sigC) - 9} y={sy(erC) + 20} fill="#7c9cff" fontSize="10" textAnchor="end">optimal mix (y*={yStar.toFixed(2)})</text>
              <circle cx={sx(sig)} cy={sy(er)} r="8" fill="#4ef0c6" style={{ filter: "drop-shadow(0 0 8px #4ef0c6)", transition: "all 0.3s" }} /><text x={sx(sig) + 11} y={sy(er) - 8} fill="#4ef0c6" fontSize="11" fontWeight="600">portfolio</text>
            </svg>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", padding: "8px 8px 4px" }}>
              Green curve: every (σ, E(r)) with the same utility as the portfolio. Grey: same for the benchmark. Dashed: capital allocation line through cash and the portfolio. Blue dot: the mix of portfolio and cash that maximizes U at this A (y* = (E(r) − r<sub>f</sub>) / (Aσ²); U there = {pct(UC, 2)}).
            </div>
          </div>
        </Reveal>
      </div>

      <div className="divider" />
      <Reveal>
        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="eyebrow">What the Monte Carlo says</div>
          <p style={{ fontSize: "0.9rem", marginTop: 0 }}>
            Independent simulation of Voyant's three-legged convergence trade. It confirmed the base case and exposed the tail we had understated, which is exactly why the σ² term in U exists.
          </p>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 }}>
            {base.monteCarlo.map((m) => (
              <div key={m.label} className="stat">
                <span className="value" style={{ fontSize: "1.3rem", color: m.label.startsWith("P(loss") || m.label.startsWith("5th") ? "var(--danger)" : "var(--text)" }}>{m.value}</span>
                <span className="label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <div className="grid grid-2">
        <Reveal>
          <div className="panel">
            <h3>Utility as risk aversion changes</h3>
            <p style={{ fontSize: "0.85rem", marginTop: 0 }}>Where the lines cross is the A at which the benchmark starts to win.</p>
            <svg viewBox="0 0 520 220" style={{ width: "100%", height: "auto" }}>
              {(() => {
                const mine = uCurve(er, sig), b = uCurve(bench.expectedReturn, bench.volatility);
                const all = [...mine, ...b].map((d) => d.u);
                const lo = Math.min(rf - 0.02, ...all), hi = Math.max(...all) + 0.02;
                const X = (a) => 40 + (a / 10) * 460, Y = (u) => 200 - ((u - lo) / (hi - lo)) * 180;
                const path = (c) => c.map((d) => `${X(d.a)},${Y(d.u)}`).join(" ");
                return (
                  <>
                    <line x1={X(0)} y1={Y(rf)} x2={X(10)} y2={Y(rf)} stroke="#9aa5bd" strokeDasharray="4 4" /><text x={X(10) - 30} y={Y(rf) - 5} fill="#9aa5bd" fontSize="10">cash</text>
                    <polyline points={path(b)} fill="none" stroke="#ffb454" strokeWidth="2" />
                    <polyline points={path(mine)} fill="none" stroke="#4ef0c6" strokeWidth="2.5" />
                    <line x1={X(A)} y1={Y(lo)} x2={X(A)} y2={Y(hi)} stroke="#7c9cff" strokeWidth="1" />
                    <text x={X(A) + 4} y={14} fill="#7c9cff" fontSize="10">A = {A.toFixed(1)}</text>
                    {[0, 2, 4, 6, 8, 10].map((a) => <text key={a} x={X(a)} y={214} fill="#9aa5bd" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{a}</text>)}
                  </>
                );
              })()}
            </svg>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="panel">
            <h3>Benchmark</h3>
            <div className="field"><label>Label</label><input value={bench.label} onChange={(e) => setBench({ ...bench, label: e.target.value })} /></div>
            <div className="field" style={{ marginTop: 10 }}><label style={{ textTransform: "none" }}>Benchmark E(r): {pct(bench.expectedReturn)}</label><input type="range" min="0" max="0.3" step="0.005" value={bench.expectedReturn} onChange={(e) => setBench({ ...bench, expectedReturn: +e.target.value })} /></div>
            <div className="field" style={{ marginTop: 10 }}><label style={{ textTransform: "none" }}>Benchmark σ: {pct(bench.volatility)}</label><input type="range" min="0.01" max="0.5" step="0.005" value={bench.volatility} onChange={(e) => setBench({ ...bench, volatility: +e.target.value })} /></div>
            <div className="mono" style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 16 }}>Benchmark Sharpe {sharpeB.toFixed(2)} vs portfolio {sharpe.toFixed(2)}</div>
            <p style={{ fontSize: "0.85rem", marginTop: 14 }}>
              Why this framing: two portfolios with the same return are not equal if one got there with twice the variance. A is the price I put on that variance, and it's the one number here I can't estimate from data; I have to choose it.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default Portfolio;
