import React, { useEffect, useState } from "react";

// Animates a number from 0 up to `to` over `duration` ms
function Counter({ to, duration = 1200, decimals = 0, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start;
    let raf;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{val.toFixed(decimals)}{suffix}</>;
}

export default Counter;
