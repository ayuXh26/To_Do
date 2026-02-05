const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //first take out the token from the cookie
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token not found");
    }

    //then verify the token
    const decodedToken = jwt.verify(token, "process.env.JWT_SECRET");

    //now the decoded cookies holds the data which was sent earlier
    //in this case it is userid
    const { id } = decodedToken;

    //now find the user by this id but remove the password
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; //attaching the authenticated user object to this request
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
