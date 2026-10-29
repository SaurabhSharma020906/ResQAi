const { getNearbyEmergencyServices } = require("../services/emergencyService");

exports.getNearbyServices = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const services = await getNearbyEmergencyServices(
      parseFloat(lat),
      parseFloat(lng)
    );

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Emergency Service Error:");
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch nearby emergency services",
      error: error.message,
    });
  }
};