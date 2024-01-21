const usernameLogIn = document.getElementById("usernameLogIn")
const passwordLogIn = document.getElementById("passwordLogIn")
const btnLogIn = document.getElementById("btnLogIn")

btnLogIn.addEventListener("click", async()=>{

    // Collect the information from input fields in signup page
    const username = usernameLogIn.value 
    const password = passwordLogIn.value
   
    try{

        // Check the password requirements
            // Send POST req
            const response = await fetch("http://localhost:3000/login", {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        username, password
                    }
                )
            }).then(response =>{ // Here we check if the redirection in the server is succesful and redirect in the client to the dashboard
                if (response.ok) {
                    console.log("Successful login");
                    window.location.href = "/dashboard";
                } else {
                    console.log("Login failed");
                }
            })
        }catch(err){
        console.error(err)
    }
})