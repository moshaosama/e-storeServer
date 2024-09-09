const stripe = require("stripe")(
  "sk_test_51PtbHPRtL4n1EJlVnKicJaw6dlT35fKv6JTWtkl1xAVUxXhAkg6fdrhZGn6s0nLuWosLMUcxq8kuCk5zooJx03oL00uNSPiA4t"
);
const { Checkout } = require("stripe/lib/resources");
const { Cart } = require("../Models/CartModel");
const { checkOut } = require("../Models/checkOutModels");
const User = require("../Models/userModels");
const { mail } = require("./sendEmail");

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const cart = await Cart.find();
    ////////////////////////////////////////////////////////////////
    const user = await User.findById(req.params._id);
    const date = new Date();
    const DateFormat = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    const lineItems = cart.flatMap((el) =>
      el.data.map((el2) => ({
        price_data: {
          currency: "usd",
          unit_amount: el2.price * 100, // Amount in cents
          product_data: {
            name: el2.name,
            // Add other product data if necessary
          },
        },
        quantity: el2.quantity || 1, // Default to 1 if quantity is not provided
      }))
    );

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173`,
      cancel_url: "http://localhost:3000/cancel",
    });
    const checkout_Items = new checkOut({
      user: user,
      cart: cart,
      price: session?.amount_total,
      date: DateFormat,
    });
    await checkout_Items.save();
    res.status(200).json({
      status: "success",
      result: checkout_Items.length,
      checkOut: checkout_Items,
      Session: session,
    });
    mail(
      user?.Email,
      user?.userName,
      `
        you Buy it at ${Date.now()}
        Products: ${checkout_Items?.cart}
      `
    );
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getcheckOuts = async (req, res) => {
  const CheckOuts = await checkOut.find();
  if (!CheckOuts) {
    res.status(404).json({
      message: "You don't have any checkout even right now",
    });
  }
  setTimeout(() => {
    res.status(200).json({
      message: "Success",
      result: CheckOuts.length,
      data: CheckOuts,
    });
  }, 2000);
};

exports.getCheckOutByUsers = async (req, res) => {
  const userId = req.params._id; // Ensure this is the correct parameter name
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }
  try {
    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Fetch the checkout documents related to the user
    const checkouts = await checkOut.find({ "user._id": user?._id }); // Adjust this query based on your schema

    if (!checkouts) {
      return res.status(404).json({
        message: "No checkouts found for this user",
      });
    }
    setTimeout(() => {
      res.status(200).json({
        status: "OK",
        result: checkouts.length,
        message: "Success",
        data: checkouts,
      });
    }, 2000);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching checkouts",
    });
  }
};

exports.getCheckOutById = async (req, res) => {
  try {
    const id = req.params._id;
    const CheckOut = await checkOut.findById(id);

    if (!CheckOut) {
      return res.status(404).json({
        message: "No CheckOut found for this id",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully",
      data: CheckOut,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
