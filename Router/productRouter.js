const express = require("express");
const productController = require("../Controller/productController");
const checkoutController = require("../Controller/checkoutController");
const productRouter = express.Router();

productRouter.route("/").get(productController.getAllProducts);

module.exports = { productRouter };
