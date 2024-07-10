const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ProductSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    price: {
      type: Number, // Ensure price is stored as a number
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
