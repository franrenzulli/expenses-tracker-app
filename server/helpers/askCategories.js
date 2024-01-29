// Returns all categories of a user 

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI
const bcrypt = require("bcrypt")

const askCategories = async(username)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from askCategories")    
        const database = await client.db("expense-tracker")
        
        // We collect all categories of the chosen user and return it
        const user = await database.collection("users").findOne({username:username})
        const categories = user.categories || []

        await client.close() 
        console.log("Categories returned, askCategories.js")

        return categories
        
    }catch(err){
        console.error("Error connecting to DB, askCategories.js")
    }
}

module.exports = askCategories