
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const promoteAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      throw new Error("ADMIN_EMAIL is missing from .env");
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.log("User not found. Register this account first.");
      return;
    }

    console.log("Admin account created successfully!");
    console.log("Email:", user.email);
    console.log("Role:", user.role);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

promoteAdmin();
