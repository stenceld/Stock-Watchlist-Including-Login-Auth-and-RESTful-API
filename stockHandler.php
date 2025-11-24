<!-- I certify that the php file I am submitting is all my own work. 
None of it is copied from any source or any person. -->
<!-- Signed: Dominic Stencel  Date:11/3/2025 -->
<!-- Author: Dominic Stencel -->
<!-- Date: 11/3/2025 -->
<!-- Class: CSC305 -->
<!-- Project: Assignment 4b - Using Hostinger -->
<!-- File Name: StencelAssignment4b\stockHandler -->
<!-- Sources: 
    https://www.sitepoint.com/get-url-parameters-with-javascript/
    https://claude.ai/
-->

<?php
    // Initialize Database Connection Variables
    $host = "localhost";
    $user = "u431967787_SaKgoNWBx_root";
    $password = "Luckyworld2026!";
    $dbname = "u431967787_SaKgoNWBx_assignment4bdb";

    // Create Connection
    $conn = mysqli_connect($host, $user, $password, $dbname);

    // Check Connection
    if ($conn->connect_error) {
        die("Connection: " . $conn->connect_error);
    }

    // Function to get stock info from api
    function getYahooStockPrice($ticker) {
        // Url to access yahoo finance api info based of certain ticker
        $url = "https://query1.finance.yahoo.com/v8/finance/chart/" . strtoupper($ticker) .
        "?interval=1d&range=1d";

        // I was getting 403 forbidden errors without setting a user agent because yahoo 
        // finance blocks requests that do not appear to come from a browser
        // Couldn't find a source for this exact issue but
        // Used Ai to help create this code snippet
        // Source: https://claude.ai/
        $options = [
            'http' => [
                'method' => 'GET',
                'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
                 AppleWebKit/537.36\r\n"
            ]
        ];
        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);

        // Check if response is false
        if($response === false) {
            return null;
        }

        // Decode JSON response
        $data = json_decode($response, true);

        // Check if data is valid and contains necessary information
        if (!isset($data['chart']['result'][0]['meta']['regularMarketPrice'])) {
            return null;
        }

        // Extract current price and company name
        $currentPrice = $data['chart']['result'][0]['meta']['regularMarketPrice'];
        $companyName = $data['chart']['result'][0]['meta']['shortName'];

        return [
            'companyName' => $companyName,
            'currentPrice' => $currentPrice
        ];
    }

    // Initialize Empty Message Variable
    $message = "";

    // Process form submission
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        // Get and sanitize form inputs
        $ticker = htmlspecialchars(strtoupper(trim($_POST['ticker'])));
        $quantity = htmlspecialchars(intval($_POST['quantity']));
        $purchasePrice = htmlspecialchars(floatval($_POST['price']));

        // Get stock data from Yahoo Finance API
        $stockData = getYahooStockPrice($ticker);

        // If stock data is valid, proceed to insert into database
        if ($stockData !== null) {
            $companyName = $stockData['companyName'];
            $currentPrice = $stockData['currentPrice'];

            // Insert Data into the database
            $sql = "INSERT INTO watchlist (ticker_symbol, company_name, shares_owned,
                     purchase_price, current_price)
                    VALUES ('$ticker', '$companyName', $quantity, $purchasePrice,
                     $currentPrice)";

            // Execute the query and handle potential errors
            if (mysqli_query($conn, $sql)) {
                $message = "Successfully added $companyName ($ticker) to your watchlist";
            } else {
                if (mysqli_errno($conn) == 1062) {
                    $message = "Error: $ticker is already in your watchlist";
                } else {
                    $message = "Error Adding $ticker to database" . mysqli_error($conn);
                }
            }
        } else { // If stock data is invalid, set error message
            $message = "Error: Invalid ticker symbol '$ticker'";
        }
        
        // Redirect back to index.html with message
        header("Location: index.html?message=" . urlencode($message));
        mysqli_close($conn);
        exit();
    }

    // Fetch watchlist data
    $sql = "SELECT * FROM watchlist";
    $result = mysqli_query($conn, $sql);

    // Initialize variables for portfolio totals
    $totalCurrentValue = 0;
    $totalCostBasis = 0;
    $watchlistData = [];

    // Process each stock in the watchlist
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $ticker = $row['ticker_symbol'];
            $companyName = $row['company_name'];
            $quantity = $row['shares_owned'];
            $purchasePrice = $row['purchase_price'];

            // Update stock price
            $stockData = getYahooStockPrice($ticker);

            // If api call is successful, update current price in database
            if ($stockData !== null) {
                $currentPrice = $stockData['currentPrice'];
                $updateSQL = "UPDATE watchlist SET current_price = $currentPrice
                 WHERE ticker_symbol = '$ticker'";
                mysqli_query($conn, $updateSQL);
            } else { // If the api fails just keep last known current price
                $currentPrice = $row['current_price'];
            }

            // Calculate Values for each stock
            $costBasis = $quantity * $purchasePrice;
            $currentValue = $quantity * $currentPrice;
            $profitLoss = $currentValue - $costBasis;

            // Add the current value & cost basis to running totals
            $totalCurrentValue += $currentValue;
            $totalCostBasis += $costBasis;

            // Store stock data for display
            $watchlistData[] = [
                'ticker' => $ticker,
                'companyName' => $companyName,
                'quantity' => $quantity,
                'purchasePrice' => $purchasePrice,
                'currentPrice' => $currentPrice,
                'currentValue' => $currentValue,
                'profitLoss' => $profitLoss
            ];
        }
    }

    // Calculate total profit/loss
    $totalProfitLoss = $totalCurrentValue - $totalCostBasis;

    // Display the watchlist HTML
    echo "<h2>Your Watchlist</h2>";
    
    if (count($watchlistData) > 0) {
        echo "<table>";
        echo "<tr>
                <th>Ticker</th>
                <th>Company Name</th>
                <th>Shares</th>
                <th>Purchase Price</th>
                <th>Current Price</th>
                <th>Total Value</th>
                <th>Profit/Loss</th>
            </tr>";

        // Display each stock
        foreach ($watchlistData as $stock) {
            echo "<tr>";
            echo "<td>" . $stock['ticker'] . "</td>";
            echo "<td>" . $stock['companyName'] . "</td>";
            echo "<td>" . $stock['quantity'] . "</td>";
            echo "<td>$" . number_format($stock['purchasePrice'], 2) . "</td>";
            echo "<td>$" . number_format($stock['currentPrice'], 2) . "</td>";
            echo "<td>$" . number_format($stock['currentValue'], 2) . "</td>";
            echo "<td>$" . number_format($stock['profitLoss'], 2) . "</td>";
            echo "</tr>";
        }

        // Display portfolio totals
        echo "<tr>";
        echo "<td colspan='5'><strong>Portfolio Totals</strong></td>";
        echo "<td>$" . number_format($totalCurrentValue, 2) . "</td>";
        echo "<td>$" . number_format($totalProfitLoss, 2) . "</td>";
        echo "</tr>";
        echo "</table>";

    } else {
        echo "<p>Your watchlist is empty. Add some stocks!</p>";
    }

    // Close database connection
    mysqli_close($conn);
?>
