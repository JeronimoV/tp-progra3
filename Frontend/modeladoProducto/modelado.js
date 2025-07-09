// Selección del formulario
const form = document.querySelector("form");

// Evento al enviar el formulario
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Evita que se recargue la página

  // Obtener valores del formulario
  const imagen = document.querySelector(".imagen").value.trim();
  const nombre = document.querySelector(".nombre").value.trim();
  const precio = parseFloat(document.querySelector(".precio").value);
  const categoria = document.querySelector(".categoria").value.trim();

  // Validaciones básicas
  if (!imagen || !nombre || !categoria || isNaN(precio)) {
    alert("⚠️ Completá todos los campos correctamente.");
    return;
  }

  if (precio <= 0) {
    alert("⚠️ El precio debe ser mayor a 0.");
    return;
  }

  // Enviar datos al backend para crear producto
  try {
    const response = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imagen,
        nombre,
        precio,
        categoria
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Producto creado con éxito");
      // Redirige al dashboard después de crear el producto
      window.location.href = "../dashboard/dashboard.html";
    } else {
      alert("❌ Error: " + result.error);
    }

  } catch (error) {
    console.error("Error de conexión:", error);
    alert("❌ No se pudo conectar con el servidor.");
  }
});