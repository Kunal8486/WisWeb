const express = require('express');
const User = require('../models/User');
const encodeWalletAddress = require('../utils/encodeWallet');

const router = express.Router();

// MetaMask Login Endpoint
router.post('/login', async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required.' });
  }

  try {
    // Generate user ID using the utility function
    const userId = encodeWalletAddress(walletAddress);

    // Check if user already exists
    let user = await User.findOne({ walletAddress });

    if (!user) {
      // Create new user
      user = new User({ walletAddress, userId });
      await user.save();
    }

    res.status(200).json({
      message: 'Login successful.',
      userId: user.userId,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
