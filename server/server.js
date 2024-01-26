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
const fetchUserData = require("./helpers/fetchUserData.js")


// Allows to serve static files 
app.use(express.static(path.join(__dirname, '../client')))

// Allow environment variables
require('dotenv').config()

// JWT
const jwt = require("jsonwebtoken");

// EJS
const ejs = require("ejs")
app.set("view engine", "ejs")

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

app.post("/getInfo", async(req,res)=>{
    const {token} = req.body
    console.log("received token:", token)

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
            const username = req.user.username
            res.send(username)
        }catch(error){
            console.error(err)
        }
    }

})

app.get("/dashboard", async(req, res)=>{
    const username = req.query.username
    console.log("USERNAME PASSED:", username)
    const userData = await fetchUserData(username)
    console.log(userData)
    res.status(200).render(path.join(__dirname, "../client/views/dashboard.ejs"), {userData})
})

app.get("/categories", async(req,res)=>{
    const username = req.query.username
    console.log(username)
    const userData = await fetchUserData(username)
    res.status(200).render(path.join(__dirname, "../client/views/categories.ejs"), {userData})
})

app.get("/expenses", async(req, res)=>{
    const username = req.query.username
    console.log(username)
    const userData = await fetchUserData(username)
    res.status(200).render(path.join(__dirname, "../client/views/expenses.ejs"), {userData})
})

// Start listening on the available port.
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})