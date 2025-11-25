


// Require Mongoose
const mongoose = require("mongoose");

// Create a user model from the schema 
const stockSchema = new mongoose.Schema ({
    username: { type: String, required: true},
    ticker: { type: String, required: true},
    companyName: { type: String, required: true},
    sharesOwned: { type: Number, required: true},
    purchasePrice: { type: Number, required: true},
    currentPrice: { type: Number, required: true},
});

const Stocks = mongoose.model("Stocks", stockSchema);

// Export the model
module.exports = Stocks;