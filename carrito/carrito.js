var productos = [];

//-----------------------------------------------------------------------------------

var contenedor = document.getElementsByClassName("contenedor-productos")[0];


var valorBusqueda
init()

//-----------------------------------------------------------------------------------

function init(){ // llama a las funciones esenciales y adicionalmente verifica que exista el localstorage correspondiente, para evitar errores, ya que al no estar inicializado, cuando mas abajo lo quiera parsear, me daria error, porque no existiria
    getLocalStorage()
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
        let div = document.createElement("article");
        let img = document.createElement("img");
        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        let button = document.createElement("button");

        div.className = "card-producto"

        img.src = productos[i].imagen;
        h3.textContent = productos[i].nombre;
        p.textContent = "$" + productos[i].precio;
        button.textContent = "X"

        button.name = i;

        button.addEventListener("click", function(event){
            mostrarCarrito(productos[event.target.name]); //Le paso el nombre del producto
        })

        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(p);
        div.appendChild(button);

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
        elementos = frutas.filter(el => el.nombre.toLowerCase().includes(string.toLowerCase()))
    }
    generarProductos(elementos)
}

function getLocalStorage(){
    productos = JSON.parse(localStorage.getItem("producto"))
}