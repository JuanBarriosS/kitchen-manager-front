import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE = "https://archlinux.taildc096b.ts.net:8443";

// ICONOS SVG
const RecibidoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PreparacionIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ListoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const EntregadoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ESTADOS = [
  { key: "recibido",    label: "Pedido recibido", icon: <RecibidoIcon /> },
  { key: "preparacion", label: "En preparación",  icon: <PreparacionIcon /> },
  { key: "listo",       label: "Pedido listo / En camino",    icon: <ListoIcon /> },
  { key: "entregado",   label: "Entregado",       icon: <EntregadoIcon /> },
];

export default function SeguimientoPedido() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError]   = useState(false);

  const cargar = async () => {
    try {
      const res = await axios.get(`${BASE}/seguimiento/${id}`);
      setPedido(res.data);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    cargar();
    const iv = setInterval(cargar, 4000);
    return () => clearInterval(iv);
  }, [id]);

  const indexActual = ESTADOS.findIndex(e =>
    e.key === pedido?.estado || 
    (pedido?.estado === "en preparación" && e.key === "preparacion")
  );

  if (error) return (
    <div style={{ minHeight:"100vh", background:"#0C0E14", display:"flex",
      alignItems:"center", justifyContent:"center", color:"#F2EDE4",
      fontFamily:"DM Sans,sans-serif", textAlign:"center", padding:"24px" }}>
      <div>
        <div style={{ fontSize:"48px", marginBottom:"16px" }}>😕</div>
        <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.5rem" }}>Pedido no encontrado</div>
        <div style={{ fontSize:"13px", color:"rgba(232,230,223,0.4)", marginTop:"8px" }}>
          El enlace puede haber expirado
        </div>
      </div>
    </div>
  );

  if (!pedido) return (
    <div style={{ minHeight:"100vh", background:"#0C0E14", display:"flex",
      alignItems:"center", justifyContent:"center", color:"#C8892A",
      fontFamily:"Cormorant Garamond,serif", fontSize:"1.2rem" }}>
      Cargando tu pedido...
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0C0E14", color:"#F2EDE4",
      fontFamily:"DM Sans,sans-serif", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"24px" }}>
      <div style={{ maxWidth:"420px", width:"100%" }}>

        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{ fontSize:"11px", color:"#C8892A", letterSpacing:"3px",
            textTransform:"uppercase", marginBottom:"8px" }}>Kitchen Manager</div>
          <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.8rem", fontWeight:"600" }}>
            Seguimiento de pedido
          </div>
          <div style={{ fontSize:"13px", color:"rgba(232,230,223,0.5)", marginTop:"6px" }}>
            {pedido.nombreCliente} · #{id.slice(-6).toUpperCase()}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:"6px", marginTop:"10px", fontSize:"11px", color:"#4CAF50" }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#4CAF50",
              animation:"pulse 1.5s infinite" }} />
            Actualizando en tiempo real
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
          {ESTADOS.map((estado, i) => {
            const pasado = i <= indexActual;
            const actual = i === indexActual;
            return (
              <div key={estado.key} style={{
                display:"flex", alignItems:"center", gap:"16px",
                padding:"16px 20px", borderRadius:"8px",
                background: actual ? "rgba(200,137,42,0.1)" : pasado ? "rgba(255,255,255,0.03)" : "transparent",
                border: actual ? "1px solid rgba(200,137,42,0.3)" : "1px solid rgba(255,255,255,0.06)",
                transition:"all .4s",
              }}>
                <div style={{ 
                  fontSize:"22px", 
                  opacity: pasado ? 1 : 0.2,
                  color: actual ? "#E8A830" : pasado ? "#4CAF50" : "rgba(232,230,223,0.25)",
                  display: "flex",
                  alignItems: "center"
                }}>
                  {estado.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"14px", fontWeight: actual ? "600" : "400",
                    color: actual ? "#E8A830" : pasado ? "#F2EDE4" : "rgba(232,230,223,0.25)" }}>
                    {estado.label}
                  </div>
                  {actual && (
                    <div style={{ fontSize:"11px", color:"rgba(232,230,223,0.4)", marginTop:"2px" }}>
                      Estado actual
                    </div>
                  )}
                </div>
                {pasado && (
                  <span style={{ color: actual ? "#E8A830" : "#4CAF50", fontSize:"16px" }}>
                    {actual ? "●" : "✓"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding:"16px 20px", background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.06)", borderRadius:"8px" }}>
          <div style={{ fontSize:"10px", color:"rgba(232,230,223,0.4)", letterSpacing:"2px",
            textTransform:"uppercase", marginBottom:"10px" }}>Tu pedido</div>
          {(pedido.itemsSeleccionados || []).map((item, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between",
              fontSize:"13px", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <span>{item.cantidad}× {item.nombre}</span>
              <span style={{ color:"rgba(232,230,223,0.5)" }}>
                ${Number((item.precio || 0) * (item.cantidad || 1)).toLocaleString("es-CO")}
              </span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"12px",
            fontFamily:"Cormorant Garamond,serif", fontSize:"1.3rem", fontWeight:"700" }}>
            <span>Total</span>
            <span style={{ color:"#E8A830" }}>${Number(pedido.total).toLocaleString("es-CO")}</span>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:"20px", fontSize:"11px",
          color:"rgba(232,230,223,0.2)", letterSpacing:"1px" }}>
          KITCHEN MANAGER · SISTEMA DE SEGUIMIENTO
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
      `}</style>
    </div>
  );
}