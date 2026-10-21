import React from "react";

// Shows the current value of the counter
function CounterDisplay({ counter }) {
  return (
    <div>
      <h2>
        Current count: <span className="counter-value">{counter}</span>
      </h2>
    </div>
  );
}

export default CounterDisplay;
