const express = require("express");
const cartRouter = express.Router();
const cartController = require("../Controller/cartController");
const userController = require("../Controller/userController");

cartRouter
  .route("/:_id")
  .post(cartController.addCart)
  .get(cartController.getCart)
  .delete(cartController.deleteCart);
cartRouter.route("/").get(cartController.getAllCarts);
module.exports = { cartRouter };
