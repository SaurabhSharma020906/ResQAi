const axios = require("axios");

const API_KEY = process.env.GEOAPIFY_API_KEY;

// ==============================
// Calculate Distance (Haversine)
// ==============================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function fetchCategory(category, lat, lng) {
  const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lng},${lat},5000&bias=proximity:${lng},${lat}&limit=10&apiKey=${API_KEY}`;

  const response = await axios.get(url);

  return response.data.features.map((item) => ({
    id: item.properties.place_id,
    name: item.properties.name || "Unnamed",
    address: item.properties.formatted || "",
    latitude: item.properties.lat,
    longitude: item.properties.lon,
  }));
}

async function getNearbyEmergencyServices(lat, lng) {
  try {
    const hospitals = await fetchCategory(
      "healthcare.hospital",
      lat,
      lng
    );

    const police = await fetchCategory(
      "service.police",
      lat,
      lng
    );

    const fireStations = await fetchCategory(
      "service.fire_station",
      lat,
      lng
    );

    const services = [
      ...hospitals.map((s) => ({
        ...s,
        type: "Hospital",
      })),

      ...police.map((s) => ({
        ...s,
        type: "Police Station",
      })),

      ...fireStations.map((s) => ({
        ...s,
        type: "Fire Station",
      })),
    ];

    return services
      .map((service) => ({
        ...service,
        distance: Number(
          calculateDistance(
            lat,
            lng,
            service.latitude,
            service.longitude
          ).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error("Geoapify Error");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    return [];
  }
}

module.exports = {
  getNearbyEmergencyServices,
};