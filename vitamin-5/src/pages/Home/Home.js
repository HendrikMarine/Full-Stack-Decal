import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "dark" ? "page page-dark" : "page page-light"}>
      <h1>Welcome to my React app!</h1>
      <p>
        This site was built for the Full Stack DeCal React vitamin. It uses
        React Router to move between pages, useState and useEffect for the
        counter, and useContext to share the {theme} theme across every page.
      </p>
      <p>Head over to the Counter page to try it out, or toggle the theme up top.</p>
    </div>
  );
}

export default Home;
