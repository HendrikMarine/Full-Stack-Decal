import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page" style={{ textAlign: "center" }}>
      <div className="mono" style={{ fontSize: "6rem", fontWeight: 600, lineHeight: 1 }} >
        <span className="gradient-text">404</span>
      </div>
      <p>That route doesn't exist. Which is a shame, because I built a lot of them.</p>
      <Link to="/" className="btn primary">Go home</Link>
    </div>
  );
}

export default NotFound;
