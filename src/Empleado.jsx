import { useState, useEffect } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #1A1A2E; --card: #16213E; --card2: #1e2d50;
    --orange: #FF6B35; --yellow: #FFC300; --white: #F5F5F5;
    --gray: #A0A0A0; --blue: #4A90D9; --green: #4CAF50;
    --red: #E63946; --slate: #78909C; --sidebar: 230px;
  }
  .emp-root { display:flex; min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--white); }

  /* SIDEBAR */
  .sidebar { width:var(--sidebar); background:var(--card); border-right:1px solid #FF6B3520; display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:100; }
  .sidebar-logo { padding:26px 20px 22px; border-bottom:1px solid #ffffff08; }
  .sidebar-logo-icon { width:36px; height:36px; background:linear-gradient(135deg,var(--orange),var(--yellow)); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:17px; margin-bottom:10px; }
  .sidebar-logo-name { font-family:'Bebas Neue',sans-serif; font-size:17px; letter-spacing:2px; color:var(--white); line-height:1; }
  .sidebar-logo-sub { font-size:9px; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-top:3px; }
  .sidebar-nav { flex:1; padding:14px 12px; display:flex; flex-direction:column; gap:4px; }
  .nav-section-label { font-size:9px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; padding:10px 8px 5px; }
  .nav-item { display:flex; align-items:center; gap:11px; padding:11px 12px; border-radius:6px; cursor:pointer; transition:background .15s,color .15s; font-size:13px; font-weight:500; color:var(--gray); border:1px solid transparent; user-select:none; }
  .nav-item:hover { background:#FF6B3510; color:var(--white); }
  .nav-item.active { background:linear-gradient(135deg,#FF6B3520,#FFC30010); border-color:#FF6B3530; color:var(--orange); }
  .nav-icon { font-size:15px; width:20px; text-align:center; }
  .sidebar-footer { padding:14px 12px; border-top:1px solid #ffffff08; }
  .btn-logout { width:100%; display:flex; align-items:center; gap:10px; padding:10px 12px; background:#E6394610; border:1px solid #E6394630; border-radius:6px; color:var(--red); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:background .15s; }
  .btn-logout:hover { background:#E6394625; }

  /* MAIN */
  .main { margin-left:var(--sidebar); flex:1; display:flex; flex-direction:column; min-height:100vh; }
  .topbar { background:var(--card); border-bottom:1px solid #FF6B3515; padding:0 28px; height:62px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50; }
  .topbar-title { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:2px; color:var(--white); }
  .topbar-user { display:flex; align-items:center; gap:10px; }
  .topbar-avatar { width:32px; height:32px; background:linear-gradient(135deg,var(--blue),#2563eb); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:white; }
  .topbar-username { font-size:13px; font-weight:500; }
  .topbar-role { font-size:10px; color:var(--blue); letter-spacing:1px; text-transform:uppercase; }

  .content { flex:1; padding:28px; animation:fadeIn .25s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .page-header { margin-bottom:24px; }
  .page-title { font-family:'Bebas Neue',sans-serif; font-size:30px; letter-spacing:2px; color:var(--white); }
  .page-subtitle { font-size:12px; color:var(--gray); margin-top:3px; }

  /* STATS */
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:14px; margin-bottom:24px; }
  .stat-card { background:var(--card); border-radius:8px; border:1px solid #ffffff08; padding:18px; position:relative; overflow:hidden; }
  .stat-label { font-size:9px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
  .stat-value { font-family:'Bebas Neue',sans-serif; font-size:34px; line-height:1; }
  .stat-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); font-size:32px; opacity:.12; }

  /* CARDS */
  .section-card { background:var(--card); border:1px solid #FF6B3515; border-radius:8px; overflow:hidden; margin-bottom:18px; }
  .section-card-header { padding:14px 18px; border-bottom:1px solid #ffffff08; display:flex; align-items:center; justify-content:space-between; }
  .section-card-title { font-family:'Bebas Neue',sans-serif; font-size:15px; letter-spacing:1px; color:var(--white); }

  /* BUTTONS */
  .btn-primary { padding:8px 16px; background:linear-gradient(135deg,var(--orange),var(--yellow)); border:none; border-radius:5px; font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:1px; color:var(--bg); cursor:pointer; transition:opacity .15s,transform .15s; }
  .btn-primary:hover { opacity:.88; transform:translateY(-1px); }
  .btn-primary:disabled { opacity:.35; cursor:not-allowed; transform:none; }
  .btn-secondary { padding:9px 18px; background:transparent; border:1px solid #ffffff20; border-radius:5px; color:var(--gray); font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:border-color .15s,color .15s; }
  .btn-secondary:hover { border-color:#ffffff40; color:var(--white); }

  /* PLACEHOLDER */
  .placeholder-content { padding:44px 20px; text-align:center; }
  .placeholder-icon { font-size:38px; margin-bottom:10px; opacity:.35; }
  .placeholder-text { color:var(--gray); font-size:13px; line-height:1.6; }

  /* KANBAN */
  .kanban { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; margin-bottom:24px; }
  .kanban-col { background:var(--card); border-radius:8px; overflow:hidden; border:1px solid #ffffff08; }
  .kanban-col-header { padding:12px 14px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #ffffff08; }
  .kanban-col-dot { width:8px; height:8px; border-radius:50%; }
  .kanban-col-title { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; }
  .kanban-col-count { margin-left:auto; background:#ffffff10; color:var(--gray); font-size:10px; font-weight:700; padding:2px 7px; border-radius:10px; }
  .kanban-col-body { padding:10px; min-height:120px; }
  .kanban-empty { text-align:center; color:var(--gray); font-size:11px; padding:20px 0; opacity:.5; }
  .pedido-card { background:var(--card2); border-radius:6px; padding:12px; margin-bottom:8px; border:1px solid #ffffff08; cursor:pointer; transition:border-color .15s; }
  .pedido-card:hover { border-color:#FF6B3530; }
  .pedido-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
  .pedido-id { font-family:'Bebas Neue',sans-serif; font-size:14px; color:var(--orange); letter-spacing:1px; }
  .pedido-timer { font-size:10px; color:var(--gray); font-weight:600; }
  .pedido-fuente { font-size:10px; color:var(--gray); margin-bottom:4px; }
  .pedido-productos { font-size:11px; color:var(--white); opacity:.7; line-height:1.5; }

  /* BADGES */
  .badge { display:inline-block; padding:2px 8px; border-radius:20px; font-size:9px; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
  .badge-green  { background:#4CAF5020; color:var(--green); border:1px solid #4CAF5040; }
  .badge-red    { background:#E6394620; color:var(--red);   border:1px solid #E6394640; }
  .badge-orange { background:#FF6B3520; color:var(--orange);border:1px solid #FF6B3540; }

  /* NUEVO PEDIDO */
  .pedido-layout { display:grid; grid-template-columns:1fr 320px; gap:18px; align-items:start; }
  .form-section { padding:16px 18px; border-bottom:1px solid #ffffff08; }
  .form-section:last-child { border-bottom:none; }
  .form-label { font-size:10px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; display:block; margin-bottom:7px; }
  .form-input { width:100%; background:var(--bg); border:1px solid #ffffff15; border-radius:5px; padding:11px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--white); outline:none; transition:border-color .2s; }
  .form-input:focus { border-color:var(--orange); }
  .form-input::placeholder { color:#ffffff25; }
  .form-select { width:100%; background:var(--bg); border:1px solid #ffffff15; border-radius:5px; padding:11px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--white); outline:none; transition:border-color .2s; }
  .form-select:focus { border-color:var(--orange); }
  .form-select option { background:var(--card); }
  .form-textarea { width:100%; background:var(--bg); border:1px solid #ffffff15; border-radius:5px; padding:11px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--white); outline:none; resize:vertical; min-height:70px; transition:border-color .2s; }
  .form-textarea:focus { border-color:var(--orange); }
  .form-textarea::placeholder { color:#ffffff25; }

  /* PRODUCTO SELECTOR */
  .productos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(145px,1fr)); gap:10px; }
  .producto-btn { background:var(--bg); border:1px solid #ffffff12; border-radius:7px; padding:12px 10px; cursor:pointer; transition:border-color .15s,background .15s; text-align:left; width:100%; }
  .producto-btn:hover:not(.agotado) { border-color:#FF6B3540; background:#FF6B3508; }
  .producto-btn.seleccionado { border-color:var(--orange); background:#FF6B3512; }
  .producto-btn.agotado { opacity:.35; cursor:not-allowed; }
  .prod-cat { font-size:9px; color:var(--gray); letter-spacing:1px; text-transform:uppercase; margin-bottom:4px; }
  .prod-nombre { font-size:12px; font-weight:600; color:var(--white); margin-bottom:6px; line-height:1.3; }
  .prod-precio { font-family:'Bebas Neue',sans-serif; font-size:17px; color:var(--orange); }

  /* CANTIDAD */
  .qty-control { display:flex; align-items:center; gap:8px; margin-top:8px; }
  .qty-btn { width:24px; height:24px; border-radius:50%; border:1px solid #FF6B3550; background:transparent; color:var(--orange); font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; line-height:1; }
  .qty-btn:hover { background:#FF6B3520; }
  .qty-num { font-family:'Bebas Neue',sans-serif; font-size:17px; color:var(--white); min-width:18px; text-align:center; }

  /* RESUMEN */
  .resumen-card { background:var(--card); border:1px solid #FF6B3520; border-radius:8px; overflow:hidden; position:sticky; top:80px; }
  .resumen-header { padding:14px 18px; border-bottom:1px solid #ffffff08; }
  .resumen-title { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:1px; color:var(--white); }
  .resumen-items { padding:12px 16px; min-height:100px; }
  .resumen-empty { color:var(--gray); font-size:12px; text-align:center; padding:24px 0; opacity:.6; line-height:1.6; }
  .resumen-item { display:flex; align-items:center; justify-content:space-between; padding:7px 0; border-bottom:1px solid #ffffff06; }
  .resumen-item-info { flex:1; }
  .resumen-item-name { font-size:12px; color:var(--white); }
  .resumen-item-qty { font-size:10px; color:var(--gray); margin-top:1px; }
  .resumen-item-price { font-family:'Bebas Neue',sans-serif; font-size:15px; color:var(--orange); margin:0 8px; }
  .resumen-item-del { background:none; border:none; color:var(--red); cursor:pointer; font-size:13px; opacity:.5; transition:opacity .15s; }
  .resumen-item-del:hover { opacity:1; }
  .resumen-total { padding:14px 18px; border-top:2px solid #FF6B3530; display:flex; align-items:center; justify-content:space-between; }
  .resumen-total-label { font-size:10px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; }
  .resumen-total-value { font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--yellow); }
  .resumen-actions { padding:0 16px 16px; display:flex; flex-direction:column; gap:8px; }

  /* ALERTA RESULTADO */
  .alerta { font-size:12px; padding:10px 12px; border-radius:5px; text-align:center; }
  .alerta-ok  { background:#4CAF5015; color:var(--green); border:1px solid #4CAF5040; }
  .alerta-err { background:#E6394615; color:var(--red);   border:1px solid #E6394640; }

  /* MENU VISTA */
  .menu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:12px; padding:16px; }
  .menu-item-card { background:var(--card2); border-radius:7px; border:1px solid #ffffff08; padding:14px; display:flex; flex-direction:column; gap:6px; }
  .menu-item-name { font-weight:600; font-size:13px; color:var(--white); }
  .menu-item-cat { font-size:10px; color:var(--gray); text-transform:uppercase; letter-spacing:1px; }
  .menu-item-price { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--orange); margin-top:4px; }

  /* TABLA VENTAS */
  .user-table { width:100%; border-collapse:collapse; }
  .user-table th { text-align:left; padding:10px 18px; font-size:10px; font-weight:600; color:var(--gray); letter-spacing:2px; text-transform:uppercase; border-bottom:1px solid #ffffff08; }
  .user-table td { padding:13px 18px; font-size:13px; color:var(--white); border-bottom:1px solid #ffffff05; }
  .user-table tr:last-child td { border-bottom:none; }
  .user-table tr:hover td { background:#FF6B3508; }
  
  `;

const fmt = (n) => `$${Number(n).toLocaleString("es-CO")}`;

// ── PÁGINAS ───────────────────────────────────────────────────────────────

function PaginaPedidos() {
  const [pedidos, setPedidos]     = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [moviendo, setMoviendo]   = useState(null);
  const [facturando, setFacturando] = useState(null);
  const [facturado, setFacturado]   = useState(null); // id del pedido recién facturado

  const cols = [
    { key: "recibido",    label: "Recibido",       color: "#4A90D9" },
    { key: "preparacion", label: "En Preparación", color: "#FF6B35" },
    { key: "listo",       label: "Listo",           color: "#4CAF50" },
    { key: "entregado",   label: "Entregado",       color: "#78909C" },
  ];

  const colKeys = cols.map(c => c.key);

  const cargarPedidos = () => {
    setCargando(true);
    axios.get("https://kitchen-manager-back-production.up.railway.app/empleado/pedidos")
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
      await axios.patch(`https://kitchen-manager-back-production.up.railway.app/empleado/pedido/${pedido.id}/estado`, {
        estado: colKeys[nuevoIdx],
      });
      setPedidos(prev =>
        prev.map(p => p.id === pedido.id ? { ...p, estado: colKeys[nuevoIdx] } : p)
      );
    } catch (err) { console.error(err); }
    finally { setMoviendo(null); }
  };

  const facturar = async (pedido) => {
    setFacturando(pedido.id);
    try {
      await axios.post(`https://kitchen-manager-back-production.up.railway.app/empleado/facturar/${pedido.id}`);
      //
      setFacturado(pedido.id);
      // quitar el mensaje de éxito después de 4s
      setTimeout(() => setFacturado(null), 4000);
    } catch (err) {
      console.error("Error al facturar:", err);
      alert("Error al generar la factura");
    } finally {
      setFacturando(null);
    }
  };

  const pedidosDeCol = (key) =>
    pedidos.filter(p => (p.estado || "recibido") === key);

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
                          if (mins > 30) return "#E63946";  // rojo — lleva mucho tiempo
                          if (mins > 15) return "#FFC300";  // amarillo — atención
                          return "var(--gray)";             // normal
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
                      </div>

                      <div style={{ marginTop:"8px", fontFamily:"'Bebas Neue',sans-serif", fontSize:"18px", color:"#FFC300" }}>
                        ${Number(p.total).toLocaleString("es-CO")}
                      </div>

                      {/* Mensaje de facturado exitoso */}
                      {facturado === p.id && (
                        <div style={{
                          marginTop:"8px", padding:"8px 10px",
                          background:"#4CAF5015", border:"1px solid #4CAF5040",
                          borderRadius:"5px", fontSize:"11px", color:"#4CAF50",
                          textAlign:"center", fontWeight:"600"
                        }}>
                          ✓ Facturado · revisa Mis Ventas
                        </div>
                      )}

                      {/* Controles */}
                      <div style={{ display:"flex", gap:"6px", marginTop:"10px" }}>
                        <button
                          onClick={() => mover(p, -1)}
                          disabled={colIdx === 0 || moviendo === p.id}
                          style={{
                            flex:1, padding:"6px",
                            background: colIdx === 0 ? "#ffffff05" : "#ffffff10",
                            border:"1px solid #ffffff15", borderRadius:"5px",
                            color: colIdx === 0 ? "#ffffff20" : "var(--gray)",
                            cursor: colIdx === 0 ? "not-allowed" : "pointer",
                            fontSize:"14px",
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
                              background: facturado === p.id
                                ? "#4CAF5020"
                                : "linear-gradient(135deg, #4CAF50, #81C784)",
                              border: facturado === p.id ? "1px solid #4CAF5040" : "none",
                              borderRadius:"5px",
                              color: facturado === p.id ? "#4CAF50" : "white",
                              cursor: facturado === p.id ? "default" : "pointer",
                              fontSize:"10px", fontWeight:"700",
                              letterSpacing:"1px", fontFamily:"'Bebas Neue',sans-serif",
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
                              background:`${col.color}20`,
                              border:`1px solid ${col.color}40`,
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

// helper para generar y abrir factura en nueva pestaña
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
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Factura #${venta.id?.slice(-6).toUpperCase()}</title>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:Arial,sans-serif; color:#222; padding:40px; max-width:600px; margin:0 auto; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; border-bottom:3px solid #FF6B35; padding-bottom:20px; }
    .brand { font-size:26px; font-weight:900; letter-spacing:2px; color:#1A1A2E; }
    .brand span { color:#FF6B35; }
    .info { text-align:right; font-size:13px; color:#666; }
    .info strong { font-size:18px; color:#1A1A2E; display:block; margin-bottom:4px; }
    .cliente-box { background:#f8f8f8; border-radius:8px; padding:16px 20px; margin-bottom:24px; display:flex; justify-content:space-between; }
    .cliente-box label { font-size:10px; font-weight:700; color:#999; letter-spacing:1px; text-transform:uppercase; display:block; margin-bottom:4px; }
    .cliente-box span { font-size:14px; color:#222; font-weight:600; }
    table { width:100%; border-collapse:collapse; }
    thead tr { background:#1A1A2E; color:white; }
    thead th { padding:10px 12px; text-align:left; font-size:11px; letter-spacing:1px; text-transform:uppercase; }
    tbody tr { border-bottom:1px solid #eee; }
    tbody td { padding:11px 12px; font-size:13px; }
    .total-box { background:#1A1A2E; color:white; border-radius:0 0 8px 8px; padding:14px 20px; display:flex; justify-content:space-between; align-items:center; }
    .total-box span { font-size:13px; letter-spacing:1px; text-transform:uppercase; opacity:.7; }
    .total-box strong { font-size:26px; color:#FFC300; }
    .footer { margin-top:32px; text-align:center; font-size:11px; color:#aaa; }
    .print-btn { margin-top:24px; text-align:center; }
    .print-btn button { padding:12px 32px; background:#FF6B35; color:white; border:none; border-radius:6px; font-size:14px; font-weight:700; cursor:pointer; }
    @media print { .print-btn { display:none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">KITCHEN<span> MANAGER</span></div>
      <div style="font-size:12px;color:#999;margin-top:4px;">Sistema de gestión</div>
    </div>
    <div class="info">
      <strong>FACTURA #${venta.id?.slice(-6).toUpperCase()}</strong>
      <div>${fecha}</div>
      <div>Fuente: ${venta.fuente}</div>
    </div>
  </div>
  <div class="cliente-box">
    <div><label>Cliente</label><span>${venta.nombreCliente}</span></div>
    <div style="text-align:right"><label>Estado</label><span style="color:#4CAF50">✓ Entregado</span></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th style="text-align:center">Cant.</th>
        <th style="text-align:right">Precio</th>
        <th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>
  <div class="total-box">
    <span>Total a pagar</span>
    <strong>$${Number(venta.total).toLocaleString("es-CO")}</strong>
  </div>
  <div class="footer">
    <p style="margin-bottom:4px">Gracias por su preferencia</p>
    <p>Kitchen Manager · ${new Date().getFullYear()}</p>
  </div>
  <div class="print-btn">
    <button onclick="window.print()">🖨 IMPRIMIR FACTURA</button>
  </div>
</body>
</html>`;

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
  const [resultado, setResultado]         = useState(null); // { ok, msg }

  useEffect(() => {
    axios.get("https://kitchen-manager-back-production.up.railway.app/empleado/verMenu")
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
      if (nueva <= 0) {
        const c = { ...prev };
        delete c[id];
        return c;
      }
      return { ...prev, [id]: nueva };
    });
  };

  const limpiar = () => {
    setCarrito({});
    setFuente("");
    setNombreCliente("");
    setNotas("");
    setResultado(null);
  };

  const itemsCarrito = menu
    .filter(p => carrito[p.id])
    .map(p => ({ ...p, cantidad: carrito[p.id], subtotal: p.precio * carrito[p.id] }));

  const total = itemsCarrito.reduce((acc, i) => acc + i.subtotal, 0);
  const puedeRegistrar = itemsCarrito.length > 0 && fuente && nombreCliente.trim();

  const handleRegistrar = async () => {
    setEnviando(true);
    setResultado(null);
    try {
      await axios.post("https://kitchen-manager-back-production.up.railway.app/empleado/registrarPedido", {
        fuente,
        nombreCliente,
        notas,
        total,
        itemsSeleccionados: itemsCarrito.map(i => ({
          id:        i.id,
          nombre:    i.nombre,
          categoria: i.categoria,
          precio:    i.precio,
          cantidad:  i.cantidad,
        })),
      });
      setResultado({ ok: true, msg: "✓ Pedido registrado correctamente" });
      limpiar();
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
        {/* ── COLUMNA IZQUIERDA ── */}
        <div>
          {/* Fuente + Cliente */}
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title">DATOS DEL PEDIDO</div>
            </div>

            <div className="form-section">
              <label className="form-label">¿De dónde viene?</label>
              <select
                className="form-select"
                value={fuente}
                onChange={e => setFuente(e.target.value)}
              >
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
              <input
                className="form-input"
                type="text"
                placeholder="ej: Carlos López"
                value={nombreCliente}
                onChange={e => setNombreCliente(e.target.value)}
              />
            </div>
          </div>

          {/* Productos */}
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title">SELECCIONAR PRODUCTOS</div>
            </div>
            <div className="form-section">
              {cargandoMenu ? (
                <div className="placeholder-content">
                  <div className="placeholder-text">Cargando productos...</div>
                </div>
              ) : menu.length === 0 ? (
                <div className="placeholder-content">
                  <div className="placeholder-icon">🍽️</div>
                  <div className="placeholder-text">No hay productos en el menú aún</div>
                </div>
              ) : (
                <div className="productos-grid">
                  {menu.map(prod => (
                    <div
                      key={prod.id}
                      className={`producto-btn ${carrito[prod.id] ? "seleccionado" : ""} ${!prod.disponible ? "agotado" : ""}`}
                      onClick={() => agregar(prod)}
                    >
                      <div className="prod-cat">{prod.categoria}</div>
                      <div className="prod-nombre">{prod.nombre}</div>
                      <div className="prod-precio">{fmt(prod.precio)}</div>
                      {!prod.disponible && (
                        <span className="badge badge-red" style={{ marginTop: 6 }}>Agotado</span>
                      )}
                      {carrito[prod.id] && (
                        <div
                          className="qty-control"
                          onClick={e => e.stopPropagation()}
                        >
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

          {/* Notas */}
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title">NOTAS ESPECIALES</div>
            </div>
            <div className="form-section">
              <textarea
                className="form-textarea"
                placeholder="Sin cebolla, extra salsa..."
                value={notas}
                onChange={e => setNotas(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── RESUMEN ── */}
        <div className="resumen-card">
          <div className="resumen-header">
            <div className="resumen-title">RESUMEN DEL PEDIDO</div>
          </div>

          <div className="resumen-items">
            {itemsCarrito.length === 0 ? (
              <div className="resumen-empty">
                Selecciona productos<br />del menú para comenzar
              </div>
            ) : (
              itemsCarrito.map(item => (
                <div className="resumen-item" key={item.id}>
                  <div className="resumen-item-info">
                    <div className="resumen-item-name">{item.nombre}</div>
                    <div className="resumen-item-qty">{item.cantidad} × {fmt(item.precio)}</div>
                  </div>
                  <div className="resumen-item-price">{fmt(item.subtotal)}</div>
                  <button
                    className="resumen-item-del"
                    onClick={() => cambiar(item.id, -item.cantidad)}
                  >✕</button>
                </div>
              ))
            )}
          </div>

          {/* Fuente y cliente en resumen */}
          {(fuente || nombreCliente) && (
            <div style={{ padding: "10px 16px", borderTop: "1px solid #ffffff08", fontSize: "11px", color: "var(--gray)", display: "flex", flexDirection: "column", gap: "4px" }}>
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

            <button className="btn-secondary" onClick={limpiar}>
              LIMPIAR
            </button>

            {resultado && (
              <div className={`alerta ${resultado.ok ? "alerta-ok" : "alerta-err"}`}>
                {resultado.msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaginaMenu() {
  const [menu, setMenu]           = useState([]);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    axios.get("https://kitchen-manager-back-production.up.railway.app/empleado/verMenu")
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
        <div className="section-card-header">
          <div className="section-card-title">PRODUCTOS ({menu.length})</div>
        </div>

        {cargando ? (
          <div className="placeholder-content">
            <div className="placeholder-text">Cargando productos...</div>
          </div>
        ) : menu.length === 0 ? (
          <div className="placeholder-content">
            <div className="placeholder-icon">🍽️</div>
            <div className="placeholder-text">No hay productos en el menú aún</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: "12px", padding: "16px" }}>
            {menu.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card2)",
                  borderRadius: "7px",
                  border: `1px solid ${item.disponible ? "#4CAF5020" : "#E6394620"}`,
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--white)" }}>{item.nombre}</div>
                  <span className={`badge ${item.disponible ? "badge-green" : "badge-red"}`}>
                    {item.disponible ? "Activo" : "Agotado"}
                  </span>
                </div>
                <div style={{ fontSize: "10px", color: "var(--gray)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {item.categoria}
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "20px", color: "var(--orange)", marginTop: "4px" }}>
                  {fmt(item.precio)}
                </div>
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
    axios.get("https://kitchen-manager-back-production.up.railway.app/empleado/ventas")
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
  const fmt = n => `$${Number(n).toLocaleString("es-CO")}`;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">MIS VENTAS</div>
        <div className="page-subtitle">Ventas facturadas registradas en el sistema</div>
      </div>

      <div className="stats-grid">
        {[
          { label:"Ventas hoy",    value: fmt(ventasHoy),    color:"#4CAF50", icon:"💰" },
          { label:"Esta semana",   value: fmt(ventasSemana), color:"#FF6B35", icon:"📊" },
          { label:"Este mes",      value: fmt(ventasMes),    color:"#4A90D9", icon:"📈" },
          { label:"Total facturas",value: ventas.length,     color:"#FFC300", icon:"🧾" },
        ].map((s,i) => (
          <div className="stat-card" key={i} style={{ borderTop:`2px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color:s.color, fontSize:"28px" }}>{s.value}</div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <div className="section-card-title">FACTURAS EMITIDAS ({ventas.length})</div>
        </div>

        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando ventas...</div></div>
        ) : ventas.length === 0 ? (
          <div className="placeholder-content">
            <div className="placeholder-icon">🧾</div>
            <div className="placeholder-text">
              No hay ventas aún.<br/>Cuando factures un pedido entregado, aparecerá aquí.
            </div>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Cliente</th>
                <th>Fuente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ventas.slice().reverse().map((v, i) => (
                <tr key={i}>
                  <td style={{ color:"var(--orange)", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"1px" }}>
                    #{v.id?.slice(-6).toUpperCase()}
                  </td>
                  <td>👤 {v.nombreCliente}</td>
                  <td><span className="badge badge-orange">{v.fuente}</span></td>
                  <td style={{ fontSize:"11px", opacity:.8 }}>
                    {v.itemsVendidos?.map(it => `${it.cantidad}× ${it.nombre}`).join(", ")}
                  </td>
                  <td style={{ color:"#FFC300", fontWeight:"600", fontFamily:"'Bebas Neue',sans-serif", fontSize:"16px" }}>
                    {fmt(v.total)}
                  </td>
                  <td style={{ color:"var(--gray)", fontSize:"12px" }}>
                    {new Date(v.fecha).toLocaleString("es-CO", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}
                  </td>
                  <td>
                    <button
                      onClick={() => generarFacturaHTML(v)}
                      style={{
                        padding:"5px 12px",
                        background:"#FF6B3515", border:"1px solid #FF6B3540",
                        borderRadius:"5px", color:"var(--orange)",
                        cursor:"pointer", fontSize:"11px", fontWeight:"600",
                        whiteSpace:"nowrap"
                      }}
                    >
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

// ── NAV ───────────────────────────────────────────────────────────────────
const NAV = [
  { key: "pedidos", label: "Panel de Pedidos", icon: "📦", section: "COCINA" },
  { key: "nuevo",   label: "Nuevo Pedido",      icon: "➕", section: "COCINA" },
  { key: "menu",    label: "Ver Menú",           icon: "🍽️", section: "COCINA" },
  { key: "ventas",  label: "Mis Ventas",         icon: "💰", section: "REGISTRO" },
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
      default:        return <PaginaPedidos />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="emp-root">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🔥</div>
            <div className="sidebar-logo-name">Kitchen Manager</div>
            <div className="sidebar-logo-sub">Panel Empleado</div>
          </div>
          <nav className="sidebar-nav">
            {sections.map(section => (
              <div key={section}>
                <div className="nav-section-label">{section}</div>
                {NAV.filter(n => n.section === section).map(item => (
                  <div
                    key={item.key}
                    className={`nav-item ${activePage === item.key ? "active" : ""}`}
                    onClick={() => setActivePage(item.key)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="btn-logout" onClick={() => {
                localStorage.removeItem("username");
                localStorage.removeItem("role");
                window.location.href = "/";
              }}>
              <span>🚪</span> Cerrar Sesión
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
          <div className="content" key={activePage}>
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}