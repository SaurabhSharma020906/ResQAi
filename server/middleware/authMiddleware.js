const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// Protect Routes (JWT Authentication)
// ==========================================

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find User
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("responder");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check Account Status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been disabled.",
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });

  }
};

// ==========================================
// Role-Based Authorization
// ==========================================

const authorize = (...roles) => {

  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this resource.",
      });
    }

    next();

  };

};

module.exports = {
  protect,
  authorize,
};