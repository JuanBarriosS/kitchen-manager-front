import { useState, useEffect } from "react";
import axios from "axios";

const BASE = "https://kitchen-manager-back.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:    #0C0F1A;
    --card:  #10131C;
    --card2: #141720;
    --gold:  #C9A84C;
    --gold2: #E2C97E;
    --cream: #F0EBE0;
    --muted: rgba(240,235,224,0.35);
    --border:rgba(201,168,76,0.12);
    --green: rgba(100,190,110,0.9);
    --red:   rgba(220,70,70,0.9);
    --blue:  rgba(74,144,217,0.9);
  }
  body { background: var(--bg); }

  .mv-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--cream);
    max-width: 480px;
    margin: 0 auto;
    padding-bottom: 32px;
  }

  /* ── LOGIN ── */
  .mv-login {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 32px 24px;
  }
  .mv-login-card {
    width: 100%;
    background: var(--card);
    border: 0.5px solid var(--border);
    border-radius: 16px;
    padding: 36px 28px;
    position: relative;
  }
  .mv-login-card::before {
    content: ''; position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .mv-logo-area {
    display: flex; flex-direction: column; align-items: center;
    gap: 8px; margin-bottom: 28px;
  }
  .mv-logo-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; letter-spacing: 6px;
    color: var(--gold); text-transform: uppercase;
  }
  .mv-logo-sub {
    font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(201,168,76,0.4);
  }
  .mv-field { margin-bottom: 18px; }
  .mv-label {
    display: block; font-size: 9px; letter-spacing: 3px;
    text-transform: uppercase; color: rgba(201,168,76,0.45);
    margin-bottom: 8px;
  }
  .mv-input {
    width: 100%; background: rgba(255,255,255,0.02);
    border: 0.5px solid rgba(201,168,76,0.2);
    border-radius: 8px; padding: 14px 16px;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    color: var(--cream); outline: none;
    transition: border-color 0.2s;
  }
  .mv-input:focus { border-color: rgba(201,168,76,0.55); }
  .mv-input::placeholder { color: rgba(240,235,224,0.15); }
  .mv-btn {
    width: 100%; padding: 15px;
    background: transparent; border: 0.5px solid var(--gold);
    border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 500; letter-spacing: 4px;
    text-transform: uppercase; color: var(--gold);
    cursor: pointer; transition: background 0.2s;
    margin-top: 4px;
  }
  .mv-btn:hover { background: rgba(201,168,76,0.08); }
  .mv-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .mv-error {
    margin-top: 14px; padding: 10px 14px;
    background: rgba(220,70,70,0.06);
    border: 0.5px solid rgba(220,70,70,0.2);
    border-radius: 6px; font-size: 12px;
    color: var(--red); text-align: center;
  }

  /* ── HEADER ── */
  .mv-header {
    background: var(--card);
    border-bottom: 0.5px solid var(--border);
    padding: 16px 20px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .mv-header-left { display: flex; flex-direction: column; gap: 2px; }
  .mv-header-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 300; letter-spacing: 2px; color: var(--cream);
  }
  .mv-header-role {
    font-size: 8px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(201,168,76,0.45);
  }
  .mv-logout-btn {
    padding: 6px 14px; background: transparent;
    border: 0.5px solid rgba(220,70,70,0.25);
    border-radius: 20px; color: rgba(220,70,70,0.7);
    font-size: 11px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .mv-logout-btn:hover { background: rgba(220,70,70,0.08); }

  /* ── TABS ── */
  .mv-tabs {
    display: flex; padding: 16px 20px 0;
    gap: 4px; border-bottom: 0.5px solid var(--border);
  }
  .mv-tab {
    flex: 1; padding: 10px 8px; text-align: center;
    font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    background: transparent; border-left: none; border-right: none; border-top: none;
  }
  .mv-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

  /* ── CONTENT ── */
  .mv-content { padding: 20px; }

  .mv-stat-row {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-bottom: 20px;
  }
  .mv-stat {
    background: var(--card);
    border: 0.5px solid var(--border);
    border-radius: 10px; padding: 16px;
    position: relative; overflow: hidden;
  }
  .mv-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
  }
  .mv-stat-label {
    font-size: 8px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--muted); margin-bottom: 6px;
  }
  .mv-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 300; color: var(--cream); line-height: 1;
  }
  .mv-stat-sub { font-size: 10px; color: rgba(201,168,76,0.5); margin-top: 4px; }

  /* ── PEDIDO CARD ── */
  .mv-pedido {
    background: var(--card);
    border: 0.5px solid rgba(240,235,224,0.06);
    border-radius: 12px; padding: 18px;
    margin-bottom: 12px; position: relative; overflow: hidden;
  }
  .mv-pedido-activo {
    border-color: rgba(201,168,76,0.2);
  }
  .mv-pedido-activo::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
  }
  .mv-pedido-completado {
    border-color: rgba(100,190,110,0.12);
  }
  .mv-pedido-completado::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: rgba(100,190,110,0.4);
  }
  .mv-pedido-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 12px;
  }
  .mv-pedido-id {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; color: var(--gold); line-height: 1;
  }
  .mv-pedido-tiempo {
    font-size: 11px; font-weight: 500; padding: 3px 10px;
    border-radius: 20px;
  }
  .mv-pedido-cliente {
    font-size: 15px; font-weight: 400; color: var(--cream);
    margin-bottom: 4px;
  }
  .mv-pedido-mesa {
    font-size: 11px; color: var(--muted); margin-bottom: 12px;
  }
  .mv-estado-badge {
    display: inline-block; padding: 4px 12px; border-radius: 20px;
    font-size: 9px; font-weight: 500; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 12px;
  }
  .mv-items { border-top: 0.5px solid var(--border); padding-top: 12px; }
  .mv-item-row {
    display: flex; justify-content: space-between;
    font-size: 13px; padding: 4px 0;
    color: rgba(240,235,224,0.7);
  }
  .mv-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; color: var(--gold);
  }
  .mv-total-row {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-top: 10px; padding-top: 10px;
    border-top: 0.5px solid rgba(201,168,76,0.1);
  }
  .mv-total-label {
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted);
  }
  .mv-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: var(--gold2);
  }
  .mv-notas {
    margin-top: 10px; padding: 8px 12px;
    background: rgba(255,255,255,0.02);
    border: 0.5px solid rgba(255,255,255,0.05);
    border-radius: 6px; font-size: 11px;
    color: var(--muted); font-style: italic;
  }
  .mv-empty {
    text-align: center; padding: 48px 20px;
  }
  .mv-empty-icon {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px; color: rgba(201,168,76,0.1);
    margin-bottom: 12px;
  }
  .mv-empty-text {
    font-size: 13px; color: var(--muted); line-height: 1.7;
  }
  .mv-refresh {
    width: 100%; padding: 12px;
    background: rgba(201,168,76,0.06);
    border: 0.5px solid rgba(201,168,76,0.15);
    border-radius: 8px; color: var(--gold);
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; margin-bottom: 16px;
    transition: background 0.2s;
  }
  .mv-refresh:hover { background: rgba(201,168,76,0.1); }
  .mv-fecha-completado {
    font-size: 10px; color: rgba(100,190,110,0.6);
    margin-top: 6px;
  }
`;

const ESTADOS_COLOR = {
  recibido:    { color: "#4A90D9", label: "Recibido" },
  preparacion: { color: "#C9A84C", label: "En preparación" },
  listo:       { color: "#6fcf74", label: "Listo para entregar" },
  entregado:   { color: "rgba(240,235,224,0.35)", label: "Entregado" },
};

const fmt = n => `$${Number(n).toLocaleString("es-CO")}`;

const tiempoTranscurrido = (fecha) => {
  if (!fecha) return "";
  const mins = Math.floor((Date.now() - new Date(fecha)) / 60000);
  if (mins < 1) return "Ahora mismo";
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const colorTiempo = (fecha) => {
  const mins = Math.floor((Date.now() - new Date(fecha)) / 60000);
  if (mins < 15) return { background: "rgba(100,190,110,0.1)", color: "rgba(100,190,110,0.9)", border: "0.5px solid rgba(100,190,110,0.2)" };
  if (mins < 30) return { background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "0.5px solid rgba(201,168,76,0.25)" };
  return { background: "rgba(220,70,70,0.1)", color: "rgba(220,70,70,0.9)", border: "0.5px solid rgba(220,70,70,0.2)" };
};

export default function MeseroView() {
  const [logueado, setLogueado]     = useState(false);
  const [nombreInput, setNombreInput] = useState("");
  const [meseroNombre, setMeseroNombre] = useState("");
  const [cargando, setCargando]     = useState(false);
  const [error, setError]           = useState("");
  const [tab, setTab]               = useState("activos");
  const [pedidos, setPedidos]       = useState([]);
  const [ventas, setVentas]         = useState([]);
  const [, setTick]                 = useState(0);

  // Restaurar sesión
  useEffect(() => {
    const nombre = sessionStorage.getItem("mesero_nombre");
    if (nombre) { setMeseroNombre(nombre); setLogueado(true); }
  }, []);

  // Polling cada 10s
  useEffect(() => {
    if (!logueado) return;
    cargarDatos();
    const iv = setInterval(() => { cargarDatos(); setTick(t => t + 1); }, 10000);
    return () => clearInterval(iv);
  }, [logueado, meseroNombre]);

  const cargarDatos = async () => {
    try {
      const [resPedidos, resVentas] = await Promise.all([
        axios.get(`${BASE}/empleado/pedidos`),
        axios.get(`${BASE}/empleado/ventas`),
      ]);
      setPedidos(resPedidos.data);
      setVentas(resVentas.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!nombreInput.trim()) return;
    setCargando(true);
    setError("");
    try {
      const res = await axios.get(`${BASE}/meseros/disponibles`);
      const existe = res.data.find(
        m => m.nombre.toLowerCase() === nombreInput.trim().toLowerCase()
      );
      if (!existe) {
        setError("No se encontró un mesero con ese nombre.");
        return;
      }
      sessionStorage.setItem("mesero_nombre", existe.nombre);
      setMeseroNombre(existe.nombre);
      setLogueado(true);
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mesero_nombre");
    setLogueado(false);
    setMeseroNombre("");
    setNombreInput("");
    setPedidos([]);
    setVentas([]);
  };

  // Filtrar por mesero
  const misActivos = pedidos.filter(p =>
    p.meseroAsignado?.toLowerCase() === meseroNombre.toLowerCase() &&
    p.estado !== "entregado"
  );

  const misCompletados = ventas
    .filter(v => v.meseroAsignado?.toLowerCase() === meseroNombre.toLowerCase())
    .slice()
    .reverse()
    .slice(0, 20);

  const totalHoy = (() => {
    const hoy = new Date().toDateString();
    return misCompletados
      .filter(v => new Date(v.fecha).toDateString() === hoy)
      .reduce((a, v) => a + v.total, 0);
  })();

  // ── LOGIN ──
  if (!logueado) {
    return (
      <>
        <style>{styles}</style>
        <div className="mv-root">
          <div className="mv-login">
            <div className="mv-login-card">
              <div className="mv-logo-area">
                <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" stroke="#C9A84C" strokeWidth="1.2"/>
                  <g transform="rotate(-20,50,50)" stroke="#C9A84C" strokeLinecap="round" fill="none" strokeWidth="1.8">
                    <line x1="44" y1="14" x2="44" y2="35"/><line x1="50" y1="11" x2="50" y2="35"/>
                    <line x1="56" y1="14" x2="56" y2="35"/>
                    <path d="M44 35 Q47 41 50 42 Q53 41 56 35"/>
                    <line x1="50" y1="42" x2="50" y2="86"/>
                  </g>
                  <g transform="rotate(20,50,50)" stroke="#C9A84C" strokeLinecap="round" fill="none" strokeWidth="1.8">
                    <path d="M50 11 Q58 30 54 44"/>
                    <line x1="50" y1="11" x2="46" y2="44"/><line x1="46" y1="44" x2="54" y2="44"/>
                    <line x1="50" y1="46" x2="50" y2="86"/>
                  </g>
                </svg>
                <div className="mv-logo-title">Kitchen</div>
                <div className="mv-logo-sub">Portal Mesero</div>
              </div>
              <form onSubmit={handleLogin}>
                <div className="mv-field">
                  <label className="mv-label">Tu nombre</label>
                  <input className="mv-input" type="text" placeholder="ej: Juan Rodriguez"
                    value={nombreInput} onChange={e => setNombreInput(e.target.value)} required />
                </div>
                <button className="mv-btn" type="submit" disabled={cargando}>
                  {cargando ? "Verificando..." : "Ingresar"}
                </button>
                {error && <div className="mv-error">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── VISTA PRINCIPAL ──
  return (
    <>
      <style>{styles}</style>
      <div className="mv-root">

        <div className="mv-header">
          <div className="mv-header-left">
            <div className="mv-header-name">{meseroNombre}</div>
            <div className="mv-header-role">Mesero · Kitchen Manager</div>
          </div>
          <button className="mv-logout-btn" onClick={handleLogout}>Salir</button>
        </div>

        <div className="mv-tabs">
          <button className={`mv-tab ${tab === "activos" ? "active" : ""}`} onClick={() => setTab("activos")}>
            Mis pedidos {misActivos.length > 0 && `(${misActivos.length})`}
          </button>
          <button className={`mv-tab ${tab === "completados" ? "active" : ""}`} onClick={() => setTab("completados")}>
            Completados
          </button>
        </div>

        <div className="mv-content">

          {tab === "activos" && (
            <>
              <div className="mv-stat-row">
                <div className="mv-stat">
                  <div className="mv-stat-label">Activos ahora</div>
                  <div className="mv-stat-value">{misActivos.length}</div>
                  <div className="mv-stat-sub">pedidos asignados</div>
                </div>
                <div className="mv-stat">
                  <div className="mv-stat-label">Ventas hoy</div>
                  <div className="mv-stat-value" style={{ fontSize: "18px", paddingTop: "5px" }}>
                    {fmt(totalHoy)}
                  </div>
                  <div className="mv-stat-sub">facturado</div>
                </div>
              </div>

              <button className="mv-refresh" onClick={cargarDatos}>
                ↻ Actualizar pedidos
              </button>

              {misActivos.length === 0 ? (
                <div className="mv-empty">
                  <div className="mv-empty-icon">☕</div>
                  <div className="mv-empty-text">
                    No tienes pedidos activos en este momento.<br />
                    Los nuevos pedidos aparecerán aquí.
                  </div>
                </div>
              ) : (
                misActivos
                  .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                  .map(p => {
                    const est = ESTADOS_COLOR[p.estado || "recibido"];
                    const tStyle = colorTiempo(p.fecha);
                    return (
                      <div key={p.id} className="mv-pedido mv-pedido-activo">
                        <div className="mv-pedido-top">
                          <div className="mv-pedido-id">#{p.id?.slice(-5).toUpperCase()}</div>
                          <div className="mv-pedido-tiempo" style={tStyle}>
                            ⏱ {tiempoTranscurrido(p.fecha)}
                          </div>
                        </div>
                        <div className="mv-pedido-cliente">{p.nombreCliente?.split("—")[0].trim()}</div>
                        {p.nombreCliente?.includes("—") && (
                          <div className="mv-pedido-mesa">
                            📍 {p.nombreCliente.split("—")[1]?.trim()}
                          </div>
                        )}
                        <div className="mv-estado-badge" style={{
                          background: est.color + "18",
                          color: est.color,
                          border: `0.5px solid ${est.color}40`
                        }}>
                          {est.label}
                        </div>
                        <div className="mv-items">
                          {(p.itemsSeleccionados || []).map((item, i) => (
                            <div key={i} className="mv-item-row">
                              <span>{item.cantidad}× {item.nombre}</span>
                              <span className="mv-item-price">{fmt(item.precio * item.cantidad)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mv-total-row">
                          <span className="mv-total-label">Total</span>
                          <span className="mv-total-value">{fmt(p.total)}</span>
                        </div>
                        {p.notas && (
                          <div className="mv-notas">📝 {p.notas}</div>
                        )}
                      </div>
                    );
                  })
              )}
            </>
          )}

          {tab === "completados" && (
            <>
              <div className="mv-stat-row">
                <div className="mv-stat">
                  <div className="mv-stat-label">Completados hoy</div>
                  <div className="mv-stat-value">
                    {misCompletados.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString()).length}
                  </div>
                  <div className="mv-stat-sub">pedidos</div>
                </div>
                <div className="mv-stat">
                  <div className="mv-stat-label">Total hoy</div>
                  <div className="mv-stat-value" style={{ fontSize: "18px", paddingTop: "5px" }}>
                    {fmt(totalHoy)}
                  </div>
                  <div className="mv-stat-sub">facturado</div>
                </div>
              </div>

              {misCompletados.length === 0 ? (
                <div className="mv-empty">
                  <div className="mv-empty-icon">✓</div>
                  <div className="mv-empty-text">
                    Tus pedidos completados aparecerán aquí<br />
                    una vez que sean facturados.
                  </div>
                </div>
              ) : (
                misCompletados.map(v => (
                  <div key={v.id} className="mv-pedido mv-pedido-completado">
                    <div className="mv-pedido-top">
                      <div className="mv-pedido-id">#{v.id?.slice(-5).toUpperCase()}</div>
                      <div style={{
                        fontSize: "10px", padding: "3px 10px", borderRadius: "20px",
                        background: "rgba(100,190,110,0.1)", color: "rgba(100,190,110,0.8)",
                        border: "0.5px solid rgba(100,190,110,0.2)"
                      }}>✓ Entregado</div>
                    </div>
                    <div className="mv-pedido-cliente">{v.nombreCliente?.split("—")[0].trim()}</div>
                    {v.nombreCliente?.includes("—") && (
                      <div className="mv-pedido-mesa">📍 {v.nombreCliente.split("—")[1]?.trim()}</div>
                    )}
                    <div className="mv-items">
                      {(v.itemsVendidos || []).map((item, i) => (
                        <div key={i} className="mv-item-row">
                          <span>{item.cantidad}× {item.nombre}</span>
                          <span className="mv-item-price">{fmt(item.precio * item.cantidad)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mv-total-row">
                      <span className="mv-total-label">Total</span>
                      <span className="mv-total-value">{fmt(v.total)}</span>
                    </div>
                    <div className="mv-fecha-completado">
                      {new Date(v.fecha).toLocaleString("es-CO", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
