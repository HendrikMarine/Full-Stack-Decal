import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";

const words = ["runner", "math student", "data person", "writer", "builder", "economist in training"];

function Home() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");

  // Typewriter effect: type a word, pause, delete it, move to the next
  useEffect(() => {
    const word = words[i];
    let idx = 0;
    let deleting = false;
    let timer;
    const tick = () => {
      if (!deleting) {
        idx++;
        setTyped(word.slice(0, idx));
        if (idx === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1400);
          return;
        }
        timer = setTimeout(tick, 80);
      } else {
        idx--;
        setTyped(word.slice(0, idx));
        if (idx === 0) {
          setI((n) => (n + 1) % words.length);
          return;
        }
        timer = setTimeout(tick, 45);
      }
    };
    timer = setTimeout(tick, 200);
    return () => clearTimeout(timer);
  }, [i]);

  return (
    <div className="page">
      <section style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="eyebrow">Berkeley · Applied Math + Economics · Data Science</div>
        <h1>
          Hi, I'm Hendrik.<br />
          I'm a <span className="gradient-text">{typed}</span>
          <span className="mono" style={{ animation: "pulse 1s infinite" }}>_</span>
        </h1>
        <p style={{ maxWidth: 620, fontSize: "1.15rem" }}>
          I run, I do math, I mess with data, and I'm building a tool that helps real estate teams
          decide when to buy and when to sell. This site is a tour of all of that.
        </p>
        <div className="btn-row" style={{ marginTop: 24 }}>
          <Link to="/projects" className="btn primary">See what I'm building →</Link>
          <Link to="/running" className="btn">Running lab</Link>
          <Link to="/math" className="btn">Math lab</Link>
          <Link to="/data" className="btn">Data lab</Link>
          <Link to="/portfolio" className="btn">Portfolio</Link>
          <Link to="/writing" className="btn">Writing</Link>
        </div>
      </section>

      <div className="divider" />

      <section className="grid grid-3">
        {[
          { to: "/running", label: "Miles, pace, and a plan", value: 26.2, dec: 1, suffix: "", title: "Running" },
          { to: "/math", label: "Estimate π by throwing darts", value: 3.14159, dec: 5, suffix: "", title: "Math" },
          { to: "/data", label: "Fit a line to anything", value: 0.97, dec: 2, suffix: " r²", title: "Data" },
        ].map((c, k) => (
          <Reveal key={c.to} delay={k + 1}>
            <Link to={c.to} className="panel hover" style={{ display: "block", textDecoration: "none" }}>
              <div className="eyebrow">{c.title}</div>
              <div className="stat">
                <span className="value"><Counter to={c.value} decimals={c.dec} suffix={c.suffix} /></span>
                <span className="label">{c.label}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      <div className="divider" />

      <Reveal>
        <section className="panel" style={{ overflow: "hidden", padding: "18px 0" }}>
          <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marquee 18s linear infinite" }} className="mono">
            {[...Array(2)].map((_, r) => (
              <span key={r} style={{ paddingRight: 48, color: "var(--muted)" }}>
                RUNNING · MATHEMATICS · DATA · ECONOMETRICS · REAL ESTATE · PORTFOLIO THEORY · CREATIVE WRITING · RESEARCH · BERKELEY ·&nbsp;
              </span>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}

export default Home;
