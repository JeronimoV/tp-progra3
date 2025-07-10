const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorDiv = document.getElementById("error");
const errorLoginDiv = document.getElementById("error-login");
const accesoRapidoBtn = document.getElementById("accesoRapido");
const crearAdminBtn = document.getElementById("crearAdmin");

// Enviar formulario login normal
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    errorDiv.style.display = "block";
    errorLoginDiv.style.display = "none";
    usernameInput.focus();
    return;
  } else {
    errorDiv.style.display = "none";
  }

  try {
    const respuesta = await fetch(`http://localhost:3000/users/${encodeURIComponent(username)}`);
    const respuestaJSON = await respuesta.json();

    if (!respuestaJSON.find) {
      alert("Usuario no existe. Use el botón 'Crear admin' para crear uno si es admin.");
      return;
    }

    const user = respuestaJSON.payload[0];
    if (user.contraseña !== password) {
      errorLoginDiv.style.display = "block";
      return;
    }

    localStorage.setItem("id_usuario", user.id);
    localStorage.setItem("nombre_usuario", user.nombre);
    window.location.href = `/main?nombre=${encodeURIComponent(username)}`;
  } catch (error) {
    console.error("Error en login:", error);
    alert("Ocurrió un error al procesar el login.");
  }
});

// Botón acceso rápido: autocompleta inputs con valores demo
accesoRapidoBtn.addEventListener("click", () => {
  usernameInput.value = "Tiziano Gonzalez";
  passwordInput.value = "123";
  errorDiv.style.display = "none";
  errorLoginDiv.style.display = "none";
  usernameInput.focus();
});

// Botón crear admin: crea usuario admin con datos de inputs o valores por defecto
crearAdminBtn.addEventListener("click", async () => {
  let nombre = usernameInput.value.trim();
  let contraseña = passwordInput.value.trim();

  // Si inputs vacíos, poner valores por defecto
  if (!nombre) nombre = "admin";
  if (!contraseña) contraseña = "admin123";

  try {
    const respuesta = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, contraseña, admin: true }),
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      alert(`Admin creado con ID: ${data.id}`);
      localStorage.setItem("id_usuario", data.id);
      localStorage.setItem("nombre_usuario", nombre);
      // Opcional: redirigir automáticamente
      // window.location.href = `/main?nombre=${encodeURIComponent(nombre)}`;
    } else {
      alert(`Error creando admin: ${data.error || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error creando admin:", error);
    alert("No se pudo conectar con el servidor");
  }
});