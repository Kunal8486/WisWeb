import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // CSS for styling

const LoginPage = () => {
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  // Handle login with MetaMask
  const handleMetaMaskLogin = async () => {
    try {
      if (!window.ethereum) {
        setFeedback('MetaMask is not installed. Please install it to continue.');
        return;
      }

      // Request wallet connection
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        setFeedback(`Logged in with address: ${walletAddress}`);

        // Store user role and wallet address in session
        sessionStorage.setItem('userRole', 'authenticated');
        sessionStorage.setItem('walletAddress', walletAddress);

        // Send wallet address to the backend to create or fetch user


    
      } else {
        setFeedback('No wallet address found. Please try again.');
      }
    } catch (error) {
      setFeedback(`Error logging in: ${error.message}`);
    }
  };

  // Handle guest login
  const handleGuestLogin = () => {
    setFeedback('Proceeding as Guest...');
    sessionStorage.setItem('userRole', 'guest');
    navigate('/'); // Redirect to the home page or guest dashboard
  };

  return (
    <div className="login-page">
      <div className="content-container">
        {/* Left Section: Logo */}
        <div className="logo-container">
          <img src="assets/logo.jpg" alt="Platform Logo" className="logo" />
        </div>

        {/* Right Section: Login */}
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
