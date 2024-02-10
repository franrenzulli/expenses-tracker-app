// Deletes a transaction, given a transaction name

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI

const deleteTransaction = async(username, transactionName, categoryName, transactionAmount)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to DB, deleteTransaction")    
        const database = await client.db("expense-tracker")

        // We try to find the user and keep stored only those transactios which name is different to the name given to delete
        const user = await database.collection("users").findOne({username:username})
        if(user){
            const updatedTransactions = user.expenses.filter(transaction => transaction.name !== transactionName )
            await database.collection("users").updateOne({ username: username }, { $set: { expenses: updatedTransactions } });

        // Update the income/expense data 
        const categoryFound = user.categories.filter(category => category.name == categoryName )
        const categoryType = categoryFound[0].type
        const transactionAmountInt = parseInt(transactionAmount)

        if(categoryType == "Income"){
            await database.collection("users").updateOne(
                {username: username},
                {$inc: {income: -transactionAmountInt}}
            )
        }else if(categoryType == "Expense"){
            await database.collection("users").updateOne(
                {username: username},
                {$inc: {expense: -transactionAmountInt}}
            )
        }

        // Update the balance field
        await database.collection("users").updateOne(
            { username: username },
            { $set: { balance: (await database.collection("users").findOne({ username: username })).income - (await database.collection("users").findOne({ username: username })).expense } }
        );

        }else{
            console.log("User not found, deleteTransaction.js")
        }

        await client.close() 
        console.log("Transaction deleted, deleteTransaction.js")
        
    }catch(err){
        console.error("Error connecting to DB, deleteTransaction.js", err)
    }
}

module.exports = deleteTransaction