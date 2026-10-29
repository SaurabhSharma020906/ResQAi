const express = require("express");
const router = express.Router();

const {
  getNearbyServices,
} = require("../controllers/emergencyController");

// GET /api/emergency/nearby?lat=19.07&lng=72.87
router.get("/nearby", getNearbyServices);

module.exports = router;