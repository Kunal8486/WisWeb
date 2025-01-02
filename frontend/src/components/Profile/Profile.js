import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaMapMarkerAlt, FaRegUser, FaRegFileAlt, FaRegCalendarAlt, FaEdit } from "react-icons/fa";
import "./Profile.css";

Modal.setAppElement("#root");

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editDetails, setEditDetails] = useState({
    name: "",
    dob: "",
    location: "",
    about: "",
    username: "",
    profilePicture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [usernameError, setUsernameError] = useState(""); // To display username errors
  const [dobError, setdobError] = useState(""); // To display DOB errors
  // Helper function to calculate age from DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch the profile data
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
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "An error occurred.");
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditDetails({
      name: profile?.name || "",
      dob: profile?.dob || "",
      location: profile?.location || "",
      about: profile?.about || "",
      username: profile?.username || "",
      profilePicture: profile?.profilePicture || null,
    });
    setImagePreview(profile?.profilePicture ? `${process.env.REACT_APP_BACKEND_URL}${profile.profilePicture}` : null);
    setIsEditing(true);
  };

  const handleUsernameChange = (e) => {
    setEditDetails({ ...editDetails, username: e.target.value });
    setUsernameError(""); // Clear the error when user starts typing a new username
  };

  const handleSave = async () => {
    // Validate minimum age (10 years)
    const age = calculateAge(editDetails.dob);
    if (age < 10) {
      setdobError("You must be at least 10 years old.");
      return;
    }

    try {
      const walletAddress = sessionStorage.getItem("walletAddress");

      // Only check username if it's changed
      if (editDetails.username !== profile.username) {
        // Check if username is available
        const usernameCheckResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/check-username?username=${editDetails.username}`
        );

        if (usernameCheckResponse.data.isTaken) {
          setUsernameError("This username is already taken. Please choose a different one.");
          return; // Stop the profile update process here
        }
      }

      // Prepare the data to send for updating the profile
      const formData = new FormData();
      formData.append("metaMaskWalletAddress", walletAddress);
      formData.append("name", editDetails.name);
      formData.append("username", editDetails.username);
      formData.append("dob", editDetails.dob);
      formData.append("location", editDetails.location);
      formData.append("about", editDetails.about);

      // Append profile picture if it's a file
      if (editDetails.profilePicture instanceof File) {
        formData.append("profilePicture", editDetails.profilePicture);
      }

      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/update-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for image uploads
        },
      });

      if (response.status === 200) {
        setProfile(response.data); // Update profile data with the latest from backend
        setIsEditing(false); // Close the modal
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Close the modal without saving
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click(); // Trigger file input when the image is clicked
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show the image preview
      setEditDetails({ ...editDetails, profilePicture: file }); // Save file for upload
    }
  };

  const imagePreviewUrl = imagePreview
    ? imagePreview // If there's a preview image, use that (local URL)
    : profile?.profilePicture
      ? `${process.env.REACT_APP_BACKEND_URL}${profile.profilePicture}` // If using an existing image from the backend
      : "/images/default-avatar.png"; // Default image path

  const handleDateChange = (e) => {
    const dob = e.target.value;
    setEditDetails({ ...editDetails, dob });
    const age = calculateAge(dob);
    if (age < 10) {
      setdobError("You must be at least 10 years old ");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
\      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="edit-button" onClick={handleEditClick}>
          <FaEdit /> Edit
        </button>
        <div className="profile-header">
          <img
            src={imagePreviewUrl} // Use the image preview or the current profile image
            alt="Profile"
            className="profile-avatar"
            onClick={handleImageClick} // Allow click to trigger file input
          />
          <h2>{profile.name || "User"}</h2>
          <p className="wallet-address">
            Wallet: {`${profile.metaMaskWalletAddress.substring(0, 6)}...${profile.metaMaskWalletAddress.slice(-4)}`}
          </p>
        </div>

        <div className="profile-body">
          <div className="info-row">
            <FaRegFileAlt className="info-icon" />
            <strong>Username:</strong>
            <span>{profile.username ? `@${profile.username}` : "Username not set"}</span>
          </div>
          <div className="info-row">
            <FaMapMarkerAlt className="info-icon" />
            <strong>Location:</strong>
            <span>{profile.location || "Not specified"}</span>
          </div>
          <div className="info-row">
            <FaRegCalendarAlt className="info-icon" />
            <strong>Date of Birth:</strong>
            <span>{profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not specified"}</span>
          </div>
          <div className="info-row">
            <FaRegUser className="info-icon" />
            <strong>About:</strong>
            <span>{profile.about || "No description available."}</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onRequestClose={handleCancel}
        contentLabel="Edit Profile"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Edit Profile</h2>
        <form className="edit-profile-form">
          <label>
            Name:
            <input
              type="text"
              value={editDetails.name}
              onChange={(e) => setEditDetails({ ...editDetails, name: e.target.value })}
            />
          </label>
          <label>
            Username:
            <input
              type="text"
              value={editDetails.username}
              onChange={handleUsernameChange}
            />
            {usernameError && <span className="error-text">{usernameError}</span>}
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              value={editDetails.dob}
              onChange={handleDateChange} // Use the new date handler

            />
            {dobError && <span className="error-text">{dobError}</span>}

          </label>
          <label>
            Location:
            <input
              type="text"
              value={editDetails.location}
              onChange={(e) => setEditDetails({ ...editDetails, location: e.target.value })}
            />
          </label>
          <label>
            About:
            <textarea
              value={editDetails.about}
              onChange={(e) => setEditDetails({ ...editDetails, about: e.target.value })}
            />
          </label>
          <label>
            Profile Picture:
            <div className="image-upload-container" onClick={handleImageClick}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
                id="imageInput"
                style={{ display: "none" }}
              />
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" className="preview-img" />
              </div>
            )}
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserProfile;
