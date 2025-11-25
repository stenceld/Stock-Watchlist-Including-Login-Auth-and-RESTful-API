// I certify that this file I am submitting is all my own work.
// None of it is copied from any source or any person.
// Signed: Dominic Stencel  Date: 11/22/2025

// Author: Dominic Stencel
// Date: 11/22/2025
// Class: CSC305
// Project: Assignment 5 - RESTful API and Login Authentication
// Sources:
//  - https://learn.zybooks.com/zybook/CSPCSS305DuerreFall2025/chapter/9/section/5

// File Name: api/users.js


// Require Modules
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const Users = require("../models/userModel");

// Create Secret Key
const secret = "4d14ac915cf873fdb5f24c942d38c401";


// ============================================
// POST /register - Register New User to database
// ============================================
router.post("/register", async (req, res) => {
    // Get username and password from request body
    const { username, password } = req.body;

    // Make sure username and password are provided
    if (!req.body.username || !req.body.password) {
        res.status(418).json(
            { error:"Missing username and/or password" });
        return;
    }

    // Double check that user doesn't already exist
    const existingUser = await Users.findOne(
        { username: req.body.username });
    if (existingUser) {
        res.status(409).json(
            { error: "Username already exists" });
        return;
    }

    // Create password hash
    const passHash = bcrypt.hashSync(req.body.password, 10);

    // Create new user
    const newUser = new Users({
        username: req.body.username,
        passHash: passHash
    });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        res.status(418).json({ error: err.message });
    }
});


// ============================================
// Post /login - Sends token if login is successful
// ============================================
router.post("/login", async (req, res) => {
    // Get username and password from request body
    const { username, password } = req.body;

    // Make sure username and password are provided
    if (!req.body.username || !req.body.password) {
        res.status(418).json(
            { error:"Missing username and/or password" });
        return;
    }

    // Find user in database
    try {
        const user = await Users.findOne(
            { username: req.body.username});

            if (!user) { // User not found
                res.status(401).json(
                    { error: "Invalid Username" });
                return;
            }
            else { // User found
                // Check if password matches hash from database
                if (bcrypt.compareSync(req.body.password, user.passHash)) {

                    // Send back a token that contains the username
                    const token = jwt.encode(
                        { username: user.username }, secret);
                    res.json({ token: token });
                }
                else {
                    res.status(401).json({ error: "Invalid Password" });
                }
            }
    }
    catch (err) {   
        res.status(418).json({ error: err.message });
    }
});

// Export router
module.exports = router;