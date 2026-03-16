import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    display: flex; flex-direction: column; min-height: 100vh;
    background: #0C0E14; color: #E8E6DF;
    font-family: 'DM Sans', sans-serif; overflow-x: hidden;
  }

  /* ── NAV ── */
  .lp-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 4rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    position: sticky; top: 0; z-index: 100; background: #0C0E14;
  }
  .lp-logo { display: flex; align-items: center; gap: 12px; }
  .lp-logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #C8892A, #E8A830);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
  }
  .lp-logo-icon svg { width: 22px; height: 22px; fill: white; }
  .lp-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem; font-weight: 600; letter-spacing: 0.03em; color: #F2EDE4;
  }
  .lp-logo-text span { color: #C8892A; }
  .lp-nav-pill {
    background: rgba(200,137,42,0.12); border: 1px solid rgba(200,137,42,0.35);
    color: #C8892A; font-size: 0.72rem; font-weight: 500;
    padding: 4px 12px; border-radius: 20px; letter-spacing: 0.08em; text-transform: uppercase;
  }

  /* ── HERO ── */
  .lp-hero {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 5rem 2rem 3rem; text-align: center; position: relative; overflow: hidden;
  }
  .lp-hero-glow {
    position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 400px;
    background: radial-gradient(ellipse, rgba(200,137,42,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .lp-hero-eyebrow {
    font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: #C8892A; font-weight: 500; margin-bottom: 1.25rem;
  }
  .lp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 600; line-height: 1.05;
    color: #F2EDE4; margin-bottom: 1.5rem; max-width: 800px;
  }
  .lp-hero-title em { color: #C8892A; font-style: italic; }
  .lp-hero-desc {
    font-size: 1.05rem; color: rgba(232,230,223,0.6); max-width: 540px;
    line-height: 1.75; margin-bottom: 3.5rem; font-weight: 300;
  }

  /* ── STATS ── */
  .lp-stats {
    display: flex; gap: 0;
    border: 1px solid rgba(255,255,255,0.08); border-radius: 14px;
    overflow: hidden; margin-bottom: 3rem; background: rgba(255,255,255,0.03);
  }
  .lp-stat { padding: 1.25rem 2.5rem; text-align: center; border-right: 1px solid rgba(255,255,255,0.08); }
  .lp-stat:last-child { border-right: none; }
  .lp-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 700; color: #E8A830; line-height: 1;
  }
  .lp-stat-label { font-size: 0.75rem; color: rgba(232,230,223,0.45); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

  /* ── SECTION HEADER ── */
  .lp-section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
  .lp-section-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
  .lp-section-label { font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(232,230,223,0.4); white-space: nowrap; }

  /* ── FEATURES ── */
  .lp-features { padding: 4rem 4rem 3rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  .lp-cards {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden;
  }
  .lp-card { background: #10131C; padding: 2rem; transition: background 0.25s; }
  .lp-card:hover { background: #141720; }
  .lp-card-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: rgba(200,137,42,0.12); border: 1px solid rgba(200,137,42,0.2);
    display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;
  }
  .lp-card-icon svg { width: 20px; height: 20px; stroke: #C8892A; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .lp-card h3 { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; color: #F2EDE4; margin-bottom: 0.6rem; }
  .lp-card p { font-size: 0.82rem; color: rgba(232,230,223,0.5); line-height: 1.65; }
  .lp-card-tag {
    display: inline-block; margin-top: 1rem; font-size: 0.68rem;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px;
    border-radius: 20px; background: rgba(200,137,42,0.1);
    color: #C8892A; border: 1px solid rgba(200,137,42,0.2);
  }

  /* ── PREVIEW ── */
  .lp-preview { padding: 0 4rem 4rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  .lp-preview-box { border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; background: #080A10; }
  .lp-preview-bar { background: #0F1219; padding: 0.75rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 8px; }
  .lp-dot { width: 10px; height: 10px; border-radius: 50%; }
  .lp-preview-url { flex: 1; text-align: center; font-size: 0.75rem; color: rgba(232,230,223,0.25); margin: 0 1rem; }
  .lp-preview-content { padding: 2rem; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
  .lp-mini-card { background: #0F1320; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 1.25rem; }
  .lp-mini-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(232,230,223,0.35); margin-bottom: 0.5rem; }
  .lp-mini-val { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: #F2EDE4; }
  .lp-mini-sub { font-size: 0.72rem; color: #4CAF80; margin-top: 2px; }
  .lp-mini-bar { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; margin-top: 0.75rem; overflow: hidden; }
  .lp-mini-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #C8892A, #E8A830); }
  .lp-preview-list { background: #0F1320; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 1.25rem; grid-column: span 2; }
  .lp-list-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .lp-list-row:last-child { border-bottom: none; }
  .lp-list-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .lp-list-name { font-size: 0.8rem; color: #E8E6DF; flex: 1; }
  .lp-list-val { font-size: 0.8rem; color: rgba(232,230,223,0.5); }
  .lp-list-badge { font-size: 0.65rem; padding: 2px 8px; border-radius: 10px; font-weight: 500; }

  /* ── CTA ── */
  .lp-cta {
    padding: 4rem; background: rgba(255,255,255,0.015);
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
  }
  .lp-cta-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600; color: #F2EDE4; text-align: center; }
  .lp-cta-sub { font-size: 0.88rem; color: rgba(232,230,223,0.45); text-align: center; max-width: 400px; }
  .lp-cta-buttons { display: flex; gap: 1rem; margin-top: 0.5rem; }

  .lp-btn {
    display: flex; align-items: center; gap: 10px; padding: 1rem 2rem;
    border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; font-weight: 500; cursor: pointer; border: none;
    text-decoration: none; transition: all 0.2s;
  }
  .lp-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
  .lp-btn-primary { background: linear-gradient(135deg, #C8892A, #E8A830); color: #0C0E14; }
  .lp-btn-primary svg { stroke: #0C0E14; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .lp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,137,42,0.3); }
  .lp-btn-secondary { background: rgba(255,255,255,0.05); color: #F2EDE4; border: 1px solid rgba(255,255,255,0.12) !important; }
  .lp-btn-secondary svg { stroke: #F2EDE4; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .lp-btn-secondary:hover { background: rgba(255,255,255,0.09); transform: translateY(-2px); }
  .lp-btn-label { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
  .lp-btn-hint { font-size: 0.68rem; opacity: 0.6; font-weight: 400; margin-top: 1px; }

  /* ── FOOTER ── */
  .lp-footer { padding: 1.5rem 4rem; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; }
  .lp-footer-copy { font-size: 0.75rem; color: rgba(232,230,223,0.3); }
  .lp-footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-weight: 600; color: rgba(232,230,223,0.4); }
  .lp-footer-logo span { color: #C8892A; }

  @media (max-width: 768px) {
    .lp-nav { padding: 1.25rem 1.5rem; }
    .lp-hero { padding: 4rem 1.5rem 2rem; }
    .lp-stats { flex-direction: column; }
    .lp-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .lp-stat:last-child { border-bottom: none; }
    .lp-features, .lp-preview { padding: 2rem 1.5rem; }
    .lp-cards { grid-template-columns: 1fr; }
    .lp-preview-content { grid-template-columns: 1fr; }
    .lp-preview-list { grid-column: span 1; }
    .lp-cta { padding: 3rem 1.5rem; }
    .lp-cta-buttons { flex-direction: column; width: 100%; }
    .lp-btn { justify-content: center; }
    .lp-footer { padding: 1.25rem 1.5rem; flex-direction: column; gap: 0.5rem; text-align: center; }
  }
`;

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="lp-root">

        {/* NAV */}
        <nav className="lp-nav">
          <div className="lp-logo">
            <div className="lp-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M8.5 2a6.5 6.5 0 0 1 0 13h-1v7H5V15H3.5a6.5 6.5 0 0 1 0-13h5zm7 2a4 4 0 0 1 4 4v1h1v2h-1v8h-2V11h-1V9h1V8a2 2 0 0 0-2-2V4z"/>
              </svg>
            </div>
            <span className="lp-logo-text">Kitchen<span>Manager</span></span>
          </div>
          <span className="lp-nav-pill">v2.0 · Sistema Activo</span>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-hero-glow" />
          <p className="lp-hero-eyebrow">Plataforma de gestión gastronómica</p>
          <h1 className="lp-hero-title">Controla tu cocina.<br /><em>A otro nivel.</em></h1>
          <p className="lp-hero-desc">
            Kitchen Manager centraliza tus órdenes, inventario y equipo en un solo sistema. Eficiencia real, en tiempo real.
          </p>
          <div className="lp-stats">
            {[
              { num: "98%", label: "Precisión de pedidos" },
              { num: "3x",  label: "Velocidad de despacho" },
              { num: "24/7",label: "Monitoreo en vivo" },
              { num: "∞",   label: "Escalabilidad" },
            ].map((s, i) => (
              <div className="lp-stat" key={i}>
                <div className="lp-stat-num">{s.num}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="lp-features">
          <div className="lp-section-header">
            <div className="lp-section-line" />
            <span className="lp-section-label">Funcionalidades principales</span>
            <div className="lp-section-line" />
          </div>
          <div className="lp-cards">
            {[
              { title: "Panel de comandas",     tag: "Tiempo real",        desc: "Visualiza y gestiona todas las órdenes activas desde un display centralizado con prioridades automáticas.",       icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
              { title: "Control de inventario", tag: "Alertas automáticas", desc: "Rastrea insumos, alertas de stock bajo y consumo automático al procesar cada orden del sistema.",                icon: <><path d="M3 3h18v18H3z" strokeDasharray="4 2"/><path d="M9 9h6v6H9z"/></> },
              { title: "Tiempos y turnos",       tag: "KPI operativo",       desc: "Mide tiempos de preparación por platillo y equipo. Identifica cuellos de botella en el servicio.",              icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
              { title: "Gestión de equipo",      tag: "Staff manager",       desc: "Asigna estaciones, monitorea carga de trabajo y registra el desempeño del personal de cocina.",                 icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
              { title: "Analíticas avanzadas",   tag: "Reportes",            desc: "Reportes de ventas, platillos más pedidos, horas pico y métricas de eficiencia del servicio.",                  icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
              { title: "Sincronización total",   tag: "Multi-estación",      desc: "Cocina, barra y salón conectados al instante. Actualizaciones en tiempo real entre todas las estaciones.",      icon: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></> },
            ].map((f, i) => (
              <div className="lp-card" key={i}>
                <div className="lp-card-icon"><svg viewBox="0 0 24 24">{f.icon}</svg></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="lp-card-tag">{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PREVIEW */}
        <section className="lp-preview">
          <div className="lp-section-header">
            <div className="lp-section-line" />
            <span className="lp-section-label">Vista previa del sistema</span>
            <div className="lp-section-line" />
          </div>
          <div className="lp-preview-box">
            <div className="lp-preview-bar">
              <div className="lp-dot" style={{ background: "#FF5F57" }} />
              <div className="lp-dot" style={{ background: "#FEBC2E" }} />
              <div className="lp-dot" style={{ background: "#28C840" }} />
              <span className="lp-preview-url">kitchen-manager.app / dashboard</span>
            </div>
            <div className="lp-preview-content">
              <div className="lp-mini-card">
                <div className="lp-mini-label">Órdenes activas</div>
                <div className="lp-mini-val">24</div>
                <div className="lp-mini-sub">↑ 8 vs ayer</div>
                <div className="lp-mini-bar"><div className="lp-mini-fill" style={{ width: "72%" }} /></div>
              </div>
              <div className="lp-mini-card">
                <div className="lp-mini-label">Tiempo promedio</div>
                <div className="lp-mini-val">14 min</div>
                <div className="lp-mini-sub" style={{ color: "#C8892A" }}>↔ igual que ayer</div>
                <div className="lp-mini-bar"><div className="lp-mini-fill" style={{ width: "48%" }} /></div>
              </div>
              <div className="lp-mini-card">
                <div className="lp-mini-label">Insumos críticos</div>
                <div className="lp-mini-val">3</div>
                <div className="lp-mini-sub" style={{ color: "#E85C5C" }}>↑ requieren atención</div>
                <div className="lp-mini-bar"><div className="lp-mini-fill" style={{ width: "30%", background: "#E85C5C" }} /></div>
              </div>
              <div className="lp-preview-list">
                <div className="lp-mini-label" style={{ marginBottom: "0.75rem" }}>Últimas comandas</div>
                {[
                  { dot: "#4CAF80", name: "Mesa 5 — Lomo al trapo x2",      val: "12 min", bg: "rgba(76,175,128,0.15)",  c: "#4CAF80", label: "Listo" },
                  { dot: "#C8892A", name: "Barra 2 — Ceviche clásico",       val: "6 min",  bg: "rgba(200,137,42,0.15)", c: "#C8892A", label: "En proceso" },
                  { dot: "#5B9BD5", name: "Mesa 12 — Risotto de hongos x3",  val: "2 min",  bg: "rgba(91,155,213,0.15)", c: "#5B9BD5", label: "Iniciando" },
                  { dot: "#E85C5C", name: "Domicilio — Pollo asado + papas", val: "18 min", bg: "rgba(232,92,92,0.15)",  c: "#E85C5C", label: "Demorado" },
                ].map((row, i) => (
                  <div className="lp-list-row" key={i}>
                    <div className="lp-list-dot" style={{ background: row.dot }} />
                    <span className="lp-list-name">{row.name}</span>
                    <span className="lp-list-val">{row.val}</span>
                    <span className="lp-list-badge" style={{ background: row.bg, color: row.c }}>{row.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta">
          <p className="lp-hero-eyebrow" style={{ marginBottom: 0 }}>Elige tu acceso</p>
          <h2 className="lp-cta-title">¿Cómo deseas ingresar hoy?</h2>
          <p className="lp-cta-sub">Accede al sistema interno de gestión o al portal dedicado para clientes.</p>
          <div className="lp-cta-buttons">
            <button className="lp-btn lp-btn-primary" onClick={() => navigate("/login")}>
              <svg viewBox="0 0 24 24" style={{ stroke: "#0C0E14", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
              </svg>
              <div className="lp-btn-label">
                <span>Sistema Interno</span>
                <span className="lp-btn-hint">Gestión · Cocina · Reportes</span>
              </div>
            </button>
            <button className="lp-btn lp-btn-secondary" onClick={() => navigate("/clientes")}>
              <svg viewBox="0 0 24 24" style={{ stroke: "#F2EDE4", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <div className="lp-btn-label">
                <span>Portal de Clientes</span>
                <span className="lp-btn-hint">Próximamente disponible</span>
              </div>
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <span className="lp-footer-copy">© 2026 Kitchen Manager · Todos los derechos reservados</span>
          <span className="lp-footer-logo">Kitchen<span>Manager</span></span>
        </footer>

      </div>
    </>
  );
}