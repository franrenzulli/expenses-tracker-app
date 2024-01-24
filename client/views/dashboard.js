document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        // Si no hay token, redirige al login u toma alguna otra acción
        window.location.href = "/login";
    }
});