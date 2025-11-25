



// Require Neccessary Modules
const express = require("express");
const cors = require("cors");
const stock = require("./model/stock");
const user = require("./models/userModel");
const connectDB = require("./db");

// Create app
const app = express();

// Middleware to parse data
app.use(express.json());

// CORS to allow requests from any origin
app.use(cors());

// Serve static files from the directory
app.use(express.static(__dirname));

// Secret Key
// Used jwt secret key generator
// https://jwtsecrets.com/
// Learned that it is best to store in seperate file for security
// But for simple purpose gonna store here
const secret = "4d14ac915cf873fdb5f24c942d38c401";

//  Connect to the Database
connectDB();










