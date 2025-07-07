//-----------------------------------------------------------------------------------
// Obtención de productos desde el backend
//-----------------------------------------------------------------------------------

let productos = [];

document.addEventListener("DOMContentLoaded", obtenerDatosProductos);

async function obtenerDatosProductos() {
    try {
        const respuesta = await fetch("http://localhost:3000/products");
        const datos = await respuesta.json();

        productos = datos.payload || []; // Aseguramos que sea un array

        init();
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

//-----------------------------------------------------------------------------------
// Inicialización del sistema
//-----------------------------------------------------------------------------------

function init() {
    filtradoProductos();
}

//-----------------------------------------------------------------------------------
// Generador de productos en HTML
//-----------------------------------------------------------------------------------

function generarProductos(productos) {
    const contenedor = document.getElementsByClassName("contenedor-productos")[0];

    while (contenedor.hasChildNodes()) {
        contenedor.removeChild(contenedor.firstChild);
    }

    const creacion = document.createElement("a");
    creacion.textContent = "Crear Producto";
    creacion.href = "../modeladoProducto/modelado.html";
    contenedor.appendChild(creacion);

    productos.forEach((producto, i) => {
        const div = document.createElement("article");
        const img = document.createElement("img");
        const h3 = document.createElement("h3");
        const p = document.createElement("p");
        const editarBtn = document.createElement("a");
        const estadoBtn = document.createElement("button");

        img.src = producto.imagen;
        h3.textContent = producto.nombre;
        p.textContent = "$" + producto.precio;
        editarBtn.textContent = "Editar";
        editarBtn.href = `../editadoProducto/editado.html?id=${producto.id}`;
        editarBtn.name = i;

        estadoBtn.textContent = producto.estado ? "Desactivar" : "Activar";
        div.className = producto.estado ? "card-producto" : "card-producto-inactivo";
        estadoBtn.name = i;

        editarBtn.addEventListener("click", function (event) {
            mostrarCarrito(productos[event.target.name]);
        });

        estadoBtn.addEventListener("click", function (event) {
            modalConfirmacion(productos[event.target.name]);
        });

        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(p);
        div.appendChild(editarBtn);
        div.appendChild(estadoBtn);
        contenedor.appendChild(div);
    });
}

//-----------------------------------------------------------------------------------
// Filtro de productos por texto ingresado
//-----------------------------------------------------------------------------------

function filtradoProductos(string = "") {
    let filtrados = productos;

    if (string) {
        filtrados = productos.filter(el =>
            el.nombre.toLowerCase().includes(string.toLowerCase())
        );
    }

    generarProductos(filtrados);
}

//-----------------------------------------------------------------------------------
// Activar y desactivar productos
//-----------------------------------------------------------------------------------

function activarYDesactivar(producto) {
    producto.estado = !producto.estado;
    generarProductos(productos);
}

//-----------------------------------------------------------------------------------
// Modal de confirmación
//-----------------------------------------------------------------------------------

function modalConfirmacion(producto) {
    const modal = document.getElementById("estado-modal");
    const confirmar = document.getElementById("confirmar-estado");
    const cancelar = document.getElementById("cancelar-estado");

    modal.style.display = "flex";

    confirmar.onclick = function () {
        activarYDesactivar(producto);
        modal.style.display = "none";
    };

    cancelar.onclick = function () {
        modal.style.display = "none";
    };
}