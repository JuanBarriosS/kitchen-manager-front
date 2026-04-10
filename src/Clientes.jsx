import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:     #0C0E14;
    --card:   #10131C;
    --card2:  #141720;
    --gold:   #C8892A;
    --gold2:  #E8A830;
    --white:  #F2EDE4;
    --text:   #E8E6DF;
    --gray:   rgba(232,230,223,0.45);
    --border: rgba(255,255,255,0.07);
    --green:  #6fcf74;
    --red:    #E63946;
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
    padding: 1.25rem 3rem;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
    background: rgba(12,14,20,0.95);
    backdrop-filter: blur(8px);
  }
  .cp-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .cp-logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
  }
  .cp-logo-icon svg { width: 19px; height: 19px; fill: #0C0E14; }
  .cp-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 600; letter-spacing: 0.03em; color: var(--white);
  }
  .cp-logo-text span { color: var(--gold); }
  .cp-nav-pill {
    background: rgba(200,137,42,0.1); border: 1px solid rgba(200,137,42,0.3);
    color: var(--gold); font-size: 0.7rem; font-weight: 500;
    padding: 4px 12px; border-radius: 20px; letter-spacing: 0.08em; text-transform: uppercase;
  }

  /* ── HERO MINI ── */
  .cp-hero {
    padding: 3rem 3rem 2rem; text-align: center;
    position: relative; overflow: hidden;
  }
  .cp-hero-glow {
    position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(200,137,42,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .cp-eyebrow {
    font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; margin-bottom: 0.75rem;
  }
  .cp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 600; line-height: 1.1;
    color: var(--white); margin-bottom: 0.75rem;
  }
  .cp-hero-title em { color: var(--gold); font-style: italic; }
  .cp-hero-sub {
    font-size: 0.9rem; color: var(--gray); font-weight: 300; max-width: 420px; margin: 0 auto;
  }

  /* ── LAYOUT ── */
  .cp-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 3rem 4rem;
    align-items: start;
  }

  /* ── SECTION HEADER ── */
  .cp-section-header {
    display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
  }
  .cp-section-line { flex: 1; height: 1px; background: var(--border); }
  .cp-section-label {
    font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gray); white-space: nowrap;
  }

  /* ── CATEGORÍAS ── */
  .cp-cats {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem;
  }
  .cp-cat-btn {
    padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 500;
    cursor: pointer; border: 1px solid var(--border); background: transparent;
    color: var(--gray); transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .cp-cat-btn:hover { border-color: rgba(200,137,42,0.3); color: var(--white); }
  .cp-cat-btn.active {
    background: rgba(200,137,42,0.12); border-color: rgba(200,137,42,0.35); color: var(--gold);
  }

  /* ── PRODUCTOS GRID ── */
  .cp-productos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin-bottom: 2rem;
  }
  .cp-prod {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.1rem;
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .cp-prod:hover:not(.cp-prod-agotado) {
    border-color: rgba(200,137,42,0.35); background: rgba(200,137,42,0.04);
  }
  .cp-prod.cp-prod-sel {
    border-color: var(--gold); background: rgba(200,137,42,0.08);
  }
  .cp-prod.cp-prod-agotado { opacity: 0.38; cursor: not-allowed; }
  .cp-prod-cat {
    font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gray); margin-bottom: 4px;
  }
  .cp-prod-nombre {
    font-size: 0.88rem; font-weight: 600; color: var(--white);
    margin-bottom: 6px; line-height: 1.3;
  }
  .cp-prod-precio {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 700; color: var(--gold);
  }
  .cp-prod-agotado-badge {
    position: absolute; top: 10px; right: 10px;
    font-size: 0.6rem; padding: 2px 7px; border-radius: 10px;
    background: rgba(230,57,70,0.12); color: var(--red);
    border: 1px solid rgba(230,57,70,0.25); font-weight: 600;
    letter-spacing: 0.5px; text-transform: uppercase;
  }

  /* ── QTY CONTROL ── */
  .cp-qty {
    display: flex; align-items: center; gap: 8px; margin-top: 10px;
  }
  .cp-qty-btn {
    width: 24px; height: 24px; border-radius: 50%;
    border: 1px solid rgba(200,137,42,0.4); background: transparent;
    color: var(--gold); font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; line-height: 1;
    font-family: 'DM Sans', sans-serif;
  }
  .cp-qty-btn:hover { background: rgba(200,137,42,0.15); }
  .cp-qty-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 700; color: var(--white);
    min-width: 18px; text-align: center;
  }

  /* ── DATOS CLIENTE ── */
  .cp-datos { margin-bottom: 2rem; }
  .cp-field { margin-bottom: 14px; }
  .cp-label {
    display: block; font-size: 0.65rem; font-weight: 600; color: var(--gray);
    letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;
  }
  .cp-input {
    width: 100%; background: var(--bg);
    border: 1px solid rgba(200,137,42,0.2); border-radius: 6px;
    padding: 10px 12px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--white); outline: none;
    transition: border-color 0.2s;
  }
  .cp-input:focus { border-color: rgba(200,137,42,0.55); box-shadow: 0 0 0 3px rgba(200,137,42,0.08); }
  .cp-input::placeholder { color: rgba(255,255,255,0.18); }
  .cp-textarea {
    width: 100%; background: var(--bg);
    border: 1px solid rgba(200,137,42,0.2); border-radius: 6px;
    padding: 10px 12px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--white); outline: none;
    resize: vertical; min-height: 70px; transition: border-color 0.2s;
  }
  .cp-textarea:focus { border-color: rgba(200,137,42,0.55); }
  .cp-textarea::placeholder { color: rgba(255,255,255,0.18); }

  /* ── RESUMEN CARD ── */
  .cp-resumen {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
    position: sticky; top: 80px;
  }
  .cp-resumen-top {
    position: relative; padding: 1.25rem 1.25rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .cp-resumen-top::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
  }
  .cp-resumen-titulo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; color: var(--white);
  }
  .cp-resumen-sub { font-size: 0.72rem; color: var(--gray); margin-top: 2px; }
  .cp-resumen-items { padding: 12px 16px; min-height: 80px; }
  .cp-resumen-empty { color: var(--gray); font-size: 12px; text-align: center; padding: 20px 0; opacity: 0.6; line-height: 1.6; }
  .cp-resumen-item {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .cp-resumen-item:last-child { border-bottom: none; }
  .cp-resumen-item-info { flex: 1; }
  .cp-resumen-item-name { font-size: 12px; color: var(--white); }
  .cp-resumen-item-qty { font-size: 10px; color: var(--gray); margin-top: 1px; }
  .cp-resumen-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; font-weight: 700; color: var(--gold); margin: 0 6px;
  }
  .cp-resumen-del {
    background: none; border: none; color: var(--red);
    cursor: pointer; font-size: 12px; opacity: 0.45;
    transition: opacity 0.15s;
  }
  .cp-resumen-del:hover { opacity: 1; }
  .cp-resumen-total {
    padding: 14px 16px;
    border-top: 1px solid rgba(200,137,42,0.18);
    display: flex; align-items: baseline; justify-content: space-between;
  }
  .cp-resumen-total-label { font-size: 0.7rem; font-weight: 600; color: var(--gray); letter-spacing: 0.1em; text-transform: uppercase; }
  .cp-resumen-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 700; color: var(--gold2);
  }
  .cp-resumen-actions { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 8px; }

  /* ── BUTTONS ── */
  .cp-btn-primary {
    width: 100%; padding: 13px 16px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    color: #0C0E14; cursor: pointer;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
  }
  .cp-btn-primary:hover:not(:disabled) {
    opacity: 0.88; transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(200,137,42,0.3);
  }
  .cp-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
  .cp-btn-sec {
    width: 100%; padding: 10px;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; color: var(--gray);
    font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .cp-btn-sec:hover { border-color: rgba(255,255,255,0.2); color: var(--white); }

  /* ── ALERTA ── */
  .cp-alerta { font-size: 12px; padding: 10px 12px; border-radius: 6px; text-align: center; }
  .cp-alerta-ok  { background: rgba(76,175,80,0.1);  color: var(--green); border: 1px solid rgba(76,175,80,0.25); }
  .cp-alerta-err { background: rgba(230,57,70,0.1);  color: var(--red);   border: 1px solid rgba(230,57,70,0.25); }

  /* ── SUCCESS SCREEN ── */
  .cp-success {
    min-height: 60vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    padding: 4rem 2rem; gap: 1rem;
  }
  .cp-success-icon {
    width: 64px; height: 64px;
    background: rgba(111,207,116,0.12); border: 1px solid rgba(111,207,116,0.3);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 28px; margin-bottom: 0.5rem;
  }
  .cp-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: var(--white);
  }
  .cp-success-sub { font-size: 0.9rem; color: var(--gray); font-weight: 300; max-width: 360px; line-height: 1.7; }
  .cp-success-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; color: var(--gold); font-weight: 600;
    background: rgba(200,137,42,0.08); border: 1px solid rgba(200,137,42,0.2);
    padding: 6px 20px; border-radius: 20px;
  }

  /* ── LOADING ── */
  .cp-loading { padding: 60px 20px; text-align: center; color: var(--gray); font-size: 13px; }

  /* ── FOOTER ── */
  .cp-footer {
    padding: 1.25rem 3rem; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.72rem; color: rgba(232,230,223,0.25);
  }
  .cp-footer-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem; font-weight: 600; color: rgba(232,230,223,0.3);
  }
  .cp-footer-logo span { color: var(--gold); }

  @media (max-width: 768px) {
    .cp-nav, .cp-hero, .cp-footer { padding-left: 1.25rem; padding-right: 1.25rem; }
    .cp-layout { grid-template-columns: 1fr; padding: 1.5rem 1.25rem 3rem; }
    .cp-resumen { position: static; }
  }
`;

const fmt = (n) => `$${Number(n).toLocaleString("es-CO")}`;

export default function PortalClientes() {
  const navigate = useNavigate();
  const { token } = useParams();

  // Menú
  const [menu, setMenu]           = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [catActiva, setCatActiva] = useState("Todas");
  const [errorQr, setErrorQr]     = useState(null);

  // Carrito
  const [carrito, setCarrito] = useState({});

  // Datos del cliente
  const [nombre, setNombre]     = useState("");
  const [mesa, setMesa]         = useState("");
  const [notas, setNotas]       = useState("");

  // Estado pedido
  const [enviando, setEnviando]   = useState(false);
  const [resultado, setResultado] = useState(null); // { ok, msg, pedidoId }
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  useEffect(() => {
    const url = token
      ? `https://kitchen-manager-back.onrender.com/menu/${token}`
      : "https://kitchen-manager-back.onrender.com/clientes/verMenu";

    axios.get(url)
      .then(res => {
        if (token) {
          const data = res.data;
          if (Array.isArray(data)) {
            setMenu(data);
            return;
          }
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
          if (err.response?.status === 403) {
            setErrorQr(`Acceso denegado: ${message}`);
          } else if (err.response?.status === 404) {
            setErrorQr(`QR no encontrado: ${message}`);
          } else {
            setErrorQr(`Error al cargar QR: ${message}`);
          }
        } else {
          console.error(err);
        }
      })
      .finally(() => setCargando(false));
  }, [token]);

  // Categorías únicas
  const categorias = ["Todas", ...new Set(menu.map(p => p.categoria).filter(Boolean))];

  const menuFiltrado = catActiva === "Todas"
    ? menu
    : menu.filter(p => p.categoria === catActiva);

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
    setCarrito({});
    setNombre(""); setMesa(""); setNotas("");
    setResultado(null); setPedidoEnviado(false);
  };

  const itemsCarrito = menu
    .filter(p => carrito[p.id])
    .map(p => ({ ...p, cantidad: carrito[p.id], subtotal: p.precio * carrito[p.id] }));

  const total = itemsCarrito.reduce((acc, i) => acc + i.subtotal, 0);
  const puedeEnviar = itemsCarrito.length > 0 && nombre.trim() && mesa.trim();

  const handleEnviar = async () => {
    setEnviando(true);
    setResultado(null);
    try {
      const url = token 
        ? `https://kitchen-manager-back.onrender.com/menu/${token}/pedido`
        : "https://kitchen-manager-back.onrender.com/clientes/registrarPedido";
      const payload = token ? {
        nombreCliente: `${nombre.trim()}${mesa ? ` — Mesa ${mesa}` : ""}`,
        notas,
        total,
        itemsSeleccionados: itemsCarrito.map(i => ({
          id:        i.id,
          nombre:    i.nombre,
          categoria: i.categoria,
          precio:    i.precio,
          cantidad:  i.cantidad,
        })),
      } : {
        fuente: "Presencial",
        nombreCliente: `${nombre.trim()}${mesa ? ` — Mesa ${mesa}` : ""}`,
        notas,
        total,
        itemsSeleccionados: itemsCarrito.map(i => ({
          id:        i.id,
          nombre:    i.nombre,
          categoria: i.categoria,
          precio:    i.precio,
          cantidad:  i.cantidad,
        })),
      };
      if (!token) payload.fuente = "Presencial";
      const res = await axios.post(url, payload);
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

  // ── PANTALLA ÉXITO ──
  if (pedidoEnviado && resultado?.ok) {
    return (
      <>
        <style>{styles}</style>
        <div className="cp-root">
          <nav className="cp-nav">
            <div className="cp-logo" onClick={() => navigate("/")}>
              <div className="...logo-icon" style={{ fontSize: "20px" }}>
                🫕
            </div>
              <span className="cp-logo-text">Kitchen<span>Manager</span></span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <button
                onClick={() => navigate("/")}
                style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 14px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", color:"rgba(232,230,223,0.5)", fontSize:"0.75rem", fontWeight:"500", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(200,137,42,0.35)"; e.currentTarget.style.color="#F2EDE4"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(232,230,223,0.5)"; }}
              >← Volver al inicio</button>
              <span className="cp-nav-pill">Portal Clientes</span>
            </div>
          </nav>

          <div className="cp-success">
            <div className="cp-success-icon">✓</div>
            <h2 className="cp-success-title">¡Pedido recibido!</h2>
            <p className="cp-success-sub">
              Tu pedido fue enviado a cocina. En breve estará listo.<br />
              Gracias, <strong style={{ color: "var(--white)" }}>{nombre}</strong>.
            </p>
            {resultado.pedidoId && (
              <span className="cp-success-num">
                #{resultado.pedidoId.slice(-6).toUpperCase()}
              </span>
            )}
            <button
              className="cp-btn-primary"
              style={{ maxWidth: "240px", marginTop: "1rem" }}
              onClick={limpiar}
            >
              Hacer otro pedido
            </button>
            <button
              className="cp-btn-sec"
              style={{ maxWidth: "240px" }}
              onClick={() => navigate("/")}
            >
              ← Volver al inicio
            </button>
          </div>

          <footer className="cp-footer">
            <span>© 2026 Kitchen Manager · Todos los derechos reservados</span>
            <span className="cp-footer-logo">Kitchen<span>Manager</span></span>
          </footer>
        </div>
      </>
    );
  }

  // ── ERROR QR ──
  if (errorQr) {
    return (
      <>
        <style>{styles}</style>
        <div className="cp-root">
          <nav className="cp-nav">
            <div className="cp-logo" onClick={() => navigate("/")}>
              <div className="cp-logo-icon">
                <svg viewBox="0 0 24 24"><path d="M8.5 2a6.5 6.5 0 0 1 0 13h-1v7H5V15H3.5a6.5 6.5 0 0 1 0-13h5zm7 2a4 4 0 0 1 4 4v1h1v2h-1v8h-2V11h-1V9h1V8a2 2 0 0 0-2-2V4z"/></svg>
              </div>
              <span className="cp-logo-text">Kitchen<span>Manager</span></span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <button
                onClick={() => navigate("/")}
                style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 14px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", color:"rgba(232,230,223,0.5)", fontSize:"0.75rem", fontWeight:"500", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(200,137,42,0.35)"; e.currentTarget.style.color="#F2EDE4"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(232,230,223,0.5)"; }}
              >← Volver al inicio</button>
              <span className="cp-nav-pill">Portal Clientes</span>
            </div>
          </nav>

          <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"24px" }}>
            <div>
              <div style={{ fontSize:"48px", marginBottom:"16px" }}>🚫</div>
              <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.5rem", color:"#F2EDE4" }}>Acceso denegado</div>
              <div style={{ fontSize:"13px", color:"rgba(232,230,223,0.4)", marginTop:"8px" }}>
                {errorQr}
              </div>
            </div>
          </div>

          <footer className="cp-footer">
            <span>© 2026 Kitchen Manager · Todos los derechos reservados</span>
            <span className="cp-footer-logo">Kitchen<span>Manager</span></span>
          </footer>
        </div>
      </>
    );
  }

  // ── VISTA PRINCIPAL ──
  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">

        {/* NAV */}
        <nav className="cp-nav">
          <div className="cp-logo" onClick={() => navigate("/")}>
            <div className="cp-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M8.5 2a6.5 6.5 0 0 1 0 13h-1v7H5V15H3.5a6.5 6.5 0 0 1 0-13h5zm7 2a4 4 0 0 1 4 4v1h1v2h-1v8h-2V11h-1V9h1V8a2 2 0 0 0-2-2V4z"/></svg>
            </div>
            <span className="cp-logo-text">Kitchen<span>Manager</span></span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <button
              onClick={() => navigate("/")}
              style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 14px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", color:"rgba(232,230,223,0.5)", fontSize:"0.75rem", fontWeight:"500", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(200,137,42,0.35)"; e.currentTarget.style.color="#F2EDE4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(232,230,223,0.5)"; }}
            >← Volver al inicio</button>
            <span className="cp-nav-pill">Portal Clientes</span>
          </div>
        </nav>

        {/* HERO */}
        <section className="cp-hero">
          <div className="cp-hero-glow" />
          <p className="cp-eyebrow">Bienvenido</p>
          <h1 className="cp-hero-title">Elige tu pedido.<br /><em>Lo preparamos al instante.</em></h1>
          <p className="cp-hero-sub">Selecciona los productos del menú, ingresa tu nombre y número de mesa y envíanos tu pedido.</p>
        </section>

        {/* LAYOUT */}
        <div className="cp-layout">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div>

            {/* Datos del cliente */}
            <div className="cp-section-header">
              <div className="cp-section-line" />
              <span className="cp-section-label">Tus datos</span>
              <div className="cp-section-line" />
            </div>
            <div className="cp-datos">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="cp-field">
                  <label className="cp-label">Tu nombre</label>
                  <input className="cp-input" type="text" placeholder="ej: Carlos López" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div className="cp-field">
                  <label className="cp-label">Mesa / número</label>
                  <input className="cp-input" type="text" placeholder="ej: Mesa 5" value={mesa} onChange={e => setMesa(e.target.value)} />
                </div>
              </div>
              <div className="cp-field">
                <label className="cp-label">Notas especiales</label>
                <textarea className="cp-textarea" placeholder="Sin cebolla, extra salsa, alergia a..." value={notas} onChange={e => setNotas(e.target.value)} />
              </div>
            </div>

            {/* Menú */}
            <div className="cp-section-header">
              <div className="cp-section-line" />
              <span className="cp-section-label">Menú disponible</span>
              <div className="cp-section-line" />
            </div>

            {cargando ? (
              <div className="cp-loading">Cargando menú...</div>
            ) : (
              <>
                {/* Filtro categorías */}
                <div className="cp-cats">
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      className={`cp-cat-btn ${catActiva === cat ? "active" : ""}`}
                      onClick={() => setCatActiva(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid productos */}
                <div className="cp-productos">
                  {menuFiltrado.map(prod => (
                    <div
                      key={prod.id}
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
                {itemsCarrito.length === 0 ? "Aún no has agregado nada" : `${itemsCarrito.length} producto${itemsCarrito.length > 1 ? "s" : ""} seleccionado${itemsCarrito.length > 1 ? "s" : ""}`}
              </div>
            </div>

            <div className="cp-resumen-items">
              {itemsCarrito.length === 0 ? (
                <div className="cp-resumen-empty">
                  Toca un producto<br />para agregarlo aquí
                </div>
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

            {/* Info cliente en resumen */}
            {(nombre || mesa) && (
              <div style={{ padding:"10px 16px", borderTop:"1px solid var(--border)", fontSize:"11px", color:"var(--gray)", display:"flex", flexDirection:"column", gap:"3px" }}>
                {nombre && <span>👤 <strong style={{ color:"var(--white)" }}>{nombre}</strong></span>}
                {mesa   && <span>📍 <strong style={{ color:"var(--white)" }}>{mesa}</strong></span>}
              </div>
            )}

            <div className="cp-resumen-total">
              <span className="cp-resumen-total-label">Total</span>
              <span className="cp-resumen-total-value">{fmt(total)}</span>
            </div>

            <div className="cp-resumen-actions">
              <button
                className="cp-btn-primary"
                disabled={!puedeEnviar || enviando}
                onClick={handleEnviar}
              >
                {enviando ? "Enviando pedido..." : "Enviar pedido →"}
              </button>

              {itemsCarrito.length > 0 && (
                <button className="cp-btn-sec" onClick={limpiar}>Limpiar</button>
              )}

              {resultado && !resultado.ok && (
                <div className="cp-alerta cp-alerta-err">{resultado.msg}</div>
              )}

              {!puedeEnviar && itemsCarrito.length > 0 && (
                <p style={{ fontSize:"11px", color:"var(--gray)", textAlign:"center", lineHeight:"1.5" }}>
                  {!nombre.trim() && !mesa.trim() ? "Ingresa tu nombre y número de mesa" :
                   !nombre.trim() ? "Ingresa tu nombre para continuar" :
                   "Ingresa el número de mesa"}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="cp-footer">
          <span>© 2026 Kitchen Manager · Todos los derechos reservados</span>
          <span className="cp-footer-logo">Kitchen<span>Manager</span></span>
        </footer>

      </div>
    </>
  );
}