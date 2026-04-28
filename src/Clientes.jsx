import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:     #0C0F1A;
    --card:   #10131C;
    --gold:   #C9A84C;
    --gold2:  #E2C97E;
    --cream:  #F0EBE0;
    --text:   #D8D3C8;
    --muted:  rgba(240,235,224,0.35);
    --border: rgba(201,168,76,0.12);
    --red:    rgba(220,70,70,0.85);
    --green:  rgba(100,190,110,0.85);
  }

  .cp-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ── NAV ── */
  .cp-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 3rem;
    border-bottom: 0.5px solid var(--border);
    position: sticky; top: 0; z-index: 100;
    background: rgba(12,15,26,0.97);
    backdrop-filter: blur(12px);
  }
  .cp-logo {
    display: flex; align-items: center; gap: 12px; cursor: pointer;
    text-decoration: none;
  }
  .cp-logo-wordmark {
    display: flex; flex-direction: column; gap: 2px;
  }
  .cp-logo-kitchen {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-weight: 300; letter-spacing: 5px;
    color: var(--gold); text-transform: uppercase; line-height: 1;
  }
  .cp-logo-sep {
    width: 60px; height: 0.5px; background: rgba(201,168,76,0.2);
  }
  .cp-logo-manager {
    font-size: 8px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(240,235,224,0.25);
  }
  .cp-nav-pill {
    font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(201,168,76,0.5);
    border: 0.5px solid rgba(201,168,76,0.2);
    padding: 4px 12px; border-radius: 20px;
  }
  .cp-nav-back {
    background: transparent; border: 0.5px solid rgba(240,235,224,0.1);
    border-radius: 20px; color: rgba(240,235,224,0.35);
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    letter-spacing: 1px; padding: 5px 14px; cursor: pointer;
    transition: all 0.2s;
  }
  .cp-nav-back:hover {
    border-color: rgba(201,168,76,0.3); color: var(--cream);
  }

  /* ── HERO ── */
  .cp-hero {
    padding: 4rem 3rem 2.5rem; text-align: center; position: relative; overflow: hidden;
  }
  .cp-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 700px 300px at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%);
    pointer-events: none;
  }
  .cp-hero-eyebrow {
    font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(201,168,76,0.5); margin-bottom: 14px;
  }
  .cp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 5vw, 3rem); font-weight: 300; line-height: 1.15;
    color: var(--cream); margin-bottom: 12px; letter-spacing: 1px;
  }
  .cp-hero-title em { color: var(--gold); font-style: italic; }
  .cp-hero-divider {
    width: 60px; height: 0.5px; background: rgba(201,168,76,0.3);
    margin: 16px auto;
  }
  .cp-hero-sub {
    font-size: 13px; color: var(--muted); font-weight: 300;
    max-width: 400px; margin: 0 auto; line-height: 1.8;
  }

  /* ── LAYOUT ── */
  .cp-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 28px;
    max-width: 1080px;
    margin: 0 auto;
    padding: 2rem 3rem 5rem;
    align-items: start;
  }

  /* ── SECTION DIVIDER ── */
  .cp-divider {
    display: flex; align-items: center; gap: 16px; margin-bottom: 1.5rem;
  }
  .cp-divider-line { flex: 1; height: 0.5px; background: var(--border); }
  .cp-divider-label {
    font-size: 8px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(201,168,76,0.4); white-space: nowrap;
  }

  /* ── DATOS CLIENTE ── */
  .cp-datos { margin-bottom: 2.5rem; }
  .cp-datos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .cp-field { display: flex; flex-direction: column; gap: 6px; }
  .cp-label {
    font-size: 8px; font-weight: 500; letter-spacing: 3px;
    text-transform: uppercase; color: rgba(201,168,76,0.45);
  }
  .cp-input {
    background: rgba(255,255,255,0.02);
    border: 0.5px solid rgba(201,168,76,0.18);
    border-radius: 6px; padding: 11px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 300; color: var(--cream); outline: none;
    transition: border-color 0.2s;
  }
  .cp-input:focus { border-color: rgba(201,168,76,0.5); }
  .cp-input::placeholder { color: rgba(240,235,224,0.15); }
  .cp-textarea {
    background: rgba(255,255,255,0.02);
    border: 0.5px solid rgba(201,168,76,0.18);
    border-radius: 6px; padding: 11px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 300; color: var(--cream); outline: none;
    resize: vertical; min-height: 68px; transition: border-color 0.2s;
    width: 100%;
  }
  .cp-textarea:focus { border-color: rgba(201,168,76,0.5); }
  .cp-textarea::placeholder { color: rgba(240,235,224,0.15); }

  /* ── CATS ── */
  .cp-cats {
    display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1.5rem;
  }
  .cp-cat-btn {
    padding: 5px 14px; border-radius: 20px;
    font-size: 11px; font-weight: 400; letter-spacing: 0.5px;
    cursor: pointer; border: 0.5px solid rgba(240,235,224,0.1);
    background: transparent; color: var(--muted);
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .cp-cat-btn:hover { border-color: rgba(201,168,76,0.25); color: var(--cream); }
  .cp-cat-btn.active {
    background: rgba(201,168,76,0.08);
    border-color: rgba(201,168,76,0.3); color: var(--gold);
  }

  /* ── PRODUCTOS ── */
  .cp-productos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 10px; margin-bottom: 2rem;
  }
  .cp-prod {
    background: var(--card);
    border: 0.5px solid rgba(240,235,224,0.06);
    border-radius: 8px; padding: 1rem;
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .cp-prod:hover:not(.cp-prod-agotado) {
    border-color: rgba(201,168,76,0.3);
    background: rgba(201,168,76,0.03);
  }
  .cp-prod.cp-prod-sel {
    border-color: rgba(201,168,76,0.5);
    background: rgba(201,168,76,0.06);
  }
  .cp-prod.cp-prod-agotado { opacity: 0.3; cursor: not-allowed; }
  .cp-prod-cat {
    font-size: 8px; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(201,168,76,0.4); margin-bottom: 5px;
  }
  .cp-prod-nombre {
    font-size: 13px; font-weight: 400; color: var(--cream);
    margin-bottom: 8px; line-height: 1.35;
  }
  .cp-prod-precio {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 400; color: var(--gold);
  }
  .cp-prod-agotado-badge {
    position: absolute; top: 8px; right: 8px;
    font-size: 8px; padding: 2px 7px; border-radius: 10px;
    background: rgba(220,70,70,0.08); color: var(--red);
    border: 0.5px solid rgba(220,70,70,0.2);
    letter-spacing: 1px; text-transform: uppercase;
  }

  /* ── QTY ── */
  .cp-qty {
    display: flex; align-items: center; gap: 8px; margin-top: 10px;
  }
  .cp-qty-btn {
    width: 22px; height: 22px; border-radius: 50%;
    border: 0.5px solid rgba(201,168,76,0.35); background: transparent;
    color: var(--gold); font-size: 13px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .cp-qty-btn:hover { background: rgba(201,168,76,0.12); }
  .cp-qty-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 400; color: var(--cream);
    min-width: 16px; text-align: center;
  }

  /* ── RESUMEN ── */
  .cp-resumen {
    background: var(--card);
    border: 0.5px solid rgba(201,168,76,0.15);
    border-radius: 10px; overflow: hidden;
    position: sticky; top: 72px;
  }
  .cp-resumen-top {
    position: relative; padding: 1.1rem 1.25rem 1rem;
    border-bottom: 0.5px solid var(--border);
  }
  .cp-resumen-top::before {
    content: ''; position: absolute; top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .cp-resumen-titulo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 400; color: var(--cream); letter-spacing: 1px;
  }
  .cp-resumen-sub {
    font-size: 11px; color: var(--muted); margin-top: 2px; font-weight: 300;
  }
  .cp-resumen-items { padding: 10px 14px; min-height: 72px; }
  .cp-resumen-empty {
    color: var(--muted); font-size: 11px; text-align: center;
    padding: 18px 0; line-height: 1.7; letter-spacing: 0.3px;
  }
  .cp-resumen-item {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 0; border-bottom: 0.5px solid rgba(255,255,255,0.03);
  }
  .cp-resumen-item:last-child { border-bottom: none; }
  .cp-resumen-item-info { flex: 1; }
  .cp-resumen-item-name { font-size: 12px; color: var(--cream); }
  .cp-resumen-item-qty { font-size: 10px; color: var(--muted); margin-top: 1px; }
  .cp-resumen-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; color: var(--gold); margin: 0 4px;
  }
  .cp-resumen-del {
    background: none; border: none; color: var(--red);
    cursor: pointer; font-size: 11px; opacity: 0.35;
    transition: opacity 0.15s;
  }
  .cp-resumen-del:hover { opacity: 0.8; }
  .cp-resumen-total {
    padding: 12px 16px;
    border-top: 0.5px solid rgba(201,168,76,0.15);
    display: flex; align-items: baseline; justify-content: space-between;
  }
  .cp-resumen-total-label {
    font-size: 8px; color: var(--muted); letter-spacing: 3px; text-transform: uppercase;
  }
  .cp-resumen-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 400; color: var(--gold2);
  }
  .cp-resumen-actions { padding: 0 14px 14px; display: flex; flex-direction: column; gap: 8px; }
  .cp-resumen-hint {
    font-size: 10px; color: var(--muted); text-align: center;
    line-height: 1.6; letter-spacing: 0.3px;
  }

  /* ── BUTTONS ── */
  .cp-btn-primary {
    width: 100%; padding: 12px 16px;
    background: transparent;
    border: 0.5px solid var(--gold);
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
    letter-spacing: 4px; text-transform: uppercase;
    color: var(--gold); cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .cp-btn-primary:hover:not(:disabled) {
    background: rgba(201,168,76,0.1); transform: translateY(-1px);
  }
  .cp-btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }
  .cp-btn-sec {
    width: 100%; padding: 10px;
    background: transparent; border: 0.5px solid rgba(240,235,224,0.08);
    border-radius: 6px; color: var(--muted);
    font-family: 'DM Sans', sans-serif; font-size: 11px; cursor: pointer;
    transition: all 0.15s; letter-spacing: 0.5px;
  }
  .cp-btn-sec:hover { border-color: rgba(240,235,224,0.15); color: var(--cream); }

  /* ── ALERTA ── */
  .cp-alerta { font-size: 11px; padding: 10px 12px; border-radius: 6px; text-align: center; letter-spacing: 0.3px; }
  .cp-alerta-ok  { background: rgba(100,190,110,0.06); color: var(--green); border: 0.5px solid rgba(100,190,110,0.2); }
  .cp-alerta-err { background: rgba(220,70,70,0.06);  color: var(--red);   border: 0.5px solid rgba(220,70,70,0.2); }

  /* ── SUCCESS ── */
  .cp-success {
    min-height: 60vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    padding: 4rem 2rem; gap: 14px;
  }
  .cp-success-icon {
    width: 56px; height: 56px;
    border: 0.5px solid rgba(100,190,110,0.3);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin-bottom: 6px;
  }
  .cp-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; color: var(--cream); letter-spacing: 2px;
  }
  .cp-success-sub {
    font-size: 13px; color: var(--muted); font-weight: 300;
    max-width: 340px; line-height: 1.8;
  }
  .cp-success-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; color: var(--gold);
    border: 0.5px solid rgba(201,168,76,0.2);
    padding: 6px 20px; border-radius: 20px; letter-spacing: 2px;
  }

  /* ── LOADING ── */
  .cp-loading { padding: 60px 20px; text-align: center; color: var(--muted); font-size: 12px; letter-spacing: 2px; }

  /* ── FOOTER ── */
  .cp-footer {
    padding: 1.25rem 3rem; border-top: 0.5px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .cp-footer-left {
    font-size: 10px; color: rgba(240,235,224,0.15); letter-spacing: 1px;
  }
  .cp-footer-wordmark {
    display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
  }
  .cp-footer-kitchen {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px; font-weight: 300; letter-spacing: 4px;
    color: rgba(201,168,76,0.3); text-transform: uppercase;
  }
  .cp-footer-sep {
    width: 40px; height: 0.5px; background: rgba(201,168,76,0.1);
  }
  .cp-footer-manager {
    font-size: 7px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(240,235,224,0.1);
  }

  /* ── CLIENTE INFO MINI ── */
  .cp-cliente-mini {
    padding: 9px 14px;
    border-top: 0.5px solid var(--border);
    font-size: 10px; color: var(--muted);
    display: flex; flex-direction: column; gap: 3px;
    letter-spacing: 0.3px;
  }
  .cp-cliente-mini strong { color: var(--cream); font-weight: 400; }

  /* ── MODAL OVERLAY ── */
  .cp-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(12,15,26,0.88);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem;
    animation: cp-fade-in 0.18s ease;
  }
  @keyframes cp-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .cp-modal {
    background: var(--card);
    border: 0.5px solid rgba(201,168,76,0.3);
    border-radius: 12px;
    padding: 2rem 1.75rem 1.75rem;
    max-width: 420px; width: 100%;
    position: relative;
    animation: cp-slide-up 0.2s ease;
  }
  @keyframes cp-slide-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cp-modal-topline {
    position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .cp-modal-eyebrow {
    font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(201,168,76,0.5); text-align: center; margin-bottom: 10px;
  }
  .cp-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 300; color: var(--cream);
    letter-spacing: 1px; text-align: center; margin-bottom: 6px;
  }
  .cp-modal-sub {
    font-size: 12px; color: var(--muted); font-weight: 300;
    text-align: center; line-height: 1.7; margin-bottom: 1.25rem;
  }
  .cp-modal-items {
    background: rgba(255,255,255,0.02);
    border: 0.5px solid var(--border);
    border-radius: 8px; padding: 0.9rem; margin-bottom: 1rem;
  }
  .cp-modal-items-label {
    font-size: 8px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(201,168,76,0.4); margin-bottom: 8px;
  }
  .cp-modal-item-row {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 12px; padding: 5px 0;
    border-bottom: 0.5px solid rgba(255,255,255,0.03);
  }
  .cp-modal-item-row:last-of-type { border-bottom: none; }
  .cp-modal-item-name { color: var(--text); }
  .cp-modal-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; color: var(--gold);
  }
  .cp-modal-total-row {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-top: 10px; padding-top: 8px;
    border-top: 0.5px solid rgba(201,168,76,0.15);
  }
  .cp-modal-total-label {
    font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted);
  }
  .cp-modal-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 400; color: var(--gold2);
  }
  .cp-modal-cliente {
    font-size: 11px; color: var(--muted);
    text-align: center; line-height: 1.8; margin-bottom: 1.25rem;
  }
  .cp-modal-cliente strong { color: var(--cream); font-weight: 400; }
  .cp-modal-notas {
    font-size: 10px; color: var(--muted); margin-top: 3px;
    font-style: italic;
  }
  .cp-modal-btns {
    display: flex; gap: 8px;
  }
  .cp-modal-btns .cp-btn-sec  { flex: 1; }
  .cp-modal-btns .cp-btn-primary { flex: 2; }

  @media (max-width: 768px) {
    .cp-nav, .cp-hero, .cp-footer { padding-left: 1.25rem; padding-right: 1.25rem; }
    .cp-layout { grid-template-columns: 1fr; padding: 1.5rem 1.25rem 3rem; }
    .cp-resumen { position: static; }
    .cp-datos-grid { grid-template-columns: 1fr; }
    .cp-modal { padding: 1.75rem 1.25rem 1.25rem; }
  }
`;

/* ── LOGO SVG Kitchen Manager ── */
const Logo = () => (
  <svg width="38" height="38" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
    {/* Círculo exterior */}
    <circle cx="100" cy="100" r="94" stroke="#C9A84C" strokeWidth="2.5"/>
    {/* Círculo interior sutil */}
    <circle cx="100" cy="100" r="78" stroke="#C9A84C" strokeWidth="0.8" opacity="0.35"/>

    {/* Tenedor — izquierda */}
    <g stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Púas del tenedor */}
      <line x1="82" y1="36" x2="82" y2="72"/>
      <line x1="92" y1="36" x2="92" y2="72"/>
      <line x1="102" y1="36" x2="102" y2="72"/>
      {/* Curva base del tenedor */}
      <path d="M82 72 Q87 84 92 86 Q97 84 102 72"/>
      {/* Mango del tenedor */}
      <line x1="92" y1="86" x2="92" y2="164"/>
    </g>

    {/* Cuchillo — derecha */}
    <g stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Hoja del cuchillo */}
      <path d="M118 36 Q134 60 130 88"/>
      {/* Lomo recto */}
      <line x1="118" y1="36" x2="118" y2="88"/>
      {/* Base de la hoja */}
      <line x1="118" y1="88" x2="130" y2="88"/>
      {/* Mango del cuchillo */}
      <line x1="124" y1="88" x2="124" y2="164"/>
    </g>

    {/* Plato / arco decorativo central */}
    <path d="M66 118 Q100 108 134 118" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <path d="M72 126 Q100 116 128 126" stroke="#C9A84C" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(100,190,110,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const fmt = (n) => `$${Number(n).toLocaleString("es-CO")}`;

export default function PortalClientes() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [menu, setMenu]                         = useState([]);
  const [cargando, setCargando]                 = useState(true);
  const [catActiva, setCatActiva]               = useState("Todas");
  const [errorQr, setErrorQr]                   = useState(null);
  const [carrito, setCarrito]                   = useState({});
  const [nombre, setNombre]                     = useState("");
  const [mesa, setMesa]                         = useState("");
  const [notas, setNotas]                       = useState("");
  const [enviando, setEnviando]                 = useState(false);
  const [resultado, setResultado]               = useState(null);
  const [pedidoEnviado, setPedidoEnviado]       = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [meseros, setMeseros]           = useState([]);
  const [meseroSeleccionado, setMeseroSeleccionado] = useState("");

  useEffect(() => {
    const url = token
      ? `https://kitchen-manager-back-1-production.up.railway.app/menu/${token}`
      : "https://kitchen-manager-back-1-production.up.railway.app/clientes/verMenu";

    axios.get(url)
      .then(res => {
        if (token) {
          const data = res.data;
          if (Array.isArray(data)) { setMenu(data); return; }
          if (data.menu && Array.isArray(data.menu)) {
            setMenu(data.menu);
            if (data.qr?.nombre) setMesa(data.qr.nombre);
            return;
          }
          setErrorQr(typeof data === "string" ? data : "QR no válido o inactivo");
        } else {
          setMenu(res.data);
        }
      })
      .catch(err => {
        if (token) {
          const message = err.response?.data || err.message;
          if (err.response?.status === 403)      setErrorQr(`Acceso denegado: ${message}`);
          else if (err.response?.status === 404) setErrorQr(`QR no encontrado: ${message}`);
          else                                   setErrorQr(`Error al cargar QR: ${message}`);
        } else {
          console.error(err);
        }
      })
      .finally(() => setCargando(false));

    axios.get("https://kitchen-manager-back-1-production.up.railway.app/meseros/disponibles")
      .then(res => setMeseros(res.data))
      .catch(() => {});
    
  }, [token]);

  const categorias   = ["Todas", ...new Set(menu.map(p => p.categoria).filter(Boolean))];
  const menuFiltrado = catActiva === "Todas" ? menu : menu.filter(p => p.categoria === catActiva);

  const agregar = (prod) => {
    if (!prod.disponible) return;
    setCarrito(prev => ({ ...prev, [prod.id]: (prev[prod.id] || 0) + 1 }));
  };

  const cambiar = (id, delta) => {
    setCarrito(prev => {
      const nueva = (prev[id] || 0) + delta;
      if (nueva <= 0) { const c = { ...prev }; delete c[id]; return c; }
      return { ...prev, [id]: nueva };
    });
  };

  const limpiar = () => {
    setCarrito({}); setNombre(""); setMesa(""); setNotas("");
    setResultado(null); setPedidoEnviado(false); setMostrarConfirmacion(false);
  };

  const itemsCarrito = menu
    .filter(p => carrito[p.id])
    .map(p => ({ ...p, cantidad: carrito[p.id], subtotal: p.precio * carrito[p.id] }));

  const total       = itemsCarrito.reduce((acc, i) => acc + i.subtotal, 0);
  const puedeEnviar = itemsCarrito.length > 0 && nombre.trim() && mesa.trim() && meseroSeleccionado;

  /* Abre el modal de confirmación */
  const handleConfirmar = () => setMostrarConfirmacion(true);

  /* Envío real — se llama desde el modal */
  const handleEnviar = async () => {
    setMostrarConfirmacion(false);
    setEnviando(true); setResultado(null);
    try {
      const url = token
        ? `https://kitchen-manager-back-1-production.up.railway.app/menu/${token}/pedido`
        : "https://kitchen-manager-back-1-production.up.railway.app/clientes/registrarPedido";
      const payload = {
        fuente: "Presencial",
        nombreCliente: `${nombre.trim()}${mesa ? ` — Mesa ${mesa}` : ""}`,
        notas, total,
        meseroAsignado: meseroSeleccionado,
        itemsSeleccionados: itemsCarrito.map(i => ({
          id: i.id, nombre: i.nombre, categoria: i.categoria,
          precio: i.precio, cantidad: i.cantidad,
        })),
      };
      const res     = await axios.post(url, payload);
      const pedidoId = res.data?.id || res.data?.pedidoId || "";
      setResultado({ ok: true, msg: "¡Pedido enviado!", pedidoId });
      setPedidoEnviado(true);
    } catch (error) {
      setResultado({ ok: false, msg: "Error al enviar el pedido. Intenta de nuevo." });
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  const NavBar = () => (
    <nav className="cp-nav">
      <div className="cp-logo" onClick={() => navigate("/")}>
        <Logo />
        <div className="cp-logo-wordmark">
          <div className="cp-logo-kitchen">Kitchen</div>
          <div className="cp-logo-sep" />
          <div className="cp-logo-manager">Manager</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button className="cp-nav-back" onClick={() => navigate("/")}>← Inicio</button>
        <span className="cp-nav-pill">Portal Clientes</span>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="cp-footer">
      <span className="cp-footer-left">© 2026 Kitchen Manager · Todos los derechos reservados</span>
      <div className="cp-footer-wordmark">
        <div className="cp-footer-kitchen">Kitchen</div>
        <div className="cp-footer-sep" />
        <div className="cp-footer-manager">Manager</div>
      </div>
    </footer>
  );

  /* ── MODAL DE CONFIRMACIÓN ── */
  const ModalConfirmacion = () => (
    <div className="cp-modal-overlay" onClick={() => setMostrarConfirmacion(false)}>
      <div className="cp-modal" onClick={e => e.stopPropagation()}>
        <div className="cp-modal-topline" />

        <p className="cp-modal-eyebrow">Confirmar pedido</p>
        <h2 className="cp-modal-title">¿Enviamos tu pedido?</h2>
        <p className="cp-modal-sub">Revisa el resumen antes de confirmar. Una vez enviado pasará directo a cocina.</p>

        {/* Items */}
        <div className="cp-modal-items">
          <p className="cp-modal-items-label">Resumen</p>
          {itemsCarrito.map(item => (
            <div className="cp-modal-item-row" key={item.id}>
              <span className="cp-modal-item-name">{item.nombre} <span style={{ color: "var(--muted)" }}>× {item.cantidad}</span></span>
              <span className="cp-modal-item-price">{fmt(item.subtotal)}</span>
            </div>
          ))}
          <div className="cp-modal-total-row">
            <span className="cp-modal-total-label">Total</span>
            <span className="cp-modal-total-value">{fmt(total)}</span>
          </div>
        </div>

        {/* Cliente */}
        <div className="cp-modal-cliente">
          {nombre && <span><strong>{nombre}</strong></span>}
          {nombre && mesa && <span style={{ color: "rgba(201,168,76,0.3)", margin: "0 6px" }}>·</span>}
          {mesa   && <span>Mesa <strong>{mesa}</strong></span>}
          {notas  && <div className="cp-modal-notas">"{notas}"</div>}
        </div>

        {/* Botones */}
        <div className="cp-modal-btns">
          <button className="cp-btn-sec" onClick={() => setMostrarConfirmacion(false)}>
            Cancelar
          </button>
          <button className="cp-btn-primary" onClick={handleEnviar} disabled={enviando}>
            {enviando ? "Enviando..." : "Confirmar envío"}
          </button>
        </div>
      </div>
    </div>
  );

  /* ── ÉXITO ── */
  if (pedidoEnviado && resultado?.ok) {
    return (
      <>
        <style>{styles}</style>
        <div className="cp-root">
          <NavBar />
          <div className="cp-success">
            <div className="cp-success-icon"><CheckIcon /></div>
            <h2 className="cp-success-title">Pedido recibido</h2>
            <p className="cp-success-sub">
              Tu pedido fue enviado a cocina. En breve estará listo.<br />
              Gracias, <strong style={{ color: "var(--cream)" }}>{nombre}</strong>.
            </p>
            {resultado.pedidoId && (
              <span className="cp-success-num">
                #{resultado.pedidoId.slice(-6).toUpperCase()}
              </span>
            )}
            <button className="cp-btn-primary" style={{ maxWidth: "220px", marginTop: "8px" }} onClick={limpiar}>
              Hacer otro pedido
            </button>
            <button className="cp-btn-sec" style={{ maxWidth: "220px" }} onClick={() => navigate("/")}>
              ← Volver al inicio
            </button>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  /* ── ERROR QR ── */
  if (errorQr) {
    return (
      <>
        <style>{styles}</style>
        <div className="cp-root">
          <NavBar />
          <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px" }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "3rem", color: "rgba(201,168,76,0.2)", marginBottom: "16px" }}>✕</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", color: "var(--cream)", letterSpacing: "2px", fontWeight: "300" }}>Acceso denegado</div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "10px", letterSpacing: "0.3px" }}>{errorQr}</div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  /* ── VISTA PRINCIPAL ── */
  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">
        <NavBar />

        <section className="cp-hero">
          <p className="cp-hero-eyebrow">Bienvenido</p>
          <h1 className="cp-hero-title">Elige tu pedido.<br /><em>Lo preparamos al instante.</em></h1>
          <div className="cp-hero-divider" />
          <p className="cp-hero-sub">Selecciona productos, ingresa tu nombre y número de mesa.</p>
        </section>

        <div className="cp-layout">
          {/* ── IZQUIERDA ── */}
          <div>
            <div className="cp-divider">
              <div className="cp-divider-line" />
              <span className="cp-divider-label">Tus datos</span>
              <div className="cp-divider-line" />
            </div>

            <div className="cp-datos">
              <div className="cp-datos-grid">
                <div className="cp-field">
                  <label className="cp-label">Nombre</label>
                  <input className="cp-input" type="text" placeholder="ej: Carlos López" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div className="cp-field">
                  <label className="cp-label">Mesa</label>
                  <input className="cp-input" type="text" placeholder="ej: Mesa 5" value={mesa} onChange={e => setMesa(e.target.value)} />
                </div>
              </div>
              <div className="cp-field" style={{ gridColumn: "span 2" }}>
                <label className="cp-label">Tu mesero</label>
                <select
                  className="cp-input"
                  value={meseroSeleccionado}
                  onChange={e => setMeseroSeleccionado(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Seleccionar mesero...</option>
                  {meseros.map(m => (
                    <option key={m.id} value={m.nombre}>{m.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="cp-field">
                <label className="cp-label">Notas especiales</label>
                <textarea className="cp-textarea" placeholder="Sin cebolla, extra salsa, alergia a..." value={notas} onChange={e => setNotas(e.target.value)} />
              </div>
            </div>

            <div className="cp-divider">
              <div className="cp-divider-line" />
              <span className="cp-divider-label">Menú disponible</span>
              <div className="cp-divider-line" />
            </div>

            {cargando ? (
              <div className="cp-loading">Cargando menú...</div>
            ) : (
              <>
                <div className="cp-cats">
                  {categorias.map(cat => (
                    <button key={cat} className={`cp-cat-btn ${catActiva === cat ? "active" : ""}`} onClick={() => setCatActiva(cat)}>
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="cp-productos">
                  {menuFiltrado.map(prod => (
                    <div key={prod.id}
                      className={`cp-prod ${carrito[prod.id] ? "cp-prod-sel" : ""} ${!prod.disponible ? "cp-prod-agotado" : ""}`}
                      onClick={() => agregar(prod)}
                    >
                      {!prod.disponible && <span className="cp-prod-agotado-badge">Agotado</span>}
                      <div className="cp-prod-cat">{prod.categoria}</div>
                      <div className="cp-prod-nombre">{prod.nombre}</div>
                      <div className="cp-prod-precio">{fmt(prod.precio)}</div>
                      {carrito[prod.id] && (
                        <div className="cp-qty" onClick={e => e.stopPropagation()}>
                          <button className="cp-qty-btn" onClick={() => cambiar(prod.id, -1)}>−</button>
                          <span className="cp-qty-num">{carrito[prod.id]}</span>
                          <button className="cp-qty-btn" onClick={() => cambiar(prod.id, +1)}>+</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── RESUMEN ── */}
          <div className="cp-resumen">
            <div className="cp-resumen-top">
              <div className="cp-resumen-titulo">Tu pedido</div>
              <div className="cp-resumen-sub">
                {itemsCarrito.length === 0
                  ? "Aún no has agregado nada"
                  : `${itemsCarrito.length} producto${itemsCarrito.length > 1 ? "s" : ""} seleccionado${itemsCarrito.length > 1 ? "s" : ""}`}
              </div>
            </div>

            <div className="cp-resumen-items">
              {itemsCarrito.length === 0 ? (
                <div className="cp-resumen-empty">Toca un producto<br />para agregarlo aquí</div>
              ) : (
                itemsCarrito.map(item => (
                  <div className="cp-resumen-item" key={item.id}>
                    <div className="cp-resumen-item-info">
                      <div className="cp-resumen-item-name">{item.nombre}</div>
                      <div className="cp-resumen-item-qty">{item.cantidad} × {fmt(item.precio)}</div>
                    </div>
                    <div className="cp-resumen-item-price">{fmt(item.subtotal)}</div>
                    <button className="cp-resumen-del" onClick={() => cambiar(item.id, -item.cantidad)}>✕</button>
                  </div>
                ))
              )}
            </div>

            {(nombre || mesa) && (
              <div className="cp-cliente-mini">
                {nombre && <span>— <strong>{nombre}</strong></span>}
                {mesa   && <span>— <strong>{mesa}</strong></span>}
              </div>
            )}

            <div className="cp-resumen-total">
              <span className="cp-resumen-total-label">Total</span>
              <span className="cp-resumen-total-value">{fmt(total)}</span>
            </div>

            <div className="cp-resumen-actions">
              {/* onClick ahora abre el modal en vez de enviar directo */}
              <button
                className="cp-btn-primary"
                disabled={!puedeEnviar || enviando}
                onClick={handleConfirmar}
              >
                {enviando ? "Enviando..." : "Enviar pedido"}
              </button>

              {itemsCarrito.length > 0 && (
                <button className="cp-btn-sec" onClick={limpiar}>Limpiar</button>
              )}

              {resultado && !resultado.ok && (
                <div className="cp-alerta cp-alerta-err">{resultado.msg}</div>
              )}

              {!puedeEnviar && itemsCarrito.length > 0 && (
                <p className="cp-resumen-hint">
                  {!nombre.trim() && !mesa.trim() ? "Ingresa tu nombre y número de mesa"
                    : !nombre.trim() ? "Ingresa tu nombre para continuar"
                    : "Ingresa el número de mesa"}
                    !meseroSeleccionado ? "Selecciona un mesero" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        <Footer />

        {/* ── MODAL DE CONFIRMACIÓN (se renderiza encima de todo) ── */}
        {mostrarConfirmacion && <ModalConfirmacion />}
      </div>
    </>
  );
}
