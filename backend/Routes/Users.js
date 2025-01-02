const express = require("express");
const { Web3 } = require("web3");
const User = require("../Models/User");
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

// Helper function to ensure username uniqueness
const generateUniqueUsername = async (walletAddress) => {
  let username = `user_${walletAddress.substring(2, 8)}`; // Default username based on wallet address
  let isUsernameTaken = await User.findOne({ username }); // Check if username already exists
  
  // If the username is taken, regenerate it
  while (isUsernameTaken) {
    username = `user_${walletAddress.substring(2, 8)}_${Math.floor(Math.random() * 10000)}`; // Add a random number
    isUsernameTaken = await User.findOne({ username }); // Check if new username is taken
  }
  
  return username;
};

// Check if the username is taken
router.get("/check-username", async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.json({ isTaken: true });
    }
    res.json({ isTaken: false });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "An error occurred while checking the username." });
  }
});

// Create or retrieve user by wallet address
router.post("/create-or-get", async (req, res) => {
  try {
    const { metaMaskWalletAddress, name, dob } = req.body;

    // Validate wallet address
    if (!web3.utils.isAddress(metaMaskWalletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Check if the user already exists
    let user = await User.findOne({ metaMaskWalletAddress });

    if (!user) {
      // Auto-create user if not found
      const username = await generateUniqueUsername(metaMaskWalletAddress); // Generate unique username

      user = new User({
        metaMaskWalletAddress,
        username, // Use the unique username
        profilePicture: "/uploads/default-avatar.png", // Default profile picture
        location: "",
        about: "Welcome to WizWeb!", // Default about section
        name: name || "", // Default name (empty if not provided)
        dob: dob || null // Default dob (null if not provided)
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

// Update user profile with image upload
router.put("/update-profile", upload.single("profilePicture"), async (req, res) => {
  try {
    const { metaMaskWalletAddress, name, dob, username, location, about } = req.body;

    if (!metaMaskWalletAddress) {
      return res.status(400).json({ error: "Wallet address is required." });
    }

    // Find user by wallet address
    const user = await User.findOne({ metaMaskWalletAddress });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the username is being changed
    if (username && username !== user.username) {
      // Only check for uniqueness if the username is different
      const isUsernameTaken = await User.findOne({ username });

      if (isUsernameTaken) {
        return res.status(400).json({ error: "Username is already taken." });
      }

      // Update username
      user.username = username;
    }

    // Update other fields if provided
    user.name = name || user.name;
    user.dob = dob || user.dob;
    user.location = location || user.location;
    user.about = about || user.about;

    // If new profile picture is uploaded, update the profilePicture field
    if (req.file) {
      user.profilePicture = "/uploads/" + req.file.filename; // Save the path to the uploaded image
    }

    // Update the timestamp for when the profile was modified
    user.updatedAt = Date.now();

    // Save the updated user profile
    await user.save();

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

    // Validate wallet address
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
