import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // CSS for styling

const LoginPage = () => {
  const [feedback, setFeedback] = useState("");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const navigate = useNavigate();

  // Detect if the user is on Android or iOS
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Effect to check for mobile platform and show QR code
  useEffect(() => {
    if (isAndroid || isiOS) {
      setQrCodeVisible(true); // Show the QR code image by default on mobile
    }
  }, [isAndroid, isiOS]);

  const handleMetaMaskLogin = async () => {
    try {
      const dappUrl = "https://wisweb.in"; // Replace with your dApp URL
      const metaMaskDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
  
      // Detect mobile device and redirect to MetaMask app if necessary
      if (isAndroid || isiOS) {
        window.location.href = metaMaskDeepLink;
        return;
      }
  
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setFeedback("MetaMask is not installed. Please install it to continue.");
        return;
      }
  
      // Request wallet connection
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        setFeedback(`Logged in with address: ${walletAddress}`);
        sessionStorage.setItem("userRole", "authenticated");
        sessionStorage.setItem("walletAddress", walletAddress);
  
        // Send wallet address to backend for user creation or retrieval
        try {
          const response = await axios.post("http://localhost:3000/users/create-or-get", {
            metaMaskWalletAddress: walletAddress,
          });
  
          // Handle response from backend
          if (response.status === 200 || response.status === 201) {
            const user = response.data;
            console.log("User data:", user);
            navigate("/"); // Redirect to your app's main page
          } else {
            setFeedback("Failed to create or retrieve user. Please try again.");
          }
        } catch (apiError) {
          setFeedback(`Error creating or fetching user: ${apiError.message}`);
        }
      } else {
        setFeedback("No wallet address found. Please try again.");
      }
    } catch (error) {
      setFeedback(`Error logging in: ${error.message}`);
    }
  };

  // Handle guest login
  const handleGuestLogin = () => {
    setFeedback("Proceeding as Guest...");
    sessionStorage.setItem("userRole", "guest");
    navigate("/"); // Redirect to the home page or guest dashboard
  };

  return (
    <div className="login-page">
      <div className="content-container">
        <div className="logo-container">
          <img src="assets/logo.jpg" alt="Platform Logo" className="logo" />
        </div>

        <main>
          <div id="login-container" className="login-container">
            <h1>Welcome to WisWeb</h1>
            <p>Connect using one of the options below:</p>

            <div className="login-buttons">
              <button
                id="metamask-login"
                className="login-btn"
                onClick={handleMetaMaskLogin}
              >
                🔒 Login with MetaMask
              </button>
              <button
                id="guest-login"
                className="login-btn"
                onClick={handleGuestLogin}
              >
                👤 Continue as Guest
              </button>
            </div>

            {feedback && <div id="login-feedback" className="feedback">{feedback}</div>}

            {qrCodeVisible && (
              <div className="qr-code-container">
                <p>Scan this QR code with the MetaMask app:</p>
                <img src="assets/metamask_login.png" alt="MetaMask QR code" className="metamask-qr" />
              </div>
            )}
          </div>
        </main>
      </div>

      <footer>
        <p>&copy; 2024 WisWeb. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
