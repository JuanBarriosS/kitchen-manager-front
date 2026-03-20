import { useState, useEffect } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:    #0C0E14;
    --card:  #10131C;
    --card2: #141720;
    --gold:  #C8892A;
    --gold2: #E8A830;
    --white: #F2EDE4;
    --gray:  rgba(232,230,223,0.45);
    --border: rgba(255,255,255,0.07);
    --verde:   #4CAF50;
    --amarillo: #C8892A;
    --rojo:    #E63946;
  }

  .tv-root { min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--white); display:flex; flex-direction:column; }

  /* HEADER */
  .tv-header {
    background: var(--card);
    border-bottom: 1px solid var(--border);
    padding: 0 36px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }

  .tv-logo { display:flex; align-items:center; gap:12px; }
  .tv-logo-icon {
    width:38px; height:38px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius:8px;
    display:flex; align-items:center; justify-content:center;
  }
  .tv-logo-icon svg { width:22px; height:22px; fill:#0C0E14; }
  .tv-logo-name {
    font-family:'Cormorant Garamond',serif;
    font-size:1.1rem; font-weight:600; letter-spacing:0.03em; color:var(--white); line-height:1;
  }
  .tv-logo-sub { font-size:9px; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-top:3px; }

  .tv-header-right { display:flex; align-items:center; gap:32px; }

  .tv-stat { text-align:center; }
  .tv-stat-value {
    font-family:'Cormorant Garamond',serif;
    font-size:2rem; font-weight:700; color:var(--gold2); line-height:1;
  }
  .tv-stat-label { font-size:9px; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-top:2px; }

  .tv-clock {
    font-family:'Cormorant Garamond',serif;
    font-size:2rem; font-weight:700; color:var(--white); line-height:1;
  }
  .tv-clock-label { font-size:9px; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-top:2px; text-align:right; }

  .tv-live { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--verde); letter-spacing:2px; text-transform:uppercase; margin-top:4px; }
  .tv-live-dot { width:8px; height:8px; border-radius:50%; background:var(--verde); animation:pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }

  /* CONTENT */
  .tv-content { flex:1; padding:28px 36px; }

  .tv-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
  .tv-page-title { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:600; letter-spacing:0.02em; color:var(--white); }
  .tv-page-sub { font-size:13px; color:var(--gray); margin-top:4px; }

  .tv-leyenda { display:flex; gap:20px; align-items:center; }
  .tv-leyenda-item { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--gray); }
  .tv-leyenda-dot { width:10px; height:10px; border-radius:50%; }

  /* GRID */
  .tv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:20px; }

  /* CARD */
  .tv-pedido {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius:8px;
    overflow:hidden;
    position:relative;
    animation:entrar .3s ease;
    transition: border-color 0.3s;
  }
  .tv-pedido::before {
    content:'';
    position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
  }
  .tv-pedido.amarillo::before { background: linear-gradient(90deg, #C8892A, #E8A830); }
  .tv-pedido.rojo::before { background: linear-gradient(90deg, #E63946, #ff6b6b); }
  .tv-pedido.rojo { border-color: rgba(230,57,70,0.3); animation:entrar .3s ease, alerta 1.5s ease-in-out infinite alternate; }

  @keyframes entrar { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes alerta { from{border-color:rgba(230,57,70,0.2)} to{border-color:rgba(230,57,70,0.5)} }

  .tv-pedido-header {
    padding:14px 20px;
    display:flex; align-items:center; justify-content:space-between;
    border-bottom:1px solid var(--border);
  }

  .tv-pedido-num {
    font-family:'Cormorant Garamond',serif;
    font-size:1.5rem; font-weight:700; color:var(--gold2); line-height:1;
  }

  .tv-pedido-tiempo {
    font-family:'Cormorant Garamond',serif;
    font-size:1.5rem; font-weight:700; line-height:1;
  }
  .tv-pedido.verde   .tv-pedido-tiempo { color:#4CAF50; }
  .tv-pedido.amarillo .tv-pedido-tiempo { color:var(--gold); }
  .tv-pedido.rojo    .tv-pedido-tiempo { color:var(--rojo); }

  .tv-pedido-body { padding:16px 20px; }

  .tv-pedido-cliente { font-size:15px; font-weight:600; color:var(--white); margin-bottom:3px; }
  .tv-pedido-fuente {
    display:inline-block;
    padding:2px 8px; border-radius:20px;
    font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase;
    background:rgba(200,137,42,0.12); color:var(--gold);
    border:1px solid rgba(200,137,42,0.25);
    margin-bottom:14px;
  }

  .tv-pedido-items { display:flex; flex-direction:column; gap:8px; }
  .tv-pedido-item { display:flex; align-items:center; gap:10px; }
  .tv-pedido-item-qty {
    font-family:'Cormorant Garamond',serif;
    font-size:1.2rem; font-weight:700; color:var(--gold2); min-width:24px; line-height:1;
  }
  .tv-pedido-item-nombre { font-size:14px; color:var(--white); line-height:1.3; }

  .tv-pedido-footer {
    padding:12px 20px 16px;
    display:flex; align-items:center; justify-content:space-between;
    border-top:1px solid var(--border);
    margin-top:14px;
  }
  .tv-pedido-total {
    font-family:'Cormorant Garamond',serif;
    font-size:1.4rem; font-weight:700; color:var(--gold2);
  }
  .tv-pedido-badge {
    font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase;
    padding:3px 10px; border-radius:20px;
    background:rgba(200,137,42,0.1); color:var(--gold);
    border:1px solid rgba(200,137,42,0.2);
  }

  /* VACÍO */
  .tv-vacio { grid-column:1/-1; text-align:center; padding:80px 20px; }
  .tv-vacio-icon { font-size:48px; opacity:.15; margin-bottom:16px; }
  .tv-vacio-title {
    font-family:'Cormorant Garamond',serif;
    font-size:1.8rem; font-weight:600; color:var(--gray); opacity:.5;
  }
  .tv-vacio-sub { font-size:12px; color:var(--gray); opacity:.4; margin-top:6px; letter-spacing:2px; text-transform:uppercase; }

  /* FOOTER */
  .tv-footer {
    background:var(--card);
    border-top:1px solid var(--border);
    padding:12px 36px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .tv-footer-text { font-size:11px; color:var(--gray); opacity:.4; letter-spacing:1px; }
`;

function calcularMinutos(fecha) {
  if (!fecha) return 0;
  return Math.floor((Date.now() - new Date(fecha)) / 60000);
}

function formatTiempo(mins) {
  if (mins < 1) return "< 1 min";
  if (mins < 60) return mins + " min";
  return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
}

function getColorClass(mins) {
  if (mins < 15) return "verde";
  if (mins < 30) return "amarillo";
  return "rojo";
}

export default function CocinaTV() {
  const [pedidos, setPedidos] = useState([]);
  const [hora, setHora]       = useState("");
  const [, setTick]           = useState(0);

  const cargarPedidos = async () => {
    try {
      const res = await axios.get("https://kitchen-manager-back-production.up.railway.app/cocina/pedidos");
      const enPrep = res.data.filter(
        p => p.estado === "preparacion" ||
             p.estado === "en preparación" ||
             p.estado === "en preparacion" ||
             p.estado === "preparación"
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

        <header className="tv-header">
          <div className="tv-logo">
            <div className="...logo-icon" style={{ fontSize: "20px" }}>
                🫕
            </div>
            <div>
              <div className="tv-logo-name">Kitchen Manager</div>
              <div className="tv-logo-sub">Panel de Cocina</div>
            </div>
          </div>

          <div className="tv-header-right">
            <div className="tv-stat">
              <div className="tv-stat-value">{pedidos.length}</div>
              <div className="tv-stat-label">En preparación</div>
            </div>
            {urgentes > 0 && (
              <div className="tv-stat">
                <div className="tv-stat-value" style={{ color:"var(--rojo)" }}>{urgentes}</div>
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
        </header>

        <div className="tv-content">
          <div className="tv-topbar">
            <div>
              <div className="tv-page-title">PEDIDOS ACTIVOS</div>
              <div className="tv-page-sub">Vista en tiempo real — actualiza cada 5 segundos</div>
            </div>
            <div className="tv-leyenda">
              <div className="tv-leyenda-item">
                <div className="tv-leyenda-dot" style={{ background:"#4CAF50" }} />
                Menos de 15 min
              </div>
              <div className="tv-leyenda-item">
                <div className="tv-leyenda-dot" style={{ background:"var(--gold)" }} />
                15 – 30 min
              </div>
              <div className="tv-leyenda-item">
                <div className="tv-leyenda-dot" style={{ background:"var(--rojo)" }} />
                Más de 30 min
              </div>
            </div>
          </div>

          <div className="tv-grid">
            {pedidos.length === 0 ? (
              <div className="tv-vacio">
                <div className="tv-vacio-icon">🍽️</div>
                <div className="tv-vacio-title">Sin pedidos activos</div>
                <div className="tv-vacio-sub">Actualizando cada 5 segundos</div>
              </div>
            ) : (
              [...pedidos]
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map((pedido, i) => {
                  const mins  = calcularMinutos(pedido.fecha);
                  const color = getColorClass(mins);
                  return (
                    <div key={pedido.id || i} className={"tv-pedido " + color}>
                      <div className="tv-pedido-header">
                        <div className="tv-pedido-num">
                          #{String(i + 1).padStart(2, "0")} · {pedido.nombreCliente || "Cliente"}
                        </div>
                        <div className="tv-pedido-tiempo">{formatTiempo(mins)}</div>
                      </div>

                      <div className="tv-pedido-body">
                        <div className="tv-pedido-fuente">{pedido.fuente || "Directo"}</div>
                        <div className="tv-pedido-items">
                          {(pedido.itemsSeleccionados || []).map((item, j) => (
                            <div key={j} className="tv-pedido-item">
                              <span className="tv-pedido-item-qty">{item.cantidad || 1}×</span>
                              <span className="tv-pedido-item-nombre">{item.nombre}</span>
                            </div>
                          ))}
                        </div>
                        <div className="tv-pedido-footer">
                          <div className="tv-pedido-total">
                            ${Number(pedido.total || 0).toLocaleString("es-CO")}
                          </div>
                          <div className="tv-pedido-badge">En preparación</div>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <footer className="tv-footer">
          <span className="tv-footer-text">KITCHEN MANAGER — PANEL DE COCINA</span>
          <span className="tv-footer-text">Actualizando cada 5 segundos</span>
        </footer>

      </div>
    </>
  );
}