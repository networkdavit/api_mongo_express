const express = require("express");
require('dotenv').config()
const app = express();
const bodyparser = require("body-parser")
const jsonparser = bodyparser.json()
const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);
const port = 6000;
const uri = process.env.MONGO_URI
const conn_str = uri
const post = require('./models/post_schema.js')
const post_controller = require('./controllers/post_controller.js')

console.log(post.post)
app.use(jsonparser)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

post_controller.make_post(app)
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