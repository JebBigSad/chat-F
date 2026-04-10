import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Matches({ token }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/matches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(response.data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="matches-container">
      <div className="header">
        <button onClick={() => navigate('/swipe')}>← Back to Swipe</button>
        <button onClick={() => navigate('/profile')}>👤 Profile</button>
      </div>
      
      <h2>💕 Your Matches</h2>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading matches...</p>
      ) : matches.length === 0 ? (
        <div className="no-profiles">
          <h3>No matches yet 😢</h3>
          <p>Keep swiping to find your perfect match!</p>
          <button onClick={() => navigate('/swipe')}>Start Swiping</button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match.match_id} className="match-card" onClick={() => navigate(`/chat/${match.match_id}`)}>
              <div className="match-image-placeholder">
                {match.user.photos && match.user.photos[0] ? (
                  <img src={match.user.photos[0]} alt={match.user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  '📷'
                )}
              </div>
              <h3>{match.user.name}</h3>
              <div className="compatibility-small">
                💑 {Math.round(match.compatibility)}% match
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;