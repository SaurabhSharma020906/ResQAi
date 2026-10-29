const Responder = require("../models/Responder");

// ==========================================
// Haversine Distance Formula
// ==========================================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ==========================================
// Find Nearest Available Responders
// ==========================================
const assignResponders = async (
  latitude,
  longitude,
  dispatchServices
) => {
  const assignedResponders = [];

  for (const service of dispatchServices) {

    let responderType = service;

    // Ambulance is usually provided by hospitals
    if (service === "Ambulance") {
      responderType = "Hospital";
    }

    const responders = await Responder.find({
      type: responderType,
      status: "Available",
    });

    if (!responders.length) {
      assignedResponders.push({
        type: service,
        responder: null,
        message: "No Available Responder",
      });

      continue;
    }

    let nearest = null;
    let minDistance = Number.MAX_VALUE;

    responders.forEach((responder) => {

      const distance = calculateDistance(
        latitude,
        longitude,
        responder.latitude,
        responder.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = responder;
      }

    });

    assignedResponders.push({

      type: service,

      responder: {
        id: nearest._id,
        name: nearest.name,
        phone: nearest.phone,
        address: nearest.address,
        latitude: nearest.latitude,
        longitude: nearest.longitude,
        status: nearest.status,
      },

      distance: Number(minDistance.toFixed(2)),
    });

  }

  return assignedResponders;
};

module.exports = {
  assignResponders,
};