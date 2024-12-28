import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Community.css';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/communities');
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className="community-list-container">
      {loading ? (
        <div className="loading">Loading communities...</div>
      ) : (
        <div className="community-tiles">
          {communities.map((community) => (
            <div key={community._id} className="community-tile">
              <img
                src={`http://localhost:3000${community.icon}`} // Use full path to the image
                alt={community.name}
                className="community-icon"
              />
              <div className="community-info">
                <h3>{community.name}</h3>
                <p>{community.description}</p>
                <span className="category">{community.category}</span>
                <div className="community-footer">
                  <span className="created-at">{new Date(community.createdAt).toLocaleString()}</span>
                  {community.userID && <span className="creator-id">Created by: {community.userID}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityList;
