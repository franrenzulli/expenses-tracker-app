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
const saveChanges = require("./helpers/saveChanges.js")
const manageCategory = require("./helpers/manageCategory.js")
const askCategories = require("./helpers/askCategories.js")
const deleteCategory = require("./helpers/deleteCategory.js")
const editCategory = require("./helpers/editCategory.js")
const addTransaction = require("./helpers/addTransaction.js")
const askTransactions = require("./helpers/askTransactions.js")

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
        // Generates token
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

// Serve the /dashboard .ejs template
app.get("/dashboard", async(req, res)=>{
    const username = req.query.username
    console.log("USERNAME PASSED:", username)
    const userData = await fetchUserData(username)
    res.status(200).render(path.join(__dirname, "../client/views/dashboard.ejs"), {userData})
})

// Serve the /dashboard/categories .ejs template
app.get("/categories", async(req,res)=>{
    const username = req.query.username
    const userData = await fetchUserData(username)
    res.status(200).render(path.join(__dirname, "../client/views/categories.ejs"), {userData})
})

// Serve the /dashboard/expenses .ejs template
app.get("/expenses", async(req, res)=>{
    const username = req.query.username
    const userData = await fetchUserData(username)
    res.status(200).render(path.join(__dirname, "../client/views/expenses.ejs"), {userData})
})

// Serve the /dashboard/settings .ejs template
app.get("/settings", async(req,res)=>{
    const username = req.query.username
    const userData = await fetchUserData(username)
    res.status(200).render(path.join(__dirname, "../client/views/settings.ejs"), {userData})
})

// Handles the edit action of settings (personal data)
app.post("/saveChanges", async(req,res)=>{
    const {usernameInput, passwordInput, firstNameInput, lastNameInput, urlInput, username} = req.body
    saveChanges(usernameInput, passwordInput, firstNameInput, lastNameInput, urlInput, username)
    res.status(200).send({ok:true})
})

// Handles the add or edit actions of categories
app.post("/categoryManager", async(req,res)=>{
    const {username, categoryName, type, color, action} = req.body
    manageCategory(username, categoryName, type, color, action)
    res.status(200).send({ok:true})
})

// Handle the request of all categories of a user
app.post("/askCategories", async(req,res)=>{
    const {username} = req.body
    const categories = await askCategories(username)
    res.json(categories)
})

// Handle the delete action of categories
app.post("/deleteCategory", async(req,res)=>{
    const {username, categoryh2} = req.body
    deleteCategory(username, categoryh2)
    res.status(200).send({ok:true})
})

app.post("/editCategory", async(req,res)=>{
    const {username, oldCategoryName, newCategoryName, newType, newColor} = req.body
    editCategory(username, oldCategoryName, newCategoryName, newType, newColor)
    res.status(200).send({ok:true})
})

app.post("/addTransaction", async(req,res)=>{
    const {username, transactionName, categoryName, transactionAmount} = req.body
    addTransaction(username, transactionName, categoryName, transactionAmount)
    res.status(200).send({ok:true})
})

app.post("/askTransactions", async(req,res)=>{
    const {username} = req.body
    const transactions = await askTransactions(username)
    res.json(transactions)
})

// Start listening on the available port.
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})