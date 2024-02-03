// This function will check if you have an existing token to enter the website
document.addEventListener("DOMContentLoaded", async() => {
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }

    const username = document.getElementById("username").textContent

        const responseCategories = await fetch(`http://localhost:3000/askCategories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username
            }),
        });

        const emptyList = document.getElementById("emptyList")
        const transactionList = document.getElementById("transactionList")
        const categoriesSelect = document.getElementById("categoriesSelect")
        const categories = await responseCategories.json()

           // If there isn't any category in the database, display this
      /*     if(categories.length == 0){
            transactionList.style.display = "none"
            emptyList.style.display = "flex"
        }else if(categories.length > 0){ // If there are categories in the database
            transactionList.style.display = "flex"
            emptyList.style.display = "none"
        }
*/
        // Load the categories in the <select> of the forms
        categories.forEach(category => {
            const option = `<option>${category.name}</option>`
            categoriesSelect.insertAdjacentHTML('beforeend', option);
        })

        // Load the transactions in the transactionList

        const responseTransactions = await fetch(`http://localhost:3000/askTransactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username
            }),
        });

        const transactions = await responseTransactions.json()
        const list = document.getElementById("list")

        transactions.forEach(transaction =>{
            const transactionCard = `
            <div class="transactionCard">
            <div class="infoSection">
                <div class="transNam">
                <h2>${transaction.name}</h2>
                </div>
                <div class="transCat">
                <h2>${transaction.category}</h2>
                </div>
                <h2>$${transaction.amount}</h2>
            </div>
            <div class="buttons">
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
            </div>
            </div>
            `
            list.insertAdjacentHTML("beforeend", transactionCard)
        })
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

// Add transactions 

const addTransaction = document.getElementById("addTransaction")
const addTransactionModal = document.getElementById("addTransactionModal")
const closeAddModal = document.getElementById("closeAddModal")
const saveTransaction = document.getElementById("saveTransaction")

addTransaction.addEventListener("click", ()=>{
    emptyList.style.display = "none"
    transactionList.style.display = "none"
    addTransactionModal.style.display = "flex"
})

closeAddModal.addEventListener("click", ()=>{
    emptyList.style.display = "none"
    addTransactionModal.style.display = "none"
    transactionList.style.display = "flex"
})

saveTransaction.addEventListener("click", async()=>{

    const transactionName = document.getElementById("transactionNamee").value
    const categoryName = document.getElementById("categoriesSelect").value
    const transactionAmount = document.getElementById("transactionAmount").value

     // Send POST request to /addTransaction
     const response = await fetch("http://localhost:3000/addTransaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username, transactionName, categoryName, transactionAmount
        }),
    });

    window.location.href = "/expenses?username=" + username
})

