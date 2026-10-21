import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Per-route accent colors so the particle field shifts as you navigate
const palettes = {
  "/": ["#4ef0c6", "#7c9cff"],
  "/about": ["#7c9cff", "#4ef0c6"],
  "/running": ["#ffb454", "#ff6b8a"],
  "/math": ["#7c9cff", "#c084fc"],
  "/data": ["#4ef0c6", "#ffb454"],
  "/projects": ["#ff6b8a", "#7c9cff"],
  "/goals": ["#ffb454", "#4ef0c6"],
  "/contact": ["#c084fc", "#4ef0c6"],
};

function Background() {
  const canvasRef = useRef(null);
  const { pathname } = useLocation();
  const paletteRef = useRef(palettes["/"]);

  useEffect(() => {
    const base = "/" + pathname.split("/")[1];
    paletteRef.current = palettes[base] || palettes["/"];
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, raf;
    const mouse = { x: -9999, y: -9999 };
    const N = 70;
    const points = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    for (let i = 0; i < N; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 2,
      });
    }

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const [c1, c2] = paletteRef.current;

      // soft glow blobs
      const g1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 0, width * 0.2, height * 0.3, width * 0.5);
      g1.addColorStop(0, c1 + "22");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);
      const g2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 0, width * 0.8, height * 0.7, width * 0.5);
      g2.addColorStop(0, c2 + "1f");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      for (const p of points) {
        // gentle attraction toward the cursor
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 160 * 160) { p.vx += dx * 0.00008; p.vy += dy * 0.00008; }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.995; p.vy *= 0.995;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      // connections
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = points[i], b = points[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = c1 + Math.floor((1 - d / 130) * 70).toString(16).padStart(2, "0");
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of points) {
        ctx.fillStyle = c2;
        ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}

export default Background;
