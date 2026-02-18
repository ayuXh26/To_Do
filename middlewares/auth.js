const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token not found");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = decodedToken;

    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (err) {
    res.status(401).json({
      error: err.message,
    });
  }
};

module.exports = {
  userAuth,
};
