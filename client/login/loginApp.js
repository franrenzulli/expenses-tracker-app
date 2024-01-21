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

            // Send the token to the /dashboard endpoint
            const dashboardResponse = await fetch("http://localhost:3000/dashboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                }),
            });

            if (dashboardResponse.ok) {
                console.log("Successfully accessed the dashboard");
                // Redirect to the dashboard page
                window.location.href = "/dashboard";
            } else {
                console.log("Failed to access the dashboard");
            }
        } else {
            console.log("Login failed");
        }
    } catch (err) {
        console.error(err);
    }
});