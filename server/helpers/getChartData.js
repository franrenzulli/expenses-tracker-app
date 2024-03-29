// Returns a JSON with each category and its monetary composition

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI

const getChartData = async(username)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from getChartData")    
        const database = await client.db("expense-tracker")
        
        // We collect all categories of the chosen user and return it
        const user = await database.collection("users").findOne({username:username})
        const transactions = user.expenses || []

        const categoriesSum = {} // Object to store the money sum for each category

        // We iterate over each transaction and sum the money by category
        transactions.forEach(transaction =>{
            const {category, amount} = transaction;
            if(category in categoriesSum){
                categoriesSum[category] += amount;
            }else{
                categoriesSum[category] = amount;
            }
        })
        
        await client.close() 
        console.log("Transactions returned, getChartData.js")
        return transactions
        
    }catch(err){
        console.error("Error connecting to DB, getChartData.js")
    }
}

module.exports = getChartData