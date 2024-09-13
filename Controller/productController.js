
const { Product } = require("../Models/ProductModel");

exports.getAllProducts = async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    const allProduct = await Product.find().skip(skip).limit(24);
    if (!allProduct) {
      return res.status(404).json({
        status: "404 Not Found",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "200 OK",
      results: allProduct.length,
      data: allProduct,
    });
    next();
  } catch (err) {
    res.status(500).json({
      status: "500 Internal Server Error",
      message: err.message,
    });
  }
};
