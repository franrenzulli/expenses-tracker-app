// Add a new transaction

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI



const addTransaction = async(username, transactionName, categoryName, transactionAmount)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from addTransaction")    
        const database = await client.db("expense-tracker")

        // Adds a new transaction
       
            const newTransaction = {
                name:transactionName,
                category:categoryName,
                amount:transactionAmount,
            }
    
            await database.collection("users").updateOne(
                {username:username},
                {$push: {expenses:newTransaction}}
            )
            console.log("Category added, manageCategory.js")
            
        
        await client.close() 
    }catch(err){
        console.error("Error connecting to DB, addTransaction.js")
    }
}

module.exports = addTransaction