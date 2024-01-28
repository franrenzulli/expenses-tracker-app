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
        }else if(action == "edit"){
            await database.collection("users").updateOne(
                {username:username, "categories.name":categoryName},
                {$set: {
                    
                }}
            )
        }else if(action == "delete"){

        }

        await client.close() 
        console.log("Category managed successfully, changes saved, from addCategory.js")
    }catch(err){
        console.error("Error connecting to the database, from manageCategory.js")
    }
}

module.exports = manageCategory