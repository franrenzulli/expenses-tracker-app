// Edits a transaction, given the transaction name
const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js");
require("dotenv").config();
const uri = process.env.MONGODB_URI;

const editTransaction = async (username, oldTransactionName, newTransactionName, categoryName, transactionAmount) => {
    try {
        const client = createClient(uri);
        await client.connect();
        console.log("Connected to DB, editTransaction");

        const database = client.db("expense-tracker");
        const usersCollection = database.collection("users");

        // Find the user
        const user = await usersCollection.findOne({ username: username });

        if (user) {
            // Find the transaction to edit
            const transactionIndex = user.expenses.findIndex(transaction => transaction.name === oldTransactionName);

            if (transactionIndex !== -1) {
                // Update the category
                user.expenses[transactionIndex].name = newTransactionName;
                user.expenses[transactionIndex].category = categoryName;
                user.expenses[transactionIndex].amount = transactionAmount;

                // Update the user document in the database
                await usersCollection.updateOne(
                    { username: username },
                    { $set: { expenses: user.expenses } }
                );

                console.log("Transaction edited, editTransaction");
            } else {
                console.log("Transaction not found, editTransaction");
            }
        } else {
            console.log("User not found");
        }
        await client.close();
        console.log("Connection to DB closed, editTransaction");
    } catch (err) {
        console.error("Error connecting to DB, editTransaction");
    }
};

module.exports = editTransaction;