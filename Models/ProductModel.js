const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  type: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please Enter Your productName"],
  },
  image: {
    type: String,
    required: [true, "Please Enter Your productImage"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Your productPrice"],
  },
  stock: {
    type: Number,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
