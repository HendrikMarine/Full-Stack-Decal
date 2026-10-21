import React, { useState } from "react";
import Reveal from "../components/Reveal";

const facts = {
  School: "UC Berkeley, College of Letters & Science. Double major in Applied Mathematics and Economics with a Data Science minor, working toward honors in both majors.",
  Movement: "I run (tracked on Strava), lift, and hold an active ISSA Personal Trainer certification. Movement is how I reset.",
  Math: "I like math that gives you a mental model for something real: probability, optimization, dynamics. Stats is my bridge into economics.",
  Data: "Give me a messy dataset and a question and I'm happy. Most of my projects start as a spreadsheet and end as code.",
  Building: "I've co-founded a research group and a startup club, founded a community club, and I'm now building a real estate acquisition tool.",
  Languages: "Bilingual in English and Spanish.",
};

function About() {
  const [active, setActive] = useState("School");

  return (
    <div className="page">
      <div className="eyebrow">About</div>
      <h1>Hobbies, habits, and <span className="gradient-text">how I think</span></h1>
      <p style={{ maxWidth: 640 }}>Pick a topic. The button row is the table of contents.</p>

      <div className="btn-row" style={{ margin: "24px 0" }}>
        {Object.keys(facts).map((k) => (
          <button key={k} className={`btn small ${active === k ? "active" : ""}`} onClick={() => setActive(k)}>
            {k}
          </button>
        ))}
      </div>

      <div className="panel page-enter" key={active} style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
        <h3>{active}</h3>
        <p style={{ margin: 0, color: "var(--text)" }}>{facts[active]}</p>
      </div>

      <div className="divider" />

      <h2>A week in motion</h2>
      <p>Roughly how my hours split up in a normal week. Hover the bars.</p>
      <Reveal>
        <div className="panel">
          {[
            ["Classes + problem sets", 35, "var(--accent-2)"],
            ["Building (acquisition tool, research)", 20, "var(--accent)"],
            ["Running + training", 8, "var(--accent-3)"],
            ["Clubs + community", 6, "var(--danger)"],
            ["Everything else", 31, "rgba(255,255,255,0.2)"],
          ].map(([label, hrs, color], k) => (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr 3fr auto", alignItems: "center", gap: 12, margin: "10px 0" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{label}</span>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden", height: 14 }}>
                <div
                  title={`${hrs} hrs`}
                  style={{
                    width: `${hrs}%`, height: "100%", background: color, borderRadius: 999,
                    animation: `fade-up 0.8s ${k * 0.1}s both`, transition: "filter 0.2s", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                />
              </div>
              <span className="mono" style={{ fontSize: "0.85rem" }}>{hrs}h</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

export default About;
