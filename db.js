// I certify that this file I am submitting is all my own work.
// None of it is copied from any source or any person.
// Signed: Dominic Stencel  Date: 11/22/2025

// Author: Dominic Stencel
// Date: 11/22/2025
// Class: CSC305
// Project: Assignment 5 - RESTful API and Login Authentication
// Sources:
//  - https://learn.zybooks.com/zybook/CSPCSS305DuerreFall2025/chapter/9/section/5

// File Name: db.js

// Require Mongoose
const mongoose = require("mongoose");

// Establish uri
const uri = "mongodb://localhost:27017/StockWatchList";

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

// Export connection
module.exports = connectDB;