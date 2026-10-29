const Incident = require("../models/Incident");
const Responder = require("../models/Responder");

const {
  getAddressFromCoordinates,
} = require("../services/locationService");

const {
  getSeverity,
} = require("../utils/severityAI");

const {
  getDispatchRecommendation,
} = require("../utils/dispatchAI");

const {
  assignResponders,
} = require("../services/responderService");

// ======================================
// Report New Incident
// ======================================

const reportIncident = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      emergencyType,
      description,
      latitude,
      longitude,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !emergencyType ||
      !description ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // ==================================
    // Reverse Geocoding
    // ==================================

    const location =
      await getAddressFromCoordinates(
        Number(latitude),
        Number(longitude)
      );

    // ==================================
    // AI Severity
    // ==================================

    const severity = getSeverity(
      emergencyType,
      description
    );

    // ==================================
    // AI Dispatch Recommendation
    // ==================================

    const aiDispatch =
      getDispatchRecommendation(
        emergencyType,
        severity
      );

    // ==================================
    // Find Responders
    // ==================================

    const responders =
      await assignResponders(
        Number(latitude),
        Number(longitude),
        aiDispatch.dispatchServices
      );

    // ==================================
    // Assign Responders
    // ==================================

    const assignedResponders = [];

    for (const item of responders) {
      if (!item.responder) continue;

      assignedResponders.push({
        responder: item.responder.id,
        responderType: item.type,
        distance: item.distance,
      });

      await Responder.findByIdAndUpdate(
        item.responder.id,
        {
          status: "Busy",
        }
      );
    }

    // ==================================
    // Determine Status
    // ==================================

    const incidentStatus =
      assignedResponders.length > 0
        ? "Assigned"
        : "Pending";

    // ==================================
    // Create Incident
    // ==================================

    const incident = await Incident.create({
      user: req.user.id,

      fullName,
      phone,

      emergencyType,
      description,

      latitude: Number(latitude),
      longitude: Number(longitude),

      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      pincode: location.pincode,

      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",

      severity,

      dispatchServices:
        aiDispatch.dispatchServices,

      priority:
        aiDispatch.priority,

      estimatedResponseTime:
        aiDispatch.estimatedResponseTime,

      assignedResponders,

      status: incidentStatus,
    });

    // ==================================
    // Populate Incident
    // ==================================

    const populatedIncident =
      await Incident.findById(
        incident._id
      )
        .populate(
          "user",
          "fullName email"
        )
        .populate(
          "assignedResponders.responder"
        )
        .populate(
          "dispatchedService.dispatchedBy",
          "fullName email"
        );

    // ==================================
    // Socket.IO
    // ==================================

    const io = req.app.get("io");

    if (io) {
      io.to("admins").emit("incident-created", populatedIncident);
      io.to(`citizen-${req.user.id}`).emit("incident-created", populatedIncident);
    }

    // ==================================
    // Response
    // ==================================

    return res.status(201).json({
      success: true,

      message:
        "Incident reported successfully.",

      incident: populatedIncident,

      aiRecommendation: {
        severity,

        dispatchServices:
          aiDispatch.dispatchServices,

        priority:
          aiDispatch.priority,

        estimatedResponseTime:
          aiDispatch.estimatedResponseTime,
      },

      assignedResponders: responders,
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
// Logged-in User Incidents
// ======================================

const getMyIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({
      user: req.user.id,
    })
      .populate(
        "assignedResponders.responder"
      )
      .populate(
        "dispatchedService.dispatchedBy",
        "fullName email"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      incidents,
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
// Admin - Get All Incidents
// ======================================

const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate(
        "user",
        "fullName email"
      )
      .populate(
        "assignedResponders.responder"
      )
      .populate(
        "dispatchedService.dispatchedBy",
        "fullName email"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      incidents,
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
// Admin - Dispatch Emergency Service
// ======================================

const dispatchEmergencyService = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { service } = req.body;

    if (!service) {
      return res.status(400).json({
        success: false,
        message: "Service details are required.",
      });
    }

    const incident =
      await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found.",
      });
    }

    // ==================================
    // Save Dispatched Service
    // ==================================

    incident.dispatchedService = {
      type: service.type || "",

      name: service.name || "",

      address: service.address || "",

      latitude:
        Number(service.latitude) || 0,

      longitude:
        Number(service.longitude) || 0,

      distance:
        Number(service.distance) || 0,

      dispatchedBy: req.user.id,

      dispatchedAt: new Date(),
    };

    // ==================================
    // Update Status
    // ==================================

    incident.status = "Assigned";

    await incident.save();

    // ==================================
    // Populate Updated Incident
    // ==================================

    const updatedIncident =
      await Incident.findById(id)
        .populate(
          "user",
          "fullName email"
        )
        .populate(
          "assignedResponders.responder"
        )
        .populate(
          "dispatchedService.dispatchedBy",
          "fullName email"
        );

    // ==================================
    // Socket.IO
    // ==================================

    const io = req.app.get("io");

    if (io) {
      io.to("admins").emit(
        "incident-dispatched",
        updatedIncident
      );

      io.to("admins").emit("incident-updated", updatedIncident);
      io.to(`citizen-${updatedIncident.user?._id || updatedIncident.user}`).emit(
        "incident-dispatched",
        updatedIncident
      );
      io.to(`citizen-${updatedIncident.user?._id || updatedIncident.user}`).emit(
        "incident-updated",
        updatedIncident
      );
    }

    // ==================================
    // Response
    // ==================================

    return res.status(200).json({
      success: true,

      message:
        "Emergency service dispatched successfully.",

      incident: updatedIncident,
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
// Admin - Update Incident Status
// ======================================

const updateIncidentStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Assigned",
      "Accepted",
      "In Progress",
      "Resolved",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const incident =
      await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found.",
      });
    }

    // ==================================
    // Update Status
    // ==================================

    incident.status = status;

    // ==================================
    // Free Responders
    // ==================================

    if (
      status === "Resolved" ||
      status === "Cancelled"
    ) {
      for (const responder of incident.assignedResponders) {
        await Responder.findByIdAndUpdate(
          responder.responder,
          {
            status: "Available",
          }
        );
      }
    }

    await incident.save();

    // ==================================
    // Populate Updated Incident
    // ==================================

    const updatedIncident =
      await Incident.findById(id)
        .populate(
          "user",
          "fullName email"
        )
        .populate(
          "assignedResponders.responder"
        )
        .populate(
          "dispatchedService.dispatchedBy",
          "fullName email"
        );

    // ==================================
    // Socket.IO Events
    // ==================================

    const io = req.app.get("io");

    if (io) {
      io.to("admins").emit("incident-updated", updatedIncident);
      io.to(`citizen-${updatedIncident.user?._id || updatedIncident.user}`).emit(
        "incident-dispatched",
        updatedIncident
      );
      io.to(`citizen-${updatedIncident.user?._id || updatedIncident.user}`).emit(
        "incident-updated",
        updatedIncident
      );

      if (
        status === "Resolved" ||
        status === "Cancelled"
      ) {
        io.to("admins").emit(
          "incident-resolved",
          updatedIncident
        );
      }
    }

    // ==================================
    // Response
    // ==================================

    return res.status(200).json({
      success: true,
      message:
        "Incident status updated successfully.",
      incident: updatedIncident,
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
// Module Exports
// ======================================

const getIncidentById = async (req, res) => {
  try {

    const incident = await Incident.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("dispatchedService");

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.json(incident);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
module.exports = {

  // Citizen
  reportIncident,
  getMyIncidents,
  getIncidentById,

  // Admin
  getAllIncidents,
  dispatchEmergencyService,
  updateIncidentStatus,

};