const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  getProfile,
} = require("../controllers/userController");

// ==========================================
// User Profile
// ==========================================

router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;