const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected!");
    console.log("Host:", conn.connection.host);
  } catch (err) {
    console.error("============== FULL ERROR ==============");
    console.error(err);
    console.error("========================================");
    process.exit(1);
  }
};

module.exports = connectDB;