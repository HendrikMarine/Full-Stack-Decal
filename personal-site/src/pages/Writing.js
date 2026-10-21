import React, { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import writing from "../data/writing";

const openers = ["The last train", "A spreadsheet nobody opened", "Mile nineteen", "The summer the river stopped", "A proof with one wrong line", "Her father's second company", "The town that moved its own highway"];
const constraints = ["in exactly 100 words", "without using the letter e in the first sentence", "as a list of instructions", "in second person", "with the ending written first", "where every paragraph is one sentence shorter", "in the voice of someone who is lying"];
const turns = ["and someone says the true thing too early", "and the weather disagrees", "and the number is wrong", "and nobody leaves the room", "and it turns out to be a love story", "and the narrator was never there"];

function Writing() {
  const [prompt, setPrompt] = useState(null);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const roll = () => setPrompt({ o: pick(openers), c: pick(constraints), t: pick(turns) });

  return (
    <div className="page">
      <div className="eyebrow">Creative writing</div>
      <h1>Words, <span className="gradient-text">engineered</span></h1>
      <p style={{ maxWidth: 680, fontSize: "1.05rem" }}>{writing.intro}</p>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        <Reveal>
          <div className="panel" style={{ height: "100%" }}>
            <h3>CSSSA, creative writing</h3>
            <p style={{ color: "var(--text)" }}>{writing.note}</p>
            <div>{writing.forms.map((f) => <span key={f} className="tag">{f}</span>)}</div>
            <Link to="/contact" className="btn small" style={{ marginTop: 16 }}>Ask for a piece →</Link>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="panel" style={{ height: "100%" }}>
            <h3>Prompt roulette</h3>
            <p style={{ fontSize: "0.9rem", marginTop: 0 }}>Workshop exercise from CSSSA days: an opener, a constraint, and a turn. Write for ten minutes.</p>
            <button className="btn primary" onClick={roll}>Roll a prompt</button>
            {prompt && (
              <div className="page-enter" key={prompt.o + prompt.c + prompt.t} style={{ marginTop: 18, fontSize: "1.1rem", lineHeight: 1.7 }}>
                Start with <span className="gradient-text" style={{ fontWeight: 600 }}>“{prompt.o}”</span>, write it <strong>{prompt.c}</strong>, {prompt.t}.
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default Writing;
