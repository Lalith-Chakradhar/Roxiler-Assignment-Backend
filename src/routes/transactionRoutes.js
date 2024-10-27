const express = require('express');
const transactionControllers = require('../controllers/transactionControllers');

const router = express.Router();

router.get('/initialize-database', transactionControllers.initializeDatabase);
router.get('/transactions', transactionControllers.getTransactions);
router.get('/statistics/:month', transactionControllers.getStatistics);
router.get('/bar-chart/:month', transactionControllers.getBarChartData);
router.get('/pie-chart/:month', transactionControllers.getPieChartData);

router.get('/combined-data', transactionControllers.getCombinedData);

module.exports = router;
