const transactionServices = require('../services/transactionServices');

const initializeDatabase = async (req, res) => {
    try {
        await transactionServices.initializeDatabase();
        res.json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to initialize database', error });
    }
};

const getTransactions = async (req, res) => {
    const { month= 'March', search = '', page = 1, perPage = 10 } = req.query;
    try {
        const transactions = await transactionServices.getTransactions(month, search, page, perPage);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error });
    }
};

const getStatistics = async (req, res) => {
    const { month } = req.params;
    try {
        const statistics = await transactionServices.getStatistics(month);
        res.json(statistics);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch statistics', error });
    }
};

const getBarChartData = async (req, res) => {
    const { month } = req.params;
    try {
        const barChartData = await transactionServices.getBarChartData(month);
        res.json(barChartData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bar chart data', error });
    }
};

const getPieChartData = async (req, res) => {
    const { month } = req.params;
    try {
        const pieChartData = await transactionServices.getPieChartData(month);
        res.json(pieChartData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch pie chart data', error });
    }
};

const getCombinedData = async (req, res) => {
    const { month= 'March', search = '', page = 1, perPage = 10 } = req.query;

    try {
        const [transactionsData, statistics, barchartData] = await Promise.all([
            transactionServices.getTransactions(month, search, page, perPage),
            transactionServices.getStatistics(month),
            transactionServices.getBarChartData(month)
        ]);


        const combinedResponse = {
            transactionsData,
            statistics,
            barchartData
        };

        res.status(200).json(combinedResponse);  
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch combined data', error: error.message });
    }
};

module.exports = {initializeDatabase, getTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData};