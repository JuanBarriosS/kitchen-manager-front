// CocinaTV.jsx - Versión Optimizada para Pantallas Grandes
import { useState, useEffect } from "react";
import axios from "axios";

const tvStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --bg: #0a0c10;
    --card-bg: #141820;
    --card-border: #2a2f3a;
    --text-primary: #ffffff;
    --text-secondary: #a0a8b8;
    --urgente: #e74c3c;
    --warning: #f39c12;
    --normal: #27ae60;
    --gold: #c8892a;
    --gold-light: #e8a830;
  }

  .tv-container {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    padding: 24px;
  }

  /* HEADER GRANDE PARA TV */
  .tv-header {
    background: linear-gradient(135deg, #0f1118 0%, #0a0c10 100%);
    border-radius: 16px;
    padding: 24px 32px;
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--card-border);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .tv-header-left h1 {
    font-size: 48px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }

  .tv-header-left p {
    font-size: 18px;
    color: var(--text-secondary);
  }

  .tv-header-right {
    text-align: right;
  }

  .tv-clock {
    font-size: 56px;
    font-weight: 700;
    color: var(--text-primary);
    font-family: monospace;
    letter-spacing: 4px;
  }

  .tv-date {
    font-size: 18px;
    color: var(--text-secondary);
    margin-top: 8px;
  }

  .tv-stats {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
  }

  .tv-stat-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    padding: 24px;
    flex: 1;
    text-align: center;
  }

  .tv-stat-value {
    font-size: 72px;
    font-weight: 800;
    color: var(--gold-light);
    line-height: 1;
  }

  .tv-stat-label {
    font-size: 16px;
    color: var(--text-secondary);
    margin-top: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  /* GRID DE PEDIDOS - GRANDE */
  .tv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 24px;
  }

  .tv-card {
    background: var(--card-bg);
    border: 2px solid var(--card-border);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.2s ease;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Bordes de tiempo */
  .tv-card.urgente {
    border-left: 8px solid var(--urgente);
    border-right: 2px solid var(--card-border);
    animation: pulse 1s infinite;
  }

  .tv-card.warning {
    border-left: 8px solid var(--warning);
  }

  .tv-card.normal {
    border-left: 8px solid var(--normal);
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(231, 76, 60, 0);
    }
  }

  .tv-card-header {
    padding: 20px 24px;
    background: rgba(255,255,255,0.02);
    border-bottom: 1px solid var(--card-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tv-card-number {
    font-size: 32px;
    font-weight: 800;
    color: var(--gold-light);
  }

  .tv-card-time {
    font-size: 28px;
    font-weight: 700;
    font-family: monospace;
  }

  .tv-card.urgente .tv-card-time {
    color: var(--urgente);
  }

  .tv-card.warning .tv-card-time {
    color: var(--warning);
  }

  .tv-card.normal .tv-card-time {
    color: var(--normal);
  }

  .tv-card-body {
    padding: 20px 24px;
  }

  .tv-card-cliente {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .tv-card-fuente {
    display: inline-block;
    background: rgba(200, 137, 42, 0.15);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--gold-light);
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .tv-card-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .tv-card-item {
    display: flex;
    align-items: baseline;
    gap: 12px;
    font-size: 18px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .tv-card-item-qty {
    font-weight: 800;
    color: var(--gold-light);
    font-size: 22px;
    min-width: 50px;
  }

  .tv-card-item-name {
    color: var(--text-primary);
    font-weight: 500;
  }

  .tv-card-footer {
    padding: 16px 24px;
    background: rgba(0,0,0,0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tv-card-total {
    font-size: 28px;
    font-weight: 800;
    color: var(--gold-light);
  }

  .tv-card-badge {
    background: rgba(39, 174, 96, 0.15);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--normal);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* VACÍO */
  .tv-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px;
    background: var(--card-bg);
    border-radius: 20px;
    border: 2px dashed var(--card-border);
  }

  .tv-empty-icon {
    font-size: 80px;
    margin-bottom: 24px;
    opacity: 0.3;
  }

  .tv-empty-title {
    font-size: 32px;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }

  .tv-empty-sub {
    font-size: 18px;
    color: var(--text-secondary);
    opacity: 0.5;
  }

  /* FOOTER */
  .tv-footer {
    margin-top: 32px;
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
    font-size: 14px;
    border-top: 1px solid var(--card-border);
  }

  /* RESPONSIVE PARA TABLETS */
  @media (max-width: 768px) {
    .tv-container {
      padding: 12px;
    }
    
    .tv-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .tv-clock {
      font-size: 32px;
    }
    
    .tv-stat-value {
      font-size: 48px;
    }
    
    .tv-card-number,
    .tv-card-time {
      font-size: 20px;
    }
  }
`;

function calcularMinutos(fecha) {
  if (!fecha) return 0;
  return Math.floor((Date.now() - new Date(fecha)) / 60000);
}

function formatTiempo(mins) {
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${mins} min`;
  const horas = Math.floor(mins / 60);
  const minutos = mins % 60;
  return `${horas}h ${minutos}m`;
}

function getStatusClass(mins) {
  if (mins >= 30) return "urgente";
  if (mins >= 15) return "warning";
  return "normal";
}

export default function CocinaTV() {
  const [pedidos, setPedidos] = useState([]);
  const [hora, setHora] = useState("");
  const [fecha, setFecha] = useState("");

  const cargarPedidos = async () => {
    try {
      const res = await axios.get("https://archlinux.taildc096b.ts.net:8443/empleado/pedidos");
      const enPrep = res.data.filter(
        p => p.estado === "preparacion" || p.estado === "en preparación"
      );
      setPedidos(enPrep);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 10000); // Cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const actualizarReloj = () => {
      const now = new Date();
      setHora(now.toLocaleTimeString("es-CO", { 
        hour: "2-digit", 
        minute: "2-digit",
        second: "2-digit",
        hour12: false 
      }));
      setFecha(now.toLocaleDateString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }));
    };
    
    actualizarReloj();
    const relojInterval = setInterval(actualizarReloj, 1000);
    return () => clearInterval(relojInterval);
  }, []);

  const urgentes = pedidos.filter(p => calcularMinutos(p.fecha) >= 30).length;
  const totalActivos = pedidos.length;

  return (
    <>
      <style>{tvStyles}</style>
      <div className="tv-container">
        {/* HEADER GRANDE */}
        <div className="tv-header">
          <div className="tv-header-left">
            <h1>🍳 COCINA EN VIVO</h1>
            <p>Panel de seguimiento de pedidos en preparación</p>
          </div>
          <div className="tv-header-right">
            <div className="tv-clock">{hora}</div>
            <div className="tv-date">{fecha}</div>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="tv-stats">
          <div className="tv-stat-card">
            <div className="tv-stat-value">{totalActivos}</div>
            <div className="tv-stat-label">Pedidos activos</div>
          </div>
          <div className="tv-stat-card">
            <div className="tv-stat-value" style={{ color: "#e74c3c" }}>{urgentes}</div>
            <div className="tv-stat-label">Urgentes (+30 min)</div>
          </div>
          <div className="tv-stat-card">
            <div className="tv-stat-value">⚡</div>
            <div className="tv-stat-label">Actualización cada 10s</div>
          </div>
        </div>

        {/* GRID DE PEDIDOS */}
        <div className="tv-grid">
          {pedidos.length === 0 ? (
            <div className="tv-empty">
              <div className="tv-empty-icon">🍽️</div>
              <div className="tv-empty-title">No hay pedidos activos</div>
              <div className="tv-empty-sub">Los pedidos en preparación aparecerán aquí</div>
            </div>
          ) : (
            pedidos
              .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
              .map((pedido, idx) => {
                const mins = calcularMinutos(pedido.fecha);
                const status = getStatusClass(mins);
                return (
                  <div key={pedido.id || idx} className={`tv-card ${status}`}>
                    <div className="tv-card-header">
                      <div className="tv-card-number">
                        #{idx + 1} · {pedido.nombreCliente?.split(" ")[0] || "Cliente"}
                      </div>
                      <div className="tv-card-time">⏱️ {formatTiempo(mins)}</div>
                    </div>
                    <div className="tv-card-body">
                      <div className="tv-card-fuente">
                        📍 {pedido.fuente || "Directo"}
                      </div>
                      <div className="tv-card-items">
                        {(pedido.itemsSeleccionados || []).map((item, j) => (
                          <div key={j} className="tv-card-item">
                            <span className="tv-card-item-qty">{item.cantidad}×</span>
                            <span className="tv-card-item-name">{item.nombre}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="tv-card-footer">
                      <div className="tv-card-total">
                        ${Number(pedido.total || 0).toLocaleString("es-CO")}
                      </div>
                      <div className="tv-card-badge">En preparación</div>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        <div className="tv-footer">
          KITCHEN MANAGER — PANEL DE COCINA | Actualización automática cada 10 segundos
        </div>
      </div>
    </>
  );
}