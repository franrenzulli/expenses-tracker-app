document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }
});

const expenses = document.getElementById("expenses")
const categories = document.getElementById("categories")
const settings = document.getElementById("settings")
const username = document.getElementById("username").textContent

expenses.addEventListener("click", async()=>{
    window.location.href = "/expenses?username=" + username;
})

categories.addEventListener("click", async()=>{
    window.location.href = "/categories?username=" + username;
})

settings.addEventListener("click", async()=>{
    window.location.href = "/settings?username=" + username;
})