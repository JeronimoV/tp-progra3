//-----------------------------------------------------------------------------------
// Variables globales y referencias a elementos del DOM
//-----------------------------------------------------------------------------------

let productos = []; // Almacena la lista de productos obtenidos desde el backend

const contenedor = document.getElementsByClassName("contenedor-productos")[0]; // Contenedor donde se renderizan los productos
const modal = document.getElementById("estado-modal"); // Modal de confirmación para activar/desactivar producto
const confirmarBtn = document.getElementById("confirmar-estado"); // Botón de confirmar en el modal
const cancelarBtn = document.getElementById("cancelar-estado"); // Botón de cancelar en el modal
const searchInput = document.getElementById("search-input"); // Input para filtrar productos por nombre

let productoParaCambiarEstado = null; // Guarda el producto seleccionado para cambiar su estado

//-----------------------------------------------------------------------------------
// Al cargar el DOM se obtienen los productos desde el backend
//-----------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", obtenerDatosProductos);

async function obtenerDatosProductos() {
  try {
    const respuesta = await fetch("http://localhost:3000/products");
    const datos = await respuesta.json();

    productos = datos.payload || []; // Se asegura que siempre sea un array válido

    init(); // Se inicializa el sistema una vez cargados los productos
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}

//-----------------------------------------------------------------------------------
// Inicialización del sistema: render y buscador con debounce
//-----------------------------------------------------------------------------------
function init() {
  filtradoProductos(); // Muestra todos los productos por defecto

  // Debounce en el buscador para evitar llamados innecesarios
  let debounceTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      filtradoProductos(searchInput.value.trim());
    }, 300);
  });
}

//-----------------------------------------------------------------------------------
// Renderiza productos en el HTML
//-----------------------------------------------------------------------------------
function generarProductos(listaProductos) {
  // Limpia el contenedor de productos antes de generar nuevos elementos
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }

  // Agrega un botón para crear nuevos productos
  const crearLink = document.createElement("a");
  crearLink.textContent = "Crear Producto";
  crearLink.href = "/modelado"; // Redirecciona a la vista de creación
  crearLink.className = "crear-producto-btn";
  contenedor.appendChild(crearLink);

  // Recorre la lista de productos y los renderiza en tarjetas
  listaProductos.forEach((producto, i) => {
    const div = document.createElement("article");
    div.className = producto.estado ? "card-producto" : "card-producto-inactivo";

    const img = document.createElement("img");
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const h3 = document.createElement("h3");
    h3.textContent = producto.nombre;

    const pPrecio = document.createElement("p");
    pPrecio.textContent = "$" + producto.precio.toFixed(2);

    const pCategoria = document.createElement("p");
    pCategoria.textContent = producto.categoria;

    // Botón de edición
    const editarBtn = document.createElement("a");
    editarBtn.textContent = "Editar";
    editarBtn.href = `/editado?id=${producto.id}`;
    editarBtn.name = i;

    // Botón para cambiar estado
    const estadoBtn = document.createElement("button");
    estadoBtn.textContent = producto.estado ? "Desactivar" : "Activar";
    estadoBtn.name = i;

    // Botón para eliminar producto
    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.name = i;

    // Asignar eventos
    estadoBtn.addEventListener("click", () => modalConfirmacion(producto));
    eliminarBtn.addEventListener("click", () => eliminarProducto(producto));

    // Agregar todos los elementos a la tarjeta
    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(pPrecio);
    div.appendChild(pCategoria);
    div.appendChild(editarBtn);
    div.appendChild(estadoBtn);
    div.appendChild(eliminarBtn);

    contenedor.appendChild(div);
  });
}

//-----------------------------------------------------------------------------------
// Filtra productos por nombre (usado por buscador)
//-----------------------------------------------------------------------------------
function filtradoProductos(texto = "") {
  let filtrados = productos;

  // Filtra si hay texto ingresado en el buscador
  if (texto) {
    filtrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(texto.toLowerCase())
    );
  }

  generarProductos(filtrados); // Renderiza el resultado
}

//-----------------------------------------------------------------------------------
// Muestra el modal para confirmar activación/desactivación
//-----------------------------------------------------------------------------------
function modalConfirmacion(producto) {
  productoParaCambiarEstado = producto;
  modal.style.display = "flex";

  // Asigna manejadores de confirmación/cancelación en cada apertura
  confirmarBtn.onclick = async () => {
    modal.style.display = "none";

    const nuevoEstado = !productoParaCambiarEstado.estado;

    try {
      const res = await fetch(`http://localhost:3000/products/${productoParaCambiarEstado.id}`, {
        method: "POST", // Usar PUT si tu API lo requiere
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagen: productoParaCambiarEstado.imagen,
          nombre: productoParaCambiarEstado.nombre,
          precio: productoParaCambiarEstado.precio,
          estado: nuevoEstado,
          categoria: productoParaCambiarEstado.categoria,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + (data.error || "Error desconocido"));
        return;
      }

      productoParaCambiarEstado.estado = nuevoEstado;
      filtradoProductos(searchInput.value.trim());
      alert(`Producto ${nuevoEstado ? "activado" : "desactivado"} con éxito.`);
    } catch (error) {
      alert("Error al comunicarse con el servidor.");
      console.error(error);
    }
  };

  cancelarBtn.onclick = () => {
    productoParaCambiarEstado = null;
    modal.style.display = "none";
  };
}

//-----------------------------------------------------------------------------------
// Elimina un producto del backend y actualiza la vista
//-----------------------------------------------------------------------------------
async function eliminarProducto(producto) {
  const confirmacion = confirm(`¿Seguro quieres eliminar el producto "${producto.nombre}"? Esta acción es irreversible.`);

  if (!confirmacion) return;

  try {
    const res = await fetch(`http://localhost:3000/products/${producto.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      productos = productos.filter(p => p.id !== producto.id); // Elimina localmente
      filtradoProductos(searchInput.value.trim());
      alert("Producto eliminado con éxito.");
    } else {
      alert("Error al eliminar producto: " + (data.error || "Error desconocido"));
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    alert("No se pudo conectar con el servidor.");
  }
}