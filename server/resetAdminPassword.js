const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "saurabh@gmail.com";
    const newPassword = "Admin@123";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ Admin user not found.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.role = "Admin";
    user.isActive = true;

    await user.save();

    console.log("✅ Admin password reset successfully.");
    console.log("=================================");
    console.log("Email    :", email);
    console.log("Password :", newPassword);
    console.log("Role     :", user.role);
    console.log("=================================");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetAdminPassword();