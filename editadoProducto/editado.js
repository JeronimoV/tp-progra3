cargadoDeInfo()
function cargadoDeInfo(){
    let id = window.location.href.split("?id=")[1];
    //Aca llamaria al servidor para recuperar info del servidor
    //////////////////////////////////////
    let producto = {
        "imagen":"url imagen",
        "nombre":"Nombre de la hamburgesa anashei",
        "precio":777,
        "estado": true
    }
    //////////////////////////////////////
    //Borrar esto de arriba luego

    let link = document.getElementsByClassName("link-imagen");
    let nombre = document.getElementsByClassName("nombre-producto");
    let precio = document.getElementsByClassName("precio-producto"); 

    link[0].value = producto.imagen;
    nombre[0].value = producto.nombre;
    precio[0].value = producto.precio;
    
}

function editarProducto(){
    let producto = {
        "imagen":"",
        "nombre":"",
        "precio":0,
        "estado": true
    }

    producto[imagen] = document.getElementsByClassName("link-imagen");
    producto[nombre] = document.getElementsByClassName("nombre-producto");
    producto[precio] = document.getElementsByClassName("precio-producto");

    //Aca iria la logica de enviar el producto al servidor para su edicion
}