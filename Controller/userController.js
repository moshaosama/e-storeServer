const User = require("../Models/userModels");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const Multer = require("multer");
const { mail } = require("./sendEmail");

const Storage = Multer.diskStorage({
  destination: (cb) => {
    cb(
      null,
      "/Users/Mohamed/Desktop/Project Node js/e-commerce/Client/e-commerce/public"
    );
  },
  filename: (file, cb) => {
    cb(null, file.originalname);
  },
});

exports.UploadImage = Multer({ Storage });

exports.SignUp = async (req, res) => {
  try {
    const user = new User({
      userName: req.body.userName,
      actor: req.body.actor,
      Email: req.body.Email,
      Password: req.body.Password,
      passwordCheck: req.body.passwordCheck,
      image: req.body.image,
    });

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "Please enter your Forms",
      });
    }

    await user.save();

    res.status(200).json({
      status: "OK",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "Internal Server Error",
      message: err.message,
    });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    return res.status(401).json({
      status: "Failed",
      message: "Please enter your Email and Password",
    });
  }
  const user = await User.findOne({ Email: email });
  if (!user) {
    return res.status(401).json({
      status: "Failed",
      message: "you don't have any account",
    });
  }
  if (!(await bcrypt.compare(password, user?.Password))) {
    return res.status(401).json({
      status: "Failed",
      message: "you don't have any account",
    });
  }
  const Token = await JWT.sign({ id: user?._id }, process.env.SECRET);

  mail(email, user?.userName, `you login by ${email}`);
  res.status(200).json({
    status: "OK",
    Token: Token,
    message: "you Login Suucessfully",
    data: user,
  });
};

exports.Protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  if (!token) {
    return res.status(401).json({
      status: "Failed",
      message: "you don't have Token",
    });
  }

  const decoded = await JWT.verify(token, process.env.SECRET);
  if (!decoded) {
    return res.status(401).json({
      status: "Failed",
      message: "you don/ have Token",
    });
  }

  const user = await User.findById(decoded?.id);
  if (!user) {
    return res.status(401).json({
      status: "Failed",
      message: "you don't have Token",
    });
  }
  req.user = user;

  next();
};

exports.editProfile = async (req, res, next) => {
  const { userName, email } = req.body;
  if (!userName || !email) {
    return res.status(401).json({
      status: "Failed",
      message: "Please Enter Your userName and email",
    });
  }
  const user = await User.findByIdAndUpdate(
    req.params._id,
    {
      userName: userName,
      Email: email,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return res.status(401).json({
      status: "Failed",
      message: "you don't have Account",
    });
  }

  res.status(200).json({
    status: "success",
    user,
    message: "Updated Success",
  });
};

exports.ChangePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    const CurrentPassword = req.body.CurrentPassword;
    if (!CurrentPassword) {
      return res.status(500).json({
        message: "Please Enter Current Password",
      });
    }
    if (!(await bcrypt.compare(CurrentPassword, user.Password))) {
      return res.status(404).json({
        status: "error",
        message: "your Password is not Correct",
      });
    }
    user.Password = req.body.newPassword;
    user.passwordCheck = req.body.passConf;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Updated Password Done!",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
