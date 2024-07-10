const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    total: { type: Number, required: true }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
