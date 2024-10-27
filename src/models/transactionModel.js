 const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    productId: String,
    title: String,
    description: String,
    price: Number,
    category: String,
    dateOfSale: Date,
    isSold: Boolean
});

transactionSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Transaction', transactionSchema);
