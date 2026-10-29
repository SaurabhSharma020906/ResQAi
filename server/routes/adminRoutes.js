const express = require("express");

const router = express.Router();

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllResponders,
  updateResponderStatus,
  deleteResponder,
  getAllIncidents,
  filterIncidents,
} = require("../controllers/adminController");

// =======================================
// Dashboard
// =======================================

router.get(
  "/dashboard",
  protect,
  authorize("Admin"),
  getDashboardStats
);

// =======================================
// User Management
// =======================================

// Get all users
router.get(
  "/users",
  protect,
  authorize("Admin"),
  getAllUsers
);

// Activate / Deactivate user
router.put(
  "/users/:id/status",
  protect,
  authorize("Admin"),
  updateUserStatus
);

// Delete user
router.delete(
  "/users/:id",
  protect,
  authorize("Admin"),
  deleteUser
);

// =======================================
// Responder Management
// =======================================

// Get all responders
router.get(
  "/responders",
  protect,
  authorize("Admin"),
  getAllResponders
);

// Update responder status
router.put(
  "/responders/:id/status",
  protect,
  authorize("Admin"),
  updateResponderStatus
);

// Delete responder
router.delete(
  "/responders/:id",
  protect,
  authorize("Admin"),
  deleteResponder
);

// =======================================
// Incident Management
// =======================================

// Get all incidents
router.get(
  "/incidents",
  protect,
  authorize("Admin"),
  getAllIncidents
);

// Filter incidents
router.get(
  "/incidents/filter",
  protect,
  authorize("Admin"),
  filterIncidents
);

module.exports = router;