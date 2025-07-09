//-----------------------------------------------------------------------------------
// Variables globales y referencias a elementos DOM
//-----------------------------------------------------------------------------------

let productos = []; // Array con los productos obtenidos del backend

const contenedor = document.getElementsByClassName("contenedor-productos")[0];
const modal = document.getElementById("estado-modal");
const confirmarBtn = document.getElementById("confirmar-estado");
const cancelarBtn = document.getElementById("cancelar-estado");
const searchInput = document.getElementById("search-input");

let productoParaCambiarEstado = null; // Producto seleccionado para cambiar estado

//-----------------------------------------------------------------------------------
// Obtención de productos desde el backend al cargar la página
//-----------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", obtenerDatosProductos);

async function obtenerDatosProductos() {
  try {
    const respuesta = await fetch("http://localhost:3000/products");
    const datos = await respuesta.json();

    productos = datos.payload || []; // Guardar productos o array vacío
    init();
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}

//-----------------------------------------------------------------------------------
// Inicialización: filtra productos y configura búsqueda con debounce
//-----------------------------------------------------------------------------------

function init() {
  filtradoProductos();

  let debounceTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      filtradoProductos(searchInput.value.trim());
    }, 300);
  });
}

//-----------------------------------------------------------------------------------
// Genera las tarjetas HTML para cada producto y botones de acción
//-----------------------------------------------------------------------------------

function generarProductos(listaProductos) {
  // Limpia el contenedor antes de agregar productos
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }

  // Agrega botón para crear nuevo producto
  const crearLink = document.createElement("a");
  crearLink.textContent = "Crear Producto";
  crearLink.href = "../modeladoProducto/modelado.html";
  crearLink.className = "crear-producto-btn";
  contenedor.appendChild(crearLink);

  // Por cada producto crea una tarjeta con información y botones
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

    // Botón para editar producto (link a página de edición)
    const editarBtn = document.createElement("a");
    editarBtn.textContent = "Editar";
    editarBtn.href = `../editadoProducto/editado.html?id=${producto.id}`;
    editarBtn.name = i;

    // Botón para activar o desactivar producto
    const estadoBtn = document.createElement("button");
    estadoBtn.textContent = producto.estado ? "Desactivar" : "Activar";
    estadoBtn.name = i;

    // Botón para eliminar producto
    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.name = i;

    // Asignar eventos para activar/desactivar y eliminar
    estadoBtn.addEventListener("click", () => modalConfirmacion(producto));
    eliminarBtn.addEventListener("click", () => eliminarProducto(producto));
    
    // Construir tarjeta con elementos
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
// Filtra productos según texto ingresado y actualiza la visualización
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
// Modal para confirmar activar o desactivar producto
//-----------------------------------------------------------------------------------

function modalConfirmacion(producto) {
  productoParaCambiarEstado = producto;

  modal.style.display = "flex";

  confirmarBtn.onclick = () => {
    cambiarEstadoProducto(productoParaCambiarEstado);
    modal.style.display = "none";
  };

  cancelarBtn.onclick = () => {
    productoParaCambiarEstado = null;
    modal.style.display = "none";
  };
}

//-----------------------------------------------------------------------------------
// Cambia el estado del producto en backend y actualiza UI
//-----------------------------------------------------------------------------------

async function cambiarEstadoProducto(producto) {
  const nuevoEstado = !producto.estado;

  try {
    const res = await fetch(`http://localhost:3000/products/${producto.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagen: producto.imagen,
        nombre: producto.nombre,
        precio: producto.precio,
        estado: nuevoEstado,
        categoria: producto.categoria,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      producto.estado = nuevoEstado; // Actualiza estado local
      filtradoProductos(searchInput.value.trim()); // Refresca lista
      alert(`Producto ${nuevoEstado ? "activado" : "desactivado"} con éxito.`);
    } else {
      alert("Error al cambiar estado: " + (data.error || "Error desconocido"));
    }
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    alert("No se pudo conectar con el servidor.");
  }
}

//-----------------------------------------------------------------------------------
// Elimina producto con confirmación y actualiza backend y UI
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
      // Eliminar localmente y refrescar vista
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