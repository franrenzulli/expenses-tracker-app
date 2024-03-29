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
        const user =await database.collection("users").findOne({username: username})
        
        const categoryFound = user.categories.filter(category => category.name == categoryName )
        const categoryType = categoryFound[0].type
        const transactionAmountInt = parseInt(transactionAmount)
        const categoryColor = categoryFound[0].color

        const newTransaction = {
            name:transactionName,
            category:categoryName,
            amount:transactionAmount,
            color:categoryColor,
        }

        // Adds a new transaction
        await database.collection("users").updateOne(
            {username:username},
            {$push: {expenses:newTransaction}}
        )
        console.log("Category added, manageCategory.js")

        // Update the income/expense data
        if(categoryType == "Income"){
            await database.collection("users").updateOne(
                {username: username},
                {$inc: {income: transactionAmountInt}}
            )
        }else if(categoryType == "Expense"){
            await database.collection("users").updateOne(
                {username: username},
                {$inc: {expense: transactionAmountInt}}
            )
        }

        // Update the balance field
        await database.collection("users").updateOne(
            { username: username },
            { $set: { balance: (await database.collection("users").findOne({ username: username })).income - (await database.collection("users").findOne({ username: username })).expense } }
        );

        await client.close() 
    }catch(err){
        console.error("Error connecting to DB, addTransaction.js", err)
    }
}

module.exports = addTransaction