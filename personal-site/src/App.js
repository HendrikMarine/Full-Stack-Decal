import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Running from "./pages/Running";
import MathLab from "./pages/MathLab";
import DataLab from "./pages/DataLab";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Goals from "./pages/Goals";
import Portfolio from "./pages/Portfolio";
import Writing from "./pages/Writing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();
  return (
    <>
      <Background />
      <Navbar />
      <ScrollToTop />
      {/* key on pathname re-mounts the page so the enter animation replays on every route change */}
      <main key={location.pathname} className="page-enter">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/running" element={<Running />} />
          <Route path="/math" element={<MathLab />} />
          <Route path="/data" element={<DataLab />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
