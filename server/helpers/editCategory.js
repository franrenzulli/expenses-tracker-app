// Edits a category, given the category name
const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js");
require("dotenv").config();
const uri = process.env.MONGODB_URI;

const editCategory = async(username, oldCategoryName, newCategoryName, oldType, newType, newColor) => {
    try {
        const client = createClient(uri);
        await client.connect();
        console.log("Connected to DB, editCategory");

        const database = client.db("expense-tracker");
        const usersCollection = database.collection("users");

        // Find the user
        const user = await usersCollection.findOne({ username: username });

        if (user) {
            
            // Find the category to edit
            const categoryIndex = user.categories.findIndex(category => category.name === oldCategoryName);

            if (categoryIndex !== -1) {
                // Update the category
                user.categories[categoryIndex].name = newCategoryName;
                user.categories[categoryIndex].type = newType;
                user.categories[categoryIndex].color = newColor;

                // Update the user document in the database
                await usersCollection.updateOne(
                    { username: username },
                    { $set: { categories: user.categories } }
                );

                console.log("Category edited, editCategory");

                // Edit the category name of all transactions with the old category name

                const filteredTransactions = user.expenses.filter(transaction => transaction.category == oldCategoryName )

                for (const transaction of filteredTransactions){

                    const editedTransaction = {
                        name:transaction.name,
                        category:newCategoryName,
                        amount:transaction.amount,
                        color:newColor
                    }

                    // We delete the old transactions

                    await usersCollection.updateOne(
                        { username: username },
                        { $pull: { expenses: { name: transaction.name } } }
                    );

                    // We add the edited transaction

                    await usersCollection.updateOne(
                        { username: username },
                        { $push: { expenses: editedTransaction } }
                    );      
                    
                    // We edit the income/expense numbers
                    if(oldType == "Income" && newType == "Expense"){ // Pass the money from Income to Expense

                        await usersCollection.updateOne(
                            { username: username },
                            { $inc: { expense: +transaction.amount, income: -transaction.amount } }
                        );

                    }else if(oldType == "Expense" && newType == "Income"){ // Pass the money from Expense to Income

                        await usersCollection.updateOne(
                            { username: username },
                            { $inc: { expense: -transaction.amount, income: +transaction.amount } }
                        );

                    }
                    // Update balance
                    await database.collection("users").updateOne(
                        { username: username },
                        { $set: { balance: (await database.collection("users").findOne({ username: username })).income - (await database.collection("users").findOne({ username: username })).expense } }
                    );

                }        
            } else {
                console.log("Category not found, editCategory");
            }
        } else {
            console.log("User not found");
        }
        await client.close();
        console.log("Connection to DB closed, editCategory");
    } catch (err) {
        console.error("Error connecting to DB, editCategory", err);
    }
};

module.exports = editCategory;