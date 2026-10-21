import React from "react";

// Provides buttons to change the counter value
function CounterControls({ increment, decrement }) {
  return (
    <div>
      <button onClick={increment}>Increase</button>
      <button onClick={decrement}>Decrease</button>
    </div>
  );
}

export default CounterControls;
