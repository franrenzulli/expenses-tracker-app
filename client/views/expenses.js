document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }
});

const dashboard = document.getElementById("dashboard")
const categories = document.getElementById("categories")
const username = document.getElementById("username").textContent

dashboard.addEventListener("click", async()=>{
    window.location.href = "/dashboard?username=" + username;
})

categories.addEventListener("click", async()=>{
    window.location.href = "/categories?username=" + username;
})

