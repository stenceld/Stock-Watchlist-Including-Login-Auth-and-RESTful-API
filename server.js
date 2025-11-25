// I certify that this file I am submitting is all my own work.
// None of it is copied from any source or any person.
// Signed: Dominic Stencel  Date: 11/22/2025

// Author: Dominic Stencel
// Date: 11/22/2025
// Class: CSC305
// Project: Assignment 5 - RESTful API and Login Authentication
// Sources:
//  - https://learn.zybooks.com/zybook/CSPCSS305DuerreFall2025/chapter/9/section/5
    
// File Name: server.js

// Require Neccessary Modules
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

// Import Route Files
const usersRoute = require("./api/users");
const stocksRoute = require("./api/stocks");

// Create app
const app = express();

// Middleware to parse data
app.use(express.json());

// CORS to allow requests from any origin
app.use(cors());

// Serve static files from the public directory
app.use(express.static("public"));

// Secret Key
// Used jwt secret key generator
// https://jwtsecrets.com/
// Learned that it is best to store in seperate file for security
// But for simple purpose gonna store here
const secret = "4d14ac915cf873fdb5f24c942d38c401";

// Connect to the Database
connectDB();

// Register API Routes
app.use("/api/users", usersRoute);
app.use("/api/stocks", stocksRoute);

// Root Route - Redirect to index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});









