import React, { useState, useEffect, useContext } from "react";
import CounterDisplay from "./CounterDisplay";
import CounterControls from "./CounterControls";
import { ThemeContext } from "../../context/ThemeContext";

function CounterPage() {
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState("");
  const { theme } = useContext(ThemeContext);

  const increment = () => setCounter((prev) => prev + 1);
  const decrement = () => setCounter((prev) => prev - 1);

  // Show a message whenever the counter goes above 5
  useEffect(() => {
    if (counter > 5) {
      setMessage("You passed 5!");
    } else {
      setMessage("");
    }
  }, [counter]);

  // Reset the counter to 0 if it ever becomes negative
  useEffect(() => {
    if (counter < 0) {
      setCounter(0);
    }
  }, [counter]);

  return (
    <div className={theme === "dark" ? "page page-dark" : "page page-light"}>
      <h1>Counter</h1>
      <CounterDisplay counter={counter} />
      <CounterControls increment={increment} decrement={decrement} />
      {message && <p className="counter-message">{message}</p>}
    </div>
  );
}

export default CounterPage;
