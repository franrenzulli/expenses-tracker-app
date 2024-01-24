// Store all data of a username 

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI

const fetchUserData = async(username)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from fetchUserData")
        const database = client.db("expense-tracker")
        const userData = await database.collection("users").findOne({"username":username})
        await client.close()
        return userData
    }catch(err){
        console.error(err)
    }
}

module.exports = fetchUserData