import React, { useState } from "react";
import { Link } from "react-router-dom";
import projects from "../data/projects";
import Reveal from "../components/Reveal";

function Projects() {
  const allTags = [...new Set(projects.flatMap((p) => p.tags))];
  const [filter, setFilter] = useState(null);
  const shown = filter ? projects.filter((p) => p.tags.includes(filter)) : projects;

  return (
    <div className="page">
      <div className="eyebrow">Projects</div>
      <h1>What I'm <span className="gradient-text">building</span></h1>
      <p style={{ maxWidth: 640 }}>Filter by tag. Click a card for the full story; every project has its own route.</p>

      <div className="btn-row" style={{ margin: "20px 0" }}>
        <button className={`btn small ${!filter ? "active" : ""}`} onClick={() => setFilter(null)}>All</button>
        {allTags.map((t) => (
          <button key={t} className={`btn small ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      <div className="grid grid-2">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 4) + 1}>
            <Link to={`/projects/${p.slug}`} className="panel hover" style={{ display: "block", textDecoration: "none", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span className="tag" style={{ margin: 0, color: "var(--accent)", borderColor: "rgba(78,240,198,0.4)" }}>{p.status}</span>
                <span style={{ color: "var(--muted)" }}>→</span>
              </div>
              <h3>{p.name}</h3>
              <p style={{ fontSize: "0.95rem" }}>{p.summary}</p>
              <div>{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default Projects;
