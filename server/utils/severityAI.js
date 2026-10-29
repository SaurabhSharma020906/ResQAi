const getSeverity = (emergencyType, description) => {
  const type = (emergencyType || "").toLowerCase();
  const text = (description || "").toLowerCase();

  // ---------------- FIRE ----------------
  if (type === "fire") {
    if (
      text.includes("people trapped") ||
      text.includes("explosion") ||
      text.includes("building") ||
      text.includes("fire spreading")
    ) {
      return "Critical";
    }

    if (
      text.includes("gas leak") ||
      text.includes("large fire") ||
      text.includes("factory") ||
      text.includes("forest fire")
    ) {
      return "High";
    }

    if (
      text.includes("small smoke") ||
      text.includes("smoke") ||
      text.includes("dustbin")
    ) {
      return "Medium";
    }

    return "High";
  }

  // ---------------- MEDICAL ----------------
  if (type === "medical") {
    if (
      text.includes("not breathing") ||
      text.includes("unconscious") ||
      text.includes("heart attack") ||
      text.includes("stroke")
    ) {
      return "Critical";
    }

    if (
      text.includes("fracture") ||
      text.includes("heavy bleeding")
    ) {
      return "High";
    }

    return "Medium";
  }

  // ---------------- ROAD ACCIDENT ----------------
  if (type === "road accident") {
    if (
      text.includes("multiple injured") ||
      text.includes("truck") ||
      text.includes("bus")
    ) {
      return "Critical";
    }

    if (
      text.includes("car crash") ||
      text.includes("bike collision")
    ) {
      return "High";
    }

    if (
      text.includes("bike skid") ||
      text.includes("minor accident")
    ) {
      return "Medium";
    }

    return "Medium";
  }

  // ---------------- CRIME ----------------
  if (type === "crime") {
    if (
      text.includes("gun") ||
      text.includes("terrorist") ||
      text.includes("bomb")
    ) {
      return "Critical";
    }

    if (
      text.includes("knife") ||
      text.includes("robbery") ||
      text.includes("weapon")
    ) {
      return "High";
    }

    return "Medium";
  }

  // ---------------- NATURAL DISASTER ----------------
  if (type === "natural disaster") {
    return "Critical";
  }

  return "Low";
};

module.exports = {
  getSeverity,
};