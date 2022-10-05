const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const user_schema = new Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  identifier: {
    type: String
  },
  password: {
    type: String
  }
});

user_schema.plugin(AutoIncrement, {id:'order_user_id',inc_field: 'user_id'});
const user = mongoose.model('users', user_schema)

module.exports = {
  user,
  user_schema
}
