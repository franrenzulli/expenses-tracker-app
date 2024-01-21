// Insert a document into "users" collection

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")

require("dotenv").config()
const uri = process.env.MONGODB_URI

const addToDatabase = async(username, password, firstName, lastName)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database")    
        console.log("CHIPI CHIPI CHAPA CHAPA")
        const database = await client.db("expense-tracker")
        await database.collection("users").insertOne({
            "username":username,
            "password":password,
            "firstName":firstName,
            "lastName":lastName
        })

        await client.close()
        console.log("Connection closed")

        console.log("User added to the collection")
    }catch(err){
        console.error("Error connecting to the database")
    }
}

module.exports = addToDatabase