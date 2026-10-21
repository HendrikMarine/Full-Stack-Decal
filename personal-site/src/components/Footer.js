import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--panel-border)", padding: "32px 24px", textAlign: "center" }}>
      <p className="mono" style={{ fontSize: "0.8rem", margin: 0 }}>
        Built with React + React Router. <Link to="/contact">Say hi</Link>.
      </p>
    </footer>
  );
}

export default Footer;
