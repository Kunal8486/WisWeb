const express = require("express");
const { Web3 } = require("web3");
const User = require("../Models/User"); // Adjust path to your User model
const path = require("path");
const multer = require("multer");
const router = express.Router();

// File storage configuration with Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
  },
});

const upload = multer({ storage });

// Initialize Web3 with Infura provider
const web3 = new Web3("https://mainnet.infura.io/v3/030ec9a847864e8e97cb3c12a909370b");

// Create or retrieve user by wallet address
router.post("/create-or-get", async (req, res) => {
  try {
    const { metaMaskWalletAddress } = req.body;

    // Validate wallet address
    if (!web3.utils.isAddress(metaMaskWalletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Check if the user already exists
    let user = await User.findOne({ metaMaskWalletAddress });

    if (!user) {
      // Auto-create user if not found
      user = new User({
        metaMaskWalletAddress,
        username: `user_${metaMaskWalletAddress.substring(2, 8)}`, // Default username
        profilePicture: "/uploads/default-avatar.png", // Default profile picture
        location: "",
        about: "Welcome to WizWeb!", // Default about section
      });

      await user.save();
      return res.status(201).json(user); // Return newly created user
    }

    // Return existing user
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile by wallet address
router.get("/", async (req, res) => {
  try {
    const { metaMaskWalletAddress } = req.query;

    if (!metaMaskWalletAddress) {
      return res.status(400).json({ error: "Wallet address is required." });
    }

    // Validate wallet address (optional: Web3 validation if required)
    if (!/^0x[a-fA-F0-9]{40}$/.test(metaMaskWalletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address." });
    }

    // Find user by wallet address
    const user = await User.findOne({ metaMaskWalletAddress });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return user profile
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
