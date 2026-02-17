const express = require("express");
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
const crypto = require("crypto");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const nodemailer = require("nodemailer");

// 1. Create the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // NOT your login password (see step 3)
  },
});

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
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Forgot Password: User not found for", email);
      return res.status(200).json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    console.log("Saving user with token...");
    await user.save();
    console.log("User saved successfully.");

    // const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5500"}/reset-password.html?token=${resetToken}`;
    const resetUrl = `http://localhost:3000/reset-password.html?token=${resetToken}`;

    // 2. Updated Mail Options for Nodemailer
    const mailOptions = {
      from: `"To-Do App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Please click the link below to set a new one:</p>
          <a href="${resetUrl}" style="padding: 10px 20px; background-color: #4a9eff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    res.status(200).json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Reset Password (Verification and Update)
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with valid token and check if it's not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Token is invalid or has expired." });
    }

    // Encrypt new password using your existing bcrypt logic
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;

    // Clear the reset fields so the token expires immediately
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
