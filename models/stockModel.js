


// Require Mongoose
const mongoose = require("mongoose");

// Create a user model from the schema 
const stockSchema = new mongoose.Schema ({
    username: { type: String, require: true},
    ticker: { type: String, require: true},
    companyName: { type: String, require: true},
    sharesOwned: { type: Number, require: true},
    purchasePrice: { type: Number, require: true},
    currentPrice: { type: Number, require: true},
});

const Stocks = mongoose.model("Stocks", stockSchema);

// Export the model
module.exports = Stocks;