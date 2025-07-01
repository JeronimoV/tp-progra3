const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const errorDiv = document.getElementById("error");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();

    if (!username) {
        errorDiv.style.display = "block";
        usernameInput.focus();
    } else {
        errorDiv.style.display = "none";
        // Redireccionamos con el nombre en la URL como query string
        window.location.href = `../main/main.html?nombre=${encodeURIComponent(username)}`;
    }
});