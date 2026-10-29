const axios = require("axios");

const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "ResQAI Emergency Response System",
      },
    });

    const data = response.data;

    return {
      address: data.display_name || "",

      city:
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "",

      state: data.address.state || "",

      country: data.address.country || "",

      pincode: data.address.postcode || "",
    };
  } catch (error) {
    console.error("Location Service Error:", error.message);

    return {
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    };
  }
};

module.exports = {
  getAddressFromCoordinates,
};