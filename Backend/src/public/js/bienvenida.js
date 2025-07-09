// Referencias a elementos del formulario de login
const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const errorDiv = document.getElementById("error");

// Manejo del evento submit del formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que se recargue la página

    const username = usernameInput.value.trim();

    // Validación de campo vacío
    if (!username) {
        errorDiv.style.display = "block";
        usernameInput.focus();
        return;
    } else {
        errorDiv.style.display = "none";
    }

    try {
        // Verifica si el usuario ya existe en el backend
        const respuesta = await fetch(`http://localhost:3000/users/${username}`);
        let respuestaJSON = await respuesta.json();

        // Si no existe, lo crea automáticamente con valores por defecto
        if (!respuestaJSON.find) {
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

            // Guarda los datos del usuario recién creado
            localStorage.setItem("id_usuario", response.id);
            localStorage.setItem("nombre_usuario", nombre);
        } else {
            // Guarda los datos del usuario existente
            localStorage.setItem("id_usuario", respuestaJSON.payload[0].id);
            localStorage.setItem("nombre_usuario", respuestaJSON.payload[0].nombre);
        }

        // Redirige al main con el nombre en la URL
        window.location.href = `/main?nombre=${encodeURIComponent(username)}`;

    } catch (error) {
        console.error("Error en login:", error);
        alert("Ocurrió un error al procesar el login.");
    }
});