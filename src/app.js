const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());

app.use(cors());


app.use('/api', transactionRoutes);

module.exports = app;
