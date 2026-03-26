import { useState, useRef } from "react";
import { DEFAULT_DATA, resetData } from "./data.js";

const ADMIN_PASSWORD = "NOnu1234@"; // Change this!

const SECTIONS = [
  { id: "Meta", icon: "◈", desc: "Identity & hero text" },
  { id: "About", icon: "◉", desc: "Bio & focus areas" },
  { id: "Skills", icon: "◎", desc: "Proficiency levels" },
  { id: "Projects", icon: "◆", desc: "Project showcase" },
  { id: "Research", icon: "◇", desc: "Papers & publications" },
  { id: "Contact", icon: "◈", desc: "Contact section" },
];

// ── Shared Styles ─────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #030508; }
  ::selection { background: rgba(99,102,241,0.35); color: #fff; }
  
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.45); }
  
  .admin-input {
    width: 100%; background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px; color: #cbd5e1;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    padding: 10px 14px; outline: none;
    transition: all 0.25s; display: block;
  }
  .admin-input:focus { 
    border-color: rgba(99,102,241,0.45);
    background: rgba(99,102,241,0.04);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
    color: #e2e8f0;
  }
  .admin-input::placeholder { color: #1e293b; }
  
  .admin-range {
    -webkit-appearance: none; width: 100%; height: 3px;
    background: rgba(255,255,255,0.06); border-radius: 2px; cursor: pointer;
    outline: none;
  }
  .admin-range::-webkit-slider-thumb {
    -webkit-appearance: none; width: 14px; height: 14px;
    border-radius: 50%; background: #6366f1;
    box-shadow: 0 0 8px rgba(99,102,241,0.6);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }
  .admin-range::-webkit-slider-thumb:hover {
    transform: scale(1.3);
    box-shadow: 0 0 14px rgba(99,102,241,0.8);
  }
  
  .nav-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; text-align: left;
    background: transparent; border: none; border-radius: 8px;
    color: #334155; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    padding: 10px 14px;
    transition: all 0.25s; position: relative; overflow: hidden;
  }
  .nav-btn::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 0; background: rgba(99,102,241,0.08);
    transition: width 0.3s;
  }
  .nav-btn:hover { color: #94a3b8; }
  .nav-btn:hover::before { width: 100%; }
  .nav-btn.active { color: #e2e8f0; background: rgba(99,102,241,0.1); }
  .nav-btn.active::after {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 2px; background: linear-gradient(180deg, #3b82f6, #8b5cf6);
    border-radius: 0 2px 2px 0;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border: none; border-radius: 8px; color: #fff;
    cursor: pointer; font-family: 'Space Mono', monospace;
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 10px 20px; transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(99,102,241,0.25);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); opacity: 0.9; }
  
  .btn-ghost {
    background: transparent; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #475569;
    cursor: pointer; font-family: 'Space Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.08em;
    padding: 9px 18px; transition: all 0.25s;
  }
  .btn-ghost:hover { border-color: rgba(99,102,241,0.3); color: #818cf8; }
  
  .btn-danger {
    background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15);
    border-radius: 8px; color: #f87171;
    cursor: pointer; font-family: 'Space Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.08em;
    padding: 9px 18px; transition: all 0.25s;
  }
  .btn-danger:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); }
  
  .card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; padding: 24px; margin-bottom: 20px;
    transition: border-color 0.3s;
  }
  .card:hover { border-color: rgba(255,255,255,0.09); }
  
  .card-title {
    font-family: 'Space Mono', monospace; font-size: 0.65rem;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #1e3a5f; margin-bottom: 20px;
  }
  
  .field-label {
    display: block; font-family: 'Space Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #334155; margin-bottom: 6px;
  }
  
  .tag-chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.18);
    border-radius: 4px; color: #818cf8;
    font-family: 'Space Mono', monospace; font-size: 0.65rem;
    letter-spacing: 0.06em; padding: 3px 9px; margin: 2px;
    cursor: pointer; transition: all 0.2s;
  }
  .tag-chip:hover { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); color: #f87171; }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(16px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeScale {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes savedPop {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  .section-anim { animation: slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
  .card-anim { animation: fadeScale 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
  .saved-anim { animation: savedPop 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
  
  @keyframes scanline {
    0% { transform: translateY(-8px); }
    100% { transform: translateY(100%); }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const attempt = () => {
    if (loading) return;
    if (pw === ADMIN_PASSWORD) {
      setLoading(true);
      setTimeout(() => onLogin(), 600);
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => { setErr(false); setShake(false); }, 1800);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#030508",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{css}</style>

      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Glow orb */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(255,255,255,0.02)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: "56px 48px", width: 400,
        textAlign: "center", position: "relative",
        animation: "fadeScale 0.5s cubic-bezier(0.16,1,0.3,1)",
        transform: shake ? "translateX(0)" : "none",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
        }} />

        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: "0 auto 24px",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem",
        }}>⌥</div>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#f1f5f9", marginBottom: 6, letterSpacing: "-0.02em" }}>
          Admin Console
        </h2>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#1e293b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 36 }}>
          Authenticate to continue
        </p>

        <div style={{ position: "relative", marginBottom: err ? 8 : 24 }}>
          <input
            type="password" placeholder="Enter password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            className="admin-input"
            style={{
              textAlign: "center", letterSpacing: "0.2em", fontSize: "1rem",
              border: err ? "1px solid rgba(239,68,68,0.4)" : undefined,
              background: err ? "rgba(239,68,68,0.04)" : undefined,
              transition: "all 0.2s",
              marginBottom: 0,
            }}
          />
        </div>

        {err && (
          <p style={{
            fontFamily: "'Space Mono', monospace", color: "#f87171",
            fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 16,
          }}>⊘ Incorrect password</p>
        )}

        <div style={{ marginBottom: err ? 0 : undefined }}>
          <button className="btn-primary" style={{ width: "100%", padding: "13px", fontSize: "0.72rem" }} onClick={attempt}>
            {loading ? "Authenticating..." : "Enter Console →"}
          </button>
        </div>

        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#0f172a", marginTop: 24, letterSpacing: "0.08em" }}>
          Default: admin123 · Change in AdminConsole.jsx
        </p>
      </div>
    </div>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", rows, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="field-label">{label}</label>
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
          placeholder={placeholder}
          className="admin-input" style={{ resize: "vertical", lineHeight: 1.6 }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="admin-input" />
      )}
    </div>
  );
}

function SliderField({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <label className="field-label" style={{ marginBottom: 0 }}>{label}</label>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#6366f1", fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ position: "relative" }}>
        <input type="range" min={0} max={100} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="admin-range"
          style={{
            background: `linear-gradient(90deg, #6366f1 ${value}%, rgba(255,255,255,0.06) ${value}%)`,
          }}
        />
      </div>
    </div>
  );
}

function TagEditor({ tags, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) { onChange([...tags, t]); }
    setInput("");
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="field-label">Tags</label>
      <div style={{ marginBottom: 10, minHeight: 28 }}>
        {tags.map(t => (
          <span key={t} className="tag-chip" onClick={() => onChange(tags.filter(x => x !== t))} title="Click to remove">
            {t} ✕
          </span>
        ))}
        {tags.length === 0 && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#0f172a", letterSpacing: "0.08em" }}>No tags yet</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Type tag, press Enter" className="admin-input"
          style={{ flex: 1, marginBottom: 0 }} />
        <button className="btn-ghost" onClick={add}>Add</button>
      </div>
    </div>
  );
}

// ── Row helper ────────────────────────────────────────────────────────────────
const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>{children}</div>
);

// ── Section Editors ───────────────────────────────────────────────────────────
function MetaEditor({ meta, onChange }) {
  const set = (k, v) => onChange({ ...meta, [k]: v });
  return (
    <div className="section-anim">
      <div className="card card-anim">
        <p className="card-title">Identity</p>
        <Row>
          <Field label="Full Name" value={meta.name} onChange={v => set("name", v)} />
          <Field label="Role / Title" value={meta.role} onChange={v => set("role", v)} />
        </Row>
        <Row>
          <Field label="Email" value={meta.email} onChange={v => set("email", v)} type="email" />
          <Field label="Footer Year" value={meta.footerYear} onChange={v => set("footerYear", v)} />
        </Row>
        <Row>
          <Field label="GitHub URL" value={meta.github} onChange={v => set("github", v)} />
          <Field label="LinkedIn URL" value={meta.linkedin} onChange={v => set("linkedin", v)} />
        </Row>
      </div>
      <div className="card" style={{ animationDelay: "0.06s" }}>
        <p className="card-title">Hero Section</p>
        <Row>
          <Field label="Hero Line 1" value={meta.heroLine1} onChange={v => set("heroLine1", v)} />
          <Field label="Hero Line 2" value={meta.heroLine2} onChange={v => set("heroLine2", v)} />
        </Row>
        <Row>
          <Field label="Hero Line 3" value={meta.heroLine3} onChange={v => set("heroLine3", v)} />
          <Field label="Currently Exploring" value={meta.currentlyExploring} onChange={v => set("currentlyExploring", v)} />
        </Row>
        <Field label="Hero Bio" value={meta.heroBio} onChange={v => set("heroBio", v)} rows={2} />
        <Field label="Hero Sub" value={meta.heroSub} onChange={v => set("heroSub", v)} rows={2} />
      </div>
    </div>
  );
}

function AboutEditor({ about, onChange }) {
  const set = (k, v) => onChange({ ...about, [k]: v });
  const setArea = (i, k, v) => {
    const fa = [...about.focusAreas];
    fa[i] = { ...fa[i], [k]: v };
    onChange({ ...about, focusAreas: fa });
  };
  return (
    <div className="section-anim">
      <div className="card">
        <p className="card-title">Bio Paragraphs</p>
        <Field label="Paragraph 1" value={about.para1} onChange={v => set("para1", v)} rows={3} />
        <Field label="Paragraph 2" value={about.para2} onChange={v => set("para2", v)} rows={3} />
      </div>
      <div className="card">
        <p className="card-title">Focus Areas</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          {about.focusAreas.map((area, i) => (
            <div key={i} style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 8, padding: "16px 16px 4px", marginBottom: 12 }}>
              <Row>
                <Field label="Icon" value={area.icon} onChange={v => setArea(i, "icon", v)} />
                <Field label="Label" value={area.label} onChange={v => setArea(i, "label", v)} />
              </Row>
              <Field label="Subtitle" value={area.sub} onChange={v => setArea(i, "sub", v)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsEditor({ skills, onChange }) {
  const add = () => onChange([...skills, { name: "New Skill", level: 75 }]);
  const remove = (i) => onChange(skills.filter((_, idx) => idx !== i));
  const set = (i, k, v) => onChange(skills.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  return (
    <div className="section-anim">
      <div className="card">
        <p className="card-title">Skills — {skills.length} total</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {skills.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <input value={s.name} onChange={e => set(i, "name", e.target.value)}
                  className="admin-input" style={{ flex: 1, marginBottom: 0 }} placeholder="Skill name" />
                <button className="btn-danger" style={{ padding: "8px 12px", flexShrink: 0 }} onClick={() => remove(i)}>✕</button>
              </div>
              <SliderField label={s.name} value={s.level} onChange={v => set(i, "level", v)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn-ghost" onClick={add}>+ Add Skill</button>
        </div>
      </div>
    </div>
  );
}

function ProjectsEditor({ projects, onChange }) {
  const add = () => onChange([...projects, { id: `p${Date.now()}`, title: "New Project", icon: "🔧", desc: "", tags: [], link: "" }]);
  const remove = (i) => onChange(projects.filter((_, idx) => idx !== i));
  const set = (i, k, v) => onChange(projects.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
  return (
    <div className="section-anim">
      {projects.map((p, i) => (
        <div key={p.id} className="card" style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#1e3a5f", letterSpacing: "0.15em" }}>
                PROJECT 0{i + 1}
              </span>
              <span style={{ color: "#475569", fontSize: "1.1rem" }}>{p.icon}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#94a3b8", fontSize: "0.9rem" }}>{p.title}</span>
            </div>
            <button className="btn-danger" style={{ padding: "6px 12px", fontSize: "0.65rem" }} onClick={() => remove(i)}>Remove</button>
          </div>
          <Row>
            <Field label="Title" value={p.title} onChange={v => set(i, "title", v)} />
            <Field label="Icon (emoji)" value={p.icon} onChange={v => set(i, "icon", v)} />
          </Row>
          <Field label="Description" value={p.desc} onChange={v => set(i, "desc", v)} rows={3} />
          <Field label="Link (optional)" value={p.link} onChange={v => set(i, "link", v)} />
          <TagEditor tags={p.tags} onChange={v => set(i, "tags", v)} />
        </div>
      ))}
      <button className="btn-ghost" onClick={add}>+ Add Project</button>
    </div>
  );
}

function ResearchEditor({ research, onChange }) {
  const set = (i, k, v) => onChange(research.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const add = () => onChange([...research, { id: `r${Date.now()}`, title: "New Paper", year: new Date().getFullYear().toString(), abstract: "", link: "" }]);
  const remove = (i) => onChange(research.filter((_, idx) => idx !== i));
  return (
    <div className="section-anim">
      {research.map((r, i) => (
        <div key={r.id} className="card" style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#1e3a5f", letterSpacing: "0.15em" }}>PAPER 0{i + 1}</span>
            <button className="btn-danger" style={{ padding: "6px 12px", fontSize: "0.65rem" }} onClick={() => remove(i)}>Remove</button>
          </div>
          <Row>
            <Field label="Title" value={r.title} onChange={v => set(i, "title", v)} />
            <Field label="Year" value={r.year} onChange={v => set(i, "year", v)} />
          </Row>
          <Field label="Abstract" value={r.abstract} onChange={v => set(i, "abstract", v)} rows={4} />
          <Field label="Link (optional)" value={r.link} onChange={v => set(i, "link", v)} />
        </div>
      ))}
      <button className="btn-ghost" onClick={add}>+ Add Paper</button>
    </div>
  );
}

function ContactEditor({ contact, onChange }) {
  const set = (k, v) => onChange({ ...contact, [k]: v });
  return (
    <div className="section-anim">
      <div className="card">
        <p className="card-title">Contact Section</p>
        <Field label="Heading" value={contact.heading} onChange={v => set("heading", v)} />
        <Field label="Subheading" value={contact.subheading} onChange={v => set("subheading", v)} rows={3} />
      </div>
    </div>
  );
}

// ── Main Admin Console ────────────────────────────────────────────────────────
export default function AdminConsole({ data, setData, onBack }) {
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState("Meta");
  const [saved, setSaved] = useState(false);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const update = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Reset all data to defaults? This cannot be undone.")) {
      setData(resetData());
    }
  };

  const renderSection = () => {
    switch (section) {
      case "Meta": return <MetaEditor meta={data.meta} onChange={v => update("meta", v)} />;
      case "About": return <AboutEditor about={data.about} onChange={v => update("about", v)} />;
      case "Skills": return <SkillsEditor skills={data.skills} onChange={v => update("skills", v)} />;
      case "Projects": return <ProjectsEditor projects={data.projects} onChange={v => update("projects", v)} />;
      case "Research": return <ResearchEditor research={data.research} onChange={v => update("research", v)} />;
      case "Contact": return <ContactEditor contact={data.contact} onChange={v => update("contact", v)} />;
      default: return null;
    }
  };

  const activeSection = SECTIONS.find(s => s.id === section);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#030508", minHeight: "100vh", color: "#cbd5e1", display: "flex" }}>
      <style>{css}</style>

      {/* Sidebar */}
      <div style={{
        width: 240, background: "rgba(255,255,255,0.015)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 10,
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem",
            }}>⌥</div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#f1f5f9", letterSpacing: "-0.01em" }}>Admin</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "#1e293b", letterSpacing: "0.12em", textTransform: "uppercase" }}>Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "16px 12px", flex: 1 }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#0f172a", padding: "0 6px", marginBottom: 8 }}>Sections</p>
          {SECTIONS.map(s => (
            <button key={s.id} className={`nav-btn${section === s.id ? " active" : ""}`} onClick={() => setSection(s.id)}>
              <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: "0.85rem", lineHeight: 1.2 }}>{s.id}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: section === s.id ? "#475569" : "#0f172a", letterSpacing: "0.06em", marginTop: 1 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn-primary" style={{ width: "100%", padding: "10px" }} onClick={handleSave}>
            💾 Save Changes
          </button>
          <button className="btn-ghost" style={{ width: "100%", padding: "9px", textAlign: "center" }} onClick={onBack}>
            ← View Site
          </button>
          <button className="btn-danger" style={{ width: "100%", padding: "9px", textAlign: "center" }} onClick={handleReset}>
            ↺ Reset Defaults
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 240, flex: 1, padding: "48px 52px", maxWidth: "calc(100vw - 240px)", overflowX: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 40, paddingBottom: 24,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1e293b", marginBottom: 6 }}>
              Editing · {activeSection?.desc}
            </p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              {section}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {saved && (
              <div className="saved-anim" style={{
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 8, color: "#34d399",
                fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                letterSpacing: "0.1em", padding: "8px 16px",
              }}>
                ✓ Saved to browser
              </div>
            )}
            <button className="btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>

        {/* Section content */}
        <div style={{ maxWidth: 860 }}>
          {renderSection()}
        </div>

        {/* Export footer */}
        <div style={{
          marginTop: 48, padding: "20px 24px",
          background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 12,
        }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#1e293b", lineHeight: 1.9, letterSpacing: "0.04em" }}>
            <span style={{ color: "#3b4a5a" }}>💡 TIP —</span> Changes save automatically to localStorage. To bake into the build: export below → replace{" "}
            <code style={{ color: "#6366f1", background: "rgba(99,102,241,0.08)", padding: "1px 6px", borderRadius: 3 }}>src/data.js</code>{" "}
            → push to Netlify.
          </p>
          <button className="btn-ghost" style={{ marginTop: 14 }} onClick={() => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([`export const DEFAULT_DATA = ${json};\n\nconst STORAGE_KEY = "portfolio_data_v1";\nexport function loadData(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)return JSON.parse(raw);}catch(_){}return structuredClone(DEFAULT_DATA);}\nexport function saveData(data){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}\nexport function resetData(){localStorage.removeItem(STORAGE_KEY);return structuredClone(DEFAULT_DATA);}`], { type: "text/javascript" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "data.js"; a.click();
            URL.revokeObjectURL(url);
          }}>⬇ Export data.js for Netlify</button>
        </div>
      </div>
    </div>
  );
}
