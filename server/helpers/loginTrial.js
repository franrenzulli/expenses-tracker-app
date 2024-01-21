// Check username-password matches, returns true if there's a match

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")

require("dotenv").config()
const uri = process.env.MONGODB_URI

const loginTrial = async(username, password)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database")
        const database = client.db("expense-tracker")
        const cursor = await database.collection("users").find({"username":username, "password":password})
        const result = await cursor.toArray()
        await client.close()
        console.log("Connection closed")

        if(result.length > 0){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.error(err)
    }
}

module.exports = loginTrial