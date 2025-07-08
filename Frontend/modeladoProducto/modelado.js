const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevenir recarga

  const imagen = document.querySelector(".imagen").value.trim();
  const nombre = document.querySelector(".nombre").value.trim();
  const precio = parseFloat(document.querySelector(".precio").value);
  const categoria = document.querySelector(".categoria").value.trim();

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
        categoria
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Producto creado con éxito");
      // Redirigir al dashboard
      window.location.href = "../dashboard/dashboard.html";
    } else {
      alert("❌ Error: " + result.error);
    }

  } catch (error) {
    console.error("Error de conexión:", error);
    alert("❌ No se pudo conectar con el servidor.");
  }
});