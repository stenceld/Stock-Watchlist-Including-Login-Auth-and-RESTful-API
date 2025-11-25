// I certify that this file I am submitting is all my own work.
// None of it is copied from any source or any person.
// Signed: Dominic Stencel  Date: 11/22/2025

// Author: Dominic Stencel
// Date: 11/22/2025
// Class: CSC305
// Project: Assignment 5 - RESTful API and Login Authentication
// Sources:
//  - https://learn.zybooks.com/zybook/CSPCSS305DuerreFall2025/chapter/9/section/5

// File Name: models/stockModel.js


// Require Mongoose
const mongoose = require("mongoose");

// Create schema for Stocks
const stockSchema = new mongoose.Schema ({
    username: { type: String, required: true},
    ticker: { type: String, required: true},
    companyName: { type: String, required: true},
    sharesOwned: { type: Number, required: true},
    purchasePrice: { type: Number, required: true},
    currentPrice: { type: Number, required: true},
});

// Create model from schema
const Stocks = mongoose.model("Stocks", stockSchema);

// Export the model
module.exports = Stocks;