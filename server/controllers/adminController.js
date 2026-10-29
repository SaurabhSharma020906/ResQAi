const User = require("../models/User");
const Incident = require("../models/Incident");
const Responder = require("../models/Responder");

// ======================================
// Dashboard Statistics
// ======================================

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalResponders,
      totalIncidents,
      availableResponders,
      busyResponders,
      offlineResponders,
      criticalIncidents,
      pendingIncidents,
      assignedIncidents,
      acceptedIncidents,
      inProgressIncidents,
      resolvedIncidents,
      cancelledIncidents,
      todayIncidents,
      recentIncidents,
    ] = await Promise.all([
      User.countDocuments(),

      Responder.countDocuments(),

      Incident.countDocuments(),

      Responder.countDocuments({
        status: "Available",
      }),

      Responder.countDocuments({
        status: "Busy",
      }),

      Responder.countDocuments({
        status: "Offline",
      }),

      Incident.countDocuments({
        severity: "Critical",
      }),

      Incident.countDocuments({
        status: "Pending",
      }),

      Incident.countDocuments({
        status: "Assigned",
      }),

      Incident.countDocuments({
        status: "Accepted",
      }),

      Incident.countDocuments({
        status: "In Progress",
      }),

      Incident.countDocuments({
        status: "Resolved",
      }),

      Incident.countDocuments({
        status: "Cancelled",
      }),

      Incident.countDocuments({
        createdAt: {
          $gte: new Date(
            new Date().setHours(0, 0, 0, 0)
          ),
        },
      }),

      Incident.find()
        .populate(
          "user",
          "fullName email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        users: totalUsers,

        responders: {
          total: totalResponders,
          available: availableResponders,
          busy: busyResponders,
          offline: offlineResponders,
        },

        incidents: {
          total: totalIncidents,
          today: todayIncidents,
          critical: criticalIncidents,

          pending: pendingIncidents,
          assigned: assignedIncidents,
          accepted: acceptedIncidents,
          inProgress: inProgressIncidents,
          resolved: resolvedIncidents,
          cancelled: cancelledIncidents,
        },
      },

      recentIncidents,
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
// Users
// ======================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("responder")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
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
// Update User Status
// ======================================

const updateUserStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
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
// Delete User
// ======================================

const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
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
// Responders
// ======================================

const getAllResponders = async (
  req,
  res
) => {
  try {
    const responders =
      await Responder.find().sort({
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
// Update Responder Status
// ======================================

const updateResponderStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { status } = req.body;

      const responder =
        await Responder.findById(id);

      if (!responder) {
        return res.status(404).json({
          success: false,
          message:
            "Responder not found",
        });
      }

      responder.status = status;

      await responder.save();

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
// Delete Responder
// ======================================

const deleteResponder =
  async (req, res) => {
    try {
      const { id } = req.params;

      const responder =
        await Responder.findById(id);

      if (!responder) {
        return res.status(404).json({
          success: false,
          message:
            "Responder not found",
        });
      }

      await responder.deleteOne();

      return res.status(200).json({
        success: true,
        message:
          "Responder deleted successfully",
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
// Incidents
// ======================================

const getAllIncidents =
  async (req, res) => {
    try {
      const incidents =
        await Incident.find()
          .populate(
            "user",
            "fullName email phone"
          )
          .populate(
            "assignedResponders.responder"
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
// Filter Incidents
// ======================================

const filterIncidents =
  async (req, res) => {
    try {
      const {
        status,
        severity,
      } = req.query;

      const query = {};

      if (status)
        query.status = status;

      if (severity)
        query.severity = severity;

      const incidents =
        await Incident.find(query)
          .populate(
            "user",
            "fullName email"
          )
          .populate(
            "assignedResponders.responder"
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

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllResponders,
  updateResponderStatus,
  deleteResponder,
  getAllIncidents,
  filterIncidents,
};