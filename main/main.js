var productos = [
    {
        "id":1,
        "imagen": "https://png.pngtree.com/png-vector/20240829/ourmid/pngtree-delicious-and-testy-cheese-burger-png-image_13659847.png",
        "nombre": "Hamburguesa Atómica",
        "precio": 6500,
        "estado": true
    },
    {
        "id":2,
        "imagen": "https://img.pikbest.com/origin/09/16/69/71ZpIkbEsTjDC.png!bw700",
        "nombre": "Doble Fuego",
        "precio": 7200,
        "estado": true
    },
    {
        "id":3,
        "imagen": "https://png.pngtree.com/png-clipart/20231017/original/pngtree-burger-food-png-free-download-png-image_13329458.png",
        "nombre": "Clásica Criolla",
        "precio": 5900,
        "estado": true
    },
    {
        "id":4,
        "imagen": "https://png.pngtree.com/png-vector/20240829/ourmid/pngtree-delicious-and-testy-cheese-burger-png-image_13659847.png",
        "nombre": "Bacon Lover",
        "precio": 7100,
        "estado": true
    },
    {
        "id":5,
        "imagen": "https://img.pikbest.com/origin/09/16/69/71ZpIkbEsTjDC.png!bw700",
        "nombre": "Verde Veggie",
        "precio": 6200,
        "estado": true
    },
    {
        "id":6,
        "imagen": "https://png.pngtree.com/png-clipart/20231017/original/pngtree-burger-food-png-free-download-png-image_13329458.png",
        "nombre": "Picante Andina",
        "precio": 6800,
        "estado": true
    },
    {
        "id":7,
        "imagen": "https://png.pngtree.com/png-vector/20240829/ourmid/pngtree-delicious-and-testy-cheese-burger-png-image_13659847.png",
        "nombre": "Queso Extremo",
        "precio": 7000,
        "estado": true
    },
    {
        "id":8,
        "imagen": "https://img.pikbest.com/origin/09/16/69/71ZpIkbEsTjDC.png!bw700",
        "nombre": "Pampa BBQ",
        "precio": 6950,
        "estado": true
    },
    {
        "id":9,
        "imagen": "https://png.pngtree.com/png-clipart/20231017/original/pngtree-burger-food-png-free-download-png-image_13329458.png",
        "nombre": "Tex-Mex Boom",
        "precio": 7350,
        "estado": true
    },
    {
        "id":10,
        "imagen": "https://png.pngtree.com/png-vector/20240829/ourmid/pngtree-delicious-and-testy-cheese-burger-png-image_13659847.png",
        "nombre": "Trufada Deluxe",
        "precio": 7900,
        "estado": true
    }
];

var carrito = []

//-----------------------------------------------------------------------------------

var contenedor = document.getElementsByClassName("contenedor-productos")[0];

var valorBusqueda
init()

//-----------------------------------------------------------------------------------

function init(){ // llama a las funciones esenciales y adicionalmente verifica que exista el localstorage correspondiente, para evitar errores, ya que al no estar inicializado, cuando mas abajo lo quiera parsear, me daria error, porque no existiria
    filtradoProductos()
}


//-----------------------------------------------------------------------------------

function generarProductos(productos){ 
    /*
    Primero que nada lo que hace es eliminar todos los nodos ya existentes, para evitar que se duplique
    Luego lo que hago, es que con los productos que me pasaron por parametro, lo recorro
    Creo las etiquetas necesarias, les doy el valor necesario
    Adicionalmente hay un button con un evento, el cual permite agregar el producto al carrito
    */
    while(contenedor.hasChildNodes()){ 
        /*
        Con un bucle while
        que verifica que el carrito tenga nodos hijos, si tiene, elimina el primer elemento hijo, asi sucesivamente hasta que no tenga mas nada
        */
        contenedor.removeChild(contenedor.firstChild)
    }
    for(let i = 0; i < productos.length; i++){
        if(productos[i].estado){
            let div = document.createElement("article");
            let img = document.createElement("img");
            let h3 = document.createElement("h3");
            let p = document.createElement("p");
            let button = document.createElement("button");

            div.className = "card-producto"

            img.src = productos[i].imagen;
            h3.textContent = productos[i].nombre;
            p.textContent = "$" + productos[i].precio;
            button.textContent = "Agregar Carrito"

            button.name = i;

            button.addEventListener("click", function(event){
                agregarCarrito(productos[event.currentTarget.name]); //le pasamos el nombre del producto
            });

            div.appendChild(img);
            div.appendChild(h3);
            div.appendChild(p);
            div.appendChild(button);

            contenedor.appendChild(div);
            console.log("hola");
        }
        
    }
}

//-----------------------------------------------------------------------------------

function filtradoProductos(string){
    /*
    Uso el filter para filtrar por NOMBRE, solo si el string que me llega del inpit no es null, ya que si es null, significa que no esta siendo usado el input
    por lo cual el usuario no esta queriendo buscar nada
    El resultado de eso lo paso a generarProductos para que cree las etiquetas de cada producto
    */
    let elementos = productos;
    if(string != null){
        elementos = productos.filter(el => el.nombre.toLowerCase().includes(string.toLowerCase()))
    }
    generarProductos(elementos)
}

function agregarCarrito(productoAgregar){
    // Mostrar modal
    const modal = document.getElementById("cantidad-modal");
    const input = document.getElementById("cantidad-input");
    const confirmar = document.getElementById("confirmar-cantidad");
    const cancelar = document.getElementById("cancelar-cantidad");

    modal.style.display = "flex";
    input.value = ""; // Resetear input por si ya había algo

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