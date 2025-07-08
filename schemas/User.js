const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
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
  status_code: {
    type: Number,
    required: true,
    default: 1
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
});

module.exports = UserSchema