//-----------------------------------------------------------------------------------
// Variables globales
//-----------------------------------------------------------------------------------
let productos = [];
let productoCopia = [];
let contenedor = document.getElementsByClassName("contenedor-productos")[0];
let paginaText = document.getElementsByClassName("pagina")[0];
let botonRight = document.getElementsByClassName("button_right")[0];
let botonLeft = document.getElementsByClassName("button_left")[0];
let carrito = []; // Array auxiliar (no usado directamente en este archivo)
let numPagina = 0

botonRight.addEventListener("click", () => {
    if(9+9*numPagina < productos.length){
        numPagina++
        paginaText.textContent = numPagina;
        generarProductos()
    }
})

botonLeft.addEventListener("click", () => {
    if(numPagina != 0){
        numPagina--
        paginaText.textContent = numPagina;
        generarProductos()
    }
})

//-----------------------------------------------------------------------------------
// Obtener productos desde el backend y luego iniciar la interfaz
//-----------------------------------------------------------------------------------
async function obtenerDatosProductos() {
    try {
        const respuesta = await fetch("http://localhost:3000/products");
        const datos = await respuesta.json();
        productos = datos.payload;
        productoCopia = datos.payload;

        // Si hay una categoría en la URL, se filtra por ella
        const params = new URLSearchParams(window.location.search);
        const categoria = params.get("categoria");

        init(categoria);
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

//-----------------------------------------------------------------------------------
// Mostrar mensaje de bienvenida y cargar productos al iniciar la página
//-----------------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    let nombre = params.get("nombre");

    if (!nombre) {
        nombre = localStorage.getItem("nombre_usuario");
    }

    if (nombre) {
        const bienvenida = document.getElementById("bienvenida-texto");
        if (bienvenida) {
            bienvenida.textContent = `¡Ahora sí, ${nombre}!`;
        }
    }

    obtenerDatosProductos();
});

//-----------------------------------------------------------------------------------
// Inicializa el sistema: muestra productos o filtra por categoría
//-----------------------------------------------------------------------------------
function init(categoria) {
    if (categoria) {
        filtradoCategoria(categoria);
    } else {
        generarProductos();
    }
}

//-----------------------------------------------------------------------------------
// Renderiza los productos en pantalla
//-----------------------------------------------------------------------------------
function generarProductos() {
    // Limpiar el contenedor antes de agregar productos
    while (contenedor.hasChildNodes()) {
        contenedor.removeChild(contenedor.firstChild);
    }

    // Mostrar mensaje si no hay productos
    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }
    
    let inicio = 9*numPagina;

    // Crear tarjetas HTML para cada producto activo
    for (let i = inicio; i < (9+9*numPagina); i++) {
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
// Filtra productos por categoría (URL param)
//-----------------------------------------------------------------------------------
function filtradoCategoria(categoria) {
    productos = productoCopia.filter(p => p.categoria === categoria && p.estado);
    generarProductos();
}

//-----------------------------------------------------------------------------------
// Filtra productos por texto ingresado (nombre)
//-----------------------------------------------------------------------------------
function filtradoProductos(string) {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria");


    if (categoria) {
        productos = productoCopia.filter(p => p.categoria === categoria && p.estado);
    }

    if (string && string !== "") {
        productos = productoCopia.filter(el =>
            el.nombre.toLowerCase().includes(string.toLowerCase())
        );
    }

    generarProductos();
}

//-----------------------------------------------------------------------------------
// Muestra modal para elegir cantidad y agregar producto al carrito
//-----------------------------------------------------------------------------------
function agregarCarrito(productoAgregar) {
    const modal = document.getElementById("cantidad-modal");
    const input = document.getElementById("cantidad-input");
    const confirmar = document.getElementById("confirmar-cantidad");
    const cancelar = document.getElementById("cancelar-cantidad");

    modal.style.display = "flex";
    input.value = "";

    // Confirmar cantidad y guardar en localStorage
    confirmar.onclick = function () {
        let cantidad = parseInt(input.value, 10);

        if (!isNaN(cantidad) && cantidad > 0) {
            let item = { ...productoAgregar, cantidad };
            let productosGuardados = JSON.parse(localStorage.getItem("producto")) || [];

            // Si ya existe en el carrito, sumar cantidad
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

    // Cancelar selección
    cancelar.onclick = function () {
        modal.style.display = "none";
    };
}