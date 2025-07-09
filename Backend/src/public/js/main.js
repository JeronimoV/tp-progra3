//-----------------------------------------------------------------------------------
// Variables globales
//-----------------------------------------------------------------------------------

// Lista de productos que se cargará desde el backend
let productos = [];

// Contenedor donde se insertarán los productos en el HTML
let contenedor = document.getElementsByClassName("contenedor-productos")[0];

// Carrito de compras (puede mantenerse en memoria o sincronizar con localStorage)
let carrito = [];


//-----------------------------------------------------------------------------------
// Obtener productos desde el backend
//-----------------------------------------------------------------------------------

async function obtenerDatosProductos() {
    try {
        // Se hace una petición GET al backend para obtener todos los productos
        const respuesta = await fetch("http://localhost:3000/products");
        const datos = await respuesta.json();

        productos = datos.payload; // Guardar los productos obtenidos

        // Verifica si en la URL hay un filtro de categoría para aplicarlo automáticamente
        const params = new URLSearchParams(window.location.search);
        const categoria = params.get("categoria");

        init(categoria); // Inicializa con (o sin) categoría
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}


//-----------------------------------------------------------------------------------
// Script de bienvenida y carga inicial
//-----------------------------------------------------------------------------------

// Al cargar la página, se saluda al usuario y se obtienen los productos
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    let nombre = params.get("nombre");

    // Si no viene el nombre por la URL, se intenta usar el del localStorage
    if (!nombre) {
        nombre = localStorage.getItem("nombre_usuario");
    }

    // Si hay nombre, mostrar mensaje de bienvenida
    if (nombre) {
        const bienvenida = document.getElementById("bienvenida-texto");
        if (bienvenida) {
            bienvenida.textContent = `¡Ahora sí, ${nombre}!`;
        }
    }

    obtenerDatosProductos(); // Inicia la carga de productos
});


//-----------------------------------------------------------------------------------
// Inicialización del sistema
//-----------------------------------------------------------------------------------

// Según si hay categoría o no, se filtra o se muestran todos
function init(categoria) {
    if (categoria) {
        filtradoCategoria(categoria);
    } else {
        generarProductos(productos);
    }
}


//-----------------------------------------------------------------------------------
// Generador de productos en HTML
//-----------------------------------------------------------------------------------

// Renderiza dinámicamente las tarjetas de productos en el contenedor
function generarProductos(productos) {
    // Limpia todo lo que haya antes para evitar duplicados
    while (contenedor.hasChildNodes()) {
        contenedor.removeChild(contenedor.firstChild);
    }

    // Si no hay productos, mostrar un mensaje
    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    // Itera sobre los productos y crea sus elementos HTML
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].estado) { // Solo productos activos
            let div = document.createElement("article");
            let img = document.createElement("img");
            let h3 = document.createElement("h3");
            let p = document.createElement("p");
            let button = document.createElement("button");

            div.className = "card-producto";
            img.src = productos[i].imagen;
            h3.textContent = productos[i].nombre;
            p.textContent = "$" + productos[i].precio;
            button.textContent = "Agregar Carrito";
            button.name = i;

            // Al hacer clic en el botón, abre el modal para agregar al carrito
            button.addEventListener("click", function (event) {
                agregarCarrito(productos[event.currentTarget.name]);
            });

            // Agrega los elementos a la tarjeta
            div.appendChild(img);
            div.appendChild(h3);
            div.appendChild(p);
            div.appendChild(button);

            // Agrega la tarjeta al contenedor general
            contenedor.appendChild(div);
        }
    }
}


//-----------------------------------------------------------------------------------
// Filtro por categoría
//-----------------------------------------------------------------------------------

// Filtra los productos por categoría (viene desde la URL)
function filtradoCategoria(categoria) {
    const filtrados = productos.filter(p => p.categoria === categoria && p.estado);
    generarProductos(filtrados);
}


//-----------------------------------------------------------------------------------
// Filtro por texto en buscador (si estuviera presente)
//-----------------------------------------------------------------------------------

function filtradoProductos(string) {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria");

    let elementos = productos;

    // Primero filtra por categoría si existe
    if (categoria) {
        elementos = productos.filter(p => p.categoria === categoria && p.estado);
    }

    // Luego filtra por texto si hay algo escrito
    if (string && string !== "") {
        elementos = elementos.filter(el => el.nombre.toLowerCase().includes(string.toLowerCase()));
    }

    generarProductos(elementos);
}


//-----------------------------------------------------------------------------------
// Modal de cantidad para agregar al carrito
//-----------------------------------------------------------------------------------

// Abre un modal para que el usuario indique cuántas unidades desea agregar
function agregarCarrito(productoAgregar) {
    const modal = document.getElementById("cantidad-modal");
    const input = document.getElementById("cantidad-input");
    const confirmar = document.getElementById("confirmar-cantidad");
    const cancelar = document.getElementById("cancelar-cantidad");

    modal.style.display = "flex"; // Mostrar el modal
    input.value = ""; // Resetear el input

    // Confirmar cantidad y agregar al carrito (localStorage)
    confirmar.onclick = function () {
        let cantidad = parseInt(input.value, 10);

        if (!isNaN(cantidad) && cantidad > 0) {
            let item = { ...productoAgregar, cantidad };
            let productosGuardados = JSON.parse(localStorage.getItem("producto")) || [];

            // Si ya está en el carrito, sumamos la cantidad
            let index = productosGuardados.findIndex(p => p.nombre === item.nombre);
            if (index !== -1) {
                productosGuardados[index].cantidad += cantidad;
            } else {
                productosGuardados.push(item);
            }

            // Guardamos el carrito en localStorage
            localStorage.setItem("producto", JSON.stringify(productosGuardados));
            modal.style.display = "none";
        } else {
            alert("Ingresá una cantidad válida.");
        }
    };

    // Cancelar el agregado
    cancelar.onclick = function () {
        modal.style.display = "none";
    };
}