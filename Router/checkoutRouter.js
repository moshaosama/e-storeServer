const express = require("express");
const checkoutController = require("../Controller/checkoutController");
const userController = require("../Controller/userController");
const checkoutRouter = express.Router();
const checkOutByid = express.Router();

checkoutRouter
  .route("/session_checkout/:_id")
  .get(userController.Protect, checkoutController.createCheckoutSession);

checkoutRouter.route("/").get(checkoutController.getcheckOuts);
checkoutRouter.route("/:_id").get(checkoutController.getCheckOutByUsers);
checkOutByid.route("/:_id").get(checkoutController.getCheckOutById);
module.exports = { checkoutRouter, checkOutByid };
