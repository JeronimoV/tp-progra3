//-----------------------------------------------------------------------------------
// Referencia al formulario del DOM
//-----------------------------------------------------------------------------------

const form = document.querySelector("form");

//-----------------------------------------------------------------------------------
// Evento submit del formulario
//-----------------------------------------------------------------------------------

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevenir recarga de la página al enviar el formulario

  // Obtener valores de los campos del formulario
  const imagen = document.querySelector(".link-imagen").value.trim();
  const nombre = document.querySelector(".nombre-producto").value.trim();
  const precio = parseFloat(document.querySelector(".precio-producto").value);
  const categoria = document.querySelector(".categoria-producto").value.trim();

  //-----------------------------------------------------------------------------------
  // Validaciones básicas de los campos
  //-----------------------------------------------------------------------------------

  if (!imagen || !nombre || !categoria || isNaN(precio)) {
    alert("⚠️ Completá todos los campos correctamente.");
    return;
  }

  if (precio <= 0) {
    alert("⚠️ El precio debe ser mayor a 0.");
    return;
  }

  //-----------------------------------------------------------------------------------
  // Envío de datos al backend mediante fetch
  //-----------------------------------------------------------------------------------

  try {
    const response = await fetch("http://localhost:3000/products", {
      method: "POST", // Método para crear un nuevo recurso
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imagen,
        nombre,
        precio,
        categoria,
        estado: true // El producto se crea con estado activo por defecto
      })
    });

    const result = await response.json(); // Obtener respuesta del backend

    if (response.ok) {
      alert("✅ Producto creado con éxito");
      // Redireccionar al dashboard una vez creado
      window.location.href = "/dashboard";
    } else {
      alert("❌ Error: " + result.error);
    }

  } catch (error) {
    console.error("Error de conexión:", error);
    alert("❌ No se pudo conectar con el servidor.");
  }
});