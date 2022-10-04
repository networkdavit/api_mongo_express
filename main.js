const express = require("express");
require('dotenv').config()
const app = express();
const bodyparser = require("body-parser")
const jsonparser = bodyparser.json()
const mongoose = require("mongoose")
const port = 6000;
const uri = process.env.MONGO_URI
const conn_str = uri
const post_controller = require('./controllers/post_controller.js')
const user_controller = require('./controllers/user_controller')

app.use(jsonparser)

post_controller.make_post(app)
post_controller.get_all_posts(app)
user_controller.register(app)

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