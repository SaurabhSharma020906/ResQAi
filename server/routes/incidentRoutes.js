const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const {
  reportIncident,
  getMyIncidents,
  getIncidentById,
  getAllIncidents,
  dispatchEmergencyService,
  updateIncidentStatus,
} = require("../controllers/incidentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ==========================================
// Upload Folder
// ==========================================

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// ==========================================
// Multer Storage
// ==========================================

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },

  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ==========================================
// File Filter
// ==========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }
};

// ==========================================
// Upload Middleware
// ==========================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ==========================================
// Citizen Routes
// ==========================================

// Report Incident
router.post(
  "/",
  protect,
  authorize("Citizen"),
  upload.single("image"),
  reportIncident
);

// Logged-in User Incidents
router.get(
  "/my",
  protect,
  authorize("Citizen"),
  getMyIncidents
);

// ==========================================
// Admin Routes
// ==========================================

// Get All Incidents
// IMPORTANT: keep this route before /:id so "all" is not
// interpreted as an incident id.
router.get(
  "/all",
  protect,
  authorize("Admin"),
  getAllIncidents
);

// Get Single Incident
router.get(
  "/:id",
  protect,
  getIncidentById
);

// Dispatch Emergency Service
router.put(
  "/:id/dispatch",
  protect,
  authorize("Admin"),
  dispatchEmergencyService
);

// Update Incident Status
router.put(
  "/:id/status",
  protect,
  authorize("Admin"),
  updateIncidentStatus
);

module.exports = router;