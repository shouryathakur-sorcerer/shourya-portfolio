import { useState, useEffect, useRef } from "react";
import profileImg from "./assets/profile.png";

const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Research", "Contact"];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function SkillBar({ skill, delay }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ padding: "10px 0", opacity: visible ? 1 : 0, transition: `opacity 0.5s ease ${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#a0b8d0" }}>{skill.name}</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#4a9eff" }}>{skill.level}%</span>
      </div>
      <div style={{ height: 4, background: "#0f1c2e", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: "linear-gradient(90deg, #1e4f8c, #4a9eff)",
          width: visible ? `${skill.level}%` : "0%",
          transition: `width 1.4s cubic-bezier(0.4,0,0.2,1) ${delay + 0.15}s`,
        }} />
      </div>
    </div>
  );
}

export default function Portfolio({ data, onOpenAdmin }) {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const { meta, about, skills, projects, research, contact } = data;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => {
    setActive(id);
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0b0f1a", color: "#e8e4d9", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0b0f1a; }
        ::selection { background: #4a9eff33; color: #fff; }
        .nav-link { cursor: pointer; color: #a0b0c8; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 6px 0; position: relative; transition: color 0.3s; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: #4a9eff; transition: width 0.3s; }
        .nav-link:hover, .nav-link.active { color: #e8e4d9; }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .project-card { transition: transform 0.35s ease, box-shadow 0.35s ease; cursor: default; }
        .project-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(74,158,255,0.12); }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; letter-spacing: 0.06em; font-family: 'DM Sans', sans-serif; border: 1px solid #2a4a6e; color: #7ab3e0; margin: 3px 3px 3px 0; }
        .contact-input { background: #111827; border: 1px solid #1e3048; border-radius: 8px; color: #e8e4d9; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; padding: 12px 16px; width: 100%; outline: none; transition: border-color 0.3s; }
        .contact-input:focus { border-color: #4a9eff; }
        .btn-primary { background: linear-gradient(135deg, #1e4f8c 0%, #2563be 100%); color: #e8e4d9; border: none; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; letter-spacing: 0.06em; padding: 13px 32px; transition: opacity 0.3s, transform 0.2s; }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-2px); }
        .slabel { color: #4a9eff; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, #1e3048, transparent); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .admin-fab { position: fixed; bottom: 28px; right: 28px; z-index: 200; background: #1e4f8c; border: 1px solid #4a9eff55; border-radius: 50px; color: #e8e4d9; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; letter-spacing: 0.05em; padding: 10px 20px; transition: background 0.2s, transform 0.2s; box-shadow: 0 4px 24px rgba(74,158,255,0.2); }
        .admin-fab:hover { background: #2563be; transform: translateY(-2px); }
      `}</style>

      {/* Admin FAB */}
      <button className="admin-fab" onClick={onOpenAdmin}>⚙ Admin</button>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(11,15,26,0.95)" : "#0d1525",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid #1a2a3e",
        transition: "background 0.4s",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => scrollTo("Home")} style={{ cursor: "pointer" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#e8e4d9" }}>
              {meta.name.split(" ")[0]} <span style={{ color: "#4a9eff" }}>{meta.name.split(" ").slice(1).join(" ")}</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {NAV_LINKS.map((l) => (
              <span key={l} className={`nav-link${active === l ? " active" : ""}`} onClick={() => scrollTo(l)}>{l}</span>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 32px 60px", maxWidth: 1100, margin: "0 auto", gap: 64 }}>
        <div style={{ flex: 1, opacity: 0, animation: "fadeUp 0.8s ease 0.1s forwards" }}>
          <p className="slabel">{meta.role}</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20, color: "#f0ece0" }}>
            {meta.heroLine1} <span style={{ color: "#4a9eff" }}>·</span><br />
            {meta.heroLine2} <span style={{ color: "#4a9eff" }}>·</span><br />
            {meta.heroLine3}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#8a9bb0", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: 440, marginBottom: 12 }}>{meta.heroBio}</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a7e96", fontSize: "0.95rem", lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}>{meta.heroSub}</p>
          <div style={{ display: "flex", gap: 16 }}>
            <button className="btn-primary" onClick={() => scrollTo("Projects")}>View Projects</button>
            <button onClick={() => scrollTo("Contact")} style={{ background: "transparent", border: "1px solid #2a4a6e", borderRadius: 8, color: "#7ab3e0", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", padding: "13px 28px", transition: "border-color 0.3s, color 0.3s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#4a9eff"; e.currentTarget.style.color = "#e8e4d9"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#2a4a6e"; e.currentTarget.style.color = "#7ab3e0"; }}
            >Get In Touch</button>
          </div>
        </div>
        <div style={{ flex: "0 0 320px", display: "flex", justifyContent: "center", alignItems: "center", opacity: 0, animation: "fadeUp 0.8s ease 0.3s forwards" }}>
          <div style={{ position: "relative" }}>
            {/* Outer glow ring */}
            <div style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              background: "linear-gradient(135deg, #4a9eff55, #1e4f8c88, #4a9eff22)",
              zIndex: 0,
            }} />
            {/* Mid ring */}
            <div style={{
              position: "absolute", inset: -2, borderRadius: "50%",
              border: "1.5px solid #4a9eff44",
              zIndex: 1,
            }} />
            {/* Photo */}
            <img
              src={profileImg}
              alt="Shourya Thakur"
              style={{
                width: 280,
                height: 280,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                position: "relative",
                zIndex: 2,
                border: "3px solid #1a3a5c",
              }}
            />
            {/* Badge */}
            <div style={{
              position: "absolute", bottom: 8, right: -16, zIndex: 3,
              background: "#0d1525",
              border: "1px solid #1e3a5c",
              borderRadius: 10,
              padding: "10px 16px",
              backdropFilter: "blur(8px)",
            }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#4a9eff", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Currently Exploring</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#a0b8d0", marginTop: 3, margin: "3px 0 0" }}>{meta.currentlyExploring}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="divider" />

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn><p className="slabel">Who I Am</p><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, marginBottom: 40, color: "#f0ece0" }}>About Me</h2></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <FadeIn delay={0.1}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#8a9bb0", fontSize: "1rem", lineHeight: 1.85, marginBottom: 20 }}>{about.para1}</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a7e96", fontSize: "0.95rem", lineHeight: 1.85 }}>{about.para2}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {about.focusAreas.map((item) => (
                <div key={item.label} style={{ background: "#0f1c2e", border: "1px solid #1a2e46", borderRadius: 12, padding: "20px 18px" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{item.icon}</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#c8d8e8", fontSize: "0.9rem" }}>{item.label}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#5a7080", fontSize: "0.78rem", marginTop: 4 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
      <div className="divider" />

      {/* SKILLS */}
      <section id="skills" style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn><p className="slabel">Expertise</p><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, marginBottom: 50, color: "#f0ece0" }}>Technical Skills</h2></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 48px" }}>
          {skills.map((s, i) => <SkillBar key={s.name + i} skill={s} delay={i * 0.07} />)}
        </div>
      </section>
      <div className="divider" />

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn><p className="slabel">Portfolio</p><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, marginBottom: 50, color: "#f0ece0" }}>Projects</h2></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {projects.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.08}>
              <div className="project-card" style={{ background: "#0f1c2e", border: "1px solid #1a2e46", borderRadius: 14, padding: "28px 26px", height: "100%" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#dde8f0", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a8090", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 16 }}>{p.desc}</p>
                <div>{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#4a9eff", textDecoration: "none", letterSpacing: "0.05em" }}>View Project →</a>}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <div className="divider" />

      {/* RESEARCH */}
      <section id="research" style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn><p className="slabel">Academic Work</p><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, marginBottom: 50, color: "#f0ece0" }}>Research</h2></FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {research.map((r, i) => (
            <FadeIn key={r.id} delay={i * 0.1}>
              <div style={{ background: "#0f1c2e", border: "1px solid #1a2e46", borderRadius: 14, padding: "28px 30px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ background: "#0b1625", border: "1px solid #1e3a5c", borderRadius: 8, padding: "8px 14px", flexShrink: 0 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#4a9eff", fontSize: "0.85rem" }}>{r.year}</p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#dde8f0", marginBottom: 10 }}>{r.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a8090", fontSize: "0.88rem", lineHeight: 1.75 }}>{r.abstract}</p>
                  {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#4a9eff", textDecoration: "none" }}>Read Paper →</a>}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <div className="divider" />

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 32px", maxWidth: 600, margin: "0 auto" }}>
        <FadeIn>
          <p className="slabel">Let's Connect</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, marginBottom: 14, color: "#f0ece0" }}>{contact.heading}</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a8090", fontSize: "0.95rem", marginBottom: 40 }}>{contact.subheading}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input className="contact-input" placeholder="Your Name" />
            <input className="contact-input" placeholder="Email Address" type="email" />
            <textarea className="contact-input" placeholder="Your Message" rows={5} style={{ resize: "vertical" }} />
            <button className="btn-primary" style={{ alignSelf: "flex-start" }}>Send Message →</button>
          </div>
          {(meta.github || meta.linkedin || meta.email) && (
            <div style={{ marginTop: 40, display: "flex", gap: 20, flexWrap: "wrap" }}>
              {meta.email && <a href={`mailto:${meta.email}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#4a9eff", textDecoration: "none" }}>✉ {meta.email}</a>}
              {meta.github && <a href={meta.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#4a9eff", textDecoration: "none" }}>⌥ GitHub</a>}
              {meta.linkedin && <a href={meta.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#4a9eff", textDecoration: "none" }}>in LinkedIn</a>}
            </div>
          )}
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1a2e46", padding: "32px", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#3a5070", fontSize: "0.82rem" }}>
          © {meta.footerYear} {meta.name} · Built with precision
        </p>
      </footer>
    </div>
  );
}
