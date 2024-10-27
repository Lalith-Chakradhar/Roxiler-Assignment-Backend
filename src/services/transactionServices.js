const axios = require('axios');
const Transaction = require('../models/transactionModel');

// Fetch and save data to database
const initializeDatabase = async () => {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany({}); //first clearing out any garbage data
    await Transaction.insertMany(response.data);
};

// Get transactions with search and pagination
const getTransactions = async (month, search, page, perPage) => {

    const monthInt = new Date(Date.parse(`${month} 1, 2024`)).getMonth() + 1;
    
    // Initialize the query object to include both month and search filters
    const query = {
        $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] }
    };

    // Count total transactions matching the query
    const total = await Transaction.countDocuments(query);

    // Add the search criteria to the query
    if (search) {
        if (!isNaN(search)) { 
            query.price = Number(search);  // If 'search' is a number or numeric string, search by price
        } else { 
            // Text search on title or description, assuming text index on both fields
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }
    }

    // Set pagination options
    const skip = (page - 1) * perPage;
    const limit = parseInt(perPage);

    // Fetch filtered and paginated transactions
    const transactions = await Transaction.find(query).skip(skip).limit(limit);
    
    return {transactions,total};
};


// Get statistics by month
const getStatistics = async (month) => {
    const monthInt = new Date(Date.parse(`${month} 1, 2024`)).getMonth() + 1;
     
    const transactions = await Transaction.find({
        $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthInt]
        }
    });

     
    let totalSales = 0;
    let soldItems = 0;
    let notSoldItems = 0;

    
    transactions.forEach(transaction => {
        totalSales += transaction.price || 0; // Sum the price

        // Check if dateOfSale exists to determine if the item is sold
        if (transaction.dateOfSale) {
            soldItems += 1; // Count sold items
        } else {
            notSoldItems += 1; // Count not sold items
        }
    });

     
    return {
        totalSales,
        soldItems,
        notSoldItems,
    };
};

// Get bar chart data by month
const getBarChartData = async (month) => {
    const monthInt = new Date(Date.parse(`${month} 1, 2024`)).getMonth() + 1;
    const priceRanges = { '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0, '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901-above': 0 };

    const items = await Transaction.find({ $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] } });
    items.forEach(item => {
        if (item.price <= 100) priceRanges['0-100']++;
        else if (item.price <= 200) priceRanges['101-200']++;
        else if (item.price <= 300) priceRanges['201-300']++;
        else if (item.price <= 400) priceRanges['301-400']++;
        else if (item.price <= 500) priceRanges['401-500']++;
        else if (item.price <= 600) priceRanges['501-600']++;
        else if (item.price <= 700) priceRanges['601-700']++;
        else if (item.price <= 800) priceRanges['701-800']++;
        else if (item.price <= 900) priceRanges['801-900']++;
        else priceRanges['901-above']++;
    });
    return priceRanges;
};

// Get pie chart data by month
const getPieChartData = async (month) => {
    const monthInt = new Date(Date.parse(`${month} 1, 2024`)).getMonth() + 1;

    // Fetch all transactions for the specified month
    const transactions = await Transaction.find({
        $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthInt]
        }
    });
    
    // Initialize an object to store category counts
    const categoryCounts = {};

    // Iterate through transactions to count items per category
    transactions.forEach(transaction => {
        const category = transaction.category || 'Uncategorized'; // Handle uncategorized items
        if (categoryCounts[category]) {
            categoryCounts[category] += 1; // Increment the count for this category
        } else {
            categoryCounts[category] = 1; // Initialize count for this category
        }
    });

    // Convert the counts object into an array of objects if needed
    const result = Object.keys(categoryCounts).map(category => ({
        category,
        count: categoryCounts[category]
    }));

    return {result, transactions};
};

module.exports = {initializeDatabase, getTransactions, getStatistics, getBarChartData, getPieChartData};