


// Require Mongoose
const mongoose = require("mongoose");

// Create a user model from the schema 
const user = mongoose.model ("User", {
    username: { type: String, required: true, unique: true },
    passHash: { type: String, required: true, unique: true},
    status: String
});

// Export the model
module.exports = User;