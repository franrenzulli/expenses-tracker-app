document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        // If there is no token, redirect to login or take some other action
        window.location.href = "/login";
    }
});

const dashboard = document.getElementById("dashboard")
const categories = document.getElementById("categories")
const expenses = document.getElementById("expenses")
const username = document.getElementById("username").textContent
const uploadBtn = document.getElementById("upload")
const saveChangesBtn = document.getElementById("saveChanges")
const passwordError = document.getElementById("password-error")
const usernameError = document.getElementById("username-error")
const changeUsername = document.getElementById("changeUsername")
const changePassword = document.getElementById("changePassword")
const changeFirstName = document.getElementById("changeFirstName")
const changeLastName = document.getElementById("changeLastName")
const url = document.getElementById("url")

dashboard.addEventListener("click", async()=>{
    window.location.href = "/dashboard?username=" + username;
})

categories.addEventListener("click", async()=>{
    window.location.href = "/categories?username=" + username;
})

expenses.addEventListener("click", async()=>{
    window.location.href = "/expenses?username=" + username;
})

saveChangesBtn.addEventListener("click", async()=>{
    const usernameInput = changeUsername.value 
    const passwordInput = changePassword.value
    const firstNameInput = changeFirstName.value
    const lastNameInput = changeLastName.value
    const urlInput = url.value
   
    try{
        if(usernameChecker(usernameInput)){
            if(passwordChecker(passwordInput)){

                console.log("Enviando")
            
                const response = await fetch(`http://localhost:3000/saveChanges`, {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        {
                            usernameInput, passwordInput, firstNameInput, lastNameInput, urlInput, username
                        }
                    )
                })

                if(response.ok){
                    window.location.href = "/settings?username=" + usernameInput;
                }          
                
            }else{
                passwordError.textContent = "The password must have between 8 and 20 characters"
            }
        }else{
            usernameError.textContent = "The username cannot be empty"
        }
    }catch(err){
        console.error(err)
    }
})

// Function to check if the password meets the requirements
const passwordChecker = (password)=>{
    if((password.length > 0 && password.length < 8) || (password.length > 20)){
        return false;
    }else{
        return true
    }
}

// Function to check if the username meets the requirements
const usernameChecker = (username)=>{
    if(username.length == 0){
        return false
    }else{
        return true
    }
}