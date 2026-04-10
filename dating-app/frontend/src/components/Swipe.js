import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Swipe({ token, user }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/discover', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(response.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (profileId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/like/${profileId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.match) {
        alert(`💕 IT'S A MATCH! 💕\nCompatibility: ${response.data.match_data.compatibility}%\nYou matched with ${response.data.match_data.user}!`);
      } else {
        alert(`👍 Liked! Compatibility: ${response.data.compatibility}%`);
      }
      setCurrentIndex(currentIndex + 1);
    } catch(err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div>
        <div className="header">
          <button onClick={() => navigate('/matches')}>Matches</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="profile-card-large">
          <h3>Loading profiles... 🎯</h3>
        </div>
      </div>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div>
        <div className="header">
          <button onClick={() => navigate('/matches')}>Matches</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="no-profiles">
          <h3>🎉 No more profiles! 🎉</h3>
          <button onClick={fetchProfiles}>Load More</button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div>
      <div className="header">
        <button onClick={() => navigate('/matches')}>💕 Matches</button>
        <button onClick={() => navigate('/profile')}>👤 Profile</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
      
      <div className="profile-card-large">
        <div className="compatibility-badge">
          🎯 {Math.round(currentProfile.compatibility)}% Match
        </div>
        <h2>{currentProfile.name}, {currentProfile.age}</h2>
        <p>📍 {currentProfile.city || 'Location not specified'}</p>
        <p>📝 {currentProfile.bio || 'No bio yet'}</p>
        
        <div className="interests-section">
          <h3>Interests:</h3>
          <div className="interests">
            {currentProfile.interests && currentProfile.interests.length > 0 ? (
              currentProfile.interests.map((interest, i) => (
                <span key={i} className="interest-tag">{interest}</span>
              ))
            ) : (
              <p>No interests listed</p>
            )}
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="dislike-btn" onClick={() => setCurrentIndex(currentIndex + 1)}>
            👎 Pass
          </button>
          <button className="like-btn" onClick={() => handleLike(currentProfile.id)}>
            ❤️ Like
          </button>
        </div>
      </div>
    </div>
  );
}

export default Swipe;