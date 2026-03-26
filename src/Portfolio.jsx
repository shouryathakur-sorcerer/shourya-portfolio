import { useState, useEffect, useRef } from "react";
import profileImg from "./assets/profile.png";

const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Research", "Contact"];

function useInView(threshold = 0.12) {
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

function FadeIn({ children, delay = 0, direction = "up" }) {
  const [ref, visible] = useInView();
  const transforms = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.92)",
  };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction],
      transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function GlitchText({ text }) {
  return (
    <span className="glitch" data-text={text}>{text}</span>
  );
}

function SkillBar({ skill, delay }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      padding: "14px 0",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateX(-20px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "#94a3c4", letterSpacing: "0.03em" }}>{skill.name}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#60a5fa", fontWeight: 700 }}>{skill.level}%</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", borderRadius: 2,
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
          width: visible ? `${skill.level}%` : "0%",
          transition: `width 1.6s cubic-bezier(0.16,1,0.3,1) ${delay + 0.1}s`,
          boxShadow: "0 0 12px rgba(99,102,241,0.6)",
        }} />
      </div>
    </div>
  );
}

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.alpha})`;
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 120) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

function CyberBadge({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(59,130,246,0.08)",
      border: "1px solid rgba(59,130,246,0.25)",
      borderRadius: 4, padding: "4px 12px",
      fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
      color: "#60a5fa", letterSpacing: "0.12em", textTransform: "uppercase",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 6px #60a5fa", display: "inline-block" }} />
      {children}
    </span>
  );
}

export default function Portfolio({ data, onOpenAdmin }) {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const { meta, about, skills, projects, research, contact } = data;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const scrollTo = (id) => {
    setActive(id);
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#050810", color: "#e2e8f0", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(99,102,241,0.35); color: #fff; }

        .glitch { position: relative; }
        .glitch::before, .glitch::after {
          content: attr(data-text); position: absolute; top: 0; left: 0;
          width: 100%; overflow: hidden;
        }
        .glitch::before {
          color: #06b6d4; animation: glitch1 4s infinite;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          left: 2px; opacity: 0.7;
        }
        .glitch::after {
          color: #8b5cf6; animation: glitch2 4s infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          left: -2px; opacity: 0.7;
        }
        @keyframes glitch1 {
          0%,90%,100% { transform: translateX(0); opacity: 0; }
          92% { transform: translateX(-3px); opacity: 0.7; }
          94% { transform: translateX(3px); opacity: 0.7; }
          96% { transform: translateX(0); opacity: 0; }
        }
        @keyframes glitch2 {
          0%,88%,100% { transform: translateX(0); opacity: 0; }
          90% { transform: translateX(3px); opacity: 0.7; }
          93% { transform: translateX(-3px); opacity: 0.7; }
          96% { transform: translateX(0); opacity: 0; }
        }

        .nav-item { 
          position: relative; cursor: pointer;
          fontFamily: 'Space Mono', monospace; font-size: 0.72rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #64748b; transition: color 0.3s; padding: 8px 0;
        }
        .nav-item::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-item:hover, .nav-item.active { color: #e2e8f0; }
        .nav-item:hover::after, .nav-item.active::after { width: 100%; }

        .project-card {
          position: relative; overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
          cursor: default;
        }
        .project-card::before {
          content: ''; position: absolute; inset: 0; opacity: 0;
          background: linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06));
          transition: opacity 0.4s;
        }
        .project-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2); }
        .project-card:hover::before { opacity: 1; }

        .tag {
          display: inline-block; padding: 3px 10px; border-radius: 3px;
          font-size: 0.65rem; letter-spacing: 0.1em; font-family: 'Space Mono', monospace;
          border: 1px solid rgba(99,102,241,0.25); color: #818cf8;
          background: rgba(99,102,241,0.06); margin: 2px;
          text-transform: uppercase;
        }

        .contact-input {
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; color: #e2e8f0;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          padding: 14px 18px; width: 100%; outline: none;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .contact-input:focus { 
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.04);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .contact-input::placeholder { color: #334155; }

        .btn-send {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none; border-radius: 8px; color: #fff;
          cursor: pointer; font-family: 'Space Mono', monospace;
          font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 14px 32px;
          transition: opacity 0.3s, transform 0.2s, box-shadow 0.3s;
          box-shadow: 0 8px 24px rgba(99,102,241,0.3);
        }
        .btn-send:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.45); }

        .admin-fab {
          position: fixed; bottom: 32px; right: 32px; z-index: 200;
          background: rgba(15,20,40,0.9); backdrop-filter: blur(12px);
          border: 1px solid rgba(99,102,241,0.3); border-radius: 8px;
          color: #818cf8; cursor: pointer;
          font-family: 'Space Mono', monospace; font-size: 0.7rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 10px 18px; transition: all 0.3s;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 0 rgba(99,102,241,0.3);
        }
        .admin-fab:hover {
          border-color: rgba(99,102,241,0.6); color: #a5b4fc;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.2);
          transform: translateY(-2px);
        }

        .section-label {
          font-family: 'Space Mono', monospace; font-size: 0.68rem;
          letter-spacing: 0.2em; text-transform: uppercase; color: #3b82f6;
          margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
        }
        .section-label::before {
          content: ''; display: inline-block; width: 20px; height: 1px;
          background: linear-gradient(90deg, #3b82f6, transparent);
        }

        .section-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(2rem, 4vw, 3rem); color: #f1f5f9; line-height: 1.1;
          margin-bottom: 48px; letter-spacing: -0.02em;
        }

        .focus-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 24px 20px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          cursor: default; position: relative; overflow: hidden;
        }
        .focus-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 2px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
          opacity: 0; transition: opacity 0.4s;
        }
        .focus-card:hover { 
          background: rgba(99,102,241,0.06);
          border-color: rgba(99,102,241,0.2);
          transform: translateY(-4px);
        }
        .focus-card:hover::before { opacity: 1; }

        .research-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 32px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          display: flex; gap: 28px; align-items: flex-start;
          position: relative; overflow: hidden;
        }
        .research-card::after {
          content: ''; position: absolute; right: -80px; top: -80px;
          width: 160px; height: 160px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06), transparent);
          transition: transform 0.4s;
        }
        .research-card:hover { border-color: rgba(99,102,241,0.18); }
        .research-card:hover::after { transform: scale(1.5); }

        .scrollbar-none::-webkit-scrollbar { display: none; }

        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,130,246,0.25); }
          70% { transform: scale(1); box-shadow: 0 0 0 16px rgba(59,130,246,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .social-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Space Mono', monospace; font-size: 0.72rem;
          letter-spacing: 0.08em; color: #475569; text-decoration: none;
          padding: 8px 16px; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px; transition: all 0.3s;
        }
        .social-link:hover { color: #60a5fa; border-color: rgba(59,130,246,0.3); background: rgba(59,130,246,0.05); }

        .divider { height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(99,102,241,0.15) 50%, rgba(255,255,255,0.06) 70%, transparent 100%); margin: 0 32px; }

        /* --- MOBILE NAV --- */
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; padding: 8px; background: none; border: none;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: #94a3b8; border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu {
          display: none; position: fixed; top: 72px; left: 0; right: 0; z-index: 99;
          background: rgba(5,8,16,0.97); backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 24px 24px 32px; flex-direction: column; gap: 4px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu .nav-item {
          padding: 14px 8px; font-size: 0.8rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .mobile-menu .nav-item:last-child { border-bottom: none; }

        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .desktop-nav { display: none !important; }

          /* Hero */
          .hero-inner {
            flex-direction: column !important;
            padding: 100px 24px 60px !important;
            gap: 48px !important;
            align-items: flex-start !important;
          }
          .hero-inner h1 { font-size: clamp(2.4rem, 11vw, 3.5rem) !important; }
          .profile-wrap { width: 220px !important; height: 220px !important; align-self: center; }

          /* Sections */
          .section-inner {
            padding: 72px 24px !important;
          }

          /* About grid → single column */
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          /* Focus cards → 2 cols on mobile is fine, keep it */

          /* Skills grid → single column */
          .skills-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }

          /* Projects grid → single column */
          .projects-grid {
            grid-template-columns: 1fr !important;
          }

          /* Research card → stack vertically */
          .research-card {
            flex-direction: column !important;
            gap: 16px !important;
          }

          /* Footer */
          .footer-inner {
            flex-direction: column !important;
            gap: 8px !important;
            text-align: center;
          }

          /* Admin FAB */
          .admin-fab {
            bottom: 20px !important; right: 16px !important;
            padding: 8px 14px !important;
          }

          /* Nav inner */
          .nav-inner {
            padding: 0 20px !important;
          }

          .divider { margin: 0 16px; }
        }
      `}</style>

      {/* Cursor glow effect */}
      <div style={{
        position: "fixed", pointerEvents: "none", zIndex: 999,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)",
        transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)`,
        transition: "transform 0.1s ease",
      }} />

      {/* Admin FAB */}
      <button className="admin-fab" onClick={onOpenAdmin}>⌥ Admin</button>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(5,8,16,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div className="nav-inner" style={{ maxWidth: 1140, margin: "0 auto", padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => scrollTo("Home")} style={{ cursor: "pointer" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              {meta.name.split(" ")[0]}<span style={{ color: "#3b82f6" }}>.</span>
            </span>
          </div>
          <div className="desktop-nav" style={{ display: "flex", gap: 36 }}>
            {NAV_LINKS.map((l) => (
              <span key={l} className={`nav-item${active === l ? " active" : ""}`} onClick={() => scrollTo(l)}
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {l}
              </span>
            ))}
          </div>
          {/* Hamburger */}
          <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <span key={l} className={`nav-item${active === l ? " active" : ""}`} onClick={() => scrollTo(l)}
            style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {l}
          </span>
        ))}
      </div>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <ParticleField />

        {/* Background orbs */}
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div className="hero-inner" style={{ maxWidth: 1140, margin: "0 auto", padding: "120px 48px 80px", display: "flex", alignItems: "center", gap: 80, position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 24, opacity: 0, animation: "heroReveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }}>
              <CyberBadge>{meta.role}</CyberBadge>
            </div>

            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 1.0,
              letterSpacing: "-0.03em", color: "#f1f5f9",
              marginBottom: 28,
              opacity: 0, animation: "heroReveal 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s forwards",
            }}>
              <GlitchText text={meta.heroLine1} /><br />
              <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>{meta.heroLine2}</span><br />
              <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{meta.heroLine3}</span>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", color: "#64748b", fontSize: "1.05rem",
              lineHeight: 1.8, maxWidth: 420, marginBottom: 10,
              opacity: 0, animation: "heroReveal 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s forwards",
            }}>{meta.heroBio}</p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", color: "#475569", fontSize: "0.92rem",
              lineHeight: 1.8, maxWidth: 400, marginBottom: 40,
              opacity: 0, animation: "heroReveal 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s forwards",
            }}>{meta.heroSub}</p>

            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap",
              opacity: 0, animation: "heroReveal 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s forwards",
            }}>
              {meta.email && <a href={`mailto:${meta.email}`} className="social-link">✉ Email</a>}
              {meta.github && <a href={meta.github} target="_blank" rel="noopener noreferrer" className="social-link">⌥ GitHub</a>}
              {meta.linkedin && <a href={meta.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">in LinkedIn</a>}
            </div>
          </div>

          {/* Profile image */}
          <div style={{
            flexShrink: 0,
            opacity: 0, animation: "heroReveal 1s cubic-bezier(0.16,1,0.3,1) 0.35s forwards",
          }}>
            <div style={{ position: "relative" }}>
              {/* Outer ring with glow */}
              <div className="profile-wrap" style={{
                width: 300, height: 300, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(6,182,212,0.3))",
                padding: 3, animation: "pulse-ring 3s ease-in-out infinite",
              }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#050810", padding: 4 }}>
                  <img
                    src={profileImg} alt={meta.name}
                    style={{
                      width: "100%", height: "100%", borderRadius: "50%",
                      objectFit: "cover", objectPosition: "center top",
                      filter: "contrast(1.05) brightness(0.95)",
                      display: "block",
                    }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <div style={{
                position: "absolute", bottom: 10, right: -20, zIndex: 3,
                background: "rgba(5,8,16,0.95)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10,
                padding: "12px 18px", animation: "float 4s ease-in-out infinite",
              }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#3b82f6", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Exploring</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginTop: 3 }}>{meta.currentlyExploring}</p>
              </div>

              {/* Corner decoration */}
              <div style={{
                position: "absolute", top: -20, left: -20,
                width: 40, height: 40,
                borderTop: "2px solid #3b82f6", borderLeft: "2px solid #3b82f6",
                borderRadius: "4px 0 0 0",
              }} />
              <div style={{
                position: "absolute", bottom: -20, right: -20,
                width: 40, height: 40,
                borderBottom: "2px solid #8b5cf6", borderRight: "2px solid #8b5cf6",
                borderRadius: "0 0 4px 0",
              }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: 0, animation: "heroReveal 1s ease 1.2s forwards",
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#1e293b", letterSpacing: "0.2em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(180deg, #3b82f6, transparent)" }} />
        </div>
      </section>

      <div className="divider" />

      {/* ABOUT */}
      <section id="about" style={{ padding: "120px 0", maxWidth: 1140, margin: "0 auto", padding: "120px 48px" }} className="section-inner">
        <FadeIn>
          <p className="section-label">Who I Am</p>
          <h2 className="section-title">About Me</h2>
        </FadeIn>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 64 }}>
          <FadeIn delay={0.1} direction="left">
            <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.9, marginBottom: 24 }}>{about.para1}</p>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.9 }}>{about.para2}</p>
          </FadeIn>
          <FadeIn delay={0.2} direction="right">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {about.focusAreas.map((item, i) => (
                <div key={item.label} className="focus-card">
                  <div style={{ fontSize: "1.6rem", marginBottom: 12, filter: "drop-shadow(0 0 8px rgba(99,102,241,0.4))" }}>{item.icon}</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#cbd5e1", fontSize: "0.88rem", marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: "'Space Mono', monospace", color: "#334155", fontSize: "0.7rem", letterSpacing: "0.05em" }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="divider" />

      {/* SKILLS */}
      <section id="skills" style={{ padding: "120px 48px", maxWidth: 1140, margin: "0 auto" }} className="section-inner">
        <FadeIn>
          <p className="section-label">Expertise</p>
          <h2 className="section-title">Technical Skills</h2>
        </FadeIn>
        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 64px" }}>
          {skills.map((s, i) => <SkillBar key={s.name + i} skill={s} delay={i * 0.06} />)}
        </div>
      </section>

      <div className="divider" />

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "120px 48px", maxWidth: 1140, margin: "0 auto" }} className="section-inner">
        <FadeIn>
          <p className="section-label">Portfolio</p>
          <h2 className="section-title">Projects</h2>
        </FadeIn>
        <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {projects.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.07} direction="scale">
              <div className="project-card" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "32px 28px", height: "100%",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontSize: "2rem", filter: "drop-shadow(0 0 10px rgba(99,102,241,0.5))" }}>{p.icon}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#1e293b", letterSpacing: "0.1em" }}>0{i + 1}</span>
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#e2e8f0", marginBottom: 12, letterSpacing: "-0.01em" }}>{p.title}</h3>
                <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.75, marginBottom: 20 }}>{p.desc}</p>
                <div style={{ marginBottom: p.link ? 16 : 0 }}>
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#3b82f6",
                    textDecoration: "none", letterSpacing: "0.08em",
                    transition: "gap 0.2s",
                  }}>View Project <span>→</span></a>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* RESEARCH */}
      <section id="research" style={{ padding: "120px 48px", maxWidth: 1140, margin: "0 auto" }} className="section-inner">
        <FadeIn>
          <p className="section-label">Academic Work</p>
          <h2 className="section-title">Research</h2>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {research.map((r, i) => (
            <FadeIn key={r.id} delay={i * 0.1}>
              <div className="research-card">
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: 8, padding: "10px 16px", textAlign: "center",
                  }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#3b82f6", fontSize: "1rem" }}>{r.year}</p>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#e2e8f0", marginBottom: 12, letterSpacing: "-0.01em" }}>{r.title}</h3>
                  <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.8 }}>{r.abstract}</p>
                  {r.link && (
                    <a href={r.link} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14,
                      fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#3b82f6",
                      textDecoration: "none", letterSpacing: "0.08em",
                    }}>Read Paper →</a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* CONTACT */}
      <section id="contact" style={{ padding: "120px 48px", maxWidth: 680, margin: "0 auto" }} className="section-inner">
        <FadeIn>
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">{contact.heading}</h2>
          <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: 48, marginTop: -28 }}>{contact.subheading}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <form name="contact" method="POST" data-netlify="true" action= "/" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input type="hidden" name="form-name" value="contact" />
            <input className="contact-input" name="name" placeholder="Your Name" required />
            <input className="contact-input" name="email" placeholder="Email Address" type="email" required />
            <textarea className="contact-input" name="message" placeholder="Your Message" rows={5} style={{ resize: "vertical" }} required />
            <div>
              <button type="submit" className="btn-send">Send Message →</button>
            </div>
          </form>
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 12, flexWrap: "wrap" }}>
            {meta.email && <a href={`mailto:${meta.email}`} className="social-link">✉ {meta.email}</a>}
            {meta.github && <a href={meta.github} target="_blank" rel="noopener noreferrer" className="social-link">⌥ GitHub</a>}
            {meta.linkedin && <a href={meta.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">in LinkedIn</a>}
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "32px 48px" }}>
        <div className="footer-inner" style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", color: "#1e293b", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
            © {meta.footerYear} {meta.name}
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", color: "#1e293b", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
            Built with precision
          </span>
        </div>
      </footer>
    </div>
  );
}
