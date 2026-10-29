const axios = require("axios");

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// ===============================
// Calculate Distance (Haversine)
// ===============================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ===============================
// Get Nearby Emergency Services
// ===============================
const getNearbyEmergencyServices = async (latitude, longitude) => {
  try {
    const query = `
[out:json][timeout:25];
(
  node["amenity"~"hospital|police|fire_station"](around:5000,${latitude},${longitude});
  way["amenity"~"hospital|police|fire_station"](around:5000,${latitude},${longitude});
  relation["amenity"~"hospital|police|fire_station"](around:5000,${latitude},${longitude});
);
out center;
`;

    const response = await axios.post(
      OVERPASS_URL,
      query,
      {
        headers: {
          "Content-Type": "text/plain"
        },
        timeout: 20000
      }
    );

    const elements = response.data.elements || [];

    console.log("========== OVERPASS ==========");
    console.log("Total Places:", elements.length);
    console.log("==============================");

    const services = {
      hospital: null,
      policeStation: null,
      fireStation: null
    };

    for (const place of elements) {
      const lat = place.lat || place.center?.lat;
      const lon = place.lon || place.center?.lon;

      if (!lat || !lon) continue;

      const item = {
        name: place.tags?.name || "Unnamed",
        latitude: lat,
        longitude: lon,
        distance: Number(
          calculateDistance(
            latitude,
            longitude,
            lat,
            lon
          ).toFixed(2)
        )
      };

      switch (place.tags?.amenity) {
        case "hospital":
          if (
            !services.hospital ||
            item.distance < services.hospital.distance
          ) {
            services.hospital = item;
          }
          break;

        case "police":
          if (
            !services.policeStation ||
            item.distance < services.policeStation.distance
          ) {
            services.policeStation = item;
          }
          break;

        case "fire_station":
          if (
            !services.fireStation ||
            item.distance < services.fireStation.distance
          ) {
            services.fireStation = item;
          }
          break;
      }
    }

    return services;
  } catch (error) {
    console.error("Nearby Service Error");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    return {
      hospital: null,
      policeStation: null,
      fireStation: null
    };
  }
};

module.exports = {
  getNearbyEmergencyServices
};