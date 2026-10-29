const express = require("express");

const router = express.Router();

const {
  addResponder,
  getAllResponders,
  updateResponderLocation,
  updateResponderStatus,
  deleteResponder,
  assignResponderToIncident,
} = require("../controllers/responderController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ======================================
// Admin Routes
// ======================================

// Add New Responder
router.post(
  "/",
  protect,
  authorize("Admin"),
  addResponder
);

// Get All Responders
router.get(
  "/",
  protect,
  authorize("Admin"),
  getAllResponders
);

// ======================================
// Live Location
// ======================================

// Update Responder GPS Location
router.put(
  "/:id/location",
  protect,
  updateResponderLocation
);

// ======================================
// Status
// ======================================

// Update Responder Status
router.put(
  "/:id/status",
  protect,
  authorize("Admin"),
  updateResponderStatus
);


// Assign responder to an incident
router.put(
  "/assign/:id",
  protect,
  authorize("Admin"),
  assignResponderToIncident
);

// ======================================
// Delete
// ======================================

// Delete Responder
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteResponder
);

module.exports = router;