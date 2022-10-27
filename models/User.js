const { Schema, model } = require("mongoose");

//TODO: add user properties and validation according to assignment
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: [10, "Email must be at least 10 characters long"],
  },
  username: {
    type: String,
    required: true,
    minlength: [4, "Username must be at least 4 characters long"],
  },
  hashedPassword: { type: String, required: true },
});



const User = model("User", userSchema);

module.exports = User;
