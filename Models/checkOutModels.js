const mongoose = require("mongoose");

const chckOutSchema = mongoose.Schema({
  user: Array,
  cart: Array,
  price: {
    type: Number,
  },
  date: Date,
});

const checkOut = mongoose.model("checkOut", chckOutSchema);

module.exports = { checkOut };
