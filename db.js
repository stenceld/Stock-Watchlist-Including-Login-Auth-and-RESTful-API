

// Require Mongoose
const mongoose = require("mongoose");

// Establish uri
const uri = "mongodb://localhost:27017/StockWatchList";

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }
    catch {
        console.error("MongoDB connection error:", err);
    }
}

// Export connection
module.exports = connectDB;