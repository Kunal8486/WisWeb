import React from 'react';
import './terms-of-uses.css'; // Link your CSS file here

const TermsOfUse = () => {
  return (
    <div>
      <header>
        <h1>Terms of Use</h1>
      </header>
      <main>
        <h2>Introduction</h2>
        <p>Welcome to WisWeb! By accessing or using our platform, you agree to comply with and be bound by the following Terms of Use...</p>
        <h2>1. Acceptance of Terms</h2>
        <p>By using WisWeb, you acknowledge that you have read, understood, and agree to these Terms of Use...</p>
        <h2>2. User Responsibilities</h2>
        <p>As a user, you are responsible for the following:</p>
        <ul>
          <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account information...</li>
          <li><strong>Lawful Use:</strong> You agree to use WisWeb only for lawful purposes...</li>
          <li><strong>Respect for Others:</strong> You agree not to engage in any behavior that could harm, disrupt, or interfere...</li>
        </ul>
        <h2>3. Content Ownership</h2>
        <p>All content you post, share, or upload on WisWeb remains your property...</p>
        {/* Add other sections as needed */}
      </main>
    </div>
  );
};

export default TermsOfUse;
