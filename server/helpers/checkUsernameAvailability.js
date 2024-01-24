// Connect to the database and check if a username is found or not, returns true if the username is available to use (not found)

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")

require("dotenv").config()
const uri = process.env.MONGODB_URI

const checkUsernameAvailability = async(usernameAsked)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from checkUsernameAvailability")

        const database = await client.db("expense-tracker")
        const cursor = await database.collection("users").find({"username":usernameAsked})
        const result = await cursor.toArray()

        await client.close()
        console.log("Connection closed, from checkUsernameAvailability")

        if(result.length > 0){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.error("Error connecting to the database, from checkUsernameAvailability")
    }
}

module.exports = checkUsernameAvailability