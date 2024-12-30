import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaRegUser, FaRegFileAlt } from "react-icons/fa";
import "./Profile.css"; // Custom CSS for enhanced styling

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const walletAddress = sessionStorage.getItem("walletAddress");

        if (!walletAddress) {
          setError("Wallet address not found. Please log in with MetaMask.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users?metaMaskWalletAddress=${walletAddress}`
        );

        if (response.status === 200) {
          setProfile(response.data);
        } else {
          setError("Unable to fetch profile data.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err); // Log error for debugging
        setError(err.response?.data?.error || "An error occurred.");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  // Ensure the profile image URL is correct
  const profileImageUrl = `${process.env.REACT_APP_BACKEND_URL}${profile.profilePicture}`;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={profileImageUrl} // Correct profile image URL
            alt="Profile"
            className="profile-avatar"
          />
          <h2>{profile.username || "User"}</h2>
          <p className="wallet-address">
            Wallet: {`${profile.metaMaskWalletAddress.substring(0, 6)}...${profile.metaMaskWalletAddress.slice(-4)}`}
          </p>
        </div>
        <div className="profile-body">
          <div className="info-row">
            <FaMapMarkerAlt className="info-icon" />
            <strong>Location:</strong>
            <span>{profile.location || "Not specified"}</span>
          </div>
          <div className="info-row">
            <FaRegUser className="info-icon" />
            <strong>About:</strong>
            <span>{profile.about || "No description available."}</span>
          </div>
          <div className="info-row">
            <FaRegFileAlt className="info-icon" />
            <strong>Username:</strong>
            <span>{profile.username ? `@${profile.username}` : "Username not set"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
