// Returns all transactions of a user 

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI

const askTransactions = async(username)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from askTransactions")    
        const database = await client.db("expense-tracker")
        
        // We collect all categories of the chosen user and return it
        const user = await database.collection("users").findOne({username:username})
        const transactions = user.expenses || []

        await client.close() 
        console.log("Transactions returned, askTransactions.js")

        return transactions
        
    }catch(err){
        console.error("Error connecting to DB, askTransactions.js")
    }
}

module.exports = askTransactions