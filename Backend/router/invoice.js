const express = require("express");
const router = express.Router();
const invoiceController = require("../controller/invoiceGen");

// Add product to invoice
router.post("/add", invoiceController.addProductToInvoice);

// Fetch invoice details
router.get("/:id", invoiceController.getInvoice);

module.exports = router;
