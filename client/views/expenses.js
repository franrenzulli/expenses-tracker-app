// This function will check if you have an existing token to enter the website
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }
});

const dashboard = document.getElementById("dashboard")
const categories = document.getElementById("categories")
const settings = document.getElementById("settings")
const username = document.getElementById("username").textContent

// Here we will do the redirecting of the navigation bar

dashboard.addEventListener("click", async()=>{
    window.location.href = "/dashboard?username=" + username;
})

categories.addEventListener("click", async()=>{
    window.location.href = "/categories?username=" + username;
})

settings.addEventListener("click", async()=>{
    window.location.href = "/settings?username=" + username;
})