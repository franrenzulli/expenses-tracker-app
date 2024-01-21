// Create the server
const express = require("express")
const app = express()

// Path
const path = require("path")

// Handle CORS
const cors = require("cors")
app.use(cors())

// Import mongoDB client & bodyparser
const { MongoClient } = require('mongodb');
const bodyParser = require("body-parser")
app.use(bodyParser.json())

// Controller functions
const createClient = require("./helpers/createClient.js")
const addToDatabase = require("./helpers/addToDatabase.js")
const checkUsernameAvailability = require("./helpers/checkUsernameAvailability.js")
const loginTrial = require("./helpers/loginTrial.js")

// Allows to serve static files 
app.use(express.static(path.join(__dirname, '../client')));

// Allow environment variables
require("dotenv").config()

// JWT
const jwt = require("jsonwebtoken");

// Encryption
const bcrypt = require("bcrypt")

// Port
const PORT = process.env.PORT ?? 3000

// Serve the main page
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "../client/main/main.html"))
})

// Serve the SignUp page
app.get("/signup", (req,res)=>{
    res.sendFile(path.join(__dirname, "../client/signup/signup.html"))
})

// Serve the Login page
app.get("/login", (req,res)=>{
    res.sendFile(path.join(__dirname, "../client/login/login.html"))
})

// Handle the POST request sent by the signup page. 
app.post("/signup", async(req, res)=>{

    res.status(200)
    const {username, password, firstName, lastName} = req.body
    console.log("Sign Up Attempt:", username, password, firstName, lastName)
    if(await checkUsernameAvailability(username)){
        await addToDatabase(username, password, firstName, lastName)
    }
})

// Handle the POST request sent by the login page.
app.post("/login", async(req,res)=>{

    const {username, password} = req.body
    console.log("Login Attempt:", username, password)
    if(await loginTrial(username, password)){

        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
            expiresIn: "1h", // Token will expire in 1 hour (adjust as needed)
        });
        res.json({ token });
        console.log("Successful Login Trial")
    }
})

// Route for the successful login
app.get("/dashboard", (req,res)=>{
    res.sendFile(path.join(__dirname, "../client/dashboard/dashboard.html"))
    console.log("Dashboard route accessed")
})

// Handle the POST request sent by the login page
app.post("/dashboard", (req,res)=>{
    const {token} = req.body
    if(token){
        console.log("Token received", token)
        res.status(200).json({"ok":true})
    }else{
        console.log("Token not found")
    }
})

// Start listening on the available port.
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})