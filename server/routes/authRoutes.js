const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working!",
  });
});

// Debug Route
router.post("/register", (req, res, next) => {
  console.log("Register API Hit");
  console.log(req.body);
  next();
}, register);

router.post("/login", login);

module.exports = router;