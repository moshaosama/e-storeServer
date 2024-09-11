const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { productRouter } = require("./Router/productRouter");
const compression = require("compression");
const {
  signUpRouter,
  loginRouter,
  updateImageRouter,
  updatePassword,
} = require("./Router/userRouter");

const { cartRouter } = require("./Router/cartRouter");
const { checkoutRouter, checkOutByid } = require("./Router/checkoutRouter");
const app = express();

app.use(express.json());
dotenv.config({ path: "./config.env" });
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(compression());
//EndPoints
app.use("/Product", productRouter);
app.use("/SignUp", signUpRouter);
app.use("/Login", loginRouter);
app.use("/Cart", cartRouter);
app.use("/updateProfile", updateImageRouter);
app.use("/checkout", checkoutRouter);
app.use("/updatePassword", updatePassword);
app.use("/checkOutByid", checkOutByid);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
///Make some Changes to reload ans send again to github

mongoose
  .connect("mongodb+srv://mosha:mosha123@cluster0.je0qo.mongodb.net/")
  .then(() => {
    console.log("Connected to database Suucessfullt");
    app.listen(process.env.PORT | 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database");
  });
