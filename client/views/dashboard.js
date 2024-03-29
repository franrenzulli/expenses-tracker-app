

// This function will check if you have an existing token to enter the website
document.addEventListener("DOMContentLoaded", async() => {
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }

    // Correct the balance number incase it is negative

    const balanceNumber = document.getElementById("balance-number").textContent
    if(balanceNumber.includes("-")){
        let replacedString = balanceNumber.replace(/\$/g, '#').replace(/-/g, '$').replace(/#/g, '-');
        console.log(replacedString)
        document.getElementById("balance-number").textContent = replacedString
    } 

    // Check if there are transactions to load 

    const responseTransactions = await fetch(`http://localhost:3000/askTransactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username
        }),
    });

    const responseChartData = await fetch(`http://localhost:3000/getChartData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username
        }),
    });

    const transactions = await responseTransactions.json()
    // We create the arrays that will be loaded into the chart

    const labels = [];
    const data = [];
    const backgroundColor = [];

    transactions.forEach(transaction =>{
        const categoryIndex = labels.indexOf(transaction.category);

        if(!labels.includes(transaction.category)){
            labels.push(transaction.category);
            data.push(parseFloat(transaction.amount))

            // Set colors
            let chosenColor = "";
            switch(transaction.color){
                case "green":
                    chosenColor = "#3EB489";
                    break;
                case "Red":
                    chosenColor = "#ff3333";
                    break;
                case "Blue":
                    chosenColor = "#00B4D8";
                    break;
                case "Purple":
                    chosenColor = "#a933dc";
                    break;    
                case "Yellow":
                    chosenColor = "#e5de00";
                    break;
                case "Orange":
                    chosenColor = "#ff9d5c";
                    break;
                case "lightBlue":
                    chosenColor = "#ADD8E6";
                    break;          
            }
            
            backgroundColor.push(chosenColor)
        }else if(labels.includes(transaction.category)){
            data[categoryIndex] += parseFloat(transaction.amount);
        }
        console.log(labels)
        console.log(data)
        console.log(backgroundColor)
    })


    var grafica = document.getElementById("grafica");
    var myPieChart = new Chart(grafica, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                label: "Money spent by category",
                data: data,
                backgroundColor: backgroundColor,
            }]
        },
    });

    const latestTransactions = document.getElementById("latestTransactions")
    const emptyTransactions = document.getElementById("emptyTransactions")
    const chartDisplay = document.getElementById("chartDisplay")
    const emptyChart = document.getElementById("emptyChart")

    // If there isn't any transaction in the database, display this

           if(transactions.length == 0){
            latestTransactions.style.display = "none"
            emptyTransactions.style.display = "flex"
            chartDisplay.style.display = "none"
            emptyChart.style.display = "flex"
        }else if(transactions.length > 0){ // If there are categories in the database
            latestTransactions.style.display = "flex"
            emptyTransactions.style.display = "none"
            chartDisplay.style.display = "flex"
            emptyChart.style.display = "none"
        }

    const transactionContent = document.getElementById("transactionContent")


    // Create cards of latest transactions
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
            <div class="transAm">
                <h2>$${transaction.amount}</h2>
            </div>
        </div>
        </div>
        `
        transactionContent.insertAdjacentHTML("beforeend", transactionCard)
    })

});

// Here we will do the redirecting of the navigation bar

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

