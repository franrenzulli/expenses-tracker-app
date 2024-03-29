// This function will check if you have an existing token to enter the website
document.addEventListener("DOMContentLoaded", async() => {

    const username = document.getElementById("username").textContent
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }

    // Upload all the category cards, extracting data from the DB
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

        const categoriesList = document.getElementById("categoriesList")
        const emptyList = document.getElementById("emptyList")

        // If there isn't any category in the database, display this
        if(categories.length == 0){
            categoriesList.style.display = "none"
            emptyList.style.display = "flex"
        }else if(categories.length > 0){ // If there are categories in the database
            categoriesList.style.display = "flex"
            emptyList.style.display = "none"

        // Create cards for each category
        categories.forEach(category => {
            const cardHTML = `
            <li class="card">
                <h2>${category.name}</h2>
                <span>Category Name</span>
                <h3>${category.type}</h3>
                <span>Type of transaction</span>
                <h4 style="color:${category.color}">${category.color}</h4>
                <span>Category color</span>
                <div id="categoryButtons">
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
                </div>
            </li>
        `;

            // Append the card HTML to the categoriesList
            categoriesList.insertAdjacentHTML('beforeend', cardHTML);
        });
        }
        
    } catch (err) {
        console.error(err);
    }

    const deleteBtn = document.querySelectorAll(".deleteBtn")

    deleteBtn.forEach(deleteBtn =>{
        // This will delete a category from the database and its card in frontend
        deleteBtn.addEventListener("click", function(){
            const div = this.parentNode
            const card = div.parentNode
            const categoryh2 = card.querySelector("h2").textContent
            const type = card.querySelector("h3").textContent
            fetchDeleteCategory(categoryh2, type)
            card.remove()
        })
    })


    const editBtn = document.querySelectorAll(".editBtn")
    const editCategoryModal = document.getElementById("editCategoryModal")
    const editCategory = document.getElementById("editCategory")
    const closeEditModal = document.getElementById("closeEditModal")
    const editCategoryName = document.getElementById("editCategoryName")
    const editCategoriesSelect = document.getElementById("editCategoriesSelect")
    const editColors = document.getElementById("editColors")

    // This will edit a category from the database and its card in frontend
    editBtn.forEach(editBtn =>{
        editBtn.addEventListener("click", function(){
            editCategoryModal.style.display = "flex"
            categoriesList.style.display = "none"
            const div = this.parentNode
            const card = div.parentNode
            const oldCategoryName = card.querySelector("h2").textContent
            editCategoryName.value = card.querySelector("h2").textContent
            editCategoriesSelect.value = card.querySelector("h3").textContent
            editColors.value = card.querySelector("h4").textContent
            const oldType = editCategoriesSelect.value

            editCategory.addEventListener("click", async()=>{
                const newCategoryName = editCategoryName.value
                const newType = editCategoriesSelect.value
                const newColor = editColors.value

                fetchEditCategory(username, oldCategoryName, newCategoryName, oldType, newType, newColor)
                window.location.href = "/categories?username=" + username
            })

            closeEditModal.addEventListener("click", ()=>{
                editCategoryModal.style.display = "none"
                categoriesList.style.display = "flex"
            })
        })
    })

    // We put this function separate because the eventListener can't be asynchronous since it wouldn't have access to .this property
    const fetchDeleteCategory = async(categoryh2, type)=>{
        try{
            const response = fetch("http://localhost:3000/deleteCategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    categoryh2, username, type
                }),
            });
        }catch(err){
            console.error(err)
        }
    }

    // We put this function separate because the eventListener can't be asynchronous since it wouldn't have access to .this property

    const fetchEditCategory = async(username, oldCategoryName, newCategoryName, oldType, newType, newColor)=>{
        try{
            const response = fetch("http://localhost:3000/editCategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username, oldCategoryName, newCategoryName, oldType, newType, newColor
                }),
            });
        }catch(err){
            console.error(err)
        }
    }

});

// Here we will do the redirecting of the navigation bar

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

// Manage the displays of the modals

const categoriesList = document.getElementById("categoriesList")
const addCategory = document.getElementById("addCategory")
const addCategoryModal = document.getElementById("addCategoryModal")
const closeAddModal = document.getElementById("closeAddModal")


addCategory.addEventListener("click", ()=>{
    categoriesList.style.display = "none"
    emptyList.style.display = "none"
    addCategoryModal.style.display = "flex"
})

closeAddModal.addEventListener("click", ()=>{
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

