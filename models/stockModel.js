


// Require Mongoose
const mongoose = require("mongoose");

// Create a user model from the schema 
const stock = mongoose.model ("Stock", {
    tickerSymbol: { type: String, require: true},
    companyName: { type: String, require: true},
    sharesOwned: { type: Number, require: true},
    purchasePrice: { type: Number, require: true},
    currentPrice: { type: Number, require: true},
});

// Export the model
module.exports = Stock;