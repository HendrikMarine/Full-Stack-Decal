import React, { useEffect, useRef, useState } from "react";
import Reveal from "../components/Reveal";

function MonteCarloPi() {
  const canvasRef = useRef(null);
  const [inside, setInside] = useState(0);
  const [total, setTotal] = useState(0);
  const [running, setRunning] = useState(false);

  const reset = () => {
    const c = canvasRef.current, ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(c.width / 2, c.height / 2, c.width / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeRect(0.5, 0.5, c.width - 1, c.height - 1);
    setInside(0); setTotal(0);
  };

  useEffect(() => { reset(); }, []);

  const throwDarts = (n) => {
    const c = canvasRef.current, ctx = c.getContext("2d");
    let hit = 0;
    for (let i = 0; i < n; i++) {
      const x = Math.random(), y = Math.random();
      const isIn = (x - 0.5) ** 2 + (y - 0.5) ** 2 <= 0.25;
      if (isIn) hit++;
      ctx.fillStyle = isIn ? "#4ef0c6" : "#ff6b8a";
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x * c.width, y * c.height, 2, 2);
    }
    ctx.globalAlpha = 1;
    setInside((v) => v + hit);
    setTotal((v) => v + n);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => throwDarts(200), 50);
    return () => clearInterval(id);
  }, [running]);

  const est = total ? (4 * inside) / total : 0;
  const err = total ? Math.abs(est - Math.PI) : 0;

  return (
    <div className="panel">
      <h3>Estimate π with random darts</h3>
      <p style={{ fontSize: "0.9rem", marginTop: 0 }}>
        Throw points at a square. The fraction landing inside the inscribed circle approaches π/4.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
        <canvas ref={canvasRef} width={240} height={240} style={{ borderRadius: 8, background: "rgba(0,0,0,0.3)", maxWidth: "100%" }} />
        <div>
          <div className="stat"><span className="value">{total ? est.toFixed(5) : "—"}</span><span className="label">estimate of π</span></div>
          <div className="mono" style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "8px 0 16px" }}>
            {total.toLocaleString()} darts · {inside.toLocaleString()} inside · error {total ? err.toFixed(5) : "—"}
          </div>
          <div className="btn-row">
            <button className="btn small" onClick={() => throwDarts(100)}>+100</button>
            <button className="btn small" onClick={() => throwDarts(1000)}>+1,000</button>
            <button className={`btn small ${running ? "active" : ""}`} onClick={() => setRunning((r) => !r)}>{running ? "Stop" : "Auto"}</button>
            <button className="btn small" onClick={() => { setRunning(false); reset(); }}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Collatz() {
  const [n, setN] = useState(27);
  const seq = [];
  let x = n, guard = 0;
  while (x !== 1 && guard < 1000) { seq.push(x); x = x % 2 === 0 ? x / 2 : 3 * x + 1; guard++; }
  seq.push(1);
  const max = Math.max(...seq);
  const W = 520, H = 160;
  const pts = seq.map((v, i) => `${(i / (seq.length - 1)) * W},${H - (v / max) * (H - 10)}`).join(" ");

  return (
    <div className="panel">
      <h3>Collatz orbit</h3>
      <p style={{ fontSize: "0.9rem", marginTop: 0 }}>Halve if even, 3n+1 if odd. Nobody has proven it always reaches 1. Drag to pick a start.</p>
      <div className="field"><label>n = {n}</label><input type="range" min="2" max="500" value={n} onChange={(e) => setN(+e.target.value)} /></div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", marginTop: 12 }}>
        <polyline fill="none" stroke="url(#g)" strokeWidth="2" points={pts} style={{ strokeDasharray: 3000, strokeDashoffset: 0, animation: "none" }} />
        <defs>
          <linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#7c9cff" /><stop offset="1" stopColor="#4ef0c6" /></linearGradient>
        </defs>
      </svg>
      <div className="mono" style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{seq.length - 1} steps · peak {max.toLocaleString()}</div>
    </div>
  );
}

function PrimeSpiral() {
  const canvasRef = useRef(null);
  const [size, setSize] = useState(101);

  useEffect(() => {
    const c = canvasRef.current, ctx = c.getContext("2d");
    const N = size * size;
    const sieve = new Uint8Array(N + 1); sieve[0] = sieve[1] = 1;
    for (let i = 2; i * i <= N; i++) if (!sieve[i]) for (let j = i * i; j <= N; j += i) sieve[j] = 1;
    ctx.clearRect(0, 0, c.width, c.height);
    const cell = c.width / size;
    let x = Math.floor(size / 2), y = Math.floor(size / 2), dx = 1, dy = 0, step = 1;
    let n = 1;
    const plot = () => { if (!sieve[n]) { ctx.fillStyle = "#4ef0c6"; ctx.fillRect(x * cell, y * cell, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4)); } };
    plot();
    while (n < N) {
      for (let r = 0; r < 2 && n < N; r++) {
        for (let s = 0; s < step && n < N; s++) { x += dx; y += dy; n++; plot(); }
        [dx, dy] = [-dy, dx];
      }
      step++;
    }
  }, [size]);

  return (
    <div className="panel">
      <h3>Ulam prime spiral</h3>
      <p style={{ fontSize: "0.9rem", marginTop: 0 }}>Write the integers in a spiral and light up the primes. The diagonals are the point.</p>
      <div className="btn-row" style={{ marginBottom: 12 }}>
        {[51, 101, 201].map((s) => <button key={s} className={`btn small ${size === s ? "active" : ""}`} onClick={() => setSize(s)}>{s}×{s}</button>)}
      </div>
      <canvas ref={canvasRef} width={300} height={300} style={{ width: "100%", maxWidth: 300, borderRadius: 8, background: "rgba(0,0,0,0.3)", imageRendering: "pixelated" }} />
    </div>
  );
}

function MathLab() {
  return (
    <div className="page">
      <div className="eyebrow">Math lab</div>
      <h1>Things I can't <span className="gradient-text">stop poking at</span></h1>
      <p style={{ maxWidth: 640 }}>Applied math is my major, but these are the bits I'd play with anyway.</p>
      <div className="grid" style={{ marginTop: 24 }}>
        <Reveal><MonteCarloPi /></Reveal>
        <div className="grid grid-2">
          <Reveal delay={1}><Collatz /></Reveal>
          <Reveal delay={2}><PrimeSpiral /></Reveal>
        </div>
      </div>
    </div>
  );
}

export default MathLab;
