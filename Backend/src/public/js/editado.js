//-----------------------------------------------------------------------------------
// Variables globales y referencias a elementos del DOM
//-----------------------------------------------------------------------------------

// Formulario del HTML
const form = document.querySelector(".form");

// Obtener el parámetro ID del producto desde la URL
const id = new URLSearchParams(window.location.search).get("id");

// Inputs del formulario
const imagenInput = document.querySelector(".link-imagen");
const nombreInput = document.querySelector(".nombre-producto");
const precioInput = document.querySelector(".precio-producto");
const categoriaInput = document.querySelector(".categoria-producto"); // Input para categoría (nuevo campo)

//-----------------------------------------------------------------------------------
// Al cargar la página, se obtiene la información del producto a editar
//-----------------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", cargadoDeInfo);

async function cargadoDeInfo() {
  if (!id) {
    alert("❌ No se especificó el ID del producto.");
    return;
  }

  try {
    // Trae los datos del producto desde el backend usando el ID de la URL
    const response = await fetch(`http://localhost:3000/products/${id}`);
    const data = await response.json();

    if (response.ok) {
      const producto = data.payload;

      // Rellenar los campos del formulario con la información actual
      imagenInput.value = producto.imagen;
      nombreInput.value = producto.nombre;
      precioInput.value = producto.precio;
      categoriaInput.value = producto.categoria || ""; // Si no hay categoría, usar string vacío
    } else {
      alert("⚠️ No se pudo cargar el producto.");
    }
  } catch (error) {
    console.error("Error al cargar producto:", error);
    alert("⚠️ Error de conexión al cargar el producto.");
  }
}

//-----------------------------------------------------------------------------------
// Envío del formulario para editar el producto
//-----------------------------------------------------------------------------------
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevenir que se recargue la página

  // Obtener valores ingresados por el usuario
  const imagen = imagenInput.value.trim();
  const nombre = nombreInput.value.trim();
  const precio = parseFloat(precioInput.value);
  const categoria = categoriaInput.value.trim();

  // Validaciones básicas
  if (!imagen || !nombre || !categoria || isNaN(precio) || precio <= 0) {
    alert("⚠️ Completá los campos correctamente.");
    return;
  }

  // Crear objeto con la información del producto actualizado
  const productoEditado = {
    imagen,
    nombre,
    precio,
    estado: true, // Se asume que el producto editado sigue activo
    categoria
  };

  try {
    // Enviar los datos actualizados al backend (actualización por ID)
    const response = await fetch(`http://localhost:3000/products/${id}`, {
      method: "POST", // Usar PUT si tu backend lo requiere
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productoEditado)
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Producto editado con éxito.");
      window.location.href = "/dashboard?editado=true"; // Redirige al dashboard
    } else {
      alert("❌ No se pudo editar el producto: " + data.error);
    }
  } catch (error) {
    console.error("Error al editar:", error);
    alert("⚠️ Error de conexión al editar.");
  }
});