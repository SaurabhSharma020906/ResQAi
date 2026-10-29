const User = require("../models/User");

// ==========================================
// Get Logged-in User Profile
// ==========================================

const getProfile = async (req, res) => {
  try {

    res.status(200).json({

      success: true,

      user: req.user,

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

  getProfile,

};