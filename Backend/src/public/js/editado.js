const form = document.querySelector(".form");
const id = new URLSearchParams(window.location.search).get("id");

const imagenInput = document.querySelector(".link-imagen");
const nombreInput = document.querySelector(".nombre-producto");
const precioInput = document.querySelector(".precio-producto");
const categoriaInput = document.querySelector(".categoria-producto"); // NUEVO

window.addEventListener("DOMContentLoaded", cargadoDeInfo);

async function cargadoDeInfo() {
  if (!id) {
    alert("❌ No se especificó el ID del producto.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/products/${id}`);
    const data = await response.json();

    if (response.ok) {
      const producto = data.payload;
      imagenInput.value = producto.imagen;
      nombreInput.value = producto.nombre;
      precioInput.value = producto.precio;
      categoriaInput.value = producto.categoria || ""; // ASIGNAR CATEGORÍA REAL
    } else {
      alert("⚠️ No se pudo cargar el producto.");
    }

  } catch (error) {
    console.error("Error al cargar producto:", error);
    alert("⚠️ Error de conexión al cargar el producto.");
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const imagen = imagenInput.value.trim();
  const nombre = nombreInput.value.trim();
  const precio = parseFloat(precioInput.value);
  const categoria = categoriaInput.value.trim(); // NUEVO

  if (!imagen || !nombre || !categoria || isNaN(precio) || precio <= 0) {
    alert("⚠️ Completá los campos correctamente.");
    return;
  }

  const productoEditado = {
    imagen,
    nombre,
    precio,
    estado: true,
    categoria
  };

  try {
    const response = await fetch(`http://localhost:3000/products/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productoEditado)
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Producto editado con éxito.");
      window.location.href = "/dashboard?editado=true";
    } else {
      alert("❌ No se pudo editar el producto: " + data.error);
    }

  } catch (error) {
    console.error("Error al editar:", error);
    alert("⚠️ Error de conexión al editar.");
  }
});