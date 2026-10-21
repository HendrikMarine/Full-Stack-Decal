import React, { useState } from "react";
import profile from "../data/profile";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.msg) return;
    // No backend here: open the user's mail client with the message prefilled.
    const body = encodeURIComponent(`${form.msg}\n\n– ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Hi from your website")}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="page">
      <div className="eyebrow">Contact</div>
      <h1>Let's <span className="gradient-text">talk</span></h1>
      <p style={{ maxWidth: 640 }}>Runs, research, real estate, or anything with a spreadsheet attached.</p>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        <form className="panel" onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          <div className="field"><label>Name</label><input value={form.name} onChange={set("name")} required /></div>
          <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set("email")} required /></div>
          <div className="field"><label>Message</label><input value={form.msg} onChange={set("msg")} required /></div>
          <button type="submit" className="btn primary" style={{ justifySelf: "start" }}>{sent ? "Opened your mail app ✓" : "Send"}</button>
        </form>
        <div className="panel">
          <h3>Elsewhere</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a className="btn" href={`mailto:${profile.email}`}>Email ↗</a>
            <a className="btn" href={profile.strava.url} target="_blank" rel="noreferrer">Strava · {profile.strava.name} ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
