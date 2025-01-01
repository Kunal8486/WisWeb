import React from 'react';
import './About.css'; // Optional: Add styling in a separate CSS file.

const About = () => {
  return (
    <div className="about-container">
      <h1>About WisWeb</h1>
      <p>
        Welcome to <strong>WisWeb</strong> – the decentralized platform where creativity meets technology. 
        Inspired by platforms like Reddit and GitHub, WisWeb enables content sharing and collaboration in a 
        blockchain-powered environment.
      </p>

      <h2>Our Vision</h2>
      <p>
        At WisWeb, we aim to empower users by providing a transparent, community-driven platform. 
        By integrating blockchain technology, we ensure that every contribution is valued and rewarded 
        fairly through the <strong>WisWebToken (WWT)</strong>.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>
          <strong>Decentralized Content Sharing:</strong> Store and share files securely using 
          <a href="https://ipfs.tech/" target="_blank" rel="noopener noreferrer">IPFS</a>.
        </li>
        <li>
          <strong>Performance-based Rewards:</strong> Earn WWT tokens based on the quality and performance of your contributions.
        </li>
        <li>
          <strong>Seamless Wallet Integration:</strong> Connect with <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> 
          for managing your earnings and profile settings.
        </li>
        <li>
          <strong>Customizable Profiles:</strong> Create unique usernames by encoding wallet addresses and personalize your experience.
        </li>
        <li>
          <strong>Community Creation:</strong> Build your own communities with ease, fostering collaboration and discussion.
        </li>
      </ul>

      <h2>Why Choose WisWeb?</h2>
      <p>
        Unlike traditional platforms, WisWeb operates on a decentralized network, ensuring data privacy, transparency, 
        and freedom from censorship. By leveraging blockchain and modern web technologies, WisWeb is reshaping how 
        people interact and collaborate online.
      </p>

      <h2>Join the Revolution</h2>
      <p>
        Be part of the decentralized future. Share your ideas, collaborate with others, and earn rewards on WisWeb.
      </p>
    </div>
  );
};

export default About;
