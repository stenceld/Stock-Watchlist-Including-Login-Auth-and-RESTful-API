# Stock Watchlist API

**Author:** Dominic Stencel  
**Date:** 11/24/2025  
**Class:** CSC305  
**Project:** Assignment 5 - RESTful API and Login Authentication

## Project Overview

A RESTful API for managing a personal stock watchlist with user authentication. Users can register, login, and manage their own stock portfolio. The API integrates with Yahoo Finance to fetch real-time stock prices.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs (password hashing)
- jwt-simple (token authentication)

## File Structure

```
StencelAssignment5/
├── server.js           # Main entry point
├── db.js               # MongoDB connection
├── api/
│   ├── users.js        # Register and login routes
│   └── stocks.js       # Stock CRUD routes
├── models/
    ├── userModel.js    # User schema
    └── stockModel.js   # Stock schema
```

## Installation

1. Make sure MongoDB is installed and running locally

2. Install dependencies:
```
npm install
```

3. Start the server:
```
node server.js
```

4. Server runs at `http://localhost:3000`

## Dependencies

```
npm install express mongoose bcryptjs jwt-simple cors
```

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/register | Register a new user |
| POST | /api/users/login | Login and receive token |

### Protected Routes (Require Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stocks | Get all stocks for user |
| POST | /api/stocks | Add a stock to watchlist |
| DELETE | /api/stocks/:id | Delete a stock by ID |

## Postman Testing Guide

### Step 1: Register a User

- **Method:** POST
- **URL:** `http://localhost:3000/api/users/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
    "username": "testuser",
    "password": "testpass123"
}
```

### Step 2: Login

- **Method:** POST
- **URL:** `http://localhost:3000/api/users/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
    "username": "testuser",
    "password": "testpass123"
}
```
- **Save the token from the response**

### Step 3: Get Stocks (Protected)

- **Method:** GET
- **URL:** `http://localhost:3000/api/stocks`
- **Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

### Step 4: Add a Stock (Protected)

- **Method:** POST
- **URL:** `http://localhost:3000/api/stocks`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body:**
```json
{
    "ticker": "AAPL",
    "sharesOwned": 10,
    "purchasePrice": 150.00
}
```

### Step 5: Delete a Stock (Protected)

- **Method:** DELETE
- **URL:** `http://localhost:3000/api/stocks/STOCK_ID_HERE`
- **Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

### Step 6: Test Without Token

- **Method:** GET
- **URL:** `http://localhost:3000/api/stocks`
- **Headers:** None
- **Expected:** 401 Unauthorized error

## Features

- User registration with password hashing
- JWT token-based authentication
- Real-time stock prices from Yahoo Finance API
- Portfolio tracking with profit/loss calculations
- User isolation (users only see their own stocks)
