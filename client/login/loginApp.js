const usernameLogIn = document.getElementById("usernameLogIn");
const passwordLogIn = document.getElementById("passwordLogIn");
const btnLogIn = document.getElementById("btnLogIn");

btnLogIn.addEventListener("click", async () => {
    // Collect the information from input fields in the login page
    const username = usernameLogIn.value;
    const password = passwordLogIn.value;

    try {
        // Send POST request to /login
        const loginResponse = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        // Check if the login was successful
        if (loginResponse.ok) {
            // Extract the token from the response
            const { token } = await loginResponse.json();
            console.log("Successful login");
            localStorage.setItem("token", token);

            const getInfoResponse = await fetch("http://localhost:3000/getInfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token:token
                })
            })

            if(getInfoResponse.ok){
                console.log("Data extracted")
                const username = await getInfoResponse.text();
                console.log(username)
                window.location.href = "/dashboard?username=" + username;      

            }else{
                console.log("Token couldnt be verified")
            }
        } else {
            console.log("Login failed");
        }
    } catch (err) {
        console.error(err);
    }
});