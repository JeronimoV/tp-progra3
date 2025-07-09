//-----------------------------------------------------------------------------------
// Variables globales y referencias a elementos DOM
//-----------------------------------------------------------------------------------

let productos = [];

const contenedor = document.getElementsByClassName("contenedor-productos")[0];
const modal = document.getElementById("estado-modal");
const confirmarBtn = document.getElementById("confirmar-estado");
const cancelarBtn = document.getElementById("cancelar-estado");
const searchInput = document.getElementById("search-input");

let productoParaCambiarEstado = null; // Producto que se está activando/desactivando

//-----------------------------------------------------------------------------------
// Obtención de productos desde el backend
//-----------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", obtenerDatosProductos);

async function obtenerDatosProductos() {
  try {
    const respuesta = await fetch("http://localhost:3000/products");
    const datos = await respuesta.json();

    productos = datos.payload || []; // Asegurar que sea un array

    init();
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}

//-----------------------------------------------------------------------------------
// Inicialización del sistema (carga productos y asigna eventos)
//-----------------------------------------------------------------------------------

function init() {
  filtradoProductos();

  // Listener para búsqueda con debounce
  let debounceTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      filtradoProductos(searchInput.value.trim());
    }, 300);
  });
}

//-----------------------------------------------------------------------------------
// Generador de productos en HTML
//-----------------------------------------------------------------------------------

function generarProductos(listaProductos) {
  // Limpiar contenedor
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }

  // Botón para crear producto
  const crearLink = document.createElement("a");
  crearLink.textContent = "Crear Producto";
  crearLink.href = "/modelado";
  crearLink.className = "crear-producto-btn";
  contenedor.appendChild(crearLink);

  // Crear cada tarjeta de producto
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

    // Botón editar (link)
    const editarBtn = document.createElement("a");
    editarBtn.textContent = "Editar";
    editarBtn.href = `/editado?id=${producto.id}`;
    editarBtn.name = i;

    // Botón activar/desactivar
    const estadoBtn = document.createElement("button");
    estadoBtn.textContent = producto.estado ? "Desactivar" : "Activar";
    estadoBtn.name = i;

    // Botón eliminar
    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.name = i;

    // Eventos
    estadoBtn.addEventListener("click", () => modalConfirmacion(producto));
    eliminarBtn.addEventListener("click", () => eliminarProducto(producto));

    // Agregar elementos al div
    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(pPrecio);
    div.appendChild(pCategoria);
    div.appendChild(editarBtn);
    div.appendChild(estadoBtn);
    div.appendChild(eliminarBtn);

    // Agregar tarjeta al contenedor
    contenedor.appendChild(div);
  });
}

//-----------------------------------------------------------------------------------
// Filtrado de productos por texto ingresado en la búsqueda
//-----------------------------------------------------------------------------------

function filtradoProductos(texto = "") {
  let filtrados = productos;

  if (texto) {
    filtrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(texto.toLowerCase())
    );
  }

  generarProductos(filtrados);
}

//-----------------------------------------------------------------------------------
// Modal de confirmación para activar/desactivar producto
//-----------------------------------------------------------------------------------

function modalConfirmacion(producto) {
  productoParaCambiarEstado = producto;

  modal.style.display = "flex";

  // Definimos los manejadores en cada apertura para evitar acumulación de eventos
  confirmarBtn.onclick = async () => {
    modal.style.display = "none";

    const nuevoEstado = !productoParaCambiarEstado.estado;

    try {
      const res = await fetch(`http://localhost:3000/products/${productoParaCambiarEstado.id}`, {
        method: "POST", // o PUT si tu backend lo requiere
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

      productoParaCambiarEstado.estado = nuevoEstado; // Actualizar localmente
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
// Eliminar producto con confirmación y actualización backend
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
      // Remover localmente
      productos = productos.filter(p => p.id !== producto.id);
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