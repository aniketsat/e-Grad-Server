const { JWT_SECRET } = require("../config/config");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }
    token = token.split(" ")[1];

    const verifyToken = jwt.verify(token, "secret123");

    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }

    req.user = verifyToken;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      success: false,
      message: "Please authenticate.",
    });
  }
};

module.exports = authenticate;
