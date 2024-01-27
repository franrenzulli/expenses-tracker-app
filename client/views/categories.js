document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }
});

const dashboard = document.getElementById("dashboard")
const expenses = document.getElementById("expenses")
const settings = document.getElementById("settings")
const username = document.getElementById("username").textContent

dashboard.addEventListener("click", async()=>{
    window.location.href = "/dashboard?username=" + username;
})

expenses.addEventListener("click", async()=>{
    window.location.href = "/expenses?username=" + username;
})

settings.addEventListener("click", async()=>{
    window.location.href = "/settings?username=" + username;
})
