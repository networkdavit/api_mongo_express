const express = require("express");
require('dotenv').config()
const app = express();
const bodyparser = require("body-parser")
const jsonparser = bodyparser.json()
const mongoose = require("mongoose")
const post_router = require('./routes/posts')
const user_router = require('./routes/user')
const port = require('./constants').port;
const conn_str = process.env.MONGO_URI

app.use(jsonparser)

user_router.user_routes(app)
post_router.post_routes(app)

mongoose.connect(conn_str,{ 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
},(err) => {
if (err) {
  console.log(err)
  console.log("error in connection");
} else {
  console.log("mongodb is connected");
}});

app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`)
})