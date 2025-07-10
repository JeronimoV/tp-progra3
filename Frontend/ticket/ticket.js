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

  // Botón para generar y descargar ticket en PDF con jsPDF
  const btnPDF = document.createElement("button");
  btnPDF.textContent = "Descargar PDF";

  // Al hacer clic, se ejecuta la función que crea el PDF
  btnPDF.addEventListener("click", () => generarPDF(ticket));

  // Se agrega el botón a la interfaz del ticket
  document.querySelector(".ticket").appendChild(btnPDF);
});


//Genera un ticket en formato PDF usando la biblioteca jsPDF.
//Incluye los mismos datos que el ticket visual, y los guarda como archivo descargable.

function generarPDF(ticket) {
  const { jsPDF } = window.jspdf; // Se accede al módulo jsPDF global
  const doc = new jsPDF(); // Se crea un nuevo documento

  // Título del ticket
  doc.setFontSize(16);
  doc.text("Ticket de Compra", 20, 20);

  // Contenido del ticket
  doc.setFontSize(12);
  doc.text(`Empresa: ${ticket.empresa}`, 20, 40);
  doc.text(`Cliente: ${ticket.cliente}`, 20, 50);
  doc.text(`Fecha: ${ticket.fecha}`, 20, 60);
  doc.text(`Hora: ${ticket.hora}`, 20, 70);
  doc.text(`Producto: ${ticket.producto}`, 20, 80);
  doc.text(`Cantidad: ${ticket.cantidad}`, 20, 90);
  doc.text(`Precio Unitario: $${ticket.precio}`, 20, 100);
  doc.text(`Total: $${ticket.total}`, 20, 110);

  // Mensaje final
  doc.text("¡Gracias por tu compra!", 20, 130);

  // Guarda el archivo como PDF
  doc.save("ticket_compra.pdf");
}