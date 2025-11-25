// I certify that this file I am submitting is all my own work.
// None of it is copied from any source or any person.
// Signed: Dominic Stencel  Date: 11/22/2025

// Author: Dominic Stencel
// Date: 11/22/2025
// Class: CSC305
// Project: Assignment 5 - RESTful API and Login Authentication
// Sources:
//  - https://learn.zybooks.com/zybook/CSPCSS305DuerreFall2025/chapter/9/section/5

// File Name: models/userModel.js


// Require Mongoose
const mongoose = require("mongoose");

// Create schema for Users 
const userSchema = new mongoose.Schema ({
    username: { type: String, required: true, unique: true },
    passHash: { type: String, required: true, unique: true},
    status: String
});

// Create model from schema
const Users = mongoose.model("Users", userSchema);

// Export the model
module.exports = Users;