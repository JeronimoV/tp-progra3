const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevenir recarga

  const imagen = document.querySelector(".link-imagen").value.trim();
  const nombre = document.querySelector(".nombre-producto").value.trim();
  const precio = parseFloat(document.querySelector(".precio-producto").value);
  const categoria = document.querySelector(".categoria-producto").value.trim();

  // Validaciones
  if (!imagen || !nombre || !categoria || isNaN(precio)) {
    alert("⚠️ Completá todos los campos correctamente.");
    return;
  }

  if (precio <= 0) {
    alert("⚠️ El precio debe ser mayor a 0.");
    return;
  }

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
        categoria,
        estado: true // agrega estado inicial
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Producto creado con éxito");
      // Redirigir al dashboard
      window.location.href = "/dashboard";
    } else {
      alert("❌ Error: " + result.error);
    }

  } catch (error) {
    console.error("Error de conexión:", error);
    alert("❌ No se pudo conectar con el servidor.");
  }
});