import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import * as XLSX from "xlsx";
import QRCode from 'react-qr-code';




const BASE = "https://kitchen-manager-back.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizingc: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0C0E14;
    --card:    #10131C;
    --card2:   #141720;
    --gold:    #C8892A;
    --gold2:   #E8A830;
    --white:   #F2EDE4;
    --gray:    rgba(232,230,223,0.45);
    --border:  rgba(255,255,255,0.07);
    --sidebar: 240px;
  }

  .admin-root {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--white);
  }

  .sidebar {
    width: var(--sidebar);
    background: var(--card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
  }

  .sidebar-logo {
    padding: 28px 20px 24px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
  }
  .sidebar-logo-icon svg { width: 22px; height: 22px; fill: #0C0E14; }

  .sidebar-logo-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; letter-spacing: 0.03em;
    color: var(--white); line-height: 1;
  }

  .sidebar-logo-sub {
    font-size: 9px; color: var(--gray);
    letter-spacing: 2px; text-transform: uppercase; margin-top: 3px;
  }

  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex; flex-direction: column; gap: 4px;
    overflow-y: auto;
  }

  .nav-section-label {
    font-size: 9px; font-weight: 600;
    color: var(--gray); letter-spacing: 2px;
    text-transform: uppercase;
    padding: 12px 8px 6px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    font-size: 13px; font-weight: 500;
    color: var(--gray);
    border: 1px solid transparent;
    user-select: none;
  }

  .nav-item:hover { background: rgba(200,137,42,0.08); color: var(--white); }

  .nav-item.active {
    background: rgba(200,137,42,0.1);
    border-color: rgba(200,137,42,0.2);
    color: var(--gold);
  }

  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid var(--border);
  }

  .btn-logout {
    width: 100%;
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px;
    background: rgba(230,57,70,0.08);
    border: 1px solid rgba(230,57,70,0.2);
    border-radius: 6px;
    color: #E63946;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-logout:hover { background: rgba(230,57,70,0.15); }

  .main {
    margin-left: var(--sidebar);
    flex: 1;
    display: flex; flex-direction: column;
    min-height: 100vh;
  }

  .topbar {
    background: var(--card);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }

  .topbar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 600; letter-spacing: 0.02em;
    color: var(--white);
  }

  .topbar-right { display: flex; align-items: center; gap: 14px; }
  .topbar-user  { display: flex; align-items: center; gap: 10px; }

  .topbar-avatar {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: var(--bg);
  }

  .topbar-username { font-size: 13px; font-weight: 500; color: var(--white); }
  .topbar-role     { font-size: 10px; color: var(--gold); letter-spacing: 1px; text-transform: uppercase; }

  .content {
    flex: 1; padding: 32px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .page-header   { margin-bottom: 28px; }
  .page-title    { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600; letter-spacing: 0.02em; color: var(--white); }
  .page-subtitle { font-size: 13px; color: var(--gray); margin-top: 4px; }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px; margin-bottom: 28px;
  }

  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    position: relative; overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
  }

  .stat-label  { font-size: 10px; font-weight: 600; color: var(--gray); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  .stat-value  { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: var(--white); line-height: 1; }
  .stat-sub    { font-size: 11px; color: var(--gold); margin-top: 4px; }
  .stat-icon   { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 36px; opacity: 0.08; }

  .section-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden; margin-bottom: 20px;
  }

  .section-card-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }

  .section-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; letter-spacing: 0.02em;
    color: var(--white);
  }

  .btn-primary {
    padding: 8px 16px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border: none; border-radius: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    color: var(--bg); cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .placeholder-content {
    padding: 48px 20px;
    text-align: center; color: var(--gray);
    font-size: 13px;
  }

  .placeholder-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.3; }
  .placeholder-text { color: var(--gray); }

  .badge {
    display: inline-block;
    padding: 2px 8px; border-radius: 20px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .badge-green  { background: rgba(76,175,80,0.12);  color: #6fcf74; border: 1px solid rgba(76,175,80,0.25); }
  .badge-red    { background: rgba(230,57,70,0.1);   color: #E63946; border: 1px solid rgba(230,57,70,0.25); }
  .badge-orange { background: rgba(200,137,42,0.12); color: var(--gold); border: 1px solid rgba(200,137,42,0.25); }

  .user-table { width: 100%; border-collapse: collapse; }
  .user-table th {
    text-align: left;
    padding: 10px 20px;
    font-size: 10px; font-weight: 600;
    color: var(--gray); letter-spacing: 2px;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }
  .user-table td {
    padding: 14px 20px;
    font-size: 13px; color: var(--white);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .user-table tr:last-child td { border-bottom: none; }
  .user-table tr:hover td { background: rgba(200,137,42,0.04); }

  .user-avatar {
    width: 30px; height: 30px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--bg);
    margin-right: 10px; vertical-align: middle;
  }
`;


function RegistrarEmpleado({ onEmpleadoCreado }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmate, setPasswordConfirmate] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // DEFINIR LOS ESTILOS AQUÍ DENTRO
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "6px",
    border: "1px solid rgba(200,137,42,0.25)", background: "#0C0E14",
    color: "#F2EDE4", fontSize: "13px", fontFamily: "DM Sans, sans-serif", outline: "none",
  };
  
  const labelStyle = {
    fontSize: "10px", fontWeight: "600", color: "rgba(232,230,223,0.45)",
    letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px", display: "block",
  };

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    
    if (password !== passwordConfirmate) {
      setMensaje("✗ Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(`${BASE}/admin/agregarEmpleado`,   
        { username, password },
        { headers: authHeader() }
      );
      setMensaje("✓ Empleado creado exitosamente");
      setUsername("");
      setPassword("");
      setPasswordConfirmate("");
      if (onEmpleadoCreado) onEmpleadoCreado();
    } catch (error) {
      console.error(error);
      setMensaje("✗ Error al crear el empleado: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={manejarRegistro} style={{ padding:"24px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", gap:"16px", background:"#141720" }}>
      <div style={{ fontSize:"13px", fontWeight:"600", color:"#F2EDE4", marginBottom:"4px" }}>Nuevo empleado</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
        <div>
          <label style={labelStyle}>Nombre del empleado</label>
          <input style={inputStyle} type="text" placeholder="ej: Juan Rodriguez" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Contraseña</label>
          <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Confirmar contraseña</label>
          <input style={inputStyle} type="password" placeholder="••••••••" value={passwordConfirmate} onChange={(e) => setPasswordConfirmate(e.target.value)} required />
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
        <button type="submit" className="btn-primary" disabled={loading} style={{ padding:"10px 24px" }}>
          {loading ? "Registrando..." : "Registrar Empleado"}
        </button>
        {mensaje && <span style={{ fontSize:"13px", color: mensaje.includes("✓") ? "#6fcf74" : "#E63946" }}>{mensaje}</span>}
      </div>
    </form>
  );
}
// ────────────── FORMULARIO REGISTRAR USUARIO ─────────────────────────────────────────
function RegistrarUsuario({ onUsuarioCreado }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState("EMPLEADO");
  const [passwordConfirmate, setPasswordConfirmate] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // DEFINIR LOS ESTILOS
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "6px",
    border: "1px solid rgba(200,137,42,0.25)", background: "#0C0E14",
    color: "#F2EDE4", fontSize: "13px", fontFamily: "DM Sans, sans-serif", outline: "none",
  };
  
  const labelStyle = {
    fontSize: "10px", fontWeight: "600", color: "rgba(232,230,223,0.45)",
    letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px", display: "block",
  };

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    
    if (password !== passwordConfirmate) {
      setMensaje("✗ Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(`${BASE}/admin/agregarUsuario`,  // ← Nota: es agregarUsuario, no Usuario
        { username, password, roles: [roles] },
        { headers: authHeader() }
      );
      setMensaje("✓ Usuario creado exitosamente");
      setUsername("");
      setPassword("");
      setPasswordConfirmate("");
      setRoles("EMPLEADO");
      if (onUsuarioCreado) onUsuarioCreado();
    } catch (error) {
      console.error(error);
      setMensaje("✗ Error al crear el usuario: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={manejarRegistro} style={{ padding:"24px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", gap:"16px", background:"#141720" }}>
      <div style={{ fontSize:"13px", fontWeight:"600", color:"#F2EDE4", marginBottom:"4px" }}>Nuevo usuario</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
        <div>
          <label style={labelStyle}>Nombre de usuario</label>
          <input style={inputStyle} type="text" placeholder="ej: juan123" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Rol</label>
          <select style={{ ...inputStyle, cursor:"pointer" }} value={roles} onChange={(e) => setRoles(e.target.value)}>
            <option value="EMPLEADO">Empleado</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Contraseña</label>
          <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Confirmar contraseña</label>
          <input style={inputStyle} type="password" placeholder="••••••••" value={passwordConfirmate} onChange={(e) => setPasswordConfirmate(e.target.value)} required />
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
        <button type="submit" className="btn-primary" disabled={loading} style={{ padding:"10px 24px" }}>
          {loading ? "Registrando..." : "Registrar Usuario"}
        </button>
        {mensaje && <span style={{ fontSize:"13px", color: mensaje.includes("✓") ? "#6fcf74" : "#E63946" }}>{mensaje}</span>}
      </div>
    </form>
  );
}
function generarFacturaHTML(venta) {
  const fecha = new Date(venta.fecha).toLocaleString("es-CO", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
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

// ── PÁGINAS ───────────────────────────────────────────────────────────────

function PaginaInicio({ username }) {
  const [stats, setStats] = useState({ pedidosHoy: 0, ventasHoy: 0, productos: 0, empleados: 0 });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [graficaData, setGraficaData]         = useState([]);
  const [rango, setRango]                     = useState(7);
  const [cargando, setCargando]               = useState(true);
  const [todasVentas, setTodasVentas]         = useState([]);

  useEffect(() => {
    const hoy = new Date().toDateString();
    Promise.all([
      axios.get(`${BASE}/admin/verPedidos`),
      axios.get(`${BASE}/admin/ventas`),
      axios.get(`${BASE}/admin/verMenu`),
      axios.get(`${BASE}/admin/Meseros`),
    ]).then(([pedidos, ventas, menu, empleados]) => {
      const pedidosHoy = pedidos.data.filter(p => new Date(p.fecha).toDateString() === hoy).length;
      const ventasHoy  = ventas.data.filter(v => new Date(v.fecha).toDateString() === hoy).reduce((a, v) => a + v.total, 0);
      setStats({ pedidosHoy, ventasHoy, productos: menu.data.length, empleados: empleados.data.length });
      setVentasRecientes(ventas.data.slice().reverse().slice(0, 5));
      setTodasVentas(ventas.data);
    }).catch(err => console.error(err)).finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    const dias = [];
    for (let i = rango - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("es-CO", { day:"2-digit", month:"2-digit" });
      const dateStr = d.toDateString();
      const total = todasVentas.filter(v => new Date(v.fecha).toDateString() === dateStr).reduce((a, v) => a + v.total, 0);
      dias.push({ dia: label, total });
    }
    setGraficaData(dias);
  }, [rango, todasVentas]);

  const fmt = n => `$${Number(n).toLocaleString("es-CO")}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background:"#10131C", border:"1px solid rgba(200,137,42,0.2)", borderRadius:"8px", padding:"10px 14px", fontSize:"12px" }}>
          <div style={{ color:"rgba(232,230,223,0.45)", marginBottom:"4px" }}>{label}</div>
          <div style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontWeight:"700", fontSize:"18px" }}>{fmt(payload[0].value)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">BIENVENIDO, {username?.toUpperCase()}</div>
        <div className="page-subtitle">Resumen general del sistema — hoy</div>
      </div>
      <div className="stats-grid">
        {[
          { label:"Pedidos hoy",  value: cargando ? "..." : stats.pedidosHoy,     sub:"Registrados hoy", icon:"📦" },
          { label:"Ventas hoy",   value: cargando ? "..." : fmt(stats.ventasHoy), sub:"Facturado hoy",   icon:"💰" },
          { label:"Productos",    value: cargando ? "..." : stats.productos,       sub:"En el menú",      icon:"🍽️" },
          { label:"Empleados",    value: cargando ? "..." : stats.empleados,       sub:"Registrados",     icon:"👤" },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>
      <div className="section-card" style={{ marginBottom:"20px" }}>
        <div className="section-card-header">
          <div className="section-card-title">VENTAS POR DÍA</div>
          <div style={{ display:"flex", gap:"8px" }}>
            {[7, 30].map(r => (
              <button key={r} onClick={() => setRango(r)} style={{
                padding:"5px 14px",
                background: rango === r ? "linear-gradient(135deg,#C8892A,#E8A830)" : "transparent",
                border: rango === r ? "none" : "1px solid rgba(255,255,255,0.12)",
                borderRadius:"5px", color: rango === r ? "#0C0E14" : "rgba(232,230,223,0.45)",
                cursor:"pointer", fontSize:"11px", fontWeight:"700", fontFamily:"'DM Sans',sans-serif", letterSpacing:"1px",
              }}>{r} DÍAS</button>
            ))}
          </div>
        </div>
        <div style={{ padding:"20px 16px 8px" }}>
          {cargando ? (
            <div className="placeholder-content"><div className="placeholder-text">Cargando datos...</div></div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={graficaData} margin={{ top:4, right:8, left:8, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="dia" tick={{ fill:"rgba(232,230,223,0.4)", fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"rgba(232,230,223,0.4)", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? "0" : `$${(v/1000).toFixed(0)}k`} width={42} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(200,137,42,0.06)" }} />
                <Bar dataKey="total" fill="url(#barGradient)" radius={[4,4,0,0]} maxBarSize={40} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8892A" />
                    <stop offset="100%" stopColor="#E8A830" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="section-card">
        <div className="section-card-header"><div className="section-card-title">VENTAS RECIENTES</div></div>
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando actividad...</div></div>
        ) : ventasRecientes.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">📋</div><div className="placeholder-text">Aquí aparecerán los últimos pedidos y ventas del día</div></div>
        ) : (
          <table className="user-table">
            <thead><tr><th>Factura</th><th>Cliente</th><th>Fuente</th><th>Productos</th><th>Total</th><th>Hora</th></tr></thead>
            <tbody>
              {ventasRecientes.map((v, i) => (
                <tr key={i}>
                  <td style={{ color:"var(--gold)", fontFamily:"'Cormorant Garamond',serif", fontSize:"15px", fontWeight:"600" }}>#{v.id?.slice(-6).toUpperCase()}</td>
                  <td>👤 {v.nombreCliente}</td>
                  <td><span className="badge badge-orange">{v.fuente}</span></td>
                  <td style={{ fontSize:"11px", opacity:.8 }}>{v.itemsVendidos?.map(it => `${it.cantidad}× ${it.nombre}`).join(", ")}</td>
                  <td style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", fontWeight:"700" }}>{fmt(v.total)}</td>
                  <td style={{ color:"var(--gray)", fontSize:"12px" }}>{new Date(v.fecha).toLocaleTimeString("es-CO", { hour:"2-digit", minute:"2-digit" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── PAGINA MENU ───────────────────────────────────────────────────────────
function PaginaMenu() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [mensaje, setMensaje]     = useState("");
  const [loading, setLoading]     = useState(false);
  //  Se agrega imagen al estado del formulario
  const [form, setForm]           = useState({ nombre: "", categoria: "", precio: "", imagen: "" });
  const [editId, setEditId]       = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [editando, setEditando]   = useState(false);
  const [confirmElimId, setConfirmElimId] = useState(null);
  const [eliminando, setEliminando]       = useState(null);
  //  Estados para manejar la subida de imagen
  const [subiendoImagen, setSubiendoImagen]       = useState(false);
  const [subiendoImagenEdit, setSubiendoImagenEdit] = useState(false);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const inputStyle = {
    width:"100%", padding:"10px 14px", borderRadius:"6px",
    border:"1px solid rgba(200,137,42,0.25)", background:"#0C0E14",
    color:"#F2EDE4", fontSize:"13px", fontFamily:"DM Sans, sans-serif", outline:"none",
  };
  const labelStyle = {
    fontSize:"10px", fontWeight:"600", color:"rgba(232,230,223,0.45)",
    letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"6px", display:"block",
  };
  const smallInput = { ...inputStyle, padding:"7px 10px", fontSize:"12px" };

  const cargarProductos = async () => {
    setCargando(true);
    try { const res = await axios.get(`${BASE}/admin/verMenu`); setProductos(res.data); }
    catch (e) { console.error(e); } finally { setCargando(false); }
  };

  useEffect(() => { cargarProductos(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  //  Función para subir imagen al backend y obtener la URL
  const subirImagen = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`${BASE}/admin/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${localStorage.getItem("token")}`}
    });
    return res.data.url; // ej: "/imagenes/1234567890_foto.jpg"
  };

  // maneja la selección de imagen en el formulario de AGREGAR
  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendoImagen(true);
    try {
      const url = await subirImagen(file);
      setForm(prev => ({ ...prev, imagen: url }));
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    } finally {
      setSubiendoImagen(false);
    }
  };

  //  Manejar la selección de imagen en el formulario de editar
  const handleImagenEditChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendoImagenEdit(true);
    try {
      const url = await subirImagen(file);
      setEditForm(prev => ({ ...prev, imagen: url }));
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    } finally {
      setSubiendoImagenEdit(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    try {
      // se incluye "imagen" en el objeto enviado al backend
      await axios.post(`${BASE}/admin/agregarMenu`,
        { ...form, precio: parseFloat(form.precio), disponible: true }
      );
      setMensaje("✓ Producto agregado correctamente");
      setForm({ nombre: "", categoria: "", precio: "", imagen: "" });
      cargarProductos();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error:", error);
      setMensaje("✗ Error al agregar el producto: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const abrirEdicion = (p) => {
    setEditId(p.id);
    // Se incluye "imagen" en el estado de edición
    setEditForm({ nombre: p.nombre, categoria: p.categoria, precio: p.precio, disponible: p.disponible, imagen: p.imagen || "" });
  };

  const guardarEdicion = async (id) => {
    setEditando(true);
    try {
      // Se incluye "imagen" en el PUT
      await axios.put(`${BASE}/admin/menu/${id}`,
        { ...editForm, precio: parseFloat(editForm.precio) },
        { headers: authHeader() }
      );
      cargarProductos();
      setEditId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setEditando(false);
    }
  };

  const eliminar = async (id) => {
    setEliminando(id);
    try {
      await axios.delete(`${BASE}/admin/menu/${id}`);
      setProductos(prev => prev.filter(p => p.id !== id)); setConfirmElimId(null);
    } catch (e) { console.error(e); } finally { setEliminando(null); }
  };

  const categorias = ["Platos", "Bebidas", "Entradas", "Postres"];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">GESTIÓN DEL MENÚ</div>
        <div className="page-subtitle">Administra los productos disponibles</div>
      </div>
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-card-title">PRODUCTOS ({productos.length})</div>
          <button className="btn-primary" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            {mostrarFormulario ? "✕ CANCELAR" : "+ AGREGAR PRODUCTO"}
          </button>
        </div>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit} style={{ padding:"24px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", gap:"16px", background:"#141720" }}>
            <div style={{ fontSize:"13px", fontWeight:"600", color:"#F2EDE4" }}>Nuevo producto</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px" }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input style={inputStyle} name="nombre" placeholder="ej: Bandeja Paisa" value={form.nombre} onChange={handleChange} required />
              </div>
              <div>
                <label style={labelStyle}>Categoría</label>
                <select style={{ ...inputStyle, cursor:"pointer" }} name="categoria" value={form.categoria} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Precio ($)</label>
                <input style={inputStyle} name="precio" type="number" placeholder="ej: 25000" value={form.precio} onChange={handleChange} required />
              </div>
            </div>
            {/* Campo de imagen en formulario de agregar */}
            <div>
              <label style={labelStyle}>Imagen del producto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                style={{ ...inputStyle, padding:"8px", cursor:"pointer" }}
              />
              {subiendoImagen && (
                <span style={{ fontSize:"11px", color:"var(--gold)", marginTop:"4px", display:"block" }}>⏳ Subiendo imagen...</span>
              )}
              {form.imagen && !subiendoImagen && (
                <div style={{ marginTop:"8px", display:"flex", alignItems:"center", gap:"10px" }}>
                  <img
                    src={`${BASE}${form.imagen}`}
                    alt="Preview"
                    style={{ width:"60px", height:"60px", objectFit:"cover", borderRadius:"6px", border:"1px solid rgba(200,137,42,0.25)" }}
                  />
                  <span style={{ fontSize:"11px", color:"#6fcf74" }}>✓ Imagen lista</span>
                </div>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <button type="submit" className="btn-primary" disabled={loading || subiendoImagen} style={{ padding:"10px 24px" }}>
                {loading ? "Guardando..." : "Guardar Producto"}
              </button>
              {mensaje && <span style={{ fontSize:"13px", color: mensaje.includes("✓") ? "#6fcf74" : "#E63946" }}>{mensaje}</span>}
            </div>
          </form>
        )}

        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando productos...</div></div>
        ) : productos.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">🍽️</div><div className="placeholder-text">Empieza agregando tu primer producto</div></div>
        ) : (
          <table className="user-table">
            {/*  Se agrega columna "Imagen" */}
            <thead><tr><th>Imagen</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  {editId === p.id ? (
                    <>
                      {/*  Celda de imagen en modo edición */}
                      <td>
                        <div>
                          {editForm.imagen && (
                            <img
                              src={`${BASE}${editForm.imagen}`}
                              alt="img"
                              style={{ width:"44px", height:"44px", objectFit:"cover", borderRadius:"5px", border:"1px solid rgba(200,137,42,0.2)", marginBottom:"4px", display:"block" }}
                            />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagenEditChange}
                            style={{ fontSize:"10px", color:"var(--gray)", cursor:"pointer", width:"90px" }}
                          />
                          {subiendoImagenEdit && (
                            <span style={{ fontSize:"10px", color:"var(--gold)" }}>Subiendo...</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <input style={smallInput} value={editForm.nombre} onChange={e => setEditForm({ ...editForm, nombre: e.target.value })} />
                      </td>
                      <td>
                        <select style={{ ...smallInput, cursor:"pointer" }} value={editForm.categoria} onChange={e => setEditForm({ ...editForm, categoria: e.target.value })}>
                          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td>
                        <input style={{ ...smallInput, width:"110px" }} type="number" value={editForm.precio} onChange={e => setEditForm({ ...editForm, precio: e.target.value })} />
                      </td>
                      <td>
                        <select style={{ ...smallInput, cursor:"pointer", width:"120px" }} value={editForm.disponible ? "true" : "false"} onChange={e => setEditForm({ ...editForm, disponible: e.target.value === "true" })}>
                          <option value="true">Disponible</option>
                          <option value="false">Agotado</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:"6px" }}>
                          <button onClick={() => guardarEdicion(p.id)} disabled={editando || subiendoImagenEdit} style={{ padding:"5px 12px", background:"rgba(76,175,80,0.1)", border:"1px solid rgba(76,175,80,0.25)", borderRadius:"4px", color:"#6fcf74", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>{editando ? "..." : "✓ Guardar"}</button>
                          <button onClick={() => setEditId(null)} style={{ padding:"5px 10px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"4px", color:"var(--gray)", cursor:"pointer", fontSize:"11px" }}>Cancelar</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Celda de imagen en modo visualización */}
                      <td>
                        {p.imagen ? (
                          <img
                            src={`${BASE}${p.imagen}`}
                            alt={p.nombre}
                            style={{ width:"44px", height:"44px", objectFit:"cover", borderRadius:"6px", border:"1px solid rgba(200,137,42,0.2)" }}
                          />
                        ) : (
                          <div style={{ width:"44px", height:"44px", borderRadius:"6px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>
                            🍽️
                          </div>
                        )}
                      </td>
                      <td>{p.nombre}</td>
                      <td><span className="badge badge-orange">{p.categoria}</span></td>
                      <td style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", fontWeight:"700" }}>${p.precio?.toLocaleString()}</td>
                      <td><span className={`badge ${p.disponible ? "badge-green" : "badge-red"}`}>{p.disponible ? "Disponible" : "Agotado"}</span></td>
                      <td>
                        {confirmElimId === p.id ? (
                          <div style={{ display:"flex", gap:"6px" }}>
                            <button onClick={() => eliminar(p.id)} disabled={eliminando === p.id} style={{ padding:"4px 10px", background:"rgba(230,57,70,0.1)", border:"1px solid rgba(230,57,70,0.25)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>{eliminando === p.id ? "..." : "Confirmar"}</button>
                            <button onClick={() => setConfirmElimId(null)} style={{ padding:"4px 10px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"4px", color:"var(--gray)", cursor:"pointer", fontSize:"11px" }}>Cancelar</button>
                          </div>
                        ) : (
                          <div style={{ display:"flex", gap:"6px" }}>
                            <button onClick={() => abrirEdicion(p)} style={{ padding:"4px 10px", background:"rgba(91,155,213,0.1)", border:"1px solid rgba(91,155,213,0.25)", borderRadius:"4px", color:"#5B9BD5", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>✏️ Editar</button>
                            <button onClick={() => setConfirmElimId(p.id)} style={{ padding:"4px 10px", background:"rgba(230,57,70,0.08)", border:"1px solid rgba(230,57,70,0.2)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>🗑 Borrar</button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PaginaPedidos() {
  const [pedidos, setPedidos]       = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [confirmId, setConfirmId]   = useState(null);
  const [eliminando, setEliminando] = useState(null);

  const cargarPedidos = () => {
    setCargando(true);
    axios.get(`${BASE}/admin/verPedidos`)
      .then(res => setPedidos(res.data)).catch(err => console.error(err)).finally(() => setCargando(false));
  };

  useEffect(() => { cargarPedidos(); const iv = setInterval(cargarPedidos, 30000); return () => clearInterval(iv); }, []);

  const eliminar = async (id) => {
    setEliminando(id);
    try {
      await axios.delete(`${BASE}/admin/pedido/${id}`);
      setPedidos(prev => prev.filter(p => p.id !== id)); setConfirmId(null);
    } catch (e) { console.error(e); } finally { setEliminando(null); }
  };

  const colores = { recibido:"#4A90D9", preparacion:"#C8892A", listo:"#6fcf74", entregado:"rgba(232,230,223,0.35)" };
  const labels  = { recibido:"Recibido", preparacion:"En Preparación", listo:"Listo", entregado:"Entregado" };
  const badgeCls= { recibido:"badge-orange", preparacion:"badge-orange", listo:"badge-green", entregado:"badge-red" };
  const count   = (k) => pedidos.filter(p => (p.estado || "recibido") === k).length;

  return (
    <div>
      <div className="page-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div className="page-title">PANEL DE PEDIDOS</div>
          <div className="page-subtitle">Todos los pedidos activos en tiempo real</div>
        </div>
        <button className="btn-primary" onClick={cargarPedidos}>⟳ ACTUALIZAR</button>
      </div>
      <div className="stats-grid">
        {[
          { label:"Recibidos",      key:"recibido",    color:"#4A90D9" },
          { label:"En preparación", key:"preparacion", color:"#C8892A" },
          { label:"Listos",         key:"listo",       color:"#6fcf74" },
          { label:"Entregados",     key:"entregado",   color:"rgba(232,230,223,0.35)" },
        ].map((s,i) => (
          <div className="stat-card" key={i} style={{ borderTop:`2px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color:s.color }}>{cargando ? "..." : count(s.key)}</div>
          </div>
        ))}
      </div>
      <div className="section-card">
        <div className="section-card-header"><div className="section-card-title">PEDIDOS REGISTRADOS ({pedidos.length})</div></div>
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando pedidos...</div></div>
        ) : pedidos.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">📦</div><div className="placeholder-text">No hay pedidos activos en este momento</div></div>
        ) : (
          <table className="user-table">
            <thead><tr><th>ID</th><th>Cliente</th><th>Fuente</th><th>Productos</th><th>Total</th><th>Estado</th><th>Hora</th><th></th></tr></thead>
            <tbody>
              {pedidos.slice().reverse().map((p, i) => (
                <tr key={i}>
                  <td style={{ color:"var(--gold)", fontFamily:"'Cormorant Garamond',serif", fontSize:"15px", fontWeight:"600" }}>#{p.id?.slice(-5).toUpperCase()}</td>
                  <td>👤 {p.nombreCliente}</td>
                  <td><span className="badge badge-orange">{p.fuente}</span></td>
                  <td style={{ fontSize:"11px", opacity:.8, maxWidth:"180px" }}>{p.itemsSeleccionados?.map(it => `${it.cantidad}× ${it.nombre}`).join(", ")}</td>
                  <td style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontWeight:"700", fontSize:"17px" }}>${Number(p.total).toLocaleString("es-CO")}</td>
                  <td>
                    <span className={`badge ${badgeCls[p.estado || "recibido"]}`}
                      style={{ color: colores[p.estado || "recibido"], borderColor: colores[p.estado || "recibido"] + "40", background: colores[p.estado || "recibido"] + "15" }}>
                      {labels[p.estado || "recibido"]}
                    </span>
                  </td>
                  <td style={{ color:"var(--gray)", fontSize:"12px" }}>{new Date(p.fecha).toLocaleTimeString("es-CO", { hour:"2-digit", minute:"2-digit" })}</td>
                  <td>
                    {confirmId === p.id ? (
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button onClick={() => eliminar(p.id)} disabled={eliminando === p.id} style={{ padding:"4px 10px", background:"rgba(230,57,70,0.1)", border:"1px solid rgba(230,57,70,0.25)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>{eliminando === p.id ? "..." : "Confirmar"}</button>
                        <button onClick={() => setConfirmId(null)} style={{ padding:"4px 10px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"4px", color:"var(--gray)", cursor:"pointer", fontSize:"11px" }}>Cancelar</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(p.id)} style={{ padding:"4px 10px", background:"rgba(230,57,70,0.08)", border:"1px solid rgba(230,57,70,0.2)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>🗑 Borrar</button>
                    )}
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

function exportarExcel(ventas) {
  const filas = ventas.slice().reverse().map(v => ({
    "Factura":   `#${v.id?.slice(-6).toUpperCase()}`,
    "Cliente":   v.nombreCliente,
    "Fuente":    v.fuente,
    "Productos": v.itemsVendidos?.map(it => `${it.cantidad}x ${it.nombre}`).join(" | ") || "",
    "Total":     v.total,
    "Fecha":     new Date(v.fecha).toLocaleString("es-CO", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })
  }));
  const hoja  = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  hoja["!cols"] = [{ wch:12 },{ wch:22 },{ wch:14 },{ wch:40 },{ wch:14 },{ wch:18 }];
  XLSX.utils.book_append_sheet(libro, hoja, "Ventas");
  XLSX.writeFile(libro, `ventas_${new Date().toISOString().slice(0,10)}.xlsx`);
}

function PaginaPlatos() {
  const [ventas, setVentas]     = useState([]);
  const [cargando, setCargando] = useState(true);
  const [rango, setRango]       = useState(30);
  const [vista, setVista]       = useState("frecuencia");

  useEffect(() => {
    axios.get(`${BASE}/admin/ventas`).then(res => setVentas(res.data)).catch(err => console.error(err)).finally(() => setCargando(false));
  }, []);

  const ventasFiltradas = ventas.filter(v => new Date(v.fecha) >= new Date(Date.now() - rango * 86400000));

  const porPlato = {};
  ventasFiltradas.forEach(v => {
    (v.itemsVendidos || []).forEach(item => {
      if (!porPlato[item.nombre]) porPlato[item.nombre] = { nombre: item.nombre, veces: 0, ingresos: 0, cantidadTotal: 0 };
      porPlato[item.nombre].veces        += 1;
      porPlato[item.nombre].cantidadTotal += item.cantidad || 1;
      porPlato[item.nombre].ingresos     += (item.precio || 0) * (item.cantidad || 1);
    });
  });

  const platos   = Object.values(porPlato);
  const total    = platos.length;
  const ordenados = [...platos].sort((a, b) => vista === "frecuencia" ? b.veces - a.veces : b.ingresos - a.ingresos);
  const maxVeces    = Math.max(...platos.map(p => p.veces), 1);
  const maxIngresos = Math.max(...platos.map(p => p.ingresos), 1);

  const getCategoria = (p, index) => {
    if (index < Math.ceil(total * 0.3))   return { label:"Estrella", color:"#E8A830", bg:"rgba(232,168,48,0.12)", border:"rgba(232,168,48,0.3)" };
    if (index >= Math.floor(total * 0.7)) return { label:"Muerto",   color:"#E63946", bg:"rgba(230,57,70,0.1)",  border:"rgba(230,57,70,0.25)" };
    return                                       { label:"Normal",    color:"#4A90D9", bg:"rgba(74,144,217,0.1)", border:"rgba(74,144,217,0.25)" };
  };

  const fmt      = n => `$${Number(n).toLocaleString("es-CO")}`;
  const estrellas = ordenados.filter((_, i) => i < Math.ceil(total * 0.3));
  const muertos   = ordenados.filter((_, i) => i >= Math.floor(total * 0.7));

  return (
    <div>
      <div className="page-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div><div className="page-title">ANÁLISIS DE PLATOS</div><div className="page-subtitle">Detecta tus platos estrella y los que no están funcionando</div></div>
        <div style={{ display:"flex", gap:"8px" }}>
          {[7, 30, 90].map(r => (
            <button key={r} onClick={() => setRango(r)} style={{
              padding:"6px 14px", background: rango === r ? "linear-gradient(135deg,#C8892A,#E8A830)" : "transparent",
              border: rango === r ? "none" : "1px solid rgba(255,255,255,0.12)", borderRadius:"5px",
              color: rango === r ? "#0C0E14" : "rgba(232,230,223,0.45)", cursor:"pointer", fontSize:"11px", fontWeight:"700", fontFamily:"'DM Sans',sans-serif", letterSpacing:"1px",
            }}>{r} DÍAS</button>
          ))}
        </div>
      </div>
      <div className="stats-grid">
        {[
          { label:"Platos analizados", value: cargando ? "..." : total,            sub:"En el período",         color:"var(--gold2)" },
          { label:"Platos estrella",   value: cargando ? "..." : estrellas.length, sub:"Top 30% en ventas",     color:"#E8A830" },
          { label:"Platos muertos",    value: cargando ? "..." : muertos.length,   sub:"Bottom 30% — revisar",  color:"#E63946" },
          { label:"Plato #1",          value: cargando ? "..." : (ordenados[0]?.nombre?.split(" ")[0] || "—"), sub: ordenados[0] ? `${ordenados[0].veces} pedidos` : "Sin datos", color:"var(--gold)" },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ borderTop:`2px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize:"1.6rem", color: s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>
      {estrellas.length > 0 && (
        <div style={{ padding:"14px 20px", background:"rgba(232,168,48,0.06)", border:"1px solid rgba(232,168,48,0.15)", borderRadius:"8px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ fontSize:"20px" }}>⭐</span>
          <div>
            <div style={{ fontSize:"12px", fontWeight:"600", color:"#E8A830", letterSpacing:"1px", textTransform:"uppercase" }}>Productos estrella</div>
            <div style={{ fontSize:"12px", color:"rgba(232,230,223,0.6)", marginTop:"2px" }}>{estrellas.map(p => p.nombre).join(" · ")}</div>
          </div>
        </div>
      )}
      {muertos.length > 0 && (
        <div style={{ padding:"14px 20px", background:"rgba(230,57,70,0.06)", border:"1px solid rgba(230,57,70,0.15)", borderRadius:"8px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ fontSize:"20px" }}>⚠️</span>
          <div>
            <div style={{ fontSize:"12px", fontWeight:"600", color:"#E63946", letterSpacing:"1px", textTransform:"uppercase" }}>PROductos menos vendidos</div>
            <div style={{ fontSize:"12px", color:"rgba(232,230,223,0.6)", marginTop:"2px" }}>{muertos.map(p => p.nombre).join(" · ")}</div>
          </div>
        </div>
      )}
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-card-title">RANKING DE PLATOS</div>
          <div style={{ display:"flex", gap:"8px" }}>
            {[{ key:"frecuencia", label:"Por pedidos" }, { key:"ingresos", label:"Por ingresos" }].map(v => (
              <button key={v.key} onClick={() => setVista(v.key)} style={{
                padding:"5px 14px", background: vista === v.key ? "linear-gradient(135deg,#C8892A,#E8A830)" : "transparent",
                border: vista === v.key ? "none" : "1px solid rgba(255,255,255,0.12)", borderRadius:"5px",
                color: vista === v.key ? "#0C0E14" : "rgba(232,230,223,0.45)", cursor:"pointer", fontSize:"11px", fontWeight:"700", fontFamily:"'DM Sans',sans-serif",
              }}>{v.label}</button>
            ))}
          </div>
        </div>
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando datos...</div></div>
        ) : ordenados.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">🍽️</div><div className="placeholder-text">No hay ventas en este período para analizar</div></div>
        ) : (
          <table className="user-table">
            <thead><tr><th>#</th><th>Plato</th><th>Categoría</th><th>Pedidos</th><th>Ingresos</th><th>Tendencia</th></tr></thead>
            <tbody>
              {ordenados.map((p, i) => {
                const cat = getCategoria(p, i);
                const pct = vista === "frecuencia" ? Math.round((p.veces / maxVeces) * 100) : Math.round((p.ingresos / maxIngresos) * 100);
                return (
                  <tr key={i}>
                    <td style={{ color:"var(--gray)", fontSize:"12px", fontWeight:"600" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}</td>
                    <td style={{ fontWeight:"500" }}>🍽️ {p.nombre}</td>
                    <td><span style={{ fontSize:"10px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", padding:"3px 10px", borderRadius:"20px", background: cat.bg, color: cat.color, border:`1px solid ${cat.border}` }}>{cat.label}</span></td>
                    <td style={{ color:"var(--gray)" }}>{p.veces} pedidos · {p.cantidadTotal} uds</td>
                    <td style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", fontWeight:"700" }}>{fmt(p.ingresos)}</td>
                    <td style={{ minWidth:"120px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <div style={{ flex:1, height:"6px", background:"rgba(255,255,255,0.06)", borderRadius:"3px", overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background: cat.color, borderRadius:"3px", transition:"width .5s" }} />
                        </div>
                        <span style={{ fontSize:"11px", color:"var(--gray)", minWidth:"32px" }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PaginaDashboardFinanciero() {
  const [ventas, setVentas]     = useState([]);
  const [cargando, setCargando] = useState(true);
  const [rango, setRango]       = useState(30);

  useEffect(() => {
    axios.get(`${BASE}/admin/ventas`).then(res => setVentas(res.data)).catch(err => console.error(err)).finally(() => setCargando(false));
  }, []);

  const fmt = n => `$${Number(n).toLocaleString("es-CO")}`;
  const ventasFiltradas = ventas.filter(v => new Date(v.fecha) >= new Date(Date.now() - rango * 86400000));

  const porFuente = {};
  ventasFiltradas.forEach(v => {
    const fuente = v.fuente || "WhatsApp";
    if (!porFuente[fuente]) porFuente[fuente] = { total: 0, count: 0, fuente };
    porFuente[fuente].total += v.total;
    porFuente[fuente].count += 1;
  });

  const canales      = Object.values(porFuente).sort((a, b) => b.total - a.total);
  const totalGeneral = canales.reduce((a, c) => a + c.total, 0);
  const COLORES      = { "Rappi":"#FF6314", "Uber Eats":"#06C167", "Presencial":"#C9A84C", "WhatsApp":"#01391e", "DiDi Food":"#FFC400" };
  const getColor     = (fuente) => COLORES[fuente] || "#A0A0A0";

  const graficaData = (() => {
    const dias = [];
    for (let i = rango - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("es-CO", { day:"2-digit", month:"2-digit" });
      const dateStr = d.toDateString();
      const entry = { dia: label };
      canales.forEach(c => {
        entry[c.fuente] = ventasFiltradas.filter(v => new Date(v.fecha).toDateString() === dateStr && (v.fuente || "Directo") === c.fuente).reduce((a, v) => a + v.total, 0);
      });
      dias.push(entry);
    }
    return dias;
  })();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background:"#10131C", border:"1px solid rgba(238,230,230,1)", borderRadius:"8px", padding:"10px 14px", fontSize:"12px" }}>
          <div style={{ color:"var(--gray)", marginBottom:"6px" }}>{label}</div>
          {payload.map((p, i) => <div key={i} style={{ color: p.color, marginBottom:"2px" }}>{p.name}: {fmt(p.value)}</div>)}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="page-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div><div className="page-title">DASHBOARD FINANCIERO</div><div className="page-subtitle">Comparativo de ingresos por plataforma</div></div>
        <div style={{ display:"flex", gap:"8px" }}>
          {[7, 30, 90].map(r => (
            <button key={r} onClick={() => setRango(r)} style={{
              padding:"6px 14px", background: rango === r ? "linear-gradient(135deg,#C8892A,#E8A830)" : "transparent",
              border: rango === r ? "none" : "1px solid rgba(255,255,255,0.12)", borderRadius:"5px",
              color: rango === r ? "#0C0E14" : "rgba(232,230,223,0.45)", cursor:"pointer", fontSize:"11px", fontWeight:"700", fontFamily:"'DM Sans',sans-serif", letterSpacing:"1px",
            }}>{r} DÍAS</button>
          ))}
        </div>
      </div>
      <div className="stats-grid">
        {canales.map((c, i) => {
          const pct    = totalGeneral > 0 ? Math.round((c.total / totalGeneral) * 100) : 0;
          const ticket = c.count > 0 ? Math.round(c.total / c.count) : 0;
          return (
            <div className="stat-card" key={i} style={{ borderTop:`2px solid ${getColor(c.fuente)}` }}>
              <div className="stat-label">{c.fuente}</div>
              <div className="stat-value" style={{ fontSize:"1.6rem", color: getColor(c.fuente) }}>{fmt(c.total)}</div>
              <div className="stat-sub">{c.count} ventas · ticket ${ticket.toLocaleString("es-CO")}</div>
              <div style={{ marginTop:"10px", height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"2px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background: getColor(c.fuente), borderRadius:"2px", transition:"width .5s" }} />
              </div>
              <div style={{ fontSize:"10px", color:"var(--gray)", marginTop:"4px" }}>{pct}% del total</div>
            </div>
          );
        })}
        {cargando && <div className="stat-card"><div className="stat-label">Cargando...</div><div className="stat-value">—</div></div>}
      </div>
      <div className="section-card" style={{ marginBottom:"20px" }}>
        <div className="section-card-header"><div className="section-card-title">VENTAS POR CANAL — EVOLUCIÓN</div></div>
        <div style={{ padding:"20px 16px 8px" }}>
          {cargando ? (
            <div className="placeholder-content"><div className="placeholder-text">Cargando datos...</div></div>
          ) : canales.length === 0 ? (
            <div className="placeholder-content"><div className="placeholder-icon">📊</div><div className="placeholder-text">No hay ventas en este período</div></div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={graficaData} margin={{ top:4, right:8, left:8, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="dia" tick={{ fill:"rgba(232,230,223,0.4)", fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"rgba(232,230,223,0.4)", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? "0" : `$${(v/1000).toFixed(0)}k`} width={42} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
                {canales.map(c => <Bar key={c.fuente} dataKey={c.fuente} stackId="a" fill={getColor(c.fuente)} radius={[0,0,0,0]} maxBarSize={40} />)}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="section-card">
        <div className="section-card-header"><div className="section-card-title">RESUMEN POR CANAL</div></div>
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando...</div></div>
        ) : canales.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">💰</div><div className="placeholder-text">No hay ventas registradas en este período</div></div>
        ) : (
          <table className="user-table">
            <thead><tr><th>Canal</th><th>Ventas</th><th>Ingresos</th><th>Ticket prom.</th><th>Participación</th></tr></thead>
            <tbody>
              {canales.map((c, i) => {
                const pct    = totalGeneral > 0 ? Math.round((c.total / totalGeneral) * 100) : 0;
                const ticket = c.count > 0 ? Math.round(c.total / c.count) : 0;
                return (
                  <tr key={i}>
                    <td><div style={{ display:"flex", alignItems:"center", gap:"8px" }}><div style={{ width:"10px", height:"10px", borderRadius:"50%", background: getColor(c.fuente), flexShrink:0 }} />{c.fuente}</div></td>
                    <td style={{ color:"var(--gray)" }}>{c.count}</td>
                    <td style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", fontWeight:"700" }}>{fmt(c.total)}</td>
                    <td style={{ color:"var(--white)" }}>{fmt(ticket)}</td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                        <div style={{ flex:1, height:"6px", background:"rgba(255,255,255,0.06)", borderRadius:"3px", overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background: getColor(c.fuente), borderRadius:"3px" }} />
                        </div>
                        <span style={{ fontSize:"12px", color:"var(--gray)", minWidth:"32px" }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td style={{ fontWeight:"600" }}>Total</td>
                <td style={{ color:"var(--gray)" }}>{ventasFiltradas.length}</td>
                <td style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", fontWeight:"700" }}>{fmt(totalGeneral)}</td>
                <td style={{ color:"var(--white)" }}>{fmt(ventasFiltradas.length > 0 ? Math.round(totalGeneral / ventasFiltradas.length) : 0)}</td>
                <td style={{ color:"var(--gray)" }}>100%</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PaginaVentas() {
  const [ventas, setVentas]     = useState([]);
  const [cargando, setCargando] = useState(true);
  const [desde, setDesde]       = useState("");
  const [hasta, setHasta]       = useState("");

  useEffect(() => {
    axios.get(`${BASE}/admin/ventas`).then(res => setVentas(res.data)).catch(err => console.error(err)).finally(() => setCargando(false));
  }, []);

  const hoy    = new Date().toDateString();
  const semana = new Date(Date.now() - 7  * 86400000);
  const mes    = new Date(Date.now() - 30 * 86400000);
  const fmt    = n => `$${Number(n).toLocaleString("es-CO")}`;

  const ventasFiltradas = ventas.filter(v => {
    const fecha = new Date(v.fecha);
    const desdeFecha = desde ? new Date(desde + "T00:00:00") : null;
    const hastaFecha = hasta ? new Date(hasta + "T23:59:59") : null;
    if (desdeFecha && fecha < desdeFecha) return false;
    if (hastaFecha && fecha > hastaFecha) return false;
    return true;
  });

  const hayFiltro    = desde || hasta;
  const ventasHoy    = ventas.filter(v => new Date(v.fecha).toDateString() === hoy).reduce((a,v) => a + v.total, 0);
  const ventasSemana = ventas.filter(v => new Date(v.fecha) >= semana).reduce((a,v) => a + v.total, 0);
  const ventasMes    = ventas.filter(v => new Date(v.fecha) >= mes).reduce((a,v) => a + v.total, 0);
  const ventasMesArr = ventas.filter(v => new Date(v.fecha) >= mes);
  const ticketProm   = ventasMesArr.length ? ventasMes / ventasMesArr.length : 0;

  const inputFecha = {
    padding:"7px 12px", background:"#0C0E14", border:"1px solid rgba(200,137,42,0.2)", borderRadius:"5px",
    color:"#F2EDE4", fontSize:"12px", fontFamily:"DM Sans, sans-serif", outline:"none", cursor:"pointer",
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">HISTORIAL DE VENTAS</div><div className="page-subtitle">Registro de todas las ventas facturadas</div></div>
      <div className="stats-grid">
        {[
          { label:"Ventas hoy",      value: cargando ? "..." : fmt(ventasHoy) },
          { label:"Ventas semana",   value: cargando ? "..." : fmt(ventasSemana) },
          { label:"Ventas mes",      value: cargando ? "..." : fmt(ventasMes) },
          { label:"Ticket promedio", value: cargando ? "..." : fmt(ticketProm) },
        ].map((s, i) => (
          <div className="stat-card" key={i}><div className="stat-label">{s.label}</div><div className="stat-value" style={{ fontSize:"1.8rem" }}>{s.value}</div></div>
        ))}
      </div>
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-card-title">VENTAS REGISTRADAS ({hayFiltro ? `${ventasFiltradas.length} de ${ventas.length}` : ventas.length})</div>
          {ventas.length > 0 && (
            <button onClick={() => exportarExcel(ventasFiltradas)} style={{ padding:"7px 16px", background:"transparent", border:"1px solid rgba(76,175,80,0.25)", borderRadius:"5px", color:"#6fcf74", cursor:"pointer", fontSize:"11px", fontWeight:"600", fontFamily:"DM Sans, sans-serif", display:"flex", alignItems:"center", gap:"6px" }}>
              ⬇ EXPORTAR EXCEL
            </button>
          )}
        </div>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap", background:"#141720" }}>
          <span style={{ fontSize:"10px", fontWeight:"600", color:"rgba(232,230,223,0.45)", letterSpacing:"1.5px", textTransform:"uppercase" }}>Filtrar por fecha</span>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><span style={{ fontSize:"11px", color:"rgba(232,230,223,0.45)" }}>Desde</span><input type="date" value={desde} onChange={e => setDesde(e.target.value)} style={inputFecha} /></div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><span style={{ fontSize:"11px", color:"rgba(232,230,223,0.45)" }}>Hasta</span><input type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={inputFecha} /></div>
          {hayFiltro && <button onClick={() => { setDesde(""); setHasta(""); }} style={{ padding:"6px 12px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"5px", color:"rgba(232,230,223,0.45)", cursor:"pointer", fontSize:"11px", fontFamily:"DM Sans, sans-serif" }}>✕ Limpiar</button>}
          {hayFiltro && <span style={{ fontSize:"11px", color:"var(--gold)", marginLeft:"auto" }}>Total filtrado: <strong>{fmt(ventasFiltradas.reduce((a,v) => a + v.total, 0))}</strong></span>}
        </div>
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando ventas...</div></div>
        ) : ventasFiltradas.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">💰</div><div className="placeholder-text">{hayFiltro ? "No hay ventas en ese rango de fechas." : "Aquí aparecerá el historial de ventas cuando se facturen pedidos."}</div></div>
        ) : (
          <table className="user-table">
            <thead><tr><th>Factura</th><th>Cliente</th><th>Fuente</th><th>Productos</th><th>Total</th><th>Fecha</th><th></th></tr></thead>
            <tbody>
              {ventasFiltradas.map((v, i) => (
                <tr key={i}>
                  <td style={{ color:"var(--gold)", fontFamily:"'Cormorant Garamond',serif", fontSize:"15px", fontWeight:"600" }}>#{v.id?.slice(-6).toUpperCase()}</td>
                  <td>👤 {v.nombreCliente}</td>
                  <td><span className="badge badge-orange">{v.fuente}</span></td>
                  <td style={{ fontSize:"11px", opacity:.8, maxWidth:"200px" }}>{v.itemsVendidos?.map(it => `${it.cantidad}× ${it.nombre}`).join(", ")}</td>
                  <td style={{ color:"#E8A830", fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", fontWeight:"700" }}>{fmt(v.total)}</td>
                  <td style={{ color:"var(--gray)", fontSize:"12px" }}>{new Date(v.fecha).toLocaleString("es-CO", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}</td>
                  <td><button onClick={() => generarFacturaHTML(v)} style={{ padding:"5px 12px", background:"rgba(200,137,42,0.08)", border:"1px solid rgba(200,137,42,0.2)", borderRadius:"5px", color:"var(--gold)", cursor:"pointer", fontSize:"11px", fontWeight:"500", whiteSpace:"nowrap", fontFamily:"DM Sans, sans-serif" }}>🧾 Ver factura</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PaginaEmpleados() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [empleados, setEmpleados] = useState([]);  // ← Cambiado de "usuarios" a "empleados"
  const [cargando, setCargando] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [eliminando, setEliminando] = useState(null);

  // Header con token JWT
  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const cargarEmpleados = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${BASE}/admin/Meseros`, {
        headers: authHeader()
      });
      setEmpleados(res.data);  // ← Cambiado de "setUsuarios" a "setEmpleados"
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarEmpleados(); }, []);

  const eliminar = async (id) => {
    setEliminando(id);
    try {
      await axios.delete(`${BASE}/admin/empleado/${id}`, {  // ← Cambiado a "empleado"
        headers: authHeader()
      });
      setEmpleados(prev => prev.filter(u => u.id !== id));
      setConfirmId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setEliminando(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">GESTIÓN DE EMPLEADOS</div>
        <div className="page-subtitle">Administra los empleados del sistema</div>
      </div>
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-card-title">EMPLEADOS ({empleados.length})</div>
          <button className="btn-primary" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            {mostrarFormulario ? "✕ CANCELAR" : "+ AGREGAR EMPLEADO"}
          </button>
        </div>
        {mostrarFormulario && <RegistrarEmpleado onEmpleadoCreado={() => { cargarEmpleados(); setMostrarFormulario(false); }} />}
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando empleados...</div></div>
        ) : empleados.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">👤</div><div className="placeholder-text">No hay empleados registrados aún</div></div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((u) => (
                <tr key={u.id}>
                  <td><span className="user-avatar">{u.username?.charAt(0).toUpperCase()}</span>{u.username}</td>
                  <td><span className="badge badge-green">MESERO</span></td>  {/* Rol fijo por defecto */}
                  <td>
                    {confirmId === u.id ? (
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button onClick={() => eliminar(u.id)} disabled={eliminando === u.id} style={{ padding:"4px 10px", background:"rgba(230,57,70,0.1)", border:"1px solid rgba(230,57,70,0.25)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>
                          {eliminando === u.id ? "..." : "Confirmar"}
                        </button>
                        <button onClick={() => setConfirmId(null)} style={{ padding:"4px 10px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"4px", color:"var(--gray)", cursor:"pointer", fontSize:"11px" }}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(u.id)} style={{ padding:"4px 10px", background:"rgba(230,57,70,0.08)", border:"1px solid rgba(230,57,70,0.2)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>
                        🗑 Borrar
                      </button>
                    )}
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
function PaginaUsuarios() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarios, setUsuarios]     = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [confirmId, setConfirmId]   = useState(null);
  const [eliminando, setEliminando] = useState(null);

  const cargarUsuarios = async () => {
    setCargando(true);
    try { const res = await axios.get(`${BASE}/admin/Usuarios`); setUsuarios(res.data); }
    catch (e) { console.error(e); } finally { setCargando(false); }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const eliminar = async (id) => {
    setEliminando(id);
    try {
      await axios.delete(`https://kitchen-manager-back.onrender.com/admin/usuario/${id}`);
      setUsuarios(prev => prev.filter(u => u.id !== id)); setConfirmId(null);
    } catch (e) { console.error(e); } finally { setEliminando(null); }
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">GESTIÓN DE USUARIOS</div><div className="page-subtitle">Administra los usuarios del sistema</div></div>
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-card-title">USUARIOS ({usuarios.length})</div>
          <button className="btn-primary" onClick={() => setMostrarFormulario(!mostrarFormulario)}>{mostrarFormulario ? "✕ CANCELAR" : "+ AGREGAR EMPLEADO"}</button>
        </div>
        {mostrarFormulario && <RegistrarUsuario onUsuarioCreado={() => { cargarUsuarios(); setMostrarFormulario(false); }} />}
        {cargando ? (
          <div className="placeholder-content"><div className="placeholder-text">Cargando empleados...</div></div>
        ) : usuarios.length === 0 ? (
          <div className="placeholder-content"><div className="placeholder-icon">👤</div><div className="placeholder-text">No hay empleados registrados aún</div></div>
        ) : (
          <table className="user-table">
            <thead><tr><th>Usuario</th><th>Rol</th><th></th></tr></thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td><span className="user-avatar">{u.username?.charAt(0).toUpperCase()}</span>{u.username}</td>
                  <td>{u.roles?.map((r, j) => <span key={j} className={`badge ${r === "ADMIN" ? "badge-orange" : "badge-green"}`}>{r}</span>)}</td>
                  <td>
                    {confirmId === u.id ? (
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button onClick={() => eliminar(u.id)} disabled={eliminando === u.id} style={{ padding:"4px 10px", background:"rgba(230,57,70,0.1)", border:"1px solid rgba(230,57,70,0.25)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>{eliminando === u.id ? "..." : "Confirmar"}</button>
                        <button onClick={() => setConfirmId(null)} style={{ padding:"4px 10px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"4px", color:"var(--gray)", cursor:"pointer", fontSize:"11px" }}>Cancelar</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(u.id)} style={{ padding:"4px 10px", background:"rgba(230,57,70,0.08)", border:"1px solid rgba(230,57,70,0.2)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>🗑 Borrar</button>
                    )}
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

function PaginaQRs() {
  const [qrs, setQrs]               = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nuevoQr, setNuevoQr]       = useState({ nombre: "", descripcion: "" });

  useEffect(() => { cargarQrs(); }, []);

  const cargarQrs = async () => {
    try { const res = await axios.get(`${BASE}/admin/qrs`); setQrs(res.data); }
    catch (err) { console.error(err); } finally { setCargando(false); }
  };

  const crearQr = async () => {
    try {
      await axios.post("https://kitchen-manager-back.onrender.com/admin/qrs", nuevoQr);
      setNuevoQr({ nombre: "", descripcion: "" });
      setMostrarCrear(false);
      cargarQrs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActivo = async (id, activo) => {
    try {
      await axios.patch(`https://kitchen-manager-back.onrender.com/admin/qrs/${id}/estado`, { activo });
      cargarQrs();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarQr = async (id) => {
    if (!confirm("¿Eliminar este QR?")) return;
    try { await axios.delete(`${BASE}/admin/qrs/${id}`); cargarQrs(); }
    catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding:"24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
        <h2 style={{ color:"var(--white)", fontSize:"1.5rem", fontWeight:"600" }}>Códigos QR</h2>
        <button onClick={() => setMostrarCrear(!mostrarCrear)} style={{ padding:"8px 16px", background:"var(--gold)", border:"none", borderRadius:"6px", color:"var(--bg)", cursor:"pointer", fontWeight:"500" }}>+ Crear QR</button>
      </div>
      {mostrarCrear && (
        <div style={{ background:"var(--card)", padding:"16px", borderRadius:"8px", marginBottom:"24px", border:"1px solid var(--border)" }}>
          <h3 style={{ color:"var(--white)", marginBottom:"12px" }}>Nuevo Código QR</h3>
          <input type="text" placeholder="Nombre (ej: #1, #2, #3...)" value={nuevoQr.nombre} onChange={(e) => setNuevoQr({ ...nuevoQr, nombre: e.target.value })} style={{ width:"100%", padding:"8px", marginBottom:"8px", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"4px", color:"var(--white)" }} />
          <input type="text" placeholder="Descripción (Mesa, canal whatsapp, etc.)" value={nuevoQr.descripcion} onChange={(e) => setNuevoQr({ ...nuevoQr, descripcion: e.target.value })} style={{ width:"100%", padding:"8px", marginBottom:"12px", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"4px", color:"var(--white)" }} />
          <div>
            <button onClick={crearQr} style={{ padding:"6px 12px", background:"#6fcf74", border:"none", borderRadius:"4px", color:"#0C0E14", cursor:"pointer", marginRight:"8px", fontWeight:"600" }}>Crear</button>
            <button onClick={() => setMostrarCrear(false)} style={{ padding:"6px 12px", background:"transparent", border:"1px solid var(--border)", borderRadius:"4px", color:"var(--gray)", cursor:"pointer" }}>Cancelar</button>
          </div>
        </div>
      )}
      {cargando ? (
        <div style={{ textAlign:"center", padding:"40px", color:"var(--gray)" }}>Cargando...</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:"16px" }}>
          {qrs.map((qr) => (
            <div key={qr.id} style={{ background:"var(--card)", padding:"16px", borderRadius:"8px", border:"1px solid var(--border)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                <div>
                  <h4 style={{ color:"var(--white)", fontSize:"1.1rem", fontWeight:"600" }}>{qr.nombre}</h4>
                  <p style={{ color:"var(--gray)", fontSize:"0.9rem" }}>{qr.descripcion || "Sin descripción"}</p>
                  <p style={{ color: qr.activo ? "#6fcf74" : "#E63946", fontSize:"0.8rem" }}>{qr.activo ? "Activo" : "Inactivo"}</p>
                </div>
                <div>
                  <button onClick={() => toggleActivo(qr.id, !qr.activo)} style={{ padding:"4px 8px", background: qr.activo ? "rgba(230,57,70,0.1)" : "rgba(76,175,80,0.1)", border:`1px solid ${qr.activo ? "rgba(230,57,70,0.25)" : "rgba(76,175,80,0.25)"}`, borderRadius:"4px", color: qr.activo ? "#E63946" : "#6fcf74", cursor:"pointer", fontSize:"0.8rem", marginRight:"4px" }}>{qr.activo ? "Desactivar" : "Activar"}</button>
                  <button onClick={() => eliminarQr(qr.id)} style={{ padding:"4px 8px", background:"rgba(230,57,70,0.1)", border:"1px solid rgba(230,57,70,0.25)", borderRadius:"4px", color:"#E63946", cursor:"pointer", fontSize:"0.8rem" }}>🗑</button>
                </div>
              </div>
              {qr.activo && (
                <div style={{ textAlign:"center" }}>
                  <QRCode value={`https://kitchen-manager-front.vercel.app/menu/${qr.token}`} size={128} />
                  <p style={{ color:"var(--gray)", fontSize:"0.8rem", marginTop:"8px" }}>Escanea para acceder</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── NAV e ICONOS──────────────────────────────────────────────────────────────────
const LogoutIcon = () => (
  <svg style={{ width: "14px", height: "14px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const InicioIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const MenuIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5"/>
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

const QrsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="6" height="6" rx="1"/>
    <rect x="14" y="4" width="6" height="6" rx="1"/>
    <rect x="4" y="14" width="6" height="6" rx="1"/>
    <rect x="16" y="16" width="2" height="2"/>
    <rect x="20" y="16" width="2" height="2"/>
    <rect x="16" y="20" width="6" height="2"/>
  </svg>
);

const VentasIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" fontFamily="Arial">$</text>
  </svg>
);

const FinancieroIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="14" width="3" height="8"/>
    <rect x="9" y="10" width="3" height="12"/>
    <rect x="14" y="6" width="3" height="16"/>
    <rect x="19" y="2" width="3" height="20"/>
  </svg>
);

const PlatosIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
    <path d="M12 8v4l2.5 2.5" stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="1.5" fill="white"/>
  </svg>
);

const UsuariosIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="8" r="4"/>
    <path d="M5 20v-2a7 7 0 0114 0v2"/>
  </svg>
);

const EmpleadoIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="7" r="3.5"/>
    <path d="M8 4.5h8v1H8z"/>
    <path d="M9 3.5h6v1H9z"/>
    <path d="M7 21v-5a5 5 0 0 1 10 0v5"/>
    <rect x="9.5" y="10" width="5" height="1.5" rx="0.5"/>
    <circle cx="12" cy="9.5" r="0.8"/>
  </svg>
);


const NAV = [
  { key:"inicio",     label:"Inicio",                icon: InicioIcon,     section:"GENERAL" },
  { key:"menu",       label:"Gestión del Menú",      icon: MenuIcon,       section:"OPERACIONES" },
  { key:"pedidos",    label:"Panel de Pedidos",      icon: PedidosIcon,    section:"OPERACIONES" },
  { key:"qrs",        label:"Códigos QR",            icon: QrsIcon,        section:"OPERACIONES" },
  { key:"ventas",     label:"Historial Ventas",      icon: VentasIcon,     section:"REPORTES" },
  { key:"financiero", label:"Dashboard Financiero",  icon: FinancieroIcon, section:"REPORTES" },
  { key:"platos",     label:"Análisis de Platos",    icon: PlatosIcon,     section:"REPORTES" },
  { key:"empleados",   label:"Empleados",              icon: EmpleadoIcon,   section:"CONFIGURACIÓN" },
  { key:"usuarios",   label:"Usuarios",              icon: UsuariosIcon,   section:"CONFIGURACIÓN" },
];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────
export default function Admin() {
  const [activePage, setActivePage] = useState("inicio");
  const username = localStorage.getItem("username") || "admin";
  const sections = [...new Set(NAV.map((n) => n.section))];
  const [ventasGlobal, setVentasGlobal] = useState([]);
  const [pedidosGlobal, setPedidosGlobal] = useState([]);
  const [menuGlobal, setMenuGlobal] = useState([]);
  
  useEffect(() => {
    axios.get(`${BASE}/admin/ventas`).then(r => setVentasGlobal(r.data)).catch(() => {});
    axios.get(`${BASE}/admin/verPedidos`).then(r => setPedidosGlobal(r.data)).catch(() => {});
    axios.get(`${BASE}/admin/verMenu`).then(r => setMenuGlobal(r.data)).catch(() => {});
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "inicio":     return <PaginaInicio username={username} />;
      case "menu":       return <PaginaMenu />;
      case "pedidos":    return <PaginaPedidos />;
      case "qrs":        return <PaginaQRs />;
      case "ventas":     return <PaginaVentas />;
      case "financiero": return <PaginaDashboardFinanciero />;
      case "empleados": return <PaginaEmpleados />;
      case "usuarios":   return <PaginaUsuarios />;
      case "platos":     return <PaginaPlatos />;
      default:           return <PaginaInicio username={username} />;
    }
  };

  const activeLabel = NAV.find((n) => n.key === activePage)?.label;

  return (
    <>
      <style>{styles}</style>
      <div className="admin-root">
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
            
            <div className="sidebar-logo-sub">Panel Admin</div>
          </div>
          <nav className="sidebar-nav">
            {sections.map((section) => (
              <div key={section}>
                <div className="nav-section-label">{section}</div>
                {NAV.filter((n) => n.section === section).map((item) => {
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
            <div className="topbar-right">
              <div className="topbar-user">
                <div className="topbar-avatar">A</div>
                <div>
                  <div className="topbar-username">{username}</div>
                  <div className="topbar-role">Administrador</div>
                </div>
              </div>
            </div>
          </div>
          <div className="content" key={activePage}>{renderPage()}</div>
        </main>
      </div>  {/* cierre admin-root */}
    </>
  );
}
