//-----------------------------------------------------------------------------------
// Variables globales
//-----------------------------------------------------------------------------------
let productos = [];
let contenedor = document.getElementsByClassName("contenedor-productos")[0];
let carrito = [];

//-----------------------------------------------------------------------------------
// Obtener productos desde el backend
//-----------------------------------------------------------------------------------
async function obtenerDatosProductos() {
    try {
        const respuesta = await fetch("http://localhost:3000/products");
        const datos = await respuesta.json();
        productos = datos.payload;

        const params = new URLSearchParams(window.location.search);
        const categoria = params.get("categoria");

        init(categoria);
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

//-----------------------------------------------------------------------------------
// Script de bienvenida y carga inicial
//-----------------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");

    if (nombre) {
        const bienvenida = document.getElementById("bienvenida-texto");
        if (bienvenida) {
            bienvenida.textContent = `¡Ahora sí, ${nombre}!`;
        }
    }

    obtenerDatosProductos(); // Se cargan desde el backend
});

//-----------------------------------------------------------------------------------
// Inicialización del sistema
//-----------------------------------------------------------------------------------
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
function generarProductos(productos) {
    while (contenedor.hasChildNodes()) {
        contenedor.removeChild(contenedor.firstChild);
    }

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].estado) {
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

            button.addEventListener("click", function (event) {
                agregarCarrito(productos[event.currentTarget.name]);
            });

            div.appendChild(img);
            div.appendChild(h3);
            div.appendChild(p);
            div.appendChild(button);

            contenedor.appendChild(div);
        }
    }
}

//-----------------------------------------------------------------------------------
// Filtro por categoría
//-----------------------------------------------------------------------------------
function filtradoCategoria(categoria) {
    const filtrados = productos.filter(p => p.categoria === categoria && p.estado);
    generarProductos(filtrados);
}

//-----------------------------------------------------------------------------------
// Filtro por texto en buscador
//-----------------------------------------------------------------------------------
function filtradoProductos(string) {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria");

    let elementos = productos;

    if (categoria) {
        elementos = productos.filter(p => p.categoria === categoria && p.estado);
    }

    if (string && string !== "") {
        elementos = elementos.filter(el => el.nombre.toLowerCase().includes(string.toLowerCase()));
    }

    generarProductos(elementos);
}

//-----------------------------------------------------------------------------------
// Modal de cantidad para agregar al carrito
//-----------------------------------------------------------------------------------
function agregarCarrito(productoAgregar) {
    const modal = document.getElementById("cantidad-modal");
    const input = document.getElementById("cantidad-input");
    const confirmar = document.getElementById("confirmar-cantidad");
    const cancelar = document.getElementById("cancelar-cantidad");

    modal.style.display = "flex";
    input.value = "";

    confirmar.onclick = function () {
        let cantidad = parseInt(input.value, 10);

        if (!isNaN(cantidad) && cantidad > 0) {
            let item = { ...productoAgregar, cantidad };
            let productosGuardados = JSON.parse(localStorage.getItem("producto")) || [];

            let index = productosGuardados.findIndex(p => p.nombre === item.nombre);
            if (index !== -1) {
                productosGuardados[index].cantidad += cantidad;
            } else {
                productosGuardados.push(item);
            }

            localStorage.setItem("producto", JSON.stringify(productosGuardados));
            modal.style.display = "none";
        } else {
            alert("Ingresá una cantidad válida.");
        }
    };

    cancelar.onclick = function () {
        modal.style.display = "none";
    };
}