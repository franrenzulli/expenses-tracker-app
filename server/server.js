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

// Sessions
//const session = require("express-session")

/*app.use(session({
    secret: "dasds",
    resave: false,
    saveUnitialized: false,
}))*/

// Allows to serve static files 
app.use(express.static(path.join(__dirname, '../client')));

// Allow environment variables
require("dotenv").config()

const PORT = process.env.PORT ?? 3000

// Serve the SignUp page
app.get("/signup", (req,res)=>{
    res.sendFile(path.join(__dirname, "../client/signup/signup.html"))
})

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
        console.log("SUCCESSFUL LOGIN")
        res.redirect("/dashboard")
//      req.session.userId = username; 
    }
})

// Route for the successful login

app.get("/dashboard", (req,res)=>{
//    console.log(req.session.userId)
    res.sendFile(path.join(__dirname, "../client/dashboard/dashboard.html"))
    console.log("Dashboard route accessed");
})

// Create client to MongoDB database
const uri = process.env.MONGODB_URI

const createClient = (uri)=>{

    if(!uri){
        throw new Error("Environment variable MONDODB_URI is not configured")
    }
    return new MongoClient(uri)
} 

const client = createClient(uri)

// Connect to the database and check if a username is found or not, returns true if the username is available to use (not found)
const checkUsernameAvailability = async(usernameAsked)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database")

        const database = client.db("expense-tracker")
        const collection = database.collection("users")

        const cursor = await collection.find({"username":usernameAsked})
        const result = await cursor.toArray()

        if(result.length > 0){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.error("Error connecting to the database")
    }finally{
        await client.close()
        console.log("Connection closed")
    }
}

// Insert a document into "users" collection
const addToDatabase = async(username, password, firstName, lastName)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database")

        const database = client.db("expense-tracker")
        const collection = database.collection("users")

        collection.insertOne({
            "username":username,
            "password":password,
            "firstName":firstName,
            "lastName":lastName
        })

        console.log("User added to the collection")
    }catch(err){
        console.error("Error connecting to the database")
    }finally{
        await client.close()
        console.log("Connection closed")
    }
}

// Check username-password matches, returns true if there's a match.
const loginTrial = async(username, password)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database")
        const database = client.db("expense-tracker")
        const collection = database.collection("users")

        const cursor = await collection.find({"username":username, "password":password})
        const result = await cursor.toArray()

        if(result.length > 0){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.error(err)
    }finally{
        await client.close()
        console.log("Connection closed")
    }
}

// Start listening on the available port.
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})
