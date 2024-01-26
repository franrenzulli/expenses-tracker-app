const categories = document.getElementById("categories")
const expenses = document.getElementById("expenses")
const username = document.getElementById("username").textContent

/*
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }
})

*/

categories.addEventListener("click", async()=>{
    window.location.href = "/categories?username=" + username;
})

expenses.addEventListener("click", async()=>{
    window.location.href = "/expenses?username=" + username;
})

