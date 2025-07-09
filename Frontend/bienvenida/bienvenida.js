const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const errorDiv = document.getElementById("error");

form.addEventListener("submit",async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const respuesta = await fetch(`http://localhost:3000/users/${username}`)
    let respuestaJSON = await respuesta.json();
    
    if(!respuestaJSON.find){
        
        let nombre = username;
        let contraseña = 123;
        let admin = false;
        let response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            contraseña,
            admin
        })
        })  
        response = await response.json()
        console.log(response);
        
        localStorage.setItem("id_usuario", response.id);
    }else{
        localStorage.setItem("id_usuario", respuestaJSON.payload[0].id);
    }
     

        

    if (!username) {
        errorDiv.style.display = "block";
        usernameInput.focus();
    } else {
        errorDiv.style.display = "none";
        // Redireccionamos con el nombre en la URL como query string
        window.location.href = `../main/main.html?nombre=${encodeURIComponent(username)}`;
    }
});