-- I certify that the sql file I am submitting is all my own work. 
-- None of it is copied from any source or any person.
-- Signed:Dominic Stencel  Date:11/3/2025
-- Author: Dominic Stencel 
-- Date: 11/3/2025 
-- Class: CSC305 
-- Project: Assignment 4b - Website On Hostinger
-- File Name: StencelAssignment4b\database.sql
-- Sources: https://www.w3schools.com/sql/default.asp

-- Use the database
USE assignment4bdb;

-- Create watchlist table
CREATE TABLE watchlist (
    ticker_symbol VARCHAR(10) PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    shares_owned INT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL
);
