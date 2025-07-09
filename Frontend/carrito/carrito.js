    var productos = [];

    //-----------------------------------------------------------------------------------

    var contenedor = document.getElementsByClassName("contenedor-productos")[0];
    var valorBusqueda
    init()

    //-----------------------------------------------------------------------------------

    function init(){
        // Llama a las funciones esenciales y adicionalmente verifica que exista el localStorage correspondiente,
        // para evitar errores al parsear si no está inicializado
        getLocalStorage()
        filtradoProductos()
    }

    //-----------------------------------------------------------------------------------

    function generarProductos(productos){ 
        /*
        Primero que nada lo que hace es eliminar todos los nodos ya existentes, para evitar que se duplique
        Luego lo que hago, es que con los productos que me pasaron por parámetro, lo recorro
        Creo las etiquetas necesarias, les doy el valor necesario
        Adicionalmente hay botones con eventos, que permiten aumentar, disminuir o eliminar el producto del carrito
        */

        while(contenedor.hasChildNodes()){ 
            /*
            Con un bucle while que verifica que el carrito tenga nodos hijos,
            si tiene, elimina el primer elemento hijo, así sucesivamente hasta que no tenga más nada
            */
            contenedor.removeChild(contenedor.firstChild)
        }

        let total = 0;

        for(let i = 0; i < productos.length; i++){
            let div = document.createElement("article");
            let img = document.createElement("img");
            let h3 = document.createElement("h3");
            let p = document.createElement("p");
            let cantidad = document.createElement("p");

            // Botones
            let btnMenos = document.createElement("button");
            let btnMas = document.createElement("button");
            let btnEliminar = document.createElement("button");
            let btnComprar = document.createElement("button");

            div.className = "card-producto";

            img.src = productos[i].imagen;
            h3.textContent = productos[i].nombre;
            p.textContent = "$" + productos[i].precio;

            cantidad.textContent = "Cantidad: " + productos[i].cantidad;

            // Botón +
            btnMas.textContent = "+";
            btnMas.addEventListener("click", () => {
                productos[i].cantidad += 1;
                guardarYActualizar();
            });

            // Botón -
            btnMenos.textContent = "-";
            btnMenos.addEventListener("click", () => {
                productos[i].cantidad -= 1;
                if (productos[i].cantidad <= 0) {
                    productos.splice(i, 1);
                }
                guardarYActualizar();
            });

            // Botón eliminar
            btnEliminar.textContent = "X";
            btnEliminar.addEventListener("click", () => {
                productos.splice(i, 1);
                guardarYActualizar();
            });

            // Boton comprar
            btnComprar.textContent = "Comprar";
            btnComprar.addEventListener("click", () => {
                comprarProductos(productos[i].cantidad, productos[i].id)
            })

            // Total parcial
            total += productos[i].precio * productos[i].cantidad;

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

        // Agregar total general al final
        let totalDiv = document.createElement("div");
        totalDiv.className = "total-carrito";
        totalDiv.textContent = "Total: $" + total;
        contenedor.appendChild(totalDiv);
    }
    //-----------------------------------------------------------------------------------

    async function comprarProductos(cantidad, id_productos){
        console.log(id_productos);
        
        let id_usuario = localStorage.getItem("id_usuario");
        let response = await fetch("http://localhost:3000/ventas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_usuario,
            id_productos,
            cantidad,
        })
        });
        response = await response.json();
        console.log(response);
        
        alert(response.payload);
    }


    //-----------------------------------------------------------------------------------

    function filtradoProductos(string){
        /*
        Uso el filter para filtrar por NOMBRE, solo si el string que me llega del input no es null,
        ya que si es null, significa que no está siendo usado el input
        por lo cual el usuario no está queriendo buscar nada
        El resultado de eso lo paso a generarProductos para que cree las etiquetas de cada producto
        */
        let elementos = productos;
        if(string != null){
            elementos = productos.filter(el => el.nombre.toLowerCase().includes(string.toLowerCase()))
        }
        generarProductos(elementos)
    }

    function getLocalStorage(){
        productos = JSON.parse(localStorage.getItem("producto")) || [];
    }

    function guardarYActualizar(){
        localStorage.setItem("producto", JSON.stringify(productos));
        generarProductos(productos);
        console.log("Carrito actualizado:", productos);
    }