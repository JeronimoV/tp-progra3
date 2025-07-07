//-----------------------------------------------------------------------------------
// Array de productos
//-----------------------------------------------------------------------------------

var productos = [
    {
        "id":1,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_2X_694877-MLA81724947491_122024-F.webp",
        "nombre": "Gabinete Sentey H10 Black",
        "precio": 6500,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":2,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_2X_836870-MLU78390243787_082024-F.webp",
        "nombre": "Gabinete Sentey H10 White",
        "precio": 7200,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":3,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_2X_685556-MLA80571225922_112024-F.webp",
        "nombre": "Gabinete Thermaltake View 170Tg Black",
        "precio": 5900,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":4,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_657781-MLA80577394456_112024-O.webp",
        "nombre": "Gabinete Thermaltake View 170Tg White",
        "precio": 7100,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":5,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_777806-MLA82988727033_032025-O.webp",
        "nombre": "Gabinete Gamer Xyz Airone 200 Black",
        "precio": 6200,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":6,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_668800-MLA83791105681_042025-O.webp",
        "nombre": "Gabinete Gamer Xyz Airone 200 White",
        "precio": 6800,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":7,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_947912-MLA81513301815_122024-O.webp",
        "nombre": "Gabinete Deepcool Cg530 Black",
        "precio": 7000,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":8,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_623989-MLA83092072699_032025-O.webp",
        "nombre": "Gabinete Deepcool Cg530 White",
        "precio": 6950,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":9,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_620207-MLA44205919157_112020-O.webp",
        "nombre": "Gabinete Thermaltake S100 Black",
        "precio": 7350,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":10,
        "imagen": "https://http2.mlstatic.com/D_NQ_NP_865764-MLU70534918907_072023-O.webp",
        "nombre": "Gabinete Thermaltake S100 White",
        "precio": 7900,
        "estado": true,
        categoria: "gabinete"
    },
    {
        "id":11,
        "imagen": "https://static.libreopcion.com.ar/i/LIO_fuente-aureox-500w-arxe-500_size_h686_d33b27b509fd3027bf8e7dff1abda3e3.jpeg",
        "nombre": "Fuente Aureox 500w Arxe-500",
        "precio": 7900,
        "estado": true,
        categoria: "fuente"
    },
    {
        "id":12,
        "imagen": "https://static.libreopcion.com.ar/i/LIO_fuente-gamer-aureox-600w-psu-arxgp-600_size_h686_968f1160578d7b1381864382f958abf9.jpeg",
        "nombre": "Fuente Gamer Aureox 600w Psu Arxgp-600",
        "precio": 7900,
        "estado": true,
        categoria: "fuente"
    },
    {
        "id":13,
        "imagen": "https://static.libreopcion.com.ar/i/LIO_fuente-gamer-thermaltake-smart-white-500w-80-plus_size_h686_abb1f4b77f2e1bed84a3faec2d82ec97.jpeg",
        "nombre": "Fuente Gamer Thermaltake Smart White 500w 80 Plus",
        "precio": 7900,
        "estado": true,
        categoria: "fuente"
    },
    {
        "id":14,
        "imagen": "https://static.libreopcion.com.ar/i/LIO_fuente-gamer-evga-500w-br-80-bronze_size_h686_8d3188fac22989652ceabb8c50fe75cc.jpeg",
        "nombre": "Fuente Gamer Evga 500w Br 80 Bronze",
        "precio": 7900,
        "estado": true,
        categoria: "fuente"
    },
    {
        "id":15,
        "imagen": "https://static.libreopcion.com.ar/i/LIO_fuente-gamer-gigabyte-750w-pg5-80-plus-modular-gold_size_h686_d4eb23345a6d139b0caa69293b3b0aec.jpg",
        "nombre": "Fuente Gamer Gigabyte 750w Pg5 80 Plus Modular Gold",
        "precio": 7900,
        "estado": true,
        categoria: "fuente"
    },
];

var contenedor = document.getElementsByClassName("contenedor-productos")[0];

var carrito = [];

//-----------------------------------------------------------------------------------
// Script para utilizar el nombre ingresado sin uso de LocalStorage
// y para cargar productos por categoría desde la URL
//-----------------------------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");
    const categoria = params.get("categoria");

    if (nombre) {
        const bienvenida = document.getElementById("bienvenida-texto");
        if (bienvenida) {
            bienvenida.textContent = `¡Ahora sí, ${nombre}!`;
        }
    }

    init(categoria); // Se pasa la categoría (si existe) al init
});

//-----------------------------------------------------------------------------------
// Inicialización del sistema
//-----------------------------------------------------------------------------------

function init(categoria) {
    /*
    Llama a filtrado por categoría si está definida
    Sino, carga todos los productos directamente
    */
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
    /*
    Primero elimina todos los nodos existentes dentro del contenedor
    Luego recorre el array de productos y crea dinámicamente las tarjetas
    */
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
// Filtro de productos por categoría
//-----------------------------------------------------------------------------------

function filtradoCategoria(categoria) {
    /*
    Filtra los productos por la categoría que se pasa por parámetro
    y los pasa a generarProductos para que los renderice
    */
    const filtrados = productos.filter(p => p.categoria === categoria && p.estado);
    generarProductos(filtrados);
}

//-----------------------------------------------------------------------------------
// Filtro de productos por texto ingresado (buscador)
//-----------------------------------------------------------------------------------

function filtradoProductos(string) {
    /*
    Filtra por NOMBRE dentro de la categoría activa, si existe.
    Si no hay categoría, filtra sobre todos los productos.
    */
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria");

    let elementos = productos;

    if (categoria) {
        elementos = productos.filter(p => p.categoria === categoria && p.estado);
    }

    if (string != null && string !== "") {
        elementos = elementos.filter(el => el.nombre.toLowerCase().includes(string.toLowerCase()));
    }

    generarProductos(elementos);
}

//-----------------------------------------------------------------------------------
// Modal para seleccionar cantidad al agregar al carrito
//-----------------------------------------------------------------------------------

function agregarCarrito(productoAgregar) {
    /*
    Muestra un modal para ingresar la cantidad de productos a agregar
    Luego actualiza el carrito en localStorage
    */
    const modal = document.getElementById("cantidad-modal");
    const input = document.getElementById("cantidad-input");
    const confirmar = document.getElementById("confirmar-cantidad");
    const cancelar = document.getElementById("cancelar-cantidad");

    modal.style.display = "flex";
    input.value = "";

    // Confirmar
    confirmar.onclick = function () {
        let cantidad = parseInt(input.value, 10);

        if (!isNaN(cantidad) && cantidad > 0) {
            let item = {
                ...productoAgregar,
                cantidad: cantidad
            };

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

    // Cancelar
    cancelar.onclick = function () {
        modal.style.display = "none";
    };
}