const { Cart } = require("../Models/CartModel");
const { Product } = require("../Models/ProductModel");

exports.addCart = async (req, res) => {
  try {
    const id = req.params._id;

    // Fetch the product details
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new cart entry with a unique ID
    const cart = new Cart({
      data: product,
    });

    // Save the cart to the database
    await cart.save();

    res.status(200).json({
      message: "Cart created successfully",
      cart,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    }); // Pass the error to the error-handling middleware
  }
};

exports.getAllCarts = async (req, res) => {
  const cart = await Cart.find();
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  res.status(200).json({
    status: "OK",
    results: cart.length,
    data: cart,
  });
};

exports.deleteCart = async (req, res) => {
  const id = req.params._id;
  const deleteCart = await Cart.findByIdAndDelete(id, {
    new: true,
  });
  res.status(204).json({
    status: "OK",
    message: "Deleted Succesfully",
  });
};

exports.getCart = async (req, res) => {
  const id = req.params._id;
  const cart = await Cart.findById(id);
  if (!cart) {
    return res.status(404).json({
      status: "Not Found",
      message: "Cart not found",
    });
  }
  res.status(200).json({
    status: "OK",
    data: cart,
  });
};
