import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Theme is either "light" or "dark"; light by default
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
