import { useState, useEffect } from "react";
import axios from "axios";
import CocinaTV from "./CocinaTV";

const BASE = "https://kitchen-manager-back.onrender.com";

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
    --blue:   #4A90D9;
    --green:  #6fcf74;
    --red:    #E63946;
    --slate:  rgba(232,230,223,0.35);
    --sidebar: 230px;
  }
  .emp-root { display:flex; min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--text); }

  /* SIDEBAR */
  .sidebar { width:var(--sidebar); background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:100; }
  .sidebar-logo { padding:26px 20px 22px; border-bottom:1px solid var(--border); }
  .sidebar-logo-icon { width:36px; height:36px; background:linear-gradient(135deg,var(--gold),var(--gold2)); border-radius:8px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
  .sidebar-logo-icon svg { width:20px; height:20px; fill:#0C0E14; }
  .sidebar-logo-name { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600; letter-spacing:0.03em; color:var(--white); line-height:1; }
  .sidebar-logo-sub { font-size:9px; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-top:3px; }
  .sidebar-nav { flex:1; padding:14px 12px; display:flex; flex-direction:column; gap:4px; }
  .nav-section-label { font-size:9px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; padding:10px 8px 5px; }
  .nav-item { display:flex; align-items:center; gap:11px; padding:11px 12px; border-radius:6px; cursor:pointer; transition:background .15s,color .15s; font-size:13px; font-weight:500; color:var(--gray); border:1px solid transparent; user-select:none; }
  .nav-item:hover { background:rgba(200,137,42,0.08); color:var(--white); }
  .nav-item.active { background:rgba(200,137,42,0.1); border-color:rgba(200,137,42,0.2); color:var(--gold); }
  .nav-icon { font-size:15px; width:20px; text-align:center; }
  .sidebar-footer { padding:14px 12px; border-top:1px solid var(--border); }
  .btn-logout { width:100%; display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(230,57,70,0.08); border:1px solid rgba(230,57,70,0.2); border-radius:6px; color:var(--red); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:background .15s; }
  .btn-logout:hover { background:rgba(230,57,70,0.15); }

  /* MAIN */
  .main { margin-left:var(--sidebar); flex:1; display:flex; flex-direction:column; min-height:100vh; }
  .topbar { background:var(--card); border-bottom:1px solid var(--border); padding:0 28px; height:62px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50; }
  .topbar-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; letter-spacing:0.02em; color:var(--white); }
  .topbar-user { display:flex; align-items:center; gap:10px; }
  .topbar-avatar { width:32px; height:32px; background:linear-gradient(135deg,var(--blue),#2563eb); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:white; }
  .topbar-username { font-size:13px; font-weight:500; color:var(--white); }
  .topbar-role { font-size:10px; color:var(--blue); letter-spacing:1px; text-transform:uppercase; }

  .content { flex:1; padding:28px; animation:fadeIn .25s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .page-header { margin-bottom:24px; }
  .page-title { font-family:'Cormorant Garamond',serif; font-size:1.9rem; font-weight:600; letter-spacing:0.02em; color:var(--white); }
  .page-subtitle { font-size:12px; color:var(--gray); margin-top:3px; }

  /* STATS */
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:14px; margin-bottom:24px; }
  .stat-card { background:var(--card); border-radius:8px; border:1px solid var(--border); padding:18px; position:relative; overflow:hidden; }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,var(--gold),var(--gold2)); }
  .stat-label { font-size:9px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
  .stat-value { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; line-height:1; color:var(--white); }
  .stat-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); font-size:32px; opacity:.08; }

  /* CARDS */
  .section-card { background:var(--card); border:1px solid var(--border); border-radius:8px; overflow:hidden; margin-bottom:18px; }
  .section-card-header { padding:14px 18px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .section-card-title { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600; letter-spacing:0.02em; color:var(--white); }

  /* BUTTONS */
  .btn-primary { padding:8px 16px; background:linear-gradient(135deg,var(--gold),var(--gold2)); border:none; border-radius:5px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:var(--bg); cursor:pointer; transition:opacity .15s,transform .15s; }
  .btn-primary:hover { opacity:.88; transform:translateY(-1px); }
  .btn-primary:disabled { opacity:.35; cursor:not-allowed; transform:none; }
  .btn-secondary { padding:9px 18px; background:transparent; border:1px solid rgba(255,255,255,0.12); border-radius:5px; color:var(--gray); font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:border-color .15s,color .15s; }
  .btn-secondary:hover { border-color:rgba(255,255,255,0.25); color:var(--white); }

  /* PLACEHOLDER */
  .placeholder-content { padding:44px 20px; text-align:center; }
  .placeholder-icon { font-size:38px; margin-bottom:10px; opacity:.3; }
  .placeholder-text { color:var(--gray); font-size:13px; line-height:1.6; }

  /* KANBAN */
  .kanban { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; margin-bottom:24px; }
  .kanban-col { background:var(--card); border-radius:8px; overflow:hidden; border:1px solid var(--border); }
  .kanban-col-header { padding:12px 14px; display:flex; align-items:center; gap:8px; border-bottom:1px solid var(--border); }
  .kanban-col-dot { width:8px; height:8px; border-radius:50%; }
  .kanban-col-title { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; }
  .kanban-col-count { margin-left:auto; background:rgba(255,255,255,0.07); color:var(--gray); font-size:10px; font-weight:700; padding:2px 7px; border-radius:10px; }
  .kanban-col-body { padding:10px; min-height:120px; }
  .kanban-empty { text-align:center; color:var(--gray); font-size:11px; padding:20px 0; opacity:.5; }
  .pedido-card { background:var(--card2); border-radius:6px; padding:12px; margin-bottom:8px; border:1px solid var(--border); cursor:pointer; transition:border-color .15s; }
  .pedido-card:hover { border-color:rgba(200,137,42,0.25); }
  .pedido-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
  .pedido-id { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:600; color:var(--gold); }
  .pedido-timer { font-size:10px; color:var(--gray); font-weight:600; }
  .pedido-fuente { font-size:10px; color:var(--gray); margin-bottom:4px; }
  .pedido-productos { font-size:11px; color:var(--text); opacity:.7; line-height:1.5; }

  /* BADGES */
  .badge { display:inline-block; padding:2px 8px; border-radius:20px; font-size:9px; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
  .badge-green  { background:rgba(76,175,80,0.12);  color:var(--green); border:1px solid rgba(76,175,80,0.25); }
  .badge-red    { background:rgba(230,57,70,0.1);   color:var(--red);   border:1px solid rgba(230,57,70,0.25); }
  .badge-orange { background:rgba(200,137,42,0.12); color:var(--gold);  border:1px solid rgba(200,137,42,0.25); }

  /* NUEVO PEDIDO */
  .pedido-layout { display:grid; grid-template-columns:1fr 320px; gap:18px; align-items:start; }
  .form-section { padding:16px 18px; border-bottom:1px solid var(--border); }
  .form-section:last-child { border-bottom:none; }
  .form-label { font-size:10px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; display:block; margin-bottom:7px; }
  .form-input { width:100%; background:var(--bg); border:1px solid rgba(200,137,42,0.2); border-radius:5px; padding:11px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--white); outline:none; transition:border-color .2s; }
  .form-input:focus { border-color:rgba(200,137,42,0.6); box-shadow:0 0 0 3px rgba(200,137,42,0.08); }
  .form-input::placeholder { color:rgba(255,255,255,0.2); }
  .form-select { width:100%; background:var(--bg); border:1px solid rgba(200,137,42,0.2); border-radius:5px; padding:11px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--white); outline:none; transition:border-color .2s; }
  .form-select:focus { border-color:rgba(200,137,42,0.6); }
  .form-select option { background:var(--card); }
  .form-textarea { width:100%; background:var(--bg); border:1px solid rgba(200,137,42,0.2); border-radius:5px; padding:11px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--white); outline:none; resize:vertical; min-height:70px; transition:border-color .2s; }
  .form-textarea:focus { border-color:rgba(200,137,42,0.6); }
  .form-textarea::placeholder { color:rgba(255,255,255,0.2); }

  /* PRODUCTO SELECTOR */
  .productos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(145px,1fr)); gap:10px; }
  .producto-btn { background:var(--bg); border:1px solid var(--border); border-radius:7px; padding:12px 10px; cursor:pointer; transition:border-color .15s,background .15s; text-align:left; width:100%; }
  .producto-btn:hover:not(.agotado) { border-color:rgba(200,137,42,0.35); background:rgba(200,137,42,0.06); }
  .producto-btn.seleccionado { border-color:var(--gold); background:rgba(200,137,42,0.1); }
  .producto-btn.agotado { opacity:.35; cursor:not-allowed; }
  .prod-cat { font-size:9px; color:var(--gray); letter-spacing:1px; text-transform:uppercase; margin-bottom:4px; }
  .prod-nombre { font-size:12px; font-weight:600; color:var(--white); margin-bottom:6px; line-height:1.3; }
  .prod-precio { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:var(--gold); }

  /* CANTIDAD */
  .qty-control { display:flex; align-items:center; gap:8px; margin-top:8px; }
  .qty-btn { width:24px; height:24px; border-radius:50%; border:1px solid rgba(200,137,42,0.4); background:transparent; color:var(--gold); font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; line-height:1; }
  .qty-btn:hover { background:rgba(200,137,42,0.15); }
  .qty-num { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:700; color:var(--white); min-width:18px; text-align:center; }

  /* RESUMEN */
  .resumen-card { background:var(--card); border:1px solid var(--border); border-radius:8px; overflow:hidden; position:sticky; top:80px; }
  .resumen-header { padding:14px 18px; border-bottom:1px solid var(--border); }
  .resumen-title { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600; letter-spacing:0.02em; color:var(--white); }
  .resumen-items { padding:12px 16px; min-height:100px; }
  .resumen-empty { color:var(--gray); font-size:12px; text-align:center; padding:24px 0; opacity:.6; line-height:1.6; }
  .resumen-item { display:flex; align-items:center; justify-content:space-between; padding:7px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .resumen-item-info { flex:1; }
  .resumen-item-name { font-size:12px; color:var(--white); }
  .resumen-item-qty { font-size:10px; color:var(--gray); margin-top:1px; }
  .resumen-item-price { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:700; color:var(--gold); margin:0 8px; }
  .resumen-item-del { background:none; border:none; color:var(--red); cursor:pointer; font-size:13px; opacity:.5; transition:opacity .15s; }
  .resumen-item-del:hover { opacity:1; }
  .resumen-total { padding:14px 18px; border-top:1px solid rgba(200,137,42,0.2); display:flex; align-items:center; justify-content:space-between; }
  .resumen-total-label { font-size:10px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; }
  .resumen-total-value { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:700; color:#E8A830; }
  .resumen-actions { padding:0 16px 16px; display:flex; flex-direction:column; gap:8px; }

  /* ALERTA */
  .alerta { font-size:12px; padding:10px 12px; border-radius:5px; text-align:center; }
  .alerta-ok  { background:rgba(76,175,80,0.1);  color:var(--green); border:1px solid rgba(76,175,80,0.25); }
  .alerta-err { background:rgba(230,57,70,0.1);  color:var(--red);   border:1px solid rgba(230,57,70,0.25); }

  /* IMAGENS POR CATEGORIA */
.producto-item {
  background: var(--card2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.producto-item:hover {
  border-color: var(--gold);
  transform: translateY(-2px);
}

.producto-img-bg {
  position: absolute;
  top: 0; right: 0;
  width: 60px; height: 60px;
  opacity: 0.15;
  filter: grayscale(1);
  pointer-events: none;
}

  /* TABLA */
  .user-table { width:100%; border-collapse:collapse; }
  .user-table th { text-align:left; padding:10px 18px; font-size:10px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; border-bottom:1px solid var(--border); }
  .user-table td { padding:13px 18px; font-size:13px; color:var(--text); border-bottom:1px solid rgba(255,255,255,0.04); }
  .user-table tr:last-child td { border-bottom:none; }
  .user-table tr:hover td { background:rgba(200,137,42,0.04); }
`;

const fmt = (n) => `$${Number(n).toLocaleString("es-CO")}`;

// ── PÁGINAS ───────────────────────────────────────────────────────────────

function PaginaPedidos() {
  const [pedidos, setPedidos]       = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [moviendo, setMoviendo]     = useState(null);
  const [facturando, setFacturando] = useState(null);
  const [facturado, setFacturado]   = useState(null);

  const cols = [
    { key: "recibido",    label: "Recibido",       color: "#4A90D9" },
    { key: "preparacion", label: "En Preparación", color: "#C8892A" },
    { key: "listo",       label: "Listo",           color: "#6fcf74" },
    { key: "entregado",   label: "Entregado",       color: "rgba(232,230,223,0.35)" },
  ];

  const colKeys = cols.map(c => c.key);

  const cargarPedidos = () => {
    setCargando(true);
    axios.get("https://kitchen-manager-back.onrender.com/empleado/pedidos")
      .then(res => setPedidos(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 30000);
    return () => clearInterval(interval);
  }, []);

  const mover = async (pedido, direccion) => {
    const idx = colKeys.indexOf(pedido.estado || "recibido");
    const nuevoIdx = idx + direccion;
    if (nuevoIdx < 0 || nuevoIdx >= colKeys.length) return;
    setMoviendo(pedido.id);
    try {
      await axios.patch(`https://kitchen-manager-back.onrender.com/empleado/pedido/${pedido.id}/estado`, {
        estado: colKeys[nuevoIdx],
      });
      setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, estado: colKeys[nuevoIdx] } : p));
    } catch (err) { console.error(err); }
    finally { setMoviendo(null); }
  };

  const facturar = async (pedido) => {
    setFacturando(pedido.id);
    try {
      await axios.post(`https://kitchen-manager-back.onrender.com/empleado/facturar/${pedido.id}`);
      setFacturado(pedido.id);
      setTimeout(() => setFacturado(null), 4000);
    } catch (err) {
      console.error("Error al facturar:", err);
      alert("Error al generar la factura");
    } finally {
      setFacturando(null);
    }
  };

  const pedidosDeCol = (key) => pedidos.filter(p => (p.estado || "recibido") === key);

  const formatTiempo = (fecha) => {
    if (!fecha) return "";
    const mins = Math.floor((Date.now() - new Date(fecha)) / 60000);
    if (mins < 1)  return "ahora mismo";
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    return `hace ${hrs}h ${mins % 60}min`;
  };

  return (
    <div>
      <div className="page-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div className="page-title">PANEL DE PEDIDOS</div>
          <div className="page-subtitle">Mueve los pedidos entre columnas · factura al entregar</div>
        </div>
        <button className="btn-primary" onClick={cargarPedidos}>⟳ ACTUALIZAR</button>
      </div>

      <div className="stats-grid">
        {cols.map(c => (
          <div className="stat-card" key={c.key} style={{ borderTop:`2px solid ${c.color}` }}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value" style={{ color:c.color }}>
              {cargando ? "..." : pedidosDeCol(c.key).length}
            </div>
            <div className="stat-icon">📦</div>
          </div>
        ))}
      </div>

      {cargando ? (
        <div className="placeholder-content"><div className="placeholder-text">Cargando pedidos...</div></div>
      ) : pedidos.length === 0 ? (
        <div className="section-card">
          <div className="placeholder-content">
            <div className="placeholder-icon">📦</div>
            <div className="placeholder-text">No hay pedidos registrados aún</div>
          </div>
        </div>
      ) : (
        <div className="kanban">
          {cols.map((col, colIdx) => (
            <div className="kanban-col" key={col.key}>
              <div className="kanban-col-header">
                <div className="kanban-col-dot" style={{ background:col.color }} />
                <div className="kanban-col-title" style={{ color:col.color }}>{col.label}</div>
                <div className="kanban-col-count">{pedidosDeCol(col.key).length}</div>
              </div>
              <div className="kanban-col-body">
                {pedidosDeCol(col.key).length === 0 ? (
                  <div className="kanban-empty">Sin pedidos</div>
                ) : (
                  pedidosDeCol(col.key).map((p, i) => (
                    <div className="pedido-card" key={p.id || i}>
                      <div className="pedido-card-top">
                        <div className="pedido-id">#{p.id?.slice(-5).toUpperCase()}</div>
                        <div className="pedido-timer" style={{
                          color: (() => {
                            const mins = Math.floor((Date.now() - new Date(p.fecha)) / 60000);
                            if (mins > 30) return "#E63946";
                            if (mins > 15) return "#E8A830";
                            return "var(--gray)";
                          })()
                        }}>
                          ⏱ {formatTiempo(p.fecha)}
                        </div>
                      </div>
                      <div className="pedido-fuente">👤 {p.nombreCliente} · 📍 {p.fuente}</div>
                      <div className="pedido-productos">
                        {p.itemsSeleccionados?.map((item, j) => (
                          <div key={j}>{item.cantidad}× {item.nombre}</div>
                        ))}
                        {p.notas && p.notas.trim() && (
                          <div style={{
                            marginTop: "8px",
                            padding: "6px 9px",
                            background: "rgba(200,137,42,0.07)",
                            border: "1px solid rgba(200,137,42,0.2)",
                            borderRadius: "5px",
                            fontSize: "11px",
                            color: "#E8A830",
                            lineHeight: "1.5",
                          }}>
                            📝 {p.notas}
                            {p.meseroAsignado && (
                            <div style={{
                              fontSize: "10px", color: "#4A90D9",
                              marginBottom: "4px", display: "flex",
                              alignItems: "center", gap: "4px"
                            }}>
                              🧑‍🍳 Mesero: <strong>{p.meseroAsignado}</strong>
                            </div>
                          )}
                          </div>
                        )}                     
                        <button
                          onClick={() => {
                          const link = `https://kitchen-manager-front.vercel.app/seguimiento/${p.id}`;
                          navigator.clipboard.writeText(link);
                        }}
                        style={{
                          padding:"4px 10px", background:"rgba(74,144,217,0.1)",
                          border:"1px solid rgba(74,144,217,0.25)", borderRadius:"4px",
                          color:"#4A90D9", cursor:"pointer", fontSize:"10px",
                          fontWeight:"600", marginTop:"6px", width:"100%"
                        }}
                      >
                        🔗 Copiar enlace cliente
                      </button>
                      </div>
                      <div style={{ marginTop:"8px", fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", fontWeight:"700", color:"#E8A830" }}>
                        ${Number(p.total).toLocaleString("es-CO")}
                      </div>

                      {facturado === p.id && (
                        <div style={{ marginTop:"8px", padding:"8px 10px", background:"rgba(76,175,80,0.1)", border:"1px solid rgba(76,175,80,0.25)", borderRadius:"5px", fontSize:"11px", color:"#6fcf74", textAlign:"center", fontWeight:"600" }}>
                          ✓ Facturado · revisa Mis Ventas
                        </div>
                      )}

                      <div style={{ display:"flex", gap:"6px", marginTop:"10px" }}>
                        <button
                          onClick={() => mover(p, -1)}
                          disabled={colIdx === 0 || moviendo === p.id}
                          style={{
                            flex:1, padding:"6px",
                            background: colIdx === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
                            border:"1px solid rgba(255,255,255,0.1)", borderRadius:"5px",
                            color: colIdx === 0 ? "rgba(255,255,255,0.15)" : "var(--gray)",
                            cursor: colIdx === 0 ? "not-allowed" : "pointer", fontSize:"14px",
                          }}
                        >←</button>

                        <div style={{
                          flex:2, textAlign:"center", fontSize:"9px", fontWeight:"600",
                          letterSpacing:"1px", textTransform:"uppercase", color:col.color,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          background:`${col.color}15`, borderRadius:"5px",
                          border:`1px solid ${col.color}30`, padding:"4px",
                        }}>
                          {moviendo === p.id ? "..." : col.label}
                        </div>

                        {colIdx === cols.length - 1 ? (
                          <button
                            onClick={() => facturar(p)}
                            disabled={facturando === p.id || facturado === p.id}
                            style={{
                              flex:2, padding:"6px",
                              background: facturado === p.id ? "rgba(76,175,80,0.15)" : "linear-gradient(135deg,#6fcf74,#4CAF50)",
                              border: facturado === p.id ? "1px solid rgba(76,175,80,0.3)" : "none",
                              borderRadius:"5px",
                              color: facturado === p.id ? "#6fcf74" : "#0C0E14",
                              cursor: facturado === p.id ? "default" : "pointer",
                              fontSize:"10px", fontWeight:"700",
                              letterSpacing:"1px", fontFamily:"'DM Sans',sans-serif",
                              opacity: facturando === p.id ? .5 : 1,
                            }}
                          >
                            {facturando === p.id ? "..." : facturado === p.id ? "✓ FACTURADO" : "🧾 FACTURAR"}
                          </button>
                        ) : (
                          <button
                            onClick={() => mover(p, +1)}
                            disabled={moviendo === p.id}
                            style={{
                              flex:1, padding:"6px",
                              background:`${col.color}15`,
                              border:`1px solid ${col.color}30`,
                              borderRadius:"5px", color:col.color,
                              cursor:"pointer", fontSize:"14px",
                            }}
                          >→</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generarFacturaHTML(venta) {
  const fecha = new Date(venta.fecha).toLocaleString("es-CO", {
    day:"2-digit", month:"2-digit", year:"numeric",
    hour:"2-digit", minute:"2-digit"
  });
  const filas = venta.itemsVendidos?.map(item => `
    <tr>
      <td>${item.nombre}</td>
      <td style="text-align:center">${item.cantidad}</td>
      <td style="text-align:right">$${Number(item.precio).toLocaleString("es-CO")}</td>
      <td style="text-align:right">$${Number(item.precio * item.cantidad).toLocaleString("es-CO")}</td>
    </tr>`).join("") || "";

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/>
<title>Factura #${venta.id?.slice(-6).toUpperCase()}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Georgia',serif;color:#1a1a1a;padding:40px;max-width:600px;margin:0 auto;background:#faf9f6}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;border-bottom:2px solid #C8892A;padding-bottom:20px}
  .brand{font-family:'Georgia',serif;font-size:22px;font-weight:700;letter-spacing:1px;color:#0C0E14}
  .brand span{color:#C8892A}
  .info{text-align:right;font-size:13px;color:#666}
  .info strong{font-size:16px;color:#0C0E14;display:block;margin-bottom:4px}
  .cliente-box{background:#f0ede8;border-radius:8px;padding:16px 20px;margin-bottom:24px;display:flex;justify-content:space-between}
  .cliente-box label{font-size:9px;font-weight:700;color:#999;letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:4px}
  .cliente-box span{font-size:14px;color:#1a1a1a;font-weight:600}
  table{width:100%;border-collapse:collapse}
  thead tr{background:#0C0E14;color:#F2EDE4}
  thead th{padding:10px 12px;text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-family:sans-serif}
  tbody tr{border-bottom:1px solid #e8e4dc}
  tbody td{padding:11px 12px;font-size:13px}
  .total-box{background:#0C0E14;color:#F2EDE4;border-radius:0 0 8px 8px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center}
  .total-box span{font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:.6;font-family:sans-serif}
  .total-box strong{font-size:24px;color:#E8A830;font-family:'Georgia',serif}
  .footer{margin-top:32px;text-align:center;font-size:11px;color:#aaa}
  .print-btn{margin-top:24px;text-align:center}
  .print-btn button{padding:12px 32px;background:linear-gradient(135deg,#C8892A,#E8A830);color:#0C0E14;border:none;border-radius:6px;font-size:14px;font-weight:700;cursor:pointer}
  @media print{.print-btn{display:none}}
</style></head><body>
  <div class="header">
    <div><div class="brand">KITCHEN<span> MANAGER</span></div>
    <div style="font-size:12px;color:#999;margin-top:4px">Sistema de gestión</div></div>
    <div class="info"><strong>FACTURA #${venta.id?.slice(-6).toUpperCase()}</strong>
    <div>${fecha}</div><div>Fuente: ${venta.fuente}</div></div>
  </div>
  <div class="cliente-box">
    <div><label>Cliente</label><span>${venta.nombreCliente}</span></div>
    <div style="text-align:right"><label>Estado</label><span style="color:#4CAF50">✓ Entregado</span></div>
  </div>
  <table>
    <thead><tr><th>Producto</th><th style="text-align:center">Cant.</th><th style="text-align:right">Precio</th><th style="text-align:right">Subtotal</th></tr></thead>
    <tbody>${filas}</tbody>
  </table>
  <div class="total-box"><span>Total a pagar</span><strong>$${Number(venta.total).toLocaleString("es-CO")}</strong></div>
  <div class="footer"><p style="margin-bottom:4px">Gracias por su preferencia</p><p>Kitchen Manager · ${new Date().getFullYear()}</p></div>
  <div class="print-btn"><button onclick="window.print()">🖨 IMPRIMIR FACTURA</button></div>
</body></html>`;

  const blob = new Blob([html], { type:"text/html" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.target = "_blank"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function PaginaNuevoPedido() {
  const [fuente, setFuente]               = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [notas, setNotas]                 = useState("");
  const [carrito, setCarrito]             = useState({});
  const [menu, setMenu]                   = useState([]);
  const [cargandoMenu, setCargandoMenu]   = useState(true);
  const [enviando, setEnviando]           = useState(false);
  const [resultado, setResultado]         = useState(null);
  const [linkSeguimiento, setLinkSeguimiento] = useState("");
  
  useEffect(() => {
    axios.get("https://kitchen-manager-back.onrender.com/empleado/verMenu")
      .then(res => setMenu(res.data))
      .catch(err => console.error("Error cargando menú:", err))
      .finally(() => setCargandoMenu(false));
  }, []);

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
    setCarrito({}); setFuente(""); setNombreCliente(""); setNotas(""); setResultado(null);
  };

  const itemsCarrito = menu
    .filter(p => carrito[p.id])
    .map(p => ({ ...p, cantidad: carrito[p.id], subtotal: p.precio * carrito[p.id] }));

  const total = itemsCarrito.reduce((acc, i) => acc + i.subtotal, 0);
  const puedeRegistrar = itemsCarrito.length > 0 && fuente && nombreCliente.trim();

  const handleRegistrar = async () => {
    setEnviando(true); setResultado(null);
    try {
      const res = await axios.post("https://kitchen-manager-back.onrender.com/empleado/registrarPedido", {
        fuente, nombreCliente, notas, total,
        itemsSeleccionados: itemsCarrito.map(i => ({
          id: i.id, nombre: i.nombre, categoria: i.categoria, precio: i.precio, cantidad: i.cantidad,
        })),
      });
      const link = `https://kitchen-manager-front.vercel.app/seguimiento/${res.data.id}`;
      setLinkSeguimiento(link);
      setResultado({ ok: true, msg: "✓ Pedido registrado correctamente" });

      // limpia todo menos el link
      setCarrito({}); setFuente(""); setNombreCliente(""); setNotas("");

    } catch (error) {
      setResultado({ ok: false, msg: "✗ Error al registrar el pedido" });
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">NUEVO PEDIDO</div>
        <div className="page-subtitle">Selecciona los productos y registra el pedido</div>
      </div>

      <div className="pedido-layout">
        <div>
          <div className="section-card">
            <div className="section-card-header"><div className="section-card-title">DATOS DEL PEDIDO</div></div>
            <div className="form-section">
              <label className="form-label">¿De dónde viene?</label>
              <select className="form-select" value={fuente} onChange={e => setFuente(e.target.value)}>
                <option value="">Seleccionar fuente...</option>
                <option value="Rappi">🛵 Rappi</option>
                <option value="Uber Eats">🛵 Uber Eats</option>
                <option value="DiDi Food">🛵 DiDi Food</option>
                <option value="WhatsApp">💬 WhatsApp</option>
                <option value="Presencial">🏠 Presencial</option>
              </select>
            </div>
            <div className="form-section">
              <label className="form-label">Nombre del cliente</label>
              <input className="form-input" type="text" placeholder="ej: Carlos López" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} />
            </div>
          </div>

          <div className="section-card">
            <div className="section-card-header"><div className="section-card-title">SELECCIONAR PRODUCTOS</div></div>
            <div className="form-section">
              {cargandoMenu ? (
                <div className="placeholder-content"><div className="placeholder-text">Cargando productos...</div></div>
              ) : menu.length === 0 ? (
                <div className="placeholder-content"><div className="placeholder-icon">🍽️</div><div className="placeholder-text">No hay productos en el menú aún</div></div>
              ) : (
                <div className="productos-grid">
                  {menu.map(prod => (
                    <div 
                      key={prod.id} 
                      className={`producto-btn ${carrito[prod.id] ? "seleccionado" : ""} ${!prod.disponible ? "agotado" : ""}`} 
                      onClick={() => agregar(prod)}
                    >
                      {/* IMAGEN DEL PRODUCTO */}
                      {prod.imagenUrl && (
                        <div style={{ 
                          width: "100%", 
                          height: "100px", 
                          borderRadius: "6px", 
                          overflow: "hidden", 
                          marginBottom: "10px", 
                          background: "#0C0E14",
                          position: "relative"
                        }}>
                          <img 
                            src={`${BASE}${prod.imagenUrl}`}
                            alt={prod.nombre}
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "cover",
                              transition: "transform 0.2s"
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:40px;">🍽️</div>';
                            }}
                          />
                        </div>
                      )}
                      {!prod.imagenUrl && (
                        <div style={{ 
                          width: "100%", 
                          height: "100px", 
 borderRadius: "6px", 
                          marginBottom: "10px", 
                          background: "#0C0E14",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "40px"
                        }}>
                          🍽️
                        </div>
                      )}
                      <div className="prod-cat">{prod.categoria}</div>
                      <div className="prod-nombre">{prod.nombre}</div>
                      <div className="prod-precio">{fmt(prod.precio)}</div>
                      {!prod.disponible && <span className="badge badge-red" style={{ marginTop: 6 }}>Agotado</span>}
                      {carrito[prod.id] && (
                        <div className="qty-control" onClick={e => e.stopPropagation()}>
                          <button className="qty-btn" onClick={() => cambiar(prod.id, -1)}>−</button>
                          <div className="qty-num">{carrito[prod.id]}</div>
                          <button className="qty-btn" onClick={() => cambiar(prod.id, +1)}>+</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="section-card-header"><div className="section-card-title">NOTAS ESPECIALES</div></div>
            <div className="form-section">
              <textarea 
                className="form-textarea" 
                placeholder="Sin cebolla, extra salsa, etc." 
                value={notas} 
                onChange={e => setNotas(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="resumen-card">
          <div className="resumen-header"><div className="resumen-title">RESUMEN DEL PEDIDO</div></div>
          <div className="resumen-items">
            {itemsCarrito.length === 0 ? (
              <div className="resumen-empty">Selecciona productos<br />del menú para comenzar</div>
            ) : (
              itemsCarrito.map(item => (
                <div className="resumen-item" key={item.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                    {/* Mini imagen en el resumen */}
                    {item.imagenUrl && (
                      <img 
                        src={`${BASE}${item.imagenUrl}`}
                        alt={item.nombre}
                        style={{ 
                          width: "35px", 
                          height: "35px", 
                          objectFit: "cover", 
                          borderRadius: "5px",
                          border: "1px solid rgba(200,137,42,0.2)"
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    {!item.imagenUrl && (
                      <div style={{ 
                        width: "35px", 
                        height: "35px", 
                        borderRadius: "5px", 
                        background: "#0C0E14",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        border: "1px solid rgba(200,137,42,0.2)"
                      }}>
                        🍽️
                      </div>
                    )}
                    <div className="resumen-item-info">
                      <div className="resumen-item-name">{item.nombre}</div>
                      <div className="resumen-item-qty">{item.cantidad} × {fmt(item.precio)}</div>
                    </div>
                  </div>
                  <div className="resumen-item-price">{fmt(item.subtotal)}</div>
                  <button className="resumen-item-del" onClick={() => cambiar(item.id, -item.cantidad)}>✕</button>
                </div>
              ))
            )}
          </div>

          {(fuente || nombreCliente) && (
            <div style={{ 
              padding: "10px 16px", 
              borderTop: "1px solid rgba(255,255,255,0.07)", 
              fontSize: "11px", 
              color: "var(--gray)", 
              display: "flex", 
              flexDirection: "column", 
              gap: "4px" 
            }}>
              {fuente        && <span>📍 Fuente: <strong style={{ color: "var(--white)" }}>{fuente}</strong></span>}
              {nombreCliente && <span>👤 Cliente: <strong style={{ color: "var(--white)" }}>{nombreCliente}</strong></span>}
            </div>
          )}

          <div className="resumen-total">
            <div className="resumen-total-label">Total</div>
            <div className="resumen-total-value">{fmt(total)}</div>
          </div>
          <div className="resumen-actions">
            <button 
              className="btn-primary" 
              disabled={!puedeRegistrar || enviando} 
              onClick={handleRegistrar} 
              style={{ padding: "12px 16px", fontSize: "14px" }}
            >
              {enviando ? "REGISTRANDO..." : "REGISTRAR PEDIDO"}
            </button>
            <button className="btn-secondary" onClick={limpiar}>LIMPIAR</button>
            {resultado && <div className={`alerta ${resultado.ok ? "alerta-ok" : "alerta-err"}`}>{resultado.msg}</div>}

            {linkSeguimiento && (
              <div style={{
                padding: "14px", 
                background: "rgba(76,175,80,0.08)",
                border: "1px solid rgba(76,175,80,0.2)", 
                borderRadius: "8px", 
                marginTop: "8px"
              }}>
                <div style={{ 
                  fontSize: "10px", 
                  color: "#6fcf74", 
                  letterSpacing: "2px",
                  textTransform: "uppercase", 
                  marginBottom: "6px" 
                }}>
                  Enlace para el cliente
                </div>
                <div style={{ 
                  fontSize: "11px", 
                  color: "rgba(232,230,223,0.6)",
                  wordBreak: "break-all", 
                  marginBottom: "10px" 
                }}>
                  {linkSeguimiento}
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(linkSeguimiento)} 
                  style={{
                    padding: "6px 14px", 
                    background: "rgba(76,175,80,0.15)",
                    border: "1px solid rgba(76,175,80,0.3)", 
                    borderRadius: "5px",
                    color: "#6fcf74", 
                    cursor: "pointer", 
                    fontSize: "11px",
                    fontFamily: "DM Sans,sans-serif", 
                    fontWeight: "600", 
                    width: "100%"
                  }}
                >
                  📋 Copiar y enviar al cliente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaginaMenu() {
  const [menu, setMenu]         = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get("https://kitchen-manager-back.onrender.com/empleado/verMenu")
      .then(res => setMenu(res.data))
      .catch(err => console.error("Error cargando menú:", err))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">MENÚ DISPONIBLE</div>
        <div className="page-subtitle">Consulta los productos activos</div>
      </div>
      <div className="section-card">
        <div className="section-card-header"><div className="section-card-title">PRODUCTOS ({menu.length})</div></div>
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando productos...</div></div>
        ) : menu.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">🍽️</div><div className="placeholder-text">No hay productos en el menú aún</div></div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"12px", padding:"16px" }}>
            {menu.map((item, i) => (
              <div key={i} style={{ background:"var(--card2)", borderRadius:"7px", border:`1px solid ${item.disponible ? "rgba(76,175,80,0.15)" : "rgba(230,57,70,0.15)"}`, padding:"14px", display:"flex", flexDirection:"column", gap:"6px" }}>
                {/* Agregar imagen aquí */}
                {item.imagenUrl && (
                  <div style={{ width:"100%", height:"120px", borderRadius:"6px", overflow:"hidden", marginBottom:"8px", background:"#0C0E14" }}>
                    <img 
                      src={`${BASE}${item.imagenUrl}`}
                      alt={item.nombre}
                      style={{ width:"100%", height:"100%", objectFit:"cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:40px;">🍽️</div>';
                      }}
                    />
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ fontWeight:600, fontSize:"13px", color:"var(--white)" }}>{item.nombre}</div>
                  <span className={`badge ${item.disponible ? "badge-green" : "badge-red"}`}>{item.disponible ? "Activo" : "Agotado"}</span>
                </div>
                <div style={{ fontSize:"10px", color:"var(--gray)", textTransform:"uppercase", letterSpacing:"1px" }}>{item.categoria}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", fontWeight:"700", color:"var(--gold)", marginTop:"4px" }}>{fmt(item.precio)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaginaVentas() {
  const [ventas, setVentas]     = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get("https://kitchen-manager-back.onrender.com/empleado/ventas")
      .then(res => setVentas(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  const hoy    = new Date().toDateString();
  const semana = new Date(Date.now() - 7  * 86400000);
  const mes    = new Date(Date.now() - 30 * 86400000);
  const ventasHoy    = ventas.filter(v => new Date(v.fecha).toDateString() === hoy).reduce((a,v) => a + v.total, 0);
  const ventasSemana = ventas.filter(v => new Date(v.fecha) >= semana).reduce((a,v) => a + v.total, 0);
  const ventasMes    = ventas.filter(v => new Date(v.fecha) >= mes).reduce((a,v) => a + v.total, 0);
  const fmtv = n => `$${Number(n).toLocaleString("es-CO")}`;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">MIS VENTAS</div>
        <div className="page-subtitle">Ventas facturadas registradas en el sistema</div>
      </div>
      <div className="stats-grid">
        {[
          { label:"Ventas hoy",    value: fmtv(ventasHoy),    color:"#6fcf74", icon:"💰" },
          { label:"Esta semana",   value: fmtv(ventasSemana), color:"#C8892A", icon:"📊" },
          { label:"Este mes",      value: fmtv(ventasMes),    color:"#4A90D9", icon:"📈" },
          { label:"Total facturas",value: ventas.length,      color:"#E8A830", icon:"🧾" },
        ].map((s,i) => (
          <div className="stat-card" key={i} style={{ borderTop:`2px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color:s.color, fontSize:"1.6rem" }}>{s.value}</div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-card-header"><div className="section-card-title">FACTURAS EMITIDAS ({ventas.length})</div></div>
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando ventas...</div></div>
        ) : ventas.length === 0 ? (
          <div className="placeholder-content">
            <div className="placeholder-icon">🧾</div>
            <div className="placeholder-text">No hay ventas aún.<br/>Cuando factures un pedido entregado, aparecerá aquí.</div>
          </div>
        ) : (
          <table className="user-table">
            <thead><tr><th>Factura</th><th>Cliente</th><th>Fuente</th><th>Productos</th><th>Total</th><th>Fecha</th><th></th></tr></thead>
            <tbody>
              {ventas.slice().reverse().map((v, i) => (
                <tr key={i}>
                  <td style={{ color:"var(--gold)", fontFamily:"'Cormorant Garamond',serif", fontSize:"15px", fontWeight:"600" }}>#{v.id?.slice(-6).toUpperCase()}</td>
                  <td>👤 {v.nombreCliente}</td>
                  <td><span className="badge badge-orange">{v.fuente}</span></td>
                  <td style={{ fontSize:"11px", opacity:.8 }}>{v.itemsVendidos?.map(it => `${it.cantidad}× ${it.nombre}`).join(", ")}</td>
                  <td style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", fontWeight:"700" }}>{fmtv(v.total)}</td>
                  <td style={{ color:"var(--gray)", fontSize:"12px" }}>{new Date(v.fecha).toLocaleString("es-CO", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}</td>
                  <td>
                    <button onClick={() => generarFacturaHTML(v)} style={{ padding:"5px 12px", background:"rgba(200,137,42,0.08)", border:"1px solid rgba(200,137,42,0.2)", borderRadius:"5px", color:"var(--gold)", cursor:"pointer", fontSize:"11px", fontWeight:"500", whiteSpace:"nowrap", fontFamily:"DM Sans,sans-serif" }}>
                      🧾 Ver factura
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── NAV e ICONOS ───────────────────────────────────────────────────────────────────
const LogoutIcon = () => (
  <svg style={{ width: "14px", height: "14px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const PedidosIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    {/* Monitor */}
    <rect x="3" y="3" width="18" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 19h8M12 16v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    
    {/* Lista de pedidos (checkboxes o líneas) */}
    <rect x="7" y="7" width="4" height="2" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M13 8h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    
    <rect x="7" y="11" width="4" height="2" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M13 12h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    
    <rect x="7" y="15" width="4" height="2" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M13 16h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const VentasIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" fontFamily="Arial">$</text>
  </svg>
);

const TvIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* Pantalla grande */}
    <rect x="2" y="3" width="20" height="13" rx="1.5" stroke="currentColor"/>
    
    {/* Patas / soporte */}
    <path d="M8 20h8M12 16v4" stroke="currentColor" strokeLinecap="round"/>
    
    {/* Luz de encendido */}
    <circle cx="19" cy="7" r="0.8" fill="#6fcf74" stroke="none"/>
  </svg>
);

const NuevoPedidoIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const VerMenuIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
  </svg>
);


const NAV = [
  { key: "pedidos", label: "Panel de Pedidos", icon: PedidosIcon, section: "COCINA" },
  { key: "nuevo",   label: "Nuevo Pedido",      icon: NuevoPedidoIcon, section: "COCINA" },
  { key: "menu",    label: "Ver Menú",           icon: VerMenuIcon, section: "COCINA" },
  { key: "cocina",  label:  "Panel para cocinero", icon: TvIcon, serction: "COCINA"},
  { key: "ventas",  label: "Mis Ventas",         icon: VentasIcon, section: "REGISTRO" },
];



// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────
export default function Empleado() {
  const [activePage, setActivePage] = useState("pedidos");
  const username = localStorage.getItem("username") || "empleado";
  const sections = [...new Set(NAV.map(n => n.section))];
  const activeLabel = NAV.find(n => n.key === activePage)?.label;

  const renderPage = () => {
    switch (activePage) {
      case "pedidos": return <PaginaPedidos />;
      case "nuevo":   return <PaginaNuevoPedido />;
      case "menu":    return <PaginaMenu />;
      case "ventas":  return <PaginaVentas />;
      case "cocina":  return <CocinaTV />;
      default:        return <PaginaPedidos />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="emp-root">
        <aside className="sidebar">
          <div className="sidebar-logo">
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
            <div className="sidebar-logo-sub">Panel Empleado</div>
          </div>
          <nav className="sidebar-nav">
            {sections.map(section => (
              <div key={section}>
                <div className="nav-section-label">{section}</div>
                {NAV.filter(n => n.section === section).map(item => {
                const IconComponent = item.icon;
                return (
                  <div key={item.key} className={`nav-item ${activePage === item.key ? "active" : ""}`} onClick={() => setActivePage(item.key)}>
                    <IconComponent className="nav-icon" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="btn-logout" onClick={() => { 
              localStorage.removeItem("username"); 
              localStorage.removeItem("role"); 
              window.location.href = "/"; 
            }}>
              <LogoutIcon className="w-2 h-2" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="topbar-title">{activeLabel?.toUpperCase()}</div>
            <div className="topbar-user">
              <div className="topbar-avatar">E</div>
              <div>
                <div className="topbar-username">{username}</div>
                <div className="topbar-role">Empleado</div>
              </div>
            </div>
          </div>
          <div className="content" key={activePage}>{renderPage()}</div>
        </main>
      </div>
    </>
  );
}
