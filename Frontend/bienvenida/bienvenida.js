const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const errorDiv = document.getElementById("error");

// Evento submit del formulario de login
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();

    // Validación simple: el campo no puede estar vacío
    if (!username) {
        errorDiv.style.display = "block";
        usernameInput.focus();
        return;
    } else {
        errorDiv.style.display = "none";
    }

    try {
        // Consultar si el usuario existe en el backend
        const respuesta = await fetch(`http://localhost:3000/users/${username}`);
        let respuestaJSON = await respuesta.json();

        if (!respuestaJSON.find) {
            // Si no existe, crear un usuario nuevo con valores por defecto
            let nombre = username;
            let contraseña = 123;
            let admin = false;
            let response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, contraseña, admin })
            });
            response = await response.json();
            console.log(response);

            // Guardar id y nombre en localStorage para mantener sesión
            localStorage.setItem("id_usuario", response.id);
            localStorage.setItem("nombre_usuario", nombre);
        } else {
            // Si existe, guardar datos de usuario en localStorage
            localStorage.setItem("id_usuario", respuestaJSON.payload[0].id);
            localStorage.setItem("nombre_usuario", respuestaJSON.payload[0].nombre);
        }

        // Redirigir a la página principal pasando el nombre en la URL
        window.location.href = `../main/main.html?nombre=${encodeURIComponent(username)}`;

    } catch (error) {
        // Manejo de errores generales
        console.error("Error en login:", error);
        alert("Ocurrió un error al procesar el login.");
    }
});