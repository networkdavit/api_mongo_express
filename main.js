const express = require("express");
require('dotenv').config()
const app = express();
const bodyparser = require("body-parser")
const jsonparser = bodyparser.json()
const mongoose = require("mongoose")
const port = 6000;
const uri = process.env.MONGO_URI
const conn_str = uri

app.use(jsonparser)
const post_router = require('./routes/post')
const user_router = require('./routes/user')
user_router.user_routes(app)
post_router.post_routes(app)

mongoose.connect(conn_str,{ 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
},(err) => {
if (err) {
  console.log("error in connection");
} else {
  console.log("mongodb is connected");
}});

app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`)
})