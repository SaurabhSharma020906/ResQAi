const mongoose = require("mongoose");

const responderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Hospital",
        "Fire Brigade",
        "Police",
        "Ambulance",
      ],
    },

    // =====================================
    // Base Location
    // =====================================

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    // =====================================
    // Live GPS Location
    // =====================================

    currentLatitude: {
      type: Number,
      default: null,
    },

    currentLongitude: {
      type: Number,
      default: null,
    },

    heading: {
      type: Number,
      default: 0,
    },

    speed: {
      type: Number,
      default: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
    },

    lastLocationUpdate: {
      type: Date,
      default: null,
    },

    // =====================================
    // Connection Status
    // =====================================

    socketId: {
      type: String,
      default: "",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    // =====================================
    // Contact
    // =====================================

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // =====================================
    // Availability
    // =====================================

    status: {
      type: String,
      enum: [
        "Available",
        "Busy",
        "Offline",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Responder",
  responderSchema
);