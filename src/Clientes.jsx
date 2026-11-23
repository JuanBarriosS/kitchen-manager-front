const handleEnviar = async () => {
  setMostrarConfirmacion(false);
  setEnviando(true); setResultado(null);

  // GUARDA PRIMERO (no depende del backend)
  guardarAsignacion(meseroSeleccionado);
  setTick(t => t + 1);

  try {
    const url = token
      ? `https://kitchen-manager-back.onrender.com/menu/${token}/pedido`
      : "https://kitchen-manager-back.onrender.com/clientes/registrarPedido";
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
    const res = await axios.post(url, payload);
    const pedidoId = res.data?.id || res.data?.pedidoId || "";
    setResultado({ ok: true, msg: "¡Pedido enviado!", pedidoId });
    setPedidoEnviado(true);
  } catch (error) {
    setResultado({ ok: false, msg: "Error al enviar el pedido. Intenta de nuevo." });
  } finally {
    setEnviando(false);
  }
};
