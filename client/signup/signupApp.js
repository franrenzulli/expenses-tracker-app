const usernameSignup = document.getElementById("usernameSignup")
const passwordSignup = document.getElementById("passwordSignup")
const firstNameSignup = document.getElementById("firstNameSignup")
const lastNameSignup = document.getElementById("lastNameSignup")
const btnSignup = document.getElementById("btnSignup")
const passwordError = document.getElementById("password-error")
const usernameError = document.getElementById("username-error")

btnSignup.addEventListener("click", async()=>{

    // Collect the information from input fields in signup page
    const username = usernameSignup.value 
    const password = passwordSignup.value
    const firstName = firstNameSignup.value
    const lastName = lastNameSignup.value
   
    try{
        if(usernameChecker(username)){
            if(passwordChecker(password)){

                // Send POST req
                const response = await fetch("http://localhost:3000/signup", {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        {
                            username, password, firstName, lastName
                        }
                    )
                })
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
    if(password.length < 8 || password.length > 20){
        return false;
    }else{
        return true;
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