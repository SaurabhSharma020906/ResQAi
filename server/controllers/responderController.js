const Responder = require("../models/Responder");

// ======================================
// Add New Responder
// ======================================

const addResponder = async (req, res) => {
  try {
    const {
      name,
      type,
      latitude,
      longitude,
      phone,
      address,
      status,
    } = req.body;

    if (!name || !type || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const responder = await Responder.create({
      name,
      type,

      latitude: Number(latitude),
      longitude: Number(longitude),

      currentLatitude: Number(latitude),
      currentLongitude: Number(longitude),

      heading: 0,
      speed: 0,
      accuracy: 0,

      phone,
      address,

      status: status || "Available",

      isOnline: false,
      socketId: "",
    });

    return res.status(201).json({
      success: true,
      message: "Responder added successfully.",
      responder,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Get All Responders
// ======================================

const getAllResponders = async (req, res) => {
  try {

    const responders = await Responder.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: responders.length,
      responders,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Update Live Location
// ======================================

const updateResponderLocation = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const {
      latitude,
      longitude,
      heading,
      speed,
      accuracy,
    } = req.body;

    const responder =
      await Responder.findById(id);

    if (!responder) {
      return res.status(404).json({
        success: false,
        message: "Responder not found.",
      });
    }

    responder.currentLatitude =
      Number(latitude);

    responder.currentLongitude =
      Number(longitude);

    responder.heading =
      Number(heading || 0);

    responder.speed =
      Number(speed || 0);

    responder.accuracy =
      Number(accuracy || 0);

    responder.lastLocationUpdate =
      new Date();

    responder.isOnline = true;

    await responder.save();

    // ===============================
    // Socket.IO Broadcast
    // ===============================

    const io = req.app.get("io");

    if (io) {
      io.to("admins").emit(
        "responder-location-updated",
        responder
      );
    }

    return res.status(200).json({
      success: true,
      responder,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Update Responder Status
// ======================================

const updateResponderStatus = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const { status } = req.body;

    const responder =
      await Responder.findById(id);

    if (!responder) {
      return res.status(404).json({
        success: false,
        message: "Responder not found.",
      });
    }

    responder.status = status;

    await responder.save();

    const io = req.app.get("io");

    if (io) {
      io.to("admins").emit(
        "responder-status-updated",
        responder
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Responder updated successfully.",
      responder,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Set Online / Offline
// ======================================

const setResponderOnline = async (
  responderId,
  socketId
) => {

  await Responder.findByIdAndUpdate(
    responderId,
    {
      isOnline: true,
      socketId,
    }
  );

};

const setResponderOffline = async (
  socketId
) => {

  await Responder.findOneAndUpdate(
    {
      socketId,
    },
    {
      isOnline: false,
      socketId: "",
    }
  );

};


// ======================================
// Assign Responder to Incident
// ======================================

const assignResponderToIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { responderId } = req.body;

    if (!responderId) {
      return res.status(400).json({ success: false, message: "Responder ID is required." });
    }

    const Incident = require("../models/Incident");
    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found." });
    }

    const responder = await Responder.findById(responderId);
    if (!responder) {
      return res.status(404).json({ success: false, message: "Responder not found." });
    }

    if (responder.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: `${responder.name} is currently ${responder.status}.`
      });
    }

    const alreadyAssigned = incident.assignedResponders.some(
      (item) => String(item.responder) === String(responder._id)
    );
    if (alreadyAssigned) {
      return res.status(400).json({ success: false, message: "Responder is already assigned to this incident." });
    }

    const responderLat = responder.currentLatitude ?? responder.latitude;
    const responderLng = responder.currentLongitude ?? responder.longitude;
    const distance = Number.isFinite(responderLat) && Number.isFinite(responderLng)
      ? Math.sqrt(
          Math.pow((Number(responderLat) - Number(incident.latitude)) * 111, 2) +
          Math.pow((Number(responderLng) - Number(incident.longitude)) * 111 * Math.cos(Number(incident.latitude) * Math.PI / 180), 2)
        )
      : 0;

    incident.assignedResponders.push({
      responder: responder._id,
      responderType: responder.type,
      distance: Number(distance.toFixed(2)),
      assignedAt: new Date(),
    });
    incident.status = "Assigned";

    responder.status = "Busy";
    await responder.save();
    await incident.save();

    const updatedIncident = await Incident.findById(id)
      .populate("user", "fullName email")
      .populate("assignedResponders.responder")
      .populate("dispatchedService.dispatchedBy", "fullName email");

    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("incident-updated", updatedIncident);
      io.to("admins").emit("responder-status-updated", responder);
      io.to(`citizen-${updatedIncident.user?._id || updatedIncident.user}`).emit("incident-updated", updatedIncident);
      if (responder.socketId) {
        io.to(responder.socketId).emit("incident-assigned", updatedIncident);
      }
    }

    return res.status(200).json({
      success: true,
      message: `${responder.name} assigned successfully.`,
      incident: updatedIncident,
      responder,
    });
  } catch (error) {
    console.error("Assign responder error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// Delete Responder
// ======================================

const deleteResponder = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const responder =
      await Responder.findById(id);

    if (!responder) {
      return res.status(404).json({
        success: false,
        message: "Responder not found.",
      });
    }

    await responder.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Responder deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  addResponder,
  getAllResponders,
  updateResponderLocation,
  updateResponderStatus,
  deleteResponder,
  assignResponderToIncident,
  setResponderOnline,
  setResponderOffline,
};