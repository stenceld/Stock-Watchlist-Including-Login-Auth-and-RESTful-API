


// Require Mongoose
const mongoose = require("mongoose");

// Create a user model from the schema 
const userSchema = new mongoose.Schema ({
    username: { type: String, required: true, unique: true },
    passHash: { type: String, required: true, unique: true},
    status: String
});

const Users = mongoose.model("Users", userSchema);

// Export the model
module.exports = Users;