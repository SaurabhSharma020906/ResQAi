const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// Generate JWT Token
// ==========================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==========================================
// Register Citizen
// ==========================================

const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email already registered.",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({

        fullName,

        email:
          email.toLowerCase(),

        password:
          hashedPassword,

        phone,

        role: "Citizen",

        isActive: true,

        isVerified: false,

      });

    const token =
      generateToken(user);

    res.status(201).json({

      success: true,

      message:
        "Registration Successful",

      token,

      user: {

        id: user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        phone:
          user.phone,

        role:
          user.role,

        isVerified:
          user.isVerified,

        createdAt:
          user.createdAt,

      },

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Login
// ==========================================

const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been disabled. Please contact the administrator.",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    user.lastLogin =
      new Date();

    await user.save();

    const token =
      generateToken(user);

    res.status(200).json({

      success: true,

      message:
        "Login Successful",

      token,

      user: {

        id: user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        phone:
          user.phone,

        role:
          user.role,

        isVerified:
          user.isVerified,

        lastLogin:
          user.lastLogin,

        createdAt:
          user.createdAt,

      },

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {

  register,

  login,

};