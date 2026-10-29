const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    // ==========================
    // User Information
    // ==========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    // ==========================
    // Emergency Details
    // ==========================
    emergencyType: {
      type: String,
      required: true,
      enum: [
        "Fire",
        "Medical",
        "Road Accident",
        "Crime",
        "Natural Disaster",
        "Other",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    // ==========================
    // GPS Coordinates
    // ==========================
    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    // ==========================
    // Reverse Geocoding
    // ==========================
    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    // ==========================
    // Uploaded Image
    // ==========================
    image: {
      type: String,
      default: "",
    },

    // ==========================
    // AI Severity
    // ==========================
    severity: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Low",
    },

    // ==========================
    // AI Dispatch Recommendation
    // ==========================
    dispatchServices: [
      {
        type: String,
      },
    ],

    priority: {
      type: String,
      default: "",
    },

    estimatedResponseTime: {
      type: String,
      default: "",
    },

    // ==========================
    // Assigned Responders
    // ==========================
    assignedResponders: [
      {
        responder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Responder",
        },

        responderType: {
          type: String,
        },

        distance: {
          type: Number,
        },

        assignedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ==========================
    // Dispatched Emergency Service
    // ==========================
    dispatchedService: {
      type: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },

      distance: {
        type: Number,
      },

      dispatchedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      dispatchedAt: {
        type: Date,
      },
    },

    // ==========================
    // Incident Status
    // ==========================
    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Accepted",
        "In Progress",
        "Resolved",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Incident",
  incidentSchema
);