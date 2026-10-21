import React from "react";
import { useParams, Link } from "react-router-dom";
import writing from "../data/writing";

function WritingPiece() {
  const { slug } = useParams();
  const idx = writing.pieces.findIndex((p) => p.slug === slug);
  const piece = writing.pieces[idx];
  if (!piece) {
    return (
      <div className="page"><h1>No piece called “{slug}”</h1><Link to="/writing" className="btn">← Back to writing</Link></div>
    );
  }
  const next = writing.pieces[(idx + 1) % writing.pieces.length];
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <Link to="/writing" className="btn small" style={{ marginBottom: 24 }}>← All pieces</Link>
      <div className="eyebrow">{piece.form} · {piece.year}</div>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>{piece.title}</h1>
      <div className="panel" style={{ fontSize: "1.12rem", lineHeight: 1.85, whiteSpace: "pre-line", color: "var(--text)", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {piece.text}
      </div>
      {writing.pieces.length > 1 && (
        <div style={{ marginTop: 28 }}><Link to={`/writing/${next.slug}`} className="btn">Next: {next.title} →</Link></div>
      )}
    </div>
  );
}

export default WritingPiece;
