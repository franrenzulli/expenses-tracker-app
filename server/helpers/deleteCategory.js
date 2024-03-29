// Deletes a category, given a category name

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI
const bcrypt = require("bcrypt")

const deleteCategory = async(username, categoryName, type)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to DB, deleteCategory")    
        const database = await client.db("expense-tracker")

        // We try to find the user and keep stored only those categories which name is different to the name given to delete
        const user = await database.collection("users").findOne({username:username})
        if(user){
            const updatedCategories = user.categories.filter(category => category.name !== categoryName )
            await database.collection("users").updateOne({ username: username }, { $set: { categories: updatedCategories } });
        }else{
            console.log("User not found, deleteCategory.js")
        }

        // Delete all transactions of the deleted category

        const filteredTransactions = user.expenses.filter(transaction => transaction.category == categoryName )

        for (const transaction of filteredTransactions){

            await database.collection("users").updateOne(
                {username: username},
                {$pull: { expenses: { name: transaction.name}}}
            )

            // Delete money from the income/balance
            if(type == "Expense"){

                await database.collection("users").updateOne(
                    { username: username },
                    { $inc: { expense: -transaction.amount } }
                );

            }else if(type == "Income"){

                await database.collection("users").updateOne(
                    { username: username },
                    { $inc: { income: -transaction.amount } }
                );

            }
        }

        // Update balance
        await database.collection("users").updateOne(
            { username: username },
            { $set: { balance: (await database.collection("users").findOne({ username: username })).income - (await database.collection("users").findOne({ username: username })).expense } }
        );

        await client.close() 
        console.log("Category deleted, deleteCategory.js")
        
    }catch(err){
        console.error("Error connecting to DB, deleteCategory.js")
    }
}

module.exports = deleteCategory