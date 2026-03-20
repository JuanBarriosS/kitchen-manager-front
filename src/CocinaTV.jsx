import { useState, useEffect } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0D0D1A; --card: #13132A;
    --orange: #FF6B35; --yellow: #FFC300; --white: #F5F5F5;
    --gray: #A0A0A0; --verde: #1D9E75; --amarillo: #E5A800; --rojo: #E63946;
  }

  .tv-root { min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--white); display:flex; flex-direction:column; }

  .tv-header { background:var(--card); border-bottom:2px solid #FF6B3530; padding:18px 36px; display:flex; align-items:center; justify-content:space-between; }
  .tv-logo { display:flex; align-items:center; gap:14px; }
  .tv-logo-icon { width:52px; height:52px; background:linear-gradient(135deg,var(--orange),var(--yellow)); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:26px; }
  .tv-logo-text { font-family:'Bebas Neue',sans-serif; font-size:30px; letter-spacing:3px; line-height:1; }
  .tv-logo-sub { font-size:11px; color:var(--gray); letter-spacing:3px; text-transform:uppercase; margin-top:3px; }
  .tv-header-right { display:flex; align-items:center; gap:32px; }
  .tv-stat-value { font-family:'Bebas Neue',sans-serif; font-size:42px; line-height:1; color:var(--orange); }
  .tv-stat-label { font-size:11px; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-top:2px; }
  .tv-clock { font-family:'Bebas Neue',sans-serif; font-size:48px; letter-spacing:3px; line-height:1; }
  .tv-live { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--verde); letter-spacing:2px; text-transform:uppercase; }
  .tv-live-dot { width:10px; height:10px; border-radius:50%; background:var(--verde); animation:pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }

  .tv-content { flex:1; padding:28px 36px; }
  .tv-leyenda { display:flex; gap:24px; margin-bottom:22px; align-items:center; }
  .tv-leyenda-item { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--gray); }
  .tv-leyenda-dot { width:12px; height:12px; border-radius:50%; }

  .tv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; }

  .tv-pedido { background:var(--card); border-radius:12px; overflow:hidden; border:2px solid transparent; animation:entrar .3s ease; }
  @keyframes entrar { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .tv-pedido.verde   { border-color:#1D9E7540; }
  .tv-pedido.amarillo{ border-color:#E5A80060; }
  .tv-pedido.rojo    { border-color:#E6394680; animation:alerta 1s ease-in-out infinite alternate; }
  @keyframes alerta { from{border-color:#E6394650} to{border-color:#E63946CC} }

  .tv-pedido-header { padding:14px 18px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #ffffff08; }
  .tv-pedido-numero { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:2px; line-height:1; }
  .tv-pedido-tiempo { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:1px; line-height:1; }
  .tv-pedido.verde   .tv-pedido-tiempo { color:var(--verde); }
  .tv-pedido.amarillo .tv-pedido-tiempo { color:var(--amarillo); }
  .tv-pedido.rojo    .tv-pedido-tiempo { color:var(--rojo); }

  .tv-pedido-body { padding:14px 18px; }
  .tv-pedido-cliente { font-size:15px; font-weight:600; margin-bottom:4px; }
  .tv-pedido-fuente { font-size:11px; color:var(--gray); letter-spacing:1px; text-transform:uppercase; margin-bottom:12px; }
  .tv-pedido-items { display:flex; flex-direction:column; gap:6px; }
  .tv-pedido-item { display:flex; align-items:center; gap:10px; }
  .tv-pedido-item-qty { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--orange); min-width:24px; line-height:1; }
  .tv-pedido-item-nombre { font-size:15px; line-height:1.3; }

  .tv-pedido-footer { padding:10px 18px 14px; display:flex; align-items:center; justify-content:space-between; }
  .tv-pedido-total { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--yellow); }
  .tv-pedido-estado { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:4px 10px; border-radius:20px; background:#FF6B3520; color:var(--orange); border:1px solid #FF6B3530; }

  .tv-vacio { grid-column:1/-1; text-align:center; padding:80px 20px; }
  .tv-vacio-icon { font-size:64px; opacity:.2; margin-bottom:20px; }
  .tv-vacio-text { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:3px; color:var(--gray); opacity:.4; }
  .tv-vacio-sub { font-size:14px; color:var(--gray); opacity:.3; margin-top:8px; letter-spacing:2px; text-transform:uppercase; }

  .tv-footer { background:var(--card); border-top:1px solid #ffffff08; padding:12px 36px; display:flex; align-items:center; justify-content:space-between; }
  .tv-footer-text { font-size:12px; color:var(--gray); opacity:.5; letter-spacing:1px; }
`;

function calcularMinutos(fecha) {
  if (!fecha) return 0;
  return Math.floor((Date.now() - new Date(fecha)) / 60000);
}

function formatTiempo(mins) {
  if (mins < 1) return "< 1 MIN";
  if (mins < 60) return mins + " MIN";
  return Math.floor(mins / 60) + "H " + (mins % 60) + "M";
}

function getColorClass(mins) {
  if (mins < 15) return "verde";
  if (mins < 30) return "amarillo";
  return "rojo";
}

export default function CocinaTV() {
  const [pedidos, setPedidos] = useState([]);
  const [hora, setHora] = useState("");
  const [, setTick] = useState(0);

  const cargarPedidos = async () => {
    try {
      const res = await axios.get("https://kitchen-manager-back-production.up.railway.app/cocina/pedidos");
      const enPrep = res.data.filter(
        p => p.estado === "en preparación" || p.estado === "en preparacion"
      );
      setPedidos(enPrep);
    } catch (e) {
      console.error("Error:", e);
    }
  };

  useEffect(() => {
    cargarPedidos();
    const iv = setInterval(() => { cargarPedidos(); setTick(t => t + 1); }, 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const reloj = setInterval(() => {
      setHora(new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      }));
    }, 1000);
    return () => clearInterval(reloj);
  }, []);

  const urgentes = pedidos.filter(p => calcularMinutos(p.fecha) >= 30).length;

  return (
    <>
      <style>{styles}</style>
      <div className="tv-root">

        <div className="tv-header">
          <div className="tv-logo">
            <div className="tv-logo-icon">🔥</div>
            <div>
              <div className="tv-logo-text">KITCHEN MANAGER</div>
              <div className="tv-logo-sub">Panel de Cocina</div>
            </div>
          </div>
          <div className="tv-header-right">
            <div>
              <div className="tv-stat-value">{pedidos.length}</div>
              <div className="tv-stat-label">En preparación</div>
            </div>
            {urgentes > 0 && (
              <div>
                <div className="tv-stat-value" style={{ color: "var(--rojo)" }}>{urgentes}</div>
                <div className="tv-stat-label">Urgentes</div>
              </div>
            )}
            <div>
              <div className="tv-clock">{hora}</div>
              <div className="tv-live">
                <div className="tv-live-dot" />
                En vivo
              </div>
            </div>
          </div>
        </div>

        <div className="tv-content">
          <div className="tv-leyenda">
            <div className="tv-leyenda-item">
              <div className="tv-leyenda-dot" style={{ background: "var(--verde)" }} />
              Menos de 15 min
            </div>
            <div className="tv-leyenda-item">
              <div className="tv-leyenda-dot" style={{ background: "var(--amarillo)" }} />
              15 – 30 min
            </div>
            <div className="tv-leyenda-item">
              <div className="tv-leyenda-dot" style={{ background: "var(--rojo)" }} />
              Más de 30 min — URGENTE
            </div>
          </div>

          <div className="tv-grid">
            {pedidos.length === 0 ? (
              <div className="tv-vacio">
                <div className="tv-vacio-icon">🍽️</div>
                <div className="tv-vacio-text">Sin pedidos activos</div>
                <div className="tv-vacio-sub">Actualizando cada 5 segundos</div>
              </div>
            ) : (
              [...pedidos]
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map((pedido, i) => {
                  const mins = calcularMinutos(pedido.fecha);
                  const color = getColorClass(mins);
                  return (
                    <div key={pedido.id || i} className={"tv-pedido " + color}>
                      <div className="tv-pedido-header">
                        <div className="tv-pedido-numero">
                          #{String(i + 1).padStart(2, "0")}
                        </div>
                        <div className="tv-pedido-tiempo">
                          {formatTiempo(mins)}
                        </div>
                      </div>
                      <div className="tv-pedido-body">
                        <div className="tv-pedido-cliente">
                          {pedido.nombreCliente || "Cliente"}
                        </div>
                        <div className="tv-pedido-fuente">
                          {pedido.fuente || "Pedido directo"}
                        </div>
                        <div className="tv-pedido-items">
                          {(pedido.itemsSeleccionados || []).map((item, j) => (
                            <div key={j} className="tv-pedido-item">
                              <span className="tv-pedido-item-qty">{item.cantidad || 1}×</span>
                              <span className="tv-pedido-item-nombre">{item.nombre}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="tv-pedido-footer">
                        <div className="tv-pedido-total">
                          ${Number(pedido.total || 0).toLocaleString("es-CO")}
                        </div>
                        <div className="tv-pedido-estado">En preparación</div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <div className="tv-footer">
          <span className="tv-footer-text">KITCHEN MANAGER — PANEL DE COCINA</span>
          <span className="tv-footer-text">Actualizando cada 5 segundos</span>
        </div>

      </div>
    </>
  );
}