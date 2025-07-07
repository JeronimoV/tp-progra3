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
    let creacion = document.createElement("a");
    creacion.textContent = "Crear Producto";
    creacion.href = "../modeladoProducto/modelado.html"
    contenedor.appendChild(creacion);
    for(let i = 0; i < productos.length; i++){
        let div = document.createElement("article");
        let img = document.createElement("img");
        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        let button = document.createElement("a");
        let button2 = document.createElement("button");

        img.src = productos[i].imagen;
        h3.textContent = productos[i].nombre;
        p.textContent = "$" + productos[i].precio;
        button.textContent = "Editar"
        if(productos[i].estado == true){
            button2.textContent = "Desactivar"
            div.className = "card-producto"
        }else{
            button2.textContent = "Activar"
            div.className = "card-producto-inactivo"
        }
        button.href = `../editadoProducto/editado.html?id=${productos[i].id}`

        button.name = i;
        button2.name = i;

        button.addEventListener("click", function(event){
            mostrarCarrito(productos[event.target.name]); //Le paso el nombre del producto
        })

        button2.addEventListener("click", function(event){
            modalConfirmacion(productos[event.target.name]); //Le paso el nombre del producto
        })

        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(p);
        div.appendChild(button);
        div.appendChild(button2);

        contenedor.appendChild(div);
        console.log("hola");
        
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

function activarYDesactivar(string){
    
    for(let i = 0; productos.length > i; i++){
        if(productos[i].nombre == string.nombre){
            productos[i].estado = !productos[i].estado;
        }
    }
    generarProductos(productos);
}

function modalConfirmacion(producto){
    // Mostrar modal
    const modal = document.getElementById("estado-modal");
    const confirmar = document.getElementById("confirmar-estado");
    const cancelar = document.getElementById("cancelar-estado");

    modal.style.display = "flex";

    // Confirmar
    confirmar.onclick = function () {
        activarYDesactivar(producto)
        modal.style.display = "none";
    };

    // Cancelar
    cancelar.onclick = function () {
        modal.style.display = "none";
    };
}