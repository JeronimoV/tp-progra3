var productos = [];
var contenedor = document.getElementsByClassName("contenedor-productos")[0];
init();

// Inicializa el carrito cargando productos y mostrando la lista
function init() {
    getLocalStorage();
    filtradoProductos();
}

// Genera y muestra los productos en el contenedor, con botones para modificar cantidad o eliminar
function generarProductos(productos) {
    // Limpia el contenedor antes de generar
    while (contenedor.hasChildNodes()) {
        contenedor.removeChild(contenedor.firstChild);
    }

    let total = 0;

    for (let i = 0; i < productos.length; i++) {
        // Crear elementos para cada producto
        let div = document.createElement("article");
        let img = document.createElement("img");
        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        let cantidad = document.createElement("p");

        let btnMenos = document.createElement("button");
        let btnMas = document.createElement("button");
        let btnEliminar = document.createElement("button");
        let btnComprar = document.createElement("button");

        div.className = "card-producto";

        img.src = productos[i].imagen;
        h3.textContent = productos[i].nombre;
        p.textContent = "$" + productos[i].precio;
        cantidad.textContent = "Cantidad: " + productos[i].cantidad;

        // Botón para aumentar cantidad
        btnMas.textContent = "+";
        btnMas.addEventListener("click", () => {
            productos[i].cantidad += 1;
            guardarYActualizar();
        });

        // Botón para disminuir cantidad (y eliminar si llega a 0)
        btnMenos.textContent = "-";
        btnMenos.addEventListener("click", () => {
            productos[i].cantidad -= 1;
            if (productos[i].cantidad <= 0) {
                productos.splice(i, 1);
            }
            guardarYActualizar();
        });

        // Botón para eliminar producto directamente
        btnEliminar.textContent = "X";
        btnEliminar.addEventListener("click", () => {
            productos.splice(i, 1);
            guardarYActualizar();
        });

        // Botón para realizar compra del producto actual
        btnComprar.textContent = "Comprar";
        btnComprar.addEventListener("click", () => {
            comprarProductos(productos[i].cantidad, productos[i].id);
        });

        total += productos[i].precio * productos[i].cantidad;

        // Agregar elementos al div del producto
        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(p);
        div.appendChild(cantidad);
        div.appendChild(btnMenos);
        div.appendChild(btnMas);
        div.appendChild(btnEliminar);
        div.appendChild(btnComprar);

        // Agregar producto al contenedor principal
        contenedor.appendChild(div);
    }

    // Mostrar total acumulado al final
    let totalDiv = document.createElement("div");
    totalDiv.className = "total-carrito";
    totalDiv.textContent = "Total: $" + total;
    contenedor.appendChild(totalDiv);
}

// Realiza la compra enviando los datos al backend y abre ticket en nueva ventana
async function comprarProductos(cantidad, id_productos) {
    const id_usuario = localStorage.getItem("id_usuario");
    const nombre_usuario = localStorage.getItem("nombre_usuario") || "Cliente";

    const producto = productos.find(p => p.id === id_productos);
    const fechaHora = new Date();

    let response = await fetch("http://localhost:3000/ventas", {
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

    response = await response.json();
    console.log("Respuesta del servidor:", response);

    if (response.success) {
        // Preparar ticket con datos de compra
        const ticket = {
            empresa: "G&V Computación",
            cliente: nombre_usuario,
            fecha: fechaHora.toLocaleDateString(),
            hora: fechaHora.toLocaleTimeString(),
            producto: producto.nombre,
            cantidad: cantidad,
            precio: producto.precio,
            total: producto.precio * cantidad
        };

        localStorage.setItem("ticket", JSON.stringify(ticket));

        // 🔄 Actualizar carrito: restar cantidad o eliminar producto
        const index = productos.findIndex(p => p.id === id_productos);
        if (index !== -1) {
            productos[index].cantidad -= cantidad;
            if (productos[index].cantidad <= 0) {
                productos.splice(index, 1); // Eliminar si cantidad es 0
            }
        }

        // Guardar cambios en localStorage y actualizar la vista
        guardarYActualizar();

        // Abrir ventana con ticket de compra
        window.open("../ticket/ticket.html", "_blank");
    } else {
        alert("Error al realizar la compra.");
    }
}

// Filtra productos según texto buscado y los genera en pantalla
function filtradoProductos(string) {
    let elementos = productos;
    if (string != null) {
        elementos = productos.filter(el => el.nombre.toLowerCase().includes(string.toLowerCase()));
    }
    generarProductos(elementos);
}

// Carga productos guardados en localStorage
function getLocalStorage() {
    productos = JSON.parse(localStorage.getItem("producto")) || [];
}

// Guarda productos en localStorage y actualiza la lista visible
function guardarYActualizar() {
    localStorage.setItem("producto", JSON.stringify(productos));
    generarProductos(productos);
    console.log("Carrito actualizado:", productos);
}