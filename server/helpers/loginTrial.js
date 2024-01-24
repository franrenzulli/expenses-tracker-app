// Check username-password matches using hashes, returns true if there's a match

const { MongoClient } = require('mongodb');
const createClient = require("./createClient.js")
require("dotenv").config()
const uri = process.env.MONGODB_URI
const bcrypt = require("bcrypt")

const loginTrial = async(username, password)=>{

    try{
        const client = createClient(uri)
        await client.connect()
        console.log("Connected to the database, from loginTrial")
        const database = client.db("expense-tracker")
        const user = await database.collection("users").findOne({"username":username})

        // Check the user existence
        if(user){
            // Compare the hashes
            const passwordMatch = await bcrypt.compare(password, user.password)
            await client.close()
            
            if(passwordMatch){
                console.log("Connection closed, successful user-password match, from loginTrial")
            }else{
                console.log("Connection closed, unsuccessful user-password match, from loginTrial")
            }
            return passwordMatch
        }else{
            await client.close()
            console.log("Connection closed, user not found, from loginTrial")
            return false
        }
    }catch(err){
        console.error(err)
    }
}

module.exports = loginTrial