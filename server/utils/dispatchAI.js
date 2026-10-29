// ===============================================
// ResQAI Dispatch Recommendation Engine
// ===============================================

const getDispatchRecommendation = (
  emergencyType,
  severity
) => {

  const type = (emergencyType || "").toLowerCase();

  let dispatchServices = [];

  let priority = "";

  let estimatedResponseTime = "";

  switch (type) {

    // ===========================================
    // FIRE
    // ===========================================

    case "fire":

      dispatchServices.push("Fire Brigade");

      if (
        severity === "Medium"
      ) {
        dispatchServices.push("Police");
      }

      if (
        severity === "High"
      ) {
        dispatchServices.push("Ambulance");
        dispatchServices.push("Police");
      }

      if (
        severity === "Critical"
      ) {
        dispatchServices.push("Ambulance");
        dispatchServices.push("Police");
      }

      break;

    // ===========================================
    // MEDICAL
    // ===========================================

    case "medical":

      dispatchServices.push("Ambulance");

      if (
        severity === "High"
      ) {
        dispatchServices.push("Police");
      }

      if (
        severity === "Critical"
      ) {
        dispatchServices.push("Police");
        dispatchServices.push("Fire Brigade");
      }

      break;

    // ===========================================
    // ROAD ACCIDENT
    // ===========================================

    case "road accident":

      dispatchServices.push("Ambulance");
      dispatchServices.push("Police");

      if (
        severity === "High"
      ) {
        dispatchServices.push("Fire Brigade");
      }

      if (
        severity === "Critical"
      ) {
        dispatchServices.push("Fire Brigade");
      }

      break;

    // ===========================================
    // CRIME
    // ===========================================

    case "crime":

      dispatchServices.push("Police");

      if (
        severity === "High"
      ) {
        dispatchServices.push("Ambulance");
      }

      if (
        severity === "Critical"
      ) {
        dispatchServices.push("Ambulance");
        dispatchServices.push("Fire Brigade");
      }

      break;

    // ===========================================
    // NATURAL DISASTER
    // ===========================================

    case "natural disaster":

      dispatchServices = [
        "Police",
        "Fire Brigade",
        "Ambulance",
      ];

      break;

    // ===========================================
    // OTHER
    // ===========================================

    default:

      dispatchServices = [
        "Police",
      ];

  }

  // Remove duplicate services

  dispatchServices = [
    ...new Set(dispatchServices),
  ];

  // ===========================================
  // Priority
  // ===========================================

  switch (severity) {

    case "Critical":

      priority = "Immediate";

      estimatedResponseTime =
        "5-10 Minutes";

      break;

    case "High":

      priority = "Very High";

      estimatedResponseTime =
        "10-15 Minutes";

      break;

    case "Medium":

      priority = "High";

      estimatedResponseTime =
        "15-20 Minutes";

      break;

    default:

      priority = "Normal";

      estimatedResponseTime =
        "20-30 Minutes";

  }

  return {

    dispatchServices,

    priority,

    estimatedResponseTime,

  };

};

module.exports = {

  getDispatchRecommendation,

};