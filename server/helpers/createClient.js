// Create client to MongoDB database

const { MongoClient } = require('mongodb');

const createClient = (uri)=>{
    
    if(!uri){
        throw new Error("Environment variable MONDODB_URI is not configured, from createClient")
    }
    return new MongoClient(uri)
} 

module.exports = createClient