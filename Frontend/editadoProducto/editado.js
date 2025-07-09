//-------------------------------------------------------------------------
// Referencias a elementos del formulario y obtención del ID desde la URL
//-------------------------------------------------------------------------

const form = document.querySelector(".form");
const id = new URLSearchParams(window.location.search).get("id");

const imagenInput = document.querySelector(".link-imagen");
const nombreInput = document.querySelector(".nombre-producto");
const precioInput = document.querySelector(".precio-producto");
const categoriaInput = document.querySelector(".categoria-producto"); // Campo de categoría

//-------------------------------------------------------------------------
// Cargar los datos actuales del producto al cargar la página
//-------------------------------------------------------------------------

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
      // Rellenar campos del formulario con datos actuales del producto
      imagenInput.value = producto.imagen;
      nombreInput.value = producto.nombre;
      precioInput.value = producto.precio;
      categoriaInput.value = producto.categoria || "";
    } else {
      alert("⚠️ No se pudo cargar el producto.");
    }
  } catch (error) {
    console.error("Error al cargar producto:", error);
    alert("⚠️ Error de conexión al cargar el producto.");
  }
}

//-------------------------------------------------------------------------
// Envío del formulario: validación y actualización del producto
//-------------------------------------------------------------------------

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const imagen = imagenInput.value.trim();
  const nombre = nombreInput.value.trim();
  const precio = parseFloat(precioInput.value);
  const categoria = categoriaInput.value.trim();

  // Validación básica de los campos
  if (!imagen || !nombre || !categoria || isNaN(precio) || precio <= 0) {
    alert("⚠️ Completá los campos correctamente.");
    return;
  }

  const productoEditado = {
    imagen,
    nombre,
    precio,
    estado: true, // El producto editado se guarda como activo
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
      // Redirigir al dashboard tras editar
      window.location.href = "../dashboard/dashboard.html?editado=true";
    } else {
      alert("❌ No se pudo editar el producto: " + data.error);
    }
  } catch (error) {
    console.error("Error al editar:", error);
    alert("⚠️ Error de conexión al editar.");
  }
});