// Deletes a category, given a category name

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI
const bcrypt = require("bcrypt")

const deleteCategory = async(username, categoryName)=>{

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

        await client.close() 
        console.log("Category deleted, deleteCategory.js")
        
    }catch(err){
        console.error("Error connecting to DB, deleteCategory.js")
    }
}

module.exports = deleteCategory