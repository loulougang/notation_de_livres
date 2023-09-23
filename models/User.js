const mongoose = require('mongoose');

const UniqueValidator = require("mongoose-unique-validator")
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Adresse e-mail unique
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(UniqueValidator)
const User = mongoose.model('User', userSchema);

module.exports = User;
