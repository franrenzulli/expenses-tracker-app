// Add a new category 

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI
const bcrypt = require("bcrypt")

const manageCategory = async(username, categoryName, type, color, action)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from saveChanges")    
        const database = await client.db("expense-tracker")

        // Adds a new category
        if(action == "add"){
            const newCategory = {
                name:categoryName,
                type:type,
                color:color
            }
    
            await database.collection("users").updateOne(
                {username:username},
                {$push: {categories:newCategory}}
            )
            console.log("Category added, manageCategory.js")
            
        // Edits an existing category
        }else if(action == "edit"){
            await database.collection("users").updateOne(
                {username:username, "categories.name":categoryName},
                {$set: {
                    
                }}
            )
            console.log("Category edited, manageCategory.js")
        }
        await client.close() 
    }catch(err){
        console.error("Error connecting to DB, manageCategory.js")
    }
}

module.exports = manageCategory