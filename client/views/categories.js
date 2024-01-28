document.addEventListener("DOMContentLoaded", async() => {

    const username = document.getElementById("username").textContent
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }

    // Upload all the category cards
    try {
        const response = await fetch(`http://localhost:3000/askCategories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username
            }),
        });

        // Convert the response to JSON
        const categories = await response.json();

        const categoriesList = document.getElementById("categoriesList");

        // Create cards for each category
        categories.forEach(category => {
            const cardHTML = `
            <li class="card" style="border: 2px solid grey">
                <h2>${category.name}</h2>
                <h3>${category.type}</h3>
                <span style="color:${category.color}">Category Color</span>
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
            </li>
        `;

        // Append the card HTML to the categoriesList
        categoriesList.insertAdjacentHTML('beforeend', cardHTML);
        });
    } catch (err) {
        console.error(err);
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

const categoriesList = document.getElementById("categoriesList")
const addCategory = document.getElementById("addCategory")
const addCategoryModal = document.getElementById("addCategoryModal")
const closerModal = document.getElementById("closeModal")

addCategory.addEventListener("click", ()=>{
    categoriesList.style.display = "none"
    addCategoryModal.style.display = "flex"
})

closeModal.addEventListener("click", ()=>{
    categoriesList.style.display = "flex"
    addCategoryModal.style.display = "none"
})

saveCategory.addEventListener("click", async()=>{
    
    const categoryName = document.getElementById("categoryName").value
    const type = document.getElementById("categoriesSelect").value
    const color = document.getElementById("colors").value
    const action = "add"

    try {
        // Send POST request to /addCategory
        const response = await fetch("http://localhost:3000/categoryManager", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username, categoryName, type, color, action
            }),
        });

        // Check if the login was successful
        if (response.ok) {

        } else {
            console.log("An error occured");
        }
    } catch (err) {
        console.error(err);
    }

    categoriesList.style.display = "flex"
    addCategoryModal.style.display = "none"
    window.location.href = "/categories?username=" + username
})
/*
const editCategory = document.getElementById("editCategory")
const editCategoryModal = document.getElementById("editCategoryModal")

editCategory.addEventListener("click", ()=>{
    categoriesList.style.display = "none"
    editCategoryModal.style.display = "flex"
})*/