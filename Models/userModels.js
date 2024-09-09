const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [(true, "please enter your userName")],
  },
  actor: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  Email: {
    type: String,
    required: [true, "please enter your email"],
    validate: [validator.isEmail],
    unique: true,
  },
  Password: {
    type: String,
    rquired: [true, "please enter your password"],
  },
  passwordCheck: {
    type: String,
    required: [true, "please enter your passwordCheck"],
    validate: {
      validator(el) {
        return el === this.Password;
      },
    },
  },
  image: {
    type: String,
    default: () =>
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMUDp3aV5EOTHgkQp6AB782rSKOyhhkdkx8Q&s",
  },
});

userSchema.pre("save", async function (next) {
  this.Password = await bcrypt.hash(this.Password, 12);
  this.passwordCheck = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
