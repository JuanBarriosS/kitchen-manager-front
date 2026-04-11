import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #C4862A;
    --gold-light: #E8A840;
    --gold-pale: rgba(196,134,42,0.12);
    --ink: #09090B;
    --surface: #0F1117;
    --surface2: #141820;
    --cream: #F0EBE1;
    --muted: rgba(240,235,225,0.45);
    --border: rgba(255,255,255,0.07);
  }

  .lp {
    display: flex; flex-direction: column; min-height: 100vh;
    background: var(--ink); color: var(--cream);
    font-family: 'Outfit', sans-serif; overflow-x: hidden;
  }

  /* ── NAV ── */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 3.5rem;
    background: rgba(9,9,11,0.82);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .lp-logo { display: flex; align-items: center; gap: 11px; text-decoration: none; }
  .lp-logo-mark {
    width: 34px; height: 34px; background: var(--gold);
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: 17px; line-height: 1;
  }
  .lp-logo-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 500; color: var(--cream); letter-spacing: 0.01em;
  }
  .lp-logo-name span { color: var(--gold); }
  .lp-nav-right { display: flex; align-items: center; gap: 1.5rem; }
  .lp-badge {
    font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); background: var(--gold-pale);
    border: 1px solid rgba(196,134,42,0.3); padding: 4px 12px; border-radius: 20px;
  }
  .lp-nav-cta {
    background: var(--gold); color: var(--ink);
    border: none; padding: 0.55rem 1.25rem; border-radius: 8px;
    font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 600;
    cursor: pointer; letter-spacing: 0.02em; transition: opacity 0.2s, transform 0.2s;
  }
  .lp-nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  /* ── HERO ── */
  .lp-hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 0 0 5rem;
  }
  .lp-hero-img {
    position: absolute; inset: 0; z-index: 0;
    background-image: url('https://images.unsplash.com/photo-1768162125977-9944219971c5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    background-size: cover; background-position: center 30%;
    filter: brightness(0.38);
  }
  .lp-hero-img::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.6) 45%, rgba(9,9,11,0.1) 100%);
  }
  .lp-hero-content {
    position: relative; z-index: 1;
    max-width: 780px; padding: 0 3.5rem;
  }
  .lp-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; margin-bottom: 1.5rem;
  }
  .lp-hero-eyebrow::before {
    content: ''; display: block; width: 28px; height: 1px; background: var(--gold);
  }
  .lp-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.2rem, 6.5vw, 5.8rem); font-weight: 700; line-height: 1.02;
    color: var(--cream); margin-bottom: 1.75rem; letter-spacing: -0.01em;
  }
  .lp-hero-title em { color: var(--gold); font-style: italic; }
  .lp-hero-desc {
    font-size: 1rem; color: rgba(240,235,225,0.58); max-width: 480px;
    line-height: 1.8; margin-bottom: 2.75rem; font-weight: 300;
  }
  .lp-hero-actions { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
  .lp-btn-hero {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--gold); color: var(--ink);
    padding: 0.9rem 1.8rem; border-radius: 9px;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.9rem;
    border: none; cursor: pointer; transition: all 0.22s; text-decoration: none;
  }
  .lp-btn-hero:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(196,134,42,0.35); }
  .lp-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    color: var(--cream); opacity: 0.6; font-size: 0.85rem;
    background: none; border: none; cursor: pointer; transition: opacity 0.2s;
    font-family: 'Outfit', sans-serif; padding: 0;
  }
  .lp-btn-ghost:hover { opacity: 1; }
  .lp-btn-ghost svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  /* ── STATS STRIP ── */
  .lp-stats {
    position: relative; z-index: 2;
    display: grid; grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--border); margin-top: -1px;
    background: rgba(15,17,23,0.96);
    backdrop-filter: blur(12px);
  }
  .lp-stat {
    padding: 1.8rem 2rem; border-right: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 4px;
  }
  .lp-stat:last-child { border-right: none; }
  .lp-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem; font-weight: 700; color: var(--gold-light); line-height: 1;
  }
  .lp-stat-label { font-size: 0.73rem; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }

  /* ── SECTION UTILS ── */
  .lp-section { padding: 6rem 3.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  .lp-tag {
    display: inline-block; font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 1rem;
  }
  .lp-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.9rem, 3.5vw, 2.8rem); font-weight: 700; line-height: 1.15;
    color: var(--cream); margin-bottom: 1rem;
  }
  .lp-h2 em { color: var(--gold); font-style: italic; }
  .lp-lead { font-size: 0.95rem; color: var(--muted); line-height: 1.8; max-width: 520px; font-weight: 300; }
  .lp-divider { height: 1px; background: var(--border); margin: 0; }

  /* ── IMAGE MOSAIC ── */
  .lp-mosaic {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr;
    grid-template-rows: 280px 220px;
    gap: 3px; margin-top: 3.5rem;
  }
  .lp-mosaic-img {
    overflow: hidden; position: relative;
  }
  .lp-mosaic-img img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s ease; display: block;
    filter: brightness(0.75) saturate(0.85);
  }
  .lp-mosaic-img:hover img { transform: scale(1.04); filter: brightness(0.88) saturate(0.95); }
  .lp-mosaic-main { grid-row: span 2; }
  .lp-mosaic-caption {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 0.75rem 1rem;
    background: linear-gradient(to top, rgba(9,9,11,0.8) 0%, transparent 100%);
    font-size: 0.72rem; color: rgba(240,235,225,0.6); letter-spacing: 0.08em; text-transform: uppercase;
  }

  /* ── FEATURES GRID ── */
  .lp-feat-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    background: var(--border); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; margin-top: 3.5rem;
  }
  .lp-feat-card {
    background: var(--surface); padding: 2rem 1.75rem;
    transition: background 0.22s;
    position: relative; overflow: hidden;
  }
  .lp-feat-card:hover { background: var(--surface2); }
  .lp-feat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .lp-feat-card:hover::before { opacity: 1; }
  .lp-feat-icon {
    width: 44px; height: 44px; border-radius: 10px;
    background: var(--gold-pale); border: 1px solid rgba(196,134,42,0.2);
    display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;
  }
  .lp-feat-icon svg { width: 20px; height: 20px; stroke: var(--gold); fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
  .lp-feat-card h3 { font-size: 0.92rem; font-weight: 600; color: var(--cream); margin-bottom: 0.6rem; letter-spacing: 0.01em; }
  .lp-feat-card p { font-size: 0.8rem; color: var(--muted); line-height: 1.7; }
  .lp-feat-pill {
    display: inline-block; margin-top: 1.25rem; font-size: 0.65rem;
    letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 10px;
    border-radius: 20px; background: var(--gold-pale);
    color: var(--gold); border: 1px solid rgba(196,134,42,0.2);
  }

  /* ── SPLIT SECTION ── */
  .lp-split {
    display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
    padding: 6rem 3.5rem; max-width: 1200px; margin: 0 auto; width: 100%;
  }
  .lp-split-img { position: relative; border-radius: 12px; overflow: hidden; }
  .lp-split-img img {
    width: 100%; height: 420px; object-fit: cover; display: block;
    filter: brightness(0.8) saturate(0.9);
  }
  .lp-split-img-overlay {
    position: absolute; bottom: 1.25rem; left: 1.25rem; right: 1.25rem;
    background: rgba(9,9,11,0.82); backdrop-filter: blur(12px);
    border: 1px solid var(--border); border-radius: 10px; padding: 1rem 1.25rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .lp-sio-label { font-size: 0.72rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .lp-sio-val { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--gold-light); }
  .lp-sio-sub { font-size: 0.72rem; color: #4CAF80; margin-top: 2px; }
  .lp-sio-divider { width: 1px; height: 38px; background: var(--border); }
  .lp-split-body { display: flex; flex-direction: column; gap: 2rem; }
  .lp-split-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; }
  .lp-split-item {
    display: flex; gap: 1rem; align-items: flex-start;
  }
  .lp-split-bullet {
    width: 6px; height: 6px; border-radius: 50%; background: var(--gold); margin-top: 6px; flex-shrink: 0;
  }
  .lp-split-item-text { font-size: 0.85rem; color: var(--muted); line-height: 1.65; }
  .lp-split-item-text strong { color: var(--cream); font-weight: 500; }

  /* ── PREVIEW ── */
  .lp-preview-wrap { padding: 0 3.5rem 6rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  .lp-preview-box {
    border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
    background: #07080E;
  }
  .lp-preview-bar {
    background: #0D0F18; padding: 0.7rem 1.25rem;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
  }
  .lp-dot { width: 10px; height: 10px; border-radius: 50%; }
  .lp-preview-url {
    flex: 1; text-align: center; font-size: 0.72rem; color: rgba(240,235,225,0.22);
    font-family: 'Outfit', monospace; letter-spacing: 0.02em;
  }
  .lp-preview-content { padding: 1.75rem; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
  .lp-mini-card {
    background: #0D1020; border: 1px solid rgba(255,255,255,0.055);
    border-radius: 10px; padding: 1.25rem;
  }
  .lp-mini-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(240,235,225,0.32); margin-bottom: 0.4rem; }
  .lp-mini-val { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 700; color: #F0EBE1; line-height: 1; }
  .lp-mini-sub { font-size: 0.7rem; margin-top: 4px; }
  .lp-mini-bar { height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; margin-top: 0.75rem; overflow: hidden; }
  .lp-mini-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #C4862A, #E8A840); }
  .lp-preview-list {
    background: #0D1020; border: 1px solid rgba(255,255,255,0.055);
    border-radius: 10px; padding: 1.25rem; grid-column: span 2;
  }
  .lp-list-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .lp-list-row:last-child { border-bottom: none; }
  .lp-list-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .lp-list-name { font-size: 0.78rem; color: #E0DDD5; flex: 1; }
  .lp-list-val { font-size: 0.75rem; color: var(--muted); }
  .lp-list-badge { font-size: 0.63rem; padding: 2px 9px; border-radius: 10px; font-weight: 500; letter-spacing: 0.04em; }

  /* ── TESTIMONIAL/QUOTE ── */
  .lp-quote-section {
    padding: 5rem 3.5rem; position: relative; overflow: hidden;
    background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }
  .lp-quote-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1400&q=70&auto=format&fit=crop');
    background-size: cover; background-position: center;
    filter: brightness(0.12) saturate(0.5); z-index: 0;
  }
  .lp-quote-inner { position: relative; z-index: 1; max-width: 750px; margin: 0 auto; text-align: center; }
  .lp-quote-mark {
    font-family: 'Playfair Display', serif; font-size: 6rem; line-height: 0.6;
    color: var(--gold); opacity: 0.4; margin-bottom: 1.5rem; display: block;
  }
  .lp-quote-text {
    font-family: 'Playfair Display', serif; font-size: clamp(1.3rem, 2.5vw, 1.75rem);
    font-style: italic; color: var(--cream); line-height: 1.55; margin-bottom: 2rem;
  }
  .lp-quote-author { font-size: 0.8rem; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
  .lp-quote-author strong { color: var(--gold); font-weight: 500; }

  /* ── CTA ── */
  .lp-cta { padding: 6rem 3.5rem; text-align: center; position: relative; overflow: hidden; }
  .lp-cta-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1400&q=75&auto=format&fit=crop');
    background-size: cover; background-position: center;
    filter: brightness(0.2) saturate(0.6); z-index: 0;
  }
  .lp-cta-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
  .lp-cta-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; color: var(--cream); max-width: 600px; line-height: 1.15; }
  .lp-cta-title em { color: var(--gold); font-style: italic; }
  .lp-cta-sub { font-size: 0.9rem; color: var(--muted); max-width: 420px; line-height: 1.7; }
  .lp-cta-buttons { display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap; justify-content: center; }

  .lp-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--gold); color: var(--ink);
    padding: 0.95rem 2rem; border-radius: 9px;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.9rem;
    border: none; cursor: pointer; transition: all 0.22s;
  }
  .lp-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(196,134,42,0.38); }
  .lp-btn-secondary-lg {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(240,235,225,0.06); color: var(--cream);
    border: 1px solid rgba(240,235,225,0.14) !important;
    padding: 0.95rem 2rem; border-radius: 9px;
    font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 0.9rem;
    cursor: pointer; transition: all 0.22s; border: none;
  }
  .lp-btn-secondary-lg:hover { background: rgba(240,235,225,0.11); transform: translateY(-3px); }

  /* ── FOOTER ── */
  .lp-footer {
    padding: 2rem 3.5rem; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    background: var(--ink);
  }
  .lp-footer-copy { font-size: 0.72rem; color: rgba(240,235,225,0.25); }
  .lp-footer-brand { font-family: 'Playfair Display', serif; font-size: 0.9rem; color: rgba(240,235,225,0.3); }
  .lp-footer-brand span { color: var(--gold); }

  /* ── ICON SVG HELPERS ── */
  .ico { width: 20px; height: 20px; stroke: var(--gold); fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .lp-nav { padding: 1rem 1.5rem; }
    .lp-nav-cta { display: none; }
    .lp-hero-content { padding: 0 1.5rem; }
    .lp-section { padding: 4rem 1.5rem; }
    .lp-split { grid-template-columns: 1fr; gap: 2.5rem; padding: 4rem 1.5rem; }
    .lp-split-img img { height: 300px; }
    .lp-mosaic { grid-template-columns: 1fr 1fr; grid-template-rows: 220px 180px 180px; }
    .lp-mosaic-main { grid-row: span 1; grid-column: span 2; }
    .lp-feat-grid { grid-template-columns: 1fr; }
    .lp-stats { grid-template-columns: repeat(2, 1fr); }
    .lp-stat { border-right: none; border-bottom: 1px solid var(--border); }
    .lp-stat:nth-child(odd) { border-right: 1px solid var(--border); }
    .lp-preview-wrap { padding: 0 1.5rem 4rem; }
    .lp-preview-content { grid-template-columns: 1fr; }
    .lp-preview-list { grid-column: span 1; }
    .lp-cta { padding: 4rem 1.5rem; }
    .lp-quote-section { padding: 4rem 1.5rem; }
    .lp-footer { padding: 1.5rem; flex-direction: column; gap: 0.5rem; text-align: center; }
  }
`;

const FEATURES = [
  {
    title: "Panel de comandas",
    tag: "Tiempo real",
    desc: "Visualiza y gestiona todas las órdenes activas desde un display centralizado con prioridades automáticas.",
    icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>
  },
  {
    title: "Control de inventario",
    tag: "Alertas automáticas",
    desc: "Rastrea insumos, alertas de stock bajo y consumo automático al procesar cada orden del sistema.",
    icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></>
  },
  {
    title: "Tiempos y turnos",
    tag: "KPI operativo",
    desc: "Mide tiempos de preparación por platillo y equipo. Identifica cuellos de botella en el servicio.",
    icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
  },
  {
    title: "Gestión de equipo",
    tag: "Staff manager",
    desc: "Asigna estaciones, monitorea carga de trabajo y registra el desempeño del personal de cocina.",
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>
  },
  {
    title: "Analíticas avanzadas",
    tag: "Reportes",
    desc: "Reportes de ventas, platillos más pedidos, horas pico y métricas de eficiencia del servicio.",
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  },
  {
    title: "Sincronización total",
    tag: "Multi-estación",
    desc: "Cocina, barra y salón conectados al instante. Actualizaciones en tiempo real entre todas las estaciones.",
    icon: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>
  },
];

const COMANDAS = [
  { dot: "#4CAF80", name: "Mesa 5 — Lomo al trapo ×2",      val: "12 min", bg: "rgba(76,175,128,0.14)",  c: "#4CAF80",  label: "Listo" },
  { dot: "#C4862A", name: "Barra 2 — Ceviche clásico",       val: "6 min",  bg: "rgba(196,134,42,0.14)", c: "#C4862A",  label: "En preparación" },
  { dot: "#5B9BD5", name: "Mesa 12 — Risotto de hongos ×3",  val: "2 min",  bg: "rgba(91,155,213,0.14)", c: "#5B9BD5",  label: "Recibido" },
  { dot: "#E85C5C", name: "Domicilio — Pollo asado + papas", val: "18 min", bg: "rgba(232,92,92,0.14)",  c: "#E85C5C",  label: "Demorado" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="lp">

        {/* NAV */}
        <nav className="lp-nav">
          <div className="lp-logo">
            <a className="lp-logo" href="#">
            <svg width="180" height="48" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(2,4) scale(0.55)">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.4"/>
                <g transform="rotate(-20,50,50)" stroke="#C9A84C" strokeLinecap="round" fill="none" strokeWidth="3">
                  <line x1="44" y1="14" x2="44" y2="35"/>
                  <line x1="50" y1="11" x2="50" y2="35"/>
                  <line x1="56" y1="14" x2="56" y2="35"/>
                  <path d="M44 35 Q47 41 50 42 Q53 41 56 35"/>
                  <line x1="50" y1="42" x2="50" y2="86"/>
                </g>
                <g transform="rotate(20,50,50)" stroke="#C9A84C" strokeLinecap="round" fill="none" strokeWidth="3">
                  <path d="M50 11 Q58 30 54 44"/>
                  <line x1="50" y1="11" x2="46" y2="44"/>
                  <line x1="46" y1="44" x2="54" y2="44"/>
                  <line x1="50" y1="46" x2="50" y2="86"/>
                </g>
              </g>
              <line x1="70" y1="12" x2="70" y2="68" stroke="#C9A84C" strokeWidth="0.6" opacity="0.35"/>
              <text x="82" y="36" fontFamily="'Playfair Display','Georgia',serif" fontSize="24" fontWeight="300" letterSpacing="5" fill="#C9A84C">KITCHEN</text>
              <line x1="82" y1="43" x2="282" y2="43" stroke="#C9A84C" strokeWidth="0.4" opacity="0.25"/>
              <text x="83" y="58" fontFamily="'Playfair Display','Georgia',serif" fontSize="11" fontWeight="400" letterSpacing="8" fill="#F0EBE0" opacity="0.5">MANAGER</text>
            </svg>
          </a>
          </div>
          <div className="lp-nav-right">
            <span className="lp-badge">v2.0 · Sistema Activo</span>
            <button className="lp-nav-cta" onClick={() => navigate("/login")}>
              Ingresar al sistema
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-hero-img" />
          <div className="lp-hero-content">
            <p className="lp-hero-eyebrow">Plataforma de gestión gastronómica</p>
            <h1 className="lp-hero-title">
              Tu cocina.<br />
              Bajo <em>control total.</em>
            </h1>
            <p className="lp-hero-desc">
              Kitchen Manager centraliza comandas, inventario y equipo en un solo sistema. Eficiencia real, visibilidad en tiempo real, desde la mise en place hasta el servicio.
            </p>
            <div className="lp-hero-actions">
              <button className="lp-btn-hero" onClick={() => navigate("/login")}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Acceder al sistema
              </button>
              <button className="lp-btn-ghost">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                Ver demo
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="lp-stats">
          {[
            { num: "98%",  label: "Precisión de pedidos" },
            { num: "3×",   label: "Velocidad de despacho" },
            { num: "24/7", label: "Monitoreo en vivo" },
            { num: "∞",    label: "Escalabilidad" },
          ].map((s, i) => (
            <div className="lp-stat" key={i}>
              <div className="lp-stat-num">{s.num}</div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* MOSAIC SECTION */}
        <section className="lp-section" style={{ paddingBottom: 0 }}>
          <span className="lp-tag">El corazón de tu operación</span>
          <h2 className="lp-h2">Diseñado para <em>cocinas reales</em></h2>
          <p className="lp-lead">
            Desde la brigada de cocina hasta el servicio en sala, Kitchen Manager conecta cada punto de tu operación gastronómica.
          </p>
          <div className="lp-mosaic">
            <div className="lp-mosaic-img lp-mosaic-main">
              <img
                src="https://images.unsplash.com/photo-1691651341109-e38eee0eab53?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Cocina profesional"
                loading="lazy"
              />
              <div className="lp-mosaic-caption">Integrancion en restaurantes y Gosth Kitchen</div>
            </div>
            <div className="lp-mosaic-img">
              <img
                src="https://images.unsplash.com/photo-1556745750-68295fefafc5?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Plating de alta cocina"
                loading="lazy"
              />
              <div className="lp-mosaic-caption">Gestion de los pedidos</div>
            </div>
            <div className="lp-mosaic-img">
              <img
                src="https://images.unsplash.com/photo-1548695607-9c73430ba065?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Servicio de restaurante"
                loading="lazy"
              />
              <div className="lp-mosaic-caption">Servicio delivery optimizado</div>
            </div>
            <div className="lp-mosaic-img">
              <img
                src="https://images.unsplash.com/photo-1568897798623-00bafffa9b1f?q=80&w=809&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Facturacion"
                loading="lazy"
              />
              <div className="lp-mosaic-caption">Control en la facturacion</div>
            </div>
            <div className="lp-mosaic-img">
              <img
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80&auto=format&fit=crop"
                alt="Chef trabajando"
                loading="lazy"
              />
              <div className="lp-mosaic-caption">Eficiencia en la preparacion</div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="lp-section">
          <span className="lp-tag">Funcionalidades principales</span>
          <h2 className="lp-h2">Todo lo que necesitas,<br /><em>en un solo lugar</em></h2>
          <div className="lp-feat-grid">
            {FEATURES.map((f, i) => (
              <div className="lp-feat-card" key={i}>
                <div className="lp-feat-icon">
                  <svg viewBox="0 0 24 24" className="ico">{f.icon}</svg>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="lp-feat-pill">{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SPLIT — inventario */}
        <div className="lp-divider" />
        <div className="lp-split">
          <div className="lp-split-img">
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&auto=format&fit=crop"
              alt="Inventario de cocina"
              loading="lazy"
            />
            <div className="lp-split-img-overlay">
              <div>
                <div className="lp-sio-label">Insumos activos</div>
                <div className="lp-sio-val">247</div>
                <div className="lp-sio-sub">↑ actualizado hace 2 min</div>
              </div>
              <div className="lp-sio-divider" />
              <div>
                <div className="lp-sio-label">Alertas de stock</div>
                <div className="lp-sio-val" style={{ color: "#E85C5C" }}>3</div>
                <div className="lp-sio-sub" style={{ color: "#E85C5C" }}>requieren atención</div>
              </div>
            </div>
          </div>
          <div className="lp-split-body">
            <div>
              <span className="lp-tag">Control de inventario</span>
              <h2 className="lp-h2">Stock en tiempo real,<br /><em>sin sorpresas</em></h2>
            </div>
            <p className="lp-lead">
              Cada platillo procesado descuenta automáticamente los insumos utilizados. Nunca más quedarte sin ingredientes en plena hora pico.
            </p>
            <ul className="lp-split-list">
              {[
                ["Descuento automático", "al procesar cada orden del sistema"],
                ["Alertas inteligentes", "cuando el stock llega al umbral crítico"],
                ["Historial de consumo", "para planificar compras con precisión"],
                ["Integración con proveedores", "y gestión de órdenes de reposición"],
              ].map(([strong, rest], i) => (
                <li className="lp-split-item" key={i} style={{ listStyle: "none" }}>
                  <div className="lp-split-bullet" />
                  <span className="lp-split-item-text"><strong>{strong}</strong> {rest}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lp-divider" />

        {/* PREVIEW */}
        <section className="lp-section" style={{ paddingBottom: 0 }}>
          <span className="lp-tag">Vista previa del sistema</span>
          <h2 className="lp-h2">El dashboard que<br /><em>tu equipo necesita</em></h2>
        </section>
        <div className="lp-preview-wrap" style={{ paddingTop: "2rem" }}>
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
                <div className="lp-mini-sub" style={{ color: "#4CAF80" }}>↑ 8 vs ayer</div>
                <div className="lp-mini-bar"><div className="lp-mini-fill" style={{ width: "72%" }} /></div>
              </div>
              <div className="lp-mini-card">
                <div className="lp-mini-label">Tiempo promedio</div>
                <div className="lp-mini-val">14 min</div>
                <div className="lp-mini-sub" style={{ color: "#C4862A" }}>↔ igual que ayer</div>
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
                {COMANDAS.map((row, i) => (
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
        </div>

        {/* QUOTE */}
        <section className="lp-quote-section">
          <div className="lp-quote-bg" />
          <div className="lp-quote-inner">
            <span className="lp-quote-mark">"</span>
            <p className="lp-quote-text">
              Desde que implementamos Kitchen Manager, reducimos los tiempos de despacho en un 40% y prácticamente eliminamos los errores en comandas.
            </p>
            <p className="lp-quote-author">
              <strong>Chef Andrés Mejía</strong> · Restaurante La Palma, Cartagena
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta">
          <div className="lp-cta-bg" />
          <div className="lp-cta-inner">
            <span className="lp-tag">Elige tu acceso</span>
            <h2 className="lp-cta-title">¿Listo para <em>transformar</em> tu operación?</h2>
            <p className="lp-cta-sub">
              Accede al sistema interno de gestión y lleva tu cocina al siguiente nivel.
            </p>
            <div className="lp-cta-buttons">
              <button className="lp-btn-primary" onClick={() => navigate("/login")}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
                </svg>
                Ingresar al Sistema
              </button>
              <button className="lp-btn-secondary-lg">
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                Ver demo en vivo
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <span className="lp-footer-copy">© 2026 Kitchen Manager · Todos los derechos reservados</span>
          <svg width="120" height="32" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" style={{opacity: 0.4}}>
            <g transform="translate(2,4) scale(0.55)">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.4"/>
              <g transform="rotate(-20,50,50)" stroke="#C9A84C" strokeLinecap="round" fill="none" strokeWidth="3">
                <line x1="44" y1="14" x2="44" y2="35"/><line x1="50" y1="11" x2="50" y2="35"/><line x1="56" y1="14" x2="56" y2="35"/>
                <path d="M44 35 Q47 41 50 42 Q53 41 56 35"/><line x1="50" y1="42" x2="50" y2="86"/>
              </g>
              <g transform="rotate(20,50,50)" stroke="#C9A84C" strokeLinecap="round" fill="none" strokeWidth="3">
                <path d="M50 11 Q58 30 54 44"/><line x1="50" y1="11" x2="46" y2="44"/>
                <line x1="46" y1="44" x2="54" y2="44"/><line x1="50" y1="46" x2="50" y2="86"/>
              </g>
            </g>
            <line x1="70" y1="12" x2="70" y2="68" stroke="#C9A84C" strokeWidth="0.6" opacity="0.35"/>
            <text x="82" y="36" fontFamily="Georgia,serif" fontSize="24" fontWeight="300" letterSpacing="5" fill="#C9A84C">KITCHEN</text>
            <line x1="82" y1="43" x2="282" y2="43" stroke="#C9A84C" strokeWidth="0.4" opacity="0.25"/>
            <text x="83" y="58" fontFamily="Georgia,serif" fontSize="11" letterSpacing="8" fill="#F0EBE0" opacity="0.6">MANAGER</text>
          </svg>
        </footer>

      </div>
    </>
  );
}