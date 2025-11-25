// I certify that this file I am submitting is all my own work.
// None of it is copied from any source or any person.
// Signed: Dominic Stencel  Date: 11/22/2025

// Author: Dominic Stencel
// Date: 11/22/2025
// Class: CSC305
// Project: Assignment 5 - RESTful API and Login Authentication
// Sources:
//  - https://learn.zybooks.com/zybook/CSPCSS305DuerreFall2025/chapter/9/section/5
//  - claude.ai

// File Name: api/stocks.js

// Require Modules
const express = require("express");
const router = express.Router();
const jwt = require("jwt-simple");
const Stock = require("../models/stockModel");

// Secret key
const secret = "4d14ac915cf873fdb5f24c942d38c401";

// ============================================
// getYahooStock Price Function - 
// Get stock data from Yahoo Finance API
// ============================================
async function getYahooStockPrice(ticker) {
    // Build URL for Yahoo Finance API
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/" + 
        ticker.toUpperCase() + "?interval=1d&range=1d";

    try {
        // Fetch data from Yahoo Finance
        // User-Agent header required to avoid 403 forbidden errors
        // Used AI to healp generate this fetch with headers
        // Source: claude.ai
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" + 
                "AppleWebKit/537.36"
            }
        });

        // Check if response is ok
        if (!response.ok) {
            return null;
        }

        // Parse JSON response
        const data = await response.json();

        // Check if data contains necessary information
        if (!data.chart.result[0].meta.regularMarketPrice) {
            return null;
        }

        // Extract current price and company name
        const currentPrice = data.chart.result[0].meta.regularMarketPrice;
        const companyName = data.chart.result[0].meta.shortName;

        return {
            companyName: companyName,
            currentPrice: currentPrice
        };

    } catch (error) {
        console.error("Yahoo Finance API error:", error);
        return null;
    }
}

// ============================================
// verifyToken Function - Verify token and get user info
// ============================================
function verifyToken(req) {
    // Get Authorization header
    const authHeader = req.headers["authorization"];

    // Check if header exists
    if (!authHeader) {
        return null;
    }

    // Split header to get token (format: "Bearer tokenstring")
    const parts = authHeader.split(" ");

    // Validate format
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return null;
    }

    const token = parts[1];

    try {
        // Decode token and return user info
        const decoded = jwt.decode(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}

// ============================================
// GET / - Get all stocks for authenticated user
// ============================================
router.get("/", async (req, res) => {
    // Verify token
    const user = verifyToken(req);
    if (!user) {
        res.status(401).json({ error: "Access denied. Invalid or missing token." });
        return;
    }

    try {
        // Find all stocks for this user
        const stocks = await Stock.find({ username: user.username });

        // Initialize portfolio totals
        let totalCurrentValue = 0;
        let totalCostBasis = 0;

        // Process each stock and update current prices
        const stockData = [];
        for (const stock of stocks) {
            // Get updated price from Yahoo Finance
            const yahooData = await getYahooStockPrice(stock.ticker);

            let currentPrice = stock.currentPrice;
            if (yahooData) {
                currentPrice = yahooData.currentPrice;
                // Update current price in database
                await Stock.updateOne(
                    { _id: stock._id },
                    { currentPrice: currentPrice }
                );
            }

            // Calculate values
            const costBasis = stock.sharesOwned * stock.purchasePrice;
            const currentValue = stock.sharesOwned * currentPrice;
            const profitLoss = currentValue - costBasis;

            // Add to totals
            totalCurrentValue += currentValue;
            totalCostBasis += costBasis;

            // Add stock to response array
            stockData.push({
                _id: stock._id,
                ticker: stock.ticker,
                companyName: stock.companyName,
                sharesOwned: stock.sharesOwned,
                purchasePrice: stock.purchasePrice,
                currentPrice: currentPrice,
                currentValue: currentValue,
                profitLoss: profitLoss
            });
        }

        // Calculate total profit/loss
        const totalProfitLoss = totalCurrentValue - totalCostBasis;

        // Return stocks and portfolio summary
        res.status(200).json({
            stocks: stockData,
            portfolio: {
                totalCurrentValue: totalCurrentValue,
                totalCostBasis: totalCostBasis,
                totalProfitLoss: totalProfitLoss
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// POST / - Add a new stock to watchlist
// ============================================
router.post("/", async (req, res) => {
    // Verify token
    const user = verifyToken(req);
    if (!user) {
        res.status(401).json({ error: "Access denied. Invalid or missing token." });
        return;
    }

    // Get stock info from request body
    const { ticker, sharesOwned, purchasePrice } = req.body;

    // Validate required fields
    if (!ticker || !sharesOwned || !purchasePrice) {
        res.status(400).json({ error: "Missing ticker, sharesOwned," + 
            "and/or purchasePrice" });
        return;
    }

    // Convert ticker to uppercase
    const tickerUpper = ticker.toUpperCase();

    try {
        // Check if user already has this stock
        const existingStock = await Stock.findOne({
            username: user.username,
            ticker: tickerUpper
        });

        if (existingStock) {
            res.status(409).json({ error: "Stock already in watchlist" });
            return;
        }

        // Get stock data from Yahoo Finance
        const yahooData = await getYahooStockPrice(tickerUpper);

        if (!yahooData) {
            res.status(400).json({ error: "Invalid ticker symbol" });
            return;
        }

        // Create new stock
        const newStock = new Stock({
            username: user.username,
            ticker: tickerUpper,
            companyName: yahooData.companyName,
            sharesOwned: sharesOwned,
            purchasePrice: purchasePrice,
            currentPrice: yahooData.currentPrice
        });

        // Save stock to database
        await newStock.save();

        res.status(201).json({
            message: "Stock added successfully",
            stock: newStock
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// DELETE /:id - Delete a stock from watchlist
// ============================================
router.delete("/:id", async (req, res) => {
    // Verify token
    const user = verifyToken(req);
    if (!user) {
        res.status(401).json({ error: "Access denied. Invalid or missing token." });
        return;
    }

    // Get stock id from URL parameters
    const stockId = req.params.id;

    try {
        // Find and delete stock (only if it belongs to this user)
        const deletedStock = await Stock.findOneAndDelete({
            _id: stockId,
            username: user.username
        });

        if (!deletedStock) {
            res.status(404).json({ error: "Stock not found or access denied" });
            return;
        }

        res.status(200).json({
            message: "Stock deleted successfully",
            stock: deletedStock
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;