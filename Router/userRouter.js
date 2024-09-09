const express = require("express");
const userController = require("../Controller/userController");
const signUpRouter = express.Router();
const loginRouter = express.Router();
const updateImageRouter = express.Router();
const updatePassword = express.Router();

signUpRouter
  .route("/")
  .post(userController.UploadImage.single("image"), userController.SignUp);
loginRouter.route("/").post(userController.Login);

updateImageRouter.route("/:_id").put(userController.editProfile);
updatePassword
  .route("/")
  .put(userController.Protect, userController.ChangePassword);

module.exports = {
  signUpRouter,
  loginRouter,
  updateImageRouter,
  updatePassword,
};
