import { useState } from "react";
import { DEFAULT_DATA, resetData } from "./data.js";

const ADMIN_PASSWORD = "NOnu1234@"; // Change this!

const S = {
  wrap: { fontFamily: "'DM Sans', sans-serif", background: "#070c14", minHeight: "100vh", color: "#c8d8e8" },
  sidebar: { width: 220, background: "#0b1120", borderRight: "1px solid #1a2a3e", display: "flex", flexDirection: "column", padding: "24px 0", gap: 4, position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 10, overflowY: "auto" },
  main: { marginLeft: 220, padding: "40px 48px", maxWidth: 900 },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8e4d9", marginBottom: 6 },
  subtext: { fontSize: "0.82rem", color: "#4a6080", marginBottom: 32 },
  label: { display: "block", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a7090", marginBottom: 6 },
  input: { width: "100%", background: "#0d1a2a", border: "1px solid #1e3048", borderRadius: 8, color: "#c8d8e8", fontSize: "0.9rem", padding: "10px 14px", outline: "none", fontFamily: "'DM Sans', sans-serif", marginBottom: 16, transition: "border-color 0.2s", boxSizing: "border-box" },
  textarea: { width: "100%", background: "#0d1a2a", border: "1px solid #1e3048", borderRadius: 8, color: "#c8d8e8", fontSize: "0.9rem", padding: "10px 14px", outline: "none", fontFamily: "'DM Sans', sans-serif", marginBottom: 16, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" },
  card: { background: "#0d1a2a", border: "1px solid #1a2e46", borderRadius: 12, padding: "24px", marginBottom: 20 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" },
  btnPrimary: { background: "linear-gradient(135deg,#1e4f8c,#2563be)", border: "none", borderRadius: 8, color: "#e8e4d9", cursor: "pointer", fontSize: "0.88rem", padding: "10px 22px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em", transition: "opacity 0.2s" },
  btnDanger: { background: "#2a1010", border: "1px solid #5c1a1a", borderRadius: 8, color: "#e07070", cursor: "pointer", fontSize: "0.8rem", padding: "8px 16px", fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.2s" },
  btnGhost: { background: "transparent", border: "1px solid #1e3048", borderRadius: 8, color: "#6a8090", cursor: "pointer", fontSize: "0.82rem", padding: "7px 16px", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s, color 0.2s" },
  tag: { display: "inline-block", background: "#0b1625", border: "1px solid #1e3a5c", borderRadius: 20, color: "#7ab3e0", fontSize: "0.75rem", padding: "3px 10px", margin: "2px", cursor: "pointer" },
  sectionTitle: { fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3a5070", fontWeight: 500, padding: "6px 20px 4px", marginTop: 12 },
  navBtn: (active) => ({
    display: "block", width: "100%", textAlign: "left", background: active ? "#0f1c2e" : "transparent",
    border: "none", borderLeft: `3px solid ${active ? "#4a9eff" : "transparent"}`,
    color: active ? "#e8e4d9" : "#5a7890", cursor: "pointer", fontSize: "0.85rem",
    padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
  }),
  saved: { background: "#0d2a1a", border: "1px solid #1a5c30", borderRadius: 8, color: "#4acd80", fontSize: "0.82rem", padding: "8px 16px", display: "inline-block" },
};

const SECTIONS = ["Meta", "About", "Skills", "Projects", "Research", "Contact"];

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => {
    if (pw === ADMIN_PASSWORD) { onLogin(); } else { setErr(true); setTimeout(() => setErr(false), 1800); }
  };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#070c14" }}>
      <div style={{ background: "#0b1120", border: "1px solid #1a2a3e", borderRadius: 16, padding: "48px 40px", width: 360, textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>⚙️</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#e8e4d9", marginBottom: 6 }}>Admin Console</h2>
        <p style={{ fontSize: "0.82rem", color: "#3a5070", marginBottom: 28 }}>Enter password to continue</p>
        <input
          type="password" placeholder="Password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()}
          style={{ ...S.input, textAlign: "center", border: err ? "1px solid #5c1a1a" : "1px solid #1e3048" }}
        />
        {err && <p style={{ color: "#e07070", fontSize: "0.8rem", marginTop: -10, marginBottom: 12 }}>Incorrect password</p>}
        <button style={{ ...S.btnPrimary, width: "100%", padding: "12px" }} onClick={attempt}>Enter Console</button>
        <p style={{ fontSize: "0.72rem", color: "#2a3a4a", marginTop: 16 }}>Default: admin123 — change in AdminConsole.jsx</p>
      </div>
    </div>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", rows }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {rows
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} style={S.textarea} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={S.input} />
      }
    </div>
  );
}

function SliderField({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ ...S.label, display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span style={{ color: "#4a9eff" }}>{value}%</span>
      </label>
      <input type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#4a9eff", marginBottom: 8 }} />
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
      <label style={S.label}>Tags</label>
      <div style={{ marginBottom: 8 }}>
        {tags.map(t => (
          <span key={t} style={S.tag} onClick={() => onChange(tags.filter(x => x !== t))} title="Click to remove">
            {t} ✕
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Add tag, press Enter" style={{ ...S.input, marginBottom: 0, flex: 1 }} />
        <button style={S.btnGhost} onClick={add}>Add</button>
      </div>
    </div>
  );
}

// ── Section Editors ───────────────────────────────────────────────────────────
function MetaEditor({ meta, onChange }) {
  const set = (k, v) => onChange({ ...meta, [k]: v });
  return (
    <div>
      <h2 style={S.heading}>Meta & Hero</h2>
      <p style={S.subtext}>Name, taglines, links, and hero section text</p>
      <div style={S.card}>
        <h3 style={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a7090", marginBottom: 18 }}>Identity</h3>
        <div style={S.row}>
          <Field label="Full Name" value={meta.name} onChange={v => set("name", v)} />
          <Field label="Role / Title" value={meta.role} onChange={v => set("role", v)} />
        </div>
        <div style={S.row}>
          <Field label="Email" value={meta.email} onChange={v => set("email", v)} type="email" />
          <Field label="Footer Year" value={meta.footerYear} onChange={v => set("footerYear", v)} />
        </div>
        <div style={S.row}>
          <Field label="GitHub URL" value={meta.github} onChange={v => set("github", v)} />
          <Field label="LinkedIn URL" value={meta.linkedin} onChange={v => set("linkedin", v)} />
        </div>
      </div>
      <div style={S.card}>
        <h3 style={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a7090", marginBottom: 18 }}>Hero Section</h3>
        <div style={S.row}>
          <Field label="Hero Line 1" value={meta.heroLine1} onChange={v => set("heroLine1", v)} />
          <Field label="Hero Line 2" value={meta.heroLine2} onChange={v => set("heroLine2", v)} />
        </div>
        <Field label="Hero Line 3" value={meta.heroLine3} onChange={v => set("heroLine3", v)} />
        <Field label="Hero Bio (main)" value={meta.heroBio} onChange={v => set("heroBio", v)} rows={2} />
        <Field label="Hero Sub (secondary)" value={meta.heroSub} onChange={v => set("heroSub", v)} rows={2} />
        <Field label="Currently Exploring (badge)" value={meta.currentlyExploring} onChange={v => set("currentlyExploring", v)} />
      </div>
    </div>
  );
}

function AboutEditor({ about, onChange }) {
  const setField = (k, v) => onChange({ ...about, [k]: v });
  const setFocus = (i, k, v) => {
    const next = about.focusAreas.map((f, idx) => idx === i ? { ...f, [k]: v } : f);
    setField("focusAreas", next);
  };
  return (
    <div>
      <h2 style={S.heading}>About</h2>
      <p style={S.subtext}>Bio paragraphs and focus area cards</p>
      <div style={S.card}>
        <Field label="Paragraph 1" value={about.para1} onChange={v => setField("para1", v)} rows={3} />
        <Field label="Paragraph 2" value={about.para2} onChange={v => setField("para2", v)} rows={3} />
      </div>
      <div style={S.card}>
        <h3 style={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a7090", marginBottom: 18 }}>Focus Area Cards</h3>
        {about.focusAreas.map((f, i) => (
          <div key={i} style={{ borderBottom: i < about.focusAreas.length - 1 ? "1px solid #1a2e46" : "none", paddingBottom: 16, marginBottom: 16 }}>
            <div style={S.row}>
              <Field label={`Card ${i + 1} Icon (emoji)`} value={f.icon} onChange={v => setFocus(i, "icon", v)} />
              <Field label="Label" value={f.label} onChange={v => setFocus(i, "label", v)} />
            </div>
            <Field label="Subtitle" value={f.sub} onChange={v => setFocus(i, "sub", v)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsEditor({ skills, onChange }) {
  const setSkill = (i, k, v) => onChange(skills.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const addSkill = () => onChange([...skills, { name: "New Skill", level: 70 }]);
  const removeSkill = (i) => onChange(skills.filter((_, idx) => idx !== i));
  return (
    <div>
      <h2 style={S.heading}>Technical Skills</h2>
      <p style={S.subtext}>Skill names and proficiency levels</p>
      {skills.map((s, i) => (
        <div key={i} style={{ ...S.card, position: "relative" }}>
          <button style={{ ...S.btnDanger, position: "absolute", top: 16, right: 16, fontSize: "0.72rem", padding: "5px 12px" }} onClick={() => removeSkill(i)}>Remove</button>
          <Field label={`Skill ${i + 1} Name`} value={s.name} onChange={v => setSkill(i, "name", v)} />
          <SliderField label="Proficiency" value={s.level} onChange={v => setSkill(i, "level", v)} />
        </div>
      ))}
      <button style={S.btnGhost} onClick={addSkill}>+ Add Skill</button>
    </div>
  );
}

function ProjectsEditor({ projects, onChange }) {
  const set = (i, k, v) => onChange(projects.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
  const addProject = () => onChange([...projects, { id: `p${Date.now()}`, title: "New Project", icon: "🔧", desc: "", tags: [], link: "" }]);
  const remove = (i) => onChange(projects.filter((_, idx) => idx !== i));
  return (
    <div>
      <h2 style={S.heading}>Projects</h2>
      <p style={S.subtext}>Portfolio project cards</p>
      {projects.map((p, i) => (
        <div key={p.id} style={{ ...S.card, position: "relative" }}>
          <button style={{ ...S.btnDanger, position: "absolute", top: 16, right: 16, fontSize: "0.72rem", padding: "5px 12px" }} onClick={() => remove(i)}>Remove</button>
          <div style={S.row}>
            <Field label="Title" value={p.title} onChange={v => set(i, "title", v)} />
            <Field label="Icon (emoji)" value={p.icon} onChange={v => set(i, "icon", v)} />
          </div>
          <Field label="Description" value={p.desc} onChange={v => set(i, "desc", v)} rows={3} />
          <Field label="Link (optional)" value={p.link} onChange={v => set(i, "link", v)} />
          <TagEditor tags={p.tags} onChange={v => set(i, "tags", v)} />
        </div>
      ))}
      <button style={S.btnGhost} onClick={addProject}>+ Add Project</button>
    </div>
  );
}

function ResearchEditor({ research, onChange }) {
  const set = (i, k, v) => onChange(research.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const add = () => onChange([...research, { id: `r${Date.now()}`, title: "New Paper", year: new Date().getFullYear().toString(), abstract: "", link: "" }]);
  const remove = (i) => onChange(research.filter((_, idx) => idx !== i));
  return (
    <div>
      <h2 style={S.heading}>Research</h2>
      <p style={S.subtext}>Academic papers and publications</p>
      {research.map((r, i) => (
        <div key={r.id} style={{ ...S.card, position: "relative" }}>
          <button style={{ ...S.btnDanger, position: "absolute", top: 16, right: 16, fontSize: "0.72rem", padding: "5px 12px" }} onClick={() => remove(i)}>Remove</button>
          <div style={S.row}>
            <Field label="Title" value={r.title} onChange={v => set(i, "title", v)} />
            <Field label="Year" value={r.year} onChange={v => set(i, "year", v)} />
          </div>
          <Field label="Abstract" value={r.abstract} onChange={v => set(i, "abstract", v)} rows={4} />
          <Field label="Link (optional)" value={r.link} onChange={v => set(i, "link", v)} />
        </div>
      ))}
      <button style={S.btnGhost} onClick={add}>+ Add Paper</button>
    </div>
  );
}

function ContactEditor({ contact, onChange }) {
  const set = (k, v) => onChange({ ...contact, [k]: v });
  return (
    <div>
      <h2 style={S.heading}>Contact Section</h2>
      <p style={S.subtext}>Heading and subheading for the contact section</p>
      <div style={S.card}>
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

  return (
    <div style={S.wrap}>
      <style>{`
        input:focus, textarea:focus { border-color: #4a9eff !important; }
        input[type=range] { cursor: pointer; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #070c14; } ::-webkit-scrollbar-thumb { background: #1a2e46; border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #1a2a3e" }}>
          <div style={{ fontSize: "1.1rem", fontFamily: "'Playfair Display', serif", color: "#e8e4d9", fontWeight: 700 }}>⚙ Admin</div>
          <div style={{ fontSize: "0.72rem", color: "#3a5070", marginTop: 4 }}>Portfolio Console</div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={S.sectionTitle}>Sections</div>
          {SECTIONS.map(s => (
            <button key={s} style={S.navBtn(section === s)} onClick={() => setSection(s)}>{s}</button>
          ))}
        </div>

        <div style={{ marginTop: "auto", padding: "20px", borderTop: "1px solid #1a2a3e", display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={{ ...S.btnPrimary, width: "100%", padding: "10px" }} onClick={handleSave}>💾 Save Changes</button>
          <button style={{ ...S.btnGhost, width: "100%", padding: "10px", textAlign: "center" }} onClick={onBack}>← View Site</button>
          <button style={{ ...S.btnDanger, width: "100%", padding: "9px", textAlign: "center" }} onClick={handleReset}>↺ Reset Defaults</button>
        </div>
      </div>

      {/* Main area */}
      <div style={S.main}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, paddingBottom: 20, borderBottom: "1px solid #1a2a3e" }}>
          <div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3a5070" }}>Editing</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#e8e4d9", fontWeight: 700 }}>{section}</h1>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {saved && <span style={S.saved}>✓ Saved to browser</span>}
            <button style={S.btnPrimary} onClick={handleSave}>Save Changes</button>
          </div>
        </div>

        {renderSection()}

        <div style={{ marginTop: 40, padding: "20px 24px", background: "#0a1020", border: "1px solid #1a2a3e", borderRadius: 10 }}>
          <p style={{ fontSize: "0.78rem", color: "#3a5070", lineHeight: 1.8 }}>
            <strong style={{ color: "#4a6080" }}>💡 How it works:</strong> Changes save automatically to your browser's localStorage and reflect instantly on the site. 
            To make edits permanent for deployment, click <strong style={{ color: "#4a9eff" }}>Export JSON</strong> and paste the output into <code style={{ color: "#7ab3e0", background: "#0d1a2a", padding: "1px 6px", borderRadius: 4 }}>src/data.js</code> as the DEFAULT_DATA, then push to Netlify.
          </p>
          <button style={{ ...S.btnGhost, marginTop: 12, fontSize: "0.8rem" }} onClick={() => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([`export const DEFAULT_DATA = ${json};\n\nconst STORAGE_KEY = "portfolio_data_v1";\nexport function loadData(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)return JSON.parse(raw);}catch(_){}return structuredClone(DEFAULT_DATA);}\nexport function saveData(data){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}\nexport function resetData(){localStorage.removeItem(STORAGE_KEY);return structuredClone(DEFAULT_DATA);}`], { type: "text/javascript" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "data.js"; a.click();
            URL.revokeObjectURL(url);
          }}>⬇ Export data.js for Netlify deploy</button>
        </div>
      </div>
    </div>
  );
}
