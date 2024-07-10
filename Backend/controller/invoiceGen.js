const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const Product = require("../models/Product");

exports.addProductToInvoice = async (req, res) => {
    try {
        const { products } = req.body;

        // Validate input
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ message: 'Products array is required' });
        }

        for (let item of products) {
            console.log(`Validating productId: ${item.productId}`); // Log productId for debugging
            if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({ message: `Invalid productId: ${item.productId}` });
            }
            if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.status(400).json({ message: `Invalid quantity: ${item.quantity}` });
            }
        }

        // Create a new invoice
        const invoice = new Invoice({
            products: products.map(item => ({
                productId: new mongoose.Types.ObjectId(item.productId),
                quantity: item.quantity
            })),
            total: 0 // Calculate total in next step
        });

        // Calculate the total price
        let total = 0;
        for (let item of invoice.products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }
            total += product.price * item.quantity;
        }
        invoice.total = total;

        await invoice.save();

        res.status(200).json(invoice);
    } catch (error) {
        console.error("Error creating invoice:", error); // Log error details
        res.status(500).json({ message: 'Error creating invoice', error: error.message });
    }
};

exports.getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('products.productId');

        if (!invoice) {
            console.error("Invoice not found for id:", req.params.id); // Log if invoice not found
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error("Error fetching invoice:", error); // Log error details
        res.status(500).json({ message: 'Error fetching invoice', error: error.message });
    }
};
