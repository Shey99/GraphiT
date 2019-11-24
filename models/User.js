const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  api: {
    type: Array
  }
});

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
