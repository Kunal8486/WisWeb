const crypto = require('crypto');

/**
 * Encodes a wallet address into a unique user ID.
 * @param {string} walletAddress - The wallet address to encode.
 * @returns {string} - The encoded user ID (hashed wallet address).
 */
const encodeWalletAddress = (walletAddress) => {
  if (!walletAddress) {
    throw new Error('Wallet address is required for encoding.');
  }

  // Generate a SHA-256 hash of the wallet address
  return crypto.createHash('sha256').update(walletAddress).digest('hex');
};

module.exports = encodeWalletAddress;
