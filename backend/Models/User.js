const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  metaMaskWalletAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  profilePicture: { type: String, default: "/uploads/default-avatar.png" },
  location: { type: String, default: "" },
  about: { type: String, default: "Welcome to WizWeb!" },
  name: { type: String, default: "" },
  dob: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
