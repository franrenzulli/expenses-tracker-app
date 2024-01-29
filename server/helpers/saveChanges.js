// Modify an existing user data

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI
const bcrypt = require("bcrypt")

const saveChanges = async(usernameInput, passwordInput, firstNameInput, lastNameInput, urlInput, username)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from saveChanges")    
        const database = await client.db("expense-tracker")

        // Modify photo if there is a new url
        if(urlInput != ""){
            await database.collection("users").updateOne(
                {username:username},
                {$set:{"profilePic":urlInput}}
            )
        }

        // Dont modify password
        if(passwordInput.length == 0){

            await database.collection("users").updateOne(
                {username:username},
                {$set:{"username":usernameInput, "firstName":firstNameInput, "lastName":lastNameInput}}
            )
        // Modify password
        }else if(passwordInput.length > 0){ 
            const hashedPassword = await bcrypt.hash(passwordInput, 10)
            await database.collection("users").updateOne(
                {username:username},
                {$set:{"username":usernameInput, "password":hashedPassword,"firstName":firstNameInput, "lastName":lastNameInput}}
            )
        }

        await client.close() 
        console.log("User modified, saveChanges.js")
    }catch(err){
        console.error("Error connecting to DB, saveChanges.js")
    }
}

module.exports = saveChanges