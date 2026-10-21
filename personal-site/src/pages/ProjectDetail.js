import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import projects from "../data/projects";

function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];

  if (!project) {
    return (
      <div className="page">
        <h1>No project called “{slug}”</h1>
        <Link to="/projects" className="btn">← Back to projects</Link>
      </div>
    );
  }

  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <div className="page">
      <button className="btn small" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>← Back</button>
      <div className="eyebrow">{project.status}</div>
      <h1>{project.name}</h1>
      <p style={{ fontSize: "1.15rem", maxWidth: 680 }}>{project.summary}</p>
      <div style={{ margin: "16px 0 32px" }}>{project.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>

      {project.metrics && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="eyebrow">By the numbers</div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
            {project.metrics.map((m) => (
              <div key={m.label} className="stat">
                <span className="value" style={{ fontSize: "1.25rem" }}>{m.value}</span>
                <span className="label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div className="panel">
          {project.details.map((d, i) => <p key={i} style={{ color: "var(--text)", fontSize: "1.02rem" }}>{d}</p>)}
        </div>
        <div className="panel">
          <h3>Stack</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", lineHeight: 1.9 }}>
            {project.stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, gap: 12, flexWrap: "wrap" }}>
        <Link to={`/projects/${prev.slug}`} className="btn">← {prev.name}</Link>
        <Link to={`/projects/${next.slug}`} className="btn">{next.name} →</Link>
      </div>
    </div>
  );
}

export default ProjectDetail;
