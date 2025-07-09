// Al cargar el DOM, se busca el ticket de compra en localStorage
window.addEventListener("DOMContentLoaded", () => {
  const ticket = JSON.parse(localStorage.getItem("ticket"));

  // Si no hay ticket, se muestra un mensaje y se detiene la ejecución
  if (!ticket) {
    document.body.innerHTML = "<h2>No hay datos de compra disponibles.</h2>";
    return;
  }

  // Se insertan los datos del ticket en los elementos HTML correspondientes
  document.getElementById("empresa").textContent = ticket.empresa;
  document.getElementById("cliente").textContent = ticket.cliente;
  document.getElementById("fecha").textContent = ticket.fecha;
  document.getElementById("hora").textContent = ticket.hora;
  document.getElementById("producto").textContent = ticket.producto;
  document.getElementById("cantidad").textContent = ticket.cantidad;
  document.getElementById("precio").textContent = ticket.precio;
  document.getElementById("total").textContent = ticket.total;
});