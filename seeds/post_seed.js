const mongoose = require("mongoose")
const { post } = require("../models/post_schema")
require('dotenv').config({path:__dirname+'/../.env'})
const prompt = require('prompt-sync')();
const uri = process.env.MONGO_URI
const conn_str = uri

const doDletePreviousRecords = prompt('Should we delete previous DB records? ')


mongoose.connect(conn_str, {
    useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("MONGO CONNECTION OPEN")
        console.log("STARTING SEEDING FOR POSTS")
    })
    .catch((err) => {
        console.log(err)
    })

const seedPosts = [
    {
        title: "Hello World",
        body: "This is my first post"
    },
    {
        title: "This is another post",
        body: "This is my second post here"
    },
    {
        title: "Wow what a day",
        body: "This is my third post"
    },
    {
        title: "Fantastic World",
        body: "This is my fourth post"
    },
    {
        title: "Hello again",
        body: "This is my fifth post"
    }
]

const seedDB = async () => {
    if(doDletePreviousRecords == "yes" || doDletePreviousRecords == "y"){
        await post.deleteMany({}) 
     }
    await post.insertMany(seedPosts)
}

seedDB().then(() => {
    mongoose.connection.close()
})