const express = require("express");
const cors = require("cors");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const useCookies = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

// router.use(cors())
router.use(express.json());
router.use(useCookies());

router.post("/signup/user", async (req, res, next) => {
  try {
    //Validation of Data
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    //Encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.status(201).json({
      message: "User Added Successfully",
      user,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  // console.log("BODY:", req.body);

  try {
    validateLoginData(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      throw new Error("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = await jwt.sign({ id: user._id }, "process.env.JWT_SECRET", {
        expiresIn: "1d",
      });
      // console.log(token);

      //adding the token to the cookie and sending it back to the user
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Set to true only if using HTTPS
        sameSite: "none",
      });
      res.status(200).json({
        message: "Login Successfull",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } else {
      throw new Error("Invalid Password");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Logout Successfull",
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
