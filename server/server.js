// ===============================================
// Load Environment Variables
// ===============================================
require("dotenv").config();

// ===============================================
// Force Google DNS for MongoDB SRV Lookup
// ===============================================
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ===============================================
// Package Imports
// ===============================================
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/db");

const {
  setResponderOnline,
  setResponderOffline,
} = require("./controllers/responderController");

// ===============================================
// Route Imports
// ===============================================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const responderRoutes = require("./routes/responderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");

// ===============================================
// Initialize Express
// ===============================================
const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ===============================================
// Create HTTP Server
// ===============================================
const server = http.createServer(app);

// ===============================================
// Socket.IO
// ===============================================
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Make Socket.IO Available Everywhere
app.set("io", io);

// ===============================================
// Socket Events
// ===============================================
io.on("connection", (socket) => {

  console.log(`🟢 Client Connected : ${socket.id}`);

  // =====================================
  // Admin Connection
  // =====================================

  socket.on("join-admin", () => {

    socket.join("admins");

    console.log(
      `👮 Admin Joined : ${socket.id}`
    );

  });

  // =====================================
  // Responder Connection
  // =====================================

  socket.on(
    "join-responder",
    async (responderId) => {

      try {

        socket.responderId = responderId;

        socket.join(
          `responder-${responderId}`
        );

        await setResponderOnline(
          responderId,
          socket.id
        );

        io.to("admins").emit(
          "responder-online",
          {
            responderId,
          }
        );

        console.log(
          `🚑 Responder ${responderId} Connected`
        );

      } catch (err) {

        console.error(err);

      }

    }
  );

  // =====================================
// Citizen Connection
// =====================================

socket.on("join-citizen", (userId) => {

  socket.userId = userId;

  socket.join(`citizen-${userId}`);

  console.log(
    `👤 Citizen ${userId} Connected`
  );

});

// =====================================
// Join Incident Room
// =====================================

socket.on("join-incident", (incidentId) => {

  socket.join(`incident-${incidentId}`);

  console.log(
    `📍 Joined incident-${incidentId}`
  );

});

  // =====================================
  // Live Location Broadcast
  // =====================================

  socket.on(
    "responder-location",
    (location) => {

      io.to("admins").emit(
        "responder-location-updated",
        location
      );

    }
  );

  // =====================================
  // Disconnect
  // =====================================

  socket.on(
    "disconnect",
    async () => {

      try {

        await setResponderOffline(
          socket.id
        );

        if (socket.responderId) {

          io.to("admins").emit(
            "responder-offline",
            {
              responderId:
                socket.responderId,
            }
          );

        }

        console.log(
          `🔴 Client Disconnected : ${socket.id}`
        );

      } catch (err) {

        console.error(err);

      }

    }
  );

});

// ===============================================
// Connect Database
// ===============================================
connectDB();

// ===============================================
// Middlewares
// ===============================================
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ===============================================
// Static Upload Folder
// ===============================================
app.use(
  "/uploads",
  express.static("uploads")
);

// ===============================================
// Health Check
// ===============================================
app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message:
      "🚑 ResQAI Backend API Running",
    socket: true,
    version: "3.0.0",
  });

});
// ===============================================
// Routes
// ===============================================
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/incidents", incidentRoutes);

app.use("/api/responders", responderRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/emergency", emergencyRoutes);

// ===============================================
// 404 Handler
// ===============================================
app.use((req, res) => {

  return res.status(404).json({
    success: false,
    message: "Route not found",
  });

});

// ===============================================
// Global Error Handler
// ===============================================
app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(err);

    return res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });

  }
);

// ===============================================
// MongoDB Events
// ===============================================
mongoose.connection.on(
  "connected",
  () => {

    console.log(
      "✅ MongoDB Connected"
    );

  }
);

mongoose.connection.on(
  "error",
  (err) => {

    console.error(
      "❌ MongoDB Error:",
      err
    );

  }
);

mongoose.connection.on(
  "disconnected",
  () => {

    console.warn(
      "⚠ MongoDB Disconnected"
    );

  }
);

// ===============================================
// Graceful Shutdown
// ===============================================

process.on(
  "SIGINT",
  async () => {

    console.log(
      "\n🛑 Shutting down server..."
    );

    await mongoose.connection.close();

    process.exit(0);

  }
);

// ===============================================
// Start Server
// ===============================================

const PORT =
  process.env.PORT || 5000;

server.listen(
  PORT,
  () => {

    console.log(
      "==========================================="
    );

    console.log(
      "🚀 ResQAI Server Started"
    );

    console.log(
      `🌍 http://localhost:${PORT}`
    );

    console.log(
      "📡 Socket.IO Enabled"
    );

    console.log(
      "👮 Admin Room Ready"
    );

    console.log(
      "🚑 Responder Room Ready"
    );

    console.log(
      "📍 Live GPS Tracking Enabled"
    );

    console.log(
      "==========================================="
    );

  }
);

// ===============================================
// Exports
// ===============================================

module.exports = {
  app,
  io,
  server,
};