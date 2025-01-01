import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const LoginPage = () => {
  const [feedback, setFeedback] = useState("");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const navigate = useNavigate();

  // Platform detection
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMetaMaskBrowser = typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;

  useEffect(() => {
    handleQrCodeVisibility();
  }, []);

  const handleQrCodeVisibility = () => {
    // QR Code is shown only for mobile users not using MetaMask
    if ((isAndroid || isiOS) && !isMetaMaskBrowser) {
      setQrCodeVisible(true);
    } else {
      setQrCodeVisible(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    try {
      // Deep link to MetaMask if on mobile and not using MetaMask browser
      const dappUrl = "https://wisweb.in";
      const metaMaskDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;

      if ((isAndroid || isiOS) && !isMetaMaskBrowser) {
        window.location.href = metaMaskDeepLink;
        return;
      }

      // Check for MetaMask installation
      if (!window.ethereum) {
        setFeedback("MetaMask is not installed. Please install it to continue.");
        return;
      }

      // Prevent redundant login prompts
      if (isMetaMaskConnected) {
        setFeedback("You are already connected.");
        return;
      }

      // Request wallet connection
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        setFeedback(`Logged in with address: ${walletAddress}`);
        sessionStorage.setItem("userRole", "authenticated");
        sessionStorage.setItem("walletAddress", walletAddress);
        setIsMetaMaskConnected(true);

        // Backend call to create or retrieve user
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/users/create-or-get`,
            { metaMaskWalletAddress: walletAddress }
          );

          if (response.status === 200 || response.status === 201) {
            const user = response.data;
            console.log("User data:", user);
            navigate("/"); // Navigate to the home page or dashboard
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
                disabled={isMetaMaskConnected} // Disable button if already connected
              >
                🔒 {isMetaMaskConnected ? "Connected to MetaMask" : "Login with MetaMask"}
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
                <img
                  src="assets/metamask_login.png"
                  alt="MetaMask QR code"
                  className="metamask-qr"
                />
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
