const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================
    // Basic Information
    // ==========================
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      default: "",
    },

    // ==========================
    // User Role
    // ==========================
    role: {
      type: String,
      enum: [
        "Citizen",
        "Responder",
        "Admin",
      ],
      default: "Citizen",
    },

    // ==========================
    // Account Status
    // ==========================
    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // Email Verification
    // ==========================
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // Optional Link to Responder
    // ==========================
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Responder",
      default: null,
    },

    // ==========================
    // Profile Image
    // ==========================
    profileImage: {
      type: String,
      default: "",
    },

    // ==========================
    // Last Login
    // ==========================
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);