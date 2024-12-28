import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Avatar, Typography, Button, Box, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import detectEthereumProvider from '@metamask/detect-provider';
import './Profile.css';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        profilePicture: './profile/default.png',
        name: 'Na',
        userId: '',
        email: 'Na',
        location: 'Na',
        about: 'Na',
    });
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // Connect to MetaMask and fetch user profile
        const fetchProfile = async () => {
            const provider = await detectEthereumProvider();
            if (!provider) {
                alert('MetaMask not detected!');
                return;
            }
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            // Generate a random 5-character user ID
            const generateRandomUserId = (wallet) => {
                const base = wallet.slice(2); // Remove '0x' prefix
                return Array.from({ length: 5 }, () => base[Math.floor(Math.random() * base.length)]).join('');
            };

            let userId = generateRandomUserId(walletAddress);
            
            // Check if user ID exists, and retry generating a unique one
            let isUnique = false;
            while (!isUnique) {
                const checkAvailability = await axios.get(`http://localhost:5000/api/user/check-id/${userId}`);
                if (checkAvailability.data.available) {
                    isUnique = true;
                } else {
                    // Generate a new userId if already taken
                    userId = generateRandomUserId(walletAddress);
                }
            }

            // Fetch the profile from the backend
            axios.get(`http://localhost:5000/api/user/profile/${userId}`)
                .then((response) => setProfileData(response.data))
                .catch((err) => {
                    if (err.response && err.response.status === 404) {
                        // If no profile exists, create one
                        axios.post('http://localhost:5000/api/user/profile', { walletAddress, userId })
                            .then((res) => setProfileData(res.data))
                            .catch((error) => console.error('Error creating profile:', error));
                    } else {
                        console.error('Error fetching profile:', err);
                    }
                });
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (isEditing) {
            try {
                // Check if the userId is available
                const checkAvailability = await axios.get(
                    `http://localhost:5000/api/user/check-id/${profileData.userId}`
                );

                if (!checkAvailability.data.available) {
                    setFeedback('User ID is already taken. Please choose a different one.');
                    return;
                }

                const response = await axios.put(
                    `http://localhost:5000/api/user/profile/${profileData.userId}`,
                    profileData
                );
                setProfileData(response.data);
                setIsEditing(false);
                setFeedback('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    return (
        <Container maxWidth="md" className="profile-container">
            <Paper elevation={3} className="profile-paper">
                <Box className="profile-box">
                    {/* Left Section: Avatar and Edit Button */}
                    <Box className="avatar-section">
                        <Avatar
                            src={profileData.profilePicture}
                            alt="Profile Picture"
                            className="profile-avatar"
                        />
                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => setProfileData({ ...profileData, profilePicture: reader.result });
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="avatar-input"
                            />
                        )}
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                            className="edit-button"
                        >
                            {isEditing ? 'Save Profile' : 'Edit Profile'}
                        </Button>
                    </Box>

                    {/* Right Section: Profile Information */}
                    <Box className="profile-info">
                        <Typography variant="body1" color="black" gutterBottom>
                            <strong>User ID:</strong>{' '}
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={profileData.userId}
                                    name="userId"
                                    onChange={handleChange}
                                />
                            ) : (
                                profileData.userId
                            )}
                        </Typography>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Name"
                                    value={profileData.name}
                                    name="name"
                                    onChange={handleChange}
                                />
                            ) : (
                                profileData.name
                            )}
                        </Typography>
                        <Typography variant="body1" color="black" gutterBottom>
                            <strong>Email:</strong>{' '}
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={profileData.email}
                                    name="email"
                                    onChange={handleChange}
                                />
                            ) : (
                                profileData.email
                            )}
                        </Typography>
                        <Typography variant="body1" color="black" gutterBottom>
                            <strong>Location:</strong>{' '}
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={profileData.location}
                                    name="location"
                                    onChange={handleChange}
                                />
                            ) : (
                                profileData.location
                            )}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            About Me
                        </Typography>
                        {isEditing ? (
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                label="About"
                                value={profileData.about}
                                name="about"
                                onChange={handleChange}
                            />
                        ) : (
                            <Typography variant="body1" color="black">
                                {profileData.about}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {feedback && <Typography color="error">{feedback}</Typography>}
            </Paper>
        </Container>
    );
};

export default Profile;
