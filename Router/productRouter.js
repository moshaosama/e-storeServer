const express = require("express");
const productController = require("../Controller/productController");
const productRouter = express.Router();

productRouter.route("/").get(productController.getAllProducts);

module.exports = { productRouter };
