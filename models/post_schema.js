const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const post_schema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});

post_schema.plugin(AutoIncrement, {id:'order_seq',inc_field: 'id'});
const post = mongoose.model('posts', post_schema)

module.exports = {
  post,
  post_schema
}
