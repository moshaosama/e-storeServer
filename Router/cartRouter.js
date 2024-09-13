const express = require("express");
const cartRouter = express.Router();
const cartController = require("../Controller/cartController");

cartRouter
  .route("/:_id")
  .post(cartController.addCart)
  .get(cartController.getCart)
  .delete(cartController.deleteCart);
cartRouter.route("/").get(cartController.getAllCarts);
module.exports = { cartRouter };
