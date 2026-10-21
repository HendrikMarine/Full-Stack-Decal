import React, { useState } from "react";
import Reveal from "../components/Reveal";

const steps = [
  { when: "Now", title: "Berkeley + building", body: "Finish the double major with honors. Take the real estate acquisition tool from prototype to first pilots with real teams." },
  { when: "Next ~2 years", title: "Investment banking, quant, or econ consulting", body: "Work somewhere the numbers have consequences. Learn how deals and models actually get made, not just how they're taught." },
  { when: "Then", title: "JD / MBA", body: "Law plus business. Real estate and finance both run on contracts and capital, and I want to be fluent in both." },
  { when: "Eventually", title: "PhD in Mathematics", body: "Go back to the thing I'd do for free. Probably something at the edge of probability and optimization." },
];

function Goals() {
  const [active, setActive] = useState(0);
  return (
    <div className="page">
      <div className="eyebrow">Career aspirations</div>
      <h1>Where this is <span className="gradient-text">heading</span></h1>
      <p style={{ maxWidth: 640 }}>A plan, not a promise. Click a stop.</p>

      <div style={{ position: "relative", margin: "40px 0" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 18, height: 2, background: "var(--panel-border)" }} />
        <div style={{ position: "absolute", left: 0, top: 18, height: 2, background: "linear-gradient(90deg, var(--accent), var(--accent-2))", width: `${(active / (steps.length - 1)) * 100}%`, transition: "width 0.5s cubic-bezier(0.2,0.8,0.2,1)" }} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, position: "relative" }}>
          {steps.map((s, i) => (
            <button key={s.when} onClick={() => setActive(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 0 }}>
              <span style={{
                width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center",
                background: i <= active ? "var(--accent)" : "var(--bg-2)", color: i <= active ? "#06101a" : "var(--muted)",
                border: "2px solid " + (i <= active ? "var(--accent)" : "var(--panel-border)"),
                fontWeight: 700, transition: "all 0.3s", transform: i === active ? "scale(1.15)" : "none",
                boxShadow: i === active ? "0 0 24px rgba(78,240,198,0.5)" : "none",
              }} className="mono">{i + 1}</span>
              <span style={{ fontSize: "0.75rem", color: i === active ? "var(--text)" : "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }} className="mono">{s.when}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel page-enter" key={active}>
        <h2>{steps[active].title}</h2>
        <p style={{ fontSize: "1.05rem", color: "var(--text)", margin: 0 }}>{steps[active].body}</p>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn small" disabled={active === 0} onClick={() => setActive((a) => a - 1)} style={{ opacity: active === 0 ? 0.4 : 1 }}>← Previous</button>
          <button className="btn small primary" disabled={active === steps.length - 1} onClick={() => setActive((a) => a + 1)} style={{ opacity: active === steps.length - 1 ? 0.4 : 1 }}>Next →</button>
        </div>
      </div>

      <div className="divider" />
      <Reveal>
        <h2>Why this order</h2>
        <p style={{ maxWidth: 680 }}>
          Industry first because I want the math to stay attached to real decisions. The JD/MBA because the industries I care about
          (real estate, finance) are built on contracts and capital structure. The PhD last because it's the one I'd regret skipping,
          and it's better done after I know exactly which questions I want to spend years on.
        </p>
      </Reveal>
    </div>
  );
}

export default Goals;
