// Insert a document into "users" collection

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI
const bcrypt = require("bcrypt")

const addToDatabase = async(username, password, firstName, lastName)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from addToDatabase")    

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10)

        const database = await client.db("expense-tracker")
        await database.collection("users").insertOne({
            "username":username,
            "password":hashedPassword,
            "firstName":firstName,
            "lastName":lastName
        })

        await client.close()
        console.log("Connection closed, user added to the collection successfully, from addToDatabase")
    }catch(err){
        console.error("Error connecting to the database, from addToDatabase")
    }
}

module.exports = addToDatabase