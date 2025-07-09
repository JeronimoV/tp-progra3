// Lista de productos cargados desde el localStorage
var productos = [];

//-----------------------------------------------------------------------------------
// Referencias y setup inicial
//-----------------------------------------------------------------------------------

var contenedor = document.getElementsByClassName("contenedor-productos")[0];
var valorBusqueda;

init(); // Inicia el sistema

//-----------------------------------------------------------------------------------
// Función principal de inicio: carga productos y renderiza
//-----------------------------------------------------------------------------------
function init() {
    // Carga productos desde localStorage y muestra en pantalla
    getLocalStorage();
    filtradoProductos();
}

//-----------------------------------------------------------------------------------
// Genera y muestra los productos en el DOM
//-----------------------------------------------------------------------------------
function generarProductos(productos) {
    // Limpia el contenedor antes de volver a renderizar
    while (contenedor.hasChildNodes()) {
        contenedor.removeChild(contenedor.firstChild);
    }

    let total = 0;

    // Recorre y genera la tarjeta HTML para cada producto
    for (let i = 0; i < productos.length; i++) {
        let div = document.createElement("article");
        let img = document.createElement("img");
        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        let cantidad = document.createElement("p");

        // Botones de control
        let btnMenos = document.createElement("button");
        let btnMas = document.createElement("button");
        let btnEliminar = document.createElement("button");
        let btnComprar = document.createElement("button");

        div.className = "card-producto";

        // Datos del producto
        img.src = productos[i].imagen;
        h3.textContent = productos[i].nombre;
        p.textContent = "$" + productos[i].precio;
        cantidad.textContent = "Cantidad: " + productos[i].cantidad;

        // Botón "+" para sumar cantidad
        btnMas.textContent = "+";
        btnMas.addEventListener("click", () => {
            productos[i].cantidad += 1;
            guardarYActualizar();
        });

        // Botón "-" para restar cantidad o eliminar si llega a 0
        btnMenos.textContent = "-";
        btnMenos.addEventListener("click", () => {
            productos[i].cantidad -= 1;
            if (productos[i].cantidad <= 0) {
                productos.splice(i, 1); // Elimina del array
            }
            guardarYActualizar();
        });

        // Botón para eliminar directamente
        btnEliminar.textContent = "X";
        btnEliminar.addEventListener("click", () => {
            productos.splice(i, 1);
            guardarYActualizar();
        });

        // Botón de compra (envía datos al backend)
        btnComprar.textContent = "Comprar";
        btnComprar.addEventListener("click", () => {
            comprarProductos(productos[i].cantidad, productos[i].id);
        });

        // Acumula el total general del carrito
        total += productos[i].precio * productos[i].cantidad;

        // Agrega los elementos a la tarjeta
        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(p);
        div.appendChild(cantidad);
        div.appendChild(btnMenos);
        div.appendChild(btnMas);
        div.appendChild(btnEliminar);
        div.appendChild(btnComprar);

        contenedor.appendChild(div);
    }

    // Muestra el total general al final
    let totalDiv = document.createElement("div");
    totalDiv.className = "total-carrito";
    totalDiv.textContent = "Total: $" + total;
    contenedor.appendChild(totalDiv);
}

//-----------------------------------------------------------------------------------
// Realiza la compra del producto y envía los datos al backend
//-----------------------------------------------------------------------------------
async function comprarProductos(cantidad, id_productos) {
    console.log("ID del producto:", id_productos);
    
    const id_usuario = localStorage.getItem("id_usuario");

    try {
        console.log("Enviando:", { id_usuario, id_productos, cantidad });

        const response = await fetch("http://localhost:3000/ventas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario,
                id_productos,
                cantidad
            })
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        alert(data.payload); // Muestra mensaje de éxito del servidor
    } catch (error) {
        console.error("Error en la compra:", error);
        alert("Ocurrió un error al procesar la compra.");
    }
}

//-----------------------------------------------------------------------------------
// Filtra los productos por nombre (si hay búsqueda activa)
//-----------------------------------------------------------------------------------
function filtradoProductos(string) {
    let elementos = productos;

    if (string != null) {
        elementos = productos.filter(el =>
            el.nombre.toLowerCase().includes(string.toLowerCase())
        );
    }

    generarProductos(elementos);
}

//-----------------------------------------------------------------------------------
// Carga productos desde localStorage (si existe)
//-----------------------------------------------------------------------------------
function getLocalStorage() {
    productos = JSON.parse(localStorage.getItem("producto")) || [];
}

//-----------------------------------------------------------------------------------
// Guarda los productos modificados en localStorage y actualiza pantalla
//-----------------------------------------------------------------------------------
function guardarYActualizar() {
    localStorage.setItem("producto", JSON.stringify(productos));
    generarProductos(productos);
    console.log("Carrito actualizado:", productos);
}