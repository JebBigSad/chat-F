import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile({ token, user, setUser }) {
  const [bio, setBio] = useState(user?.bio || '');
  const [interests, setInterests] = useState(user?.interests ? user.interests.join(', ') : '');
  const [city, setCity] = useState(user?.city || '');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i);
      await axios.put('http://localhost:5000/api/profile', {
        bio,
        interests: interestsArray,
        city
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully! ✅');
      setTimeout(() => setMessage(''), 3000);
      
      // Update local user data
      if (setUser) {
        setUser({ ...user, bio, interests: interestsArray, city });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('Error updating profile ❌');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="header">
        <button onClick={() => navigate('/swipe')}>← Back to Swipe</button>
        <button onClick={() => navigate('/matches')}>💕 Matches</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
      
      <div className="profile-card">
        <h2>👤 Edit Profile</h2>
        {message && <div style={{ textAlign: 'center', marginBottom: '20px', color: '#4CAF50' }}>{message}</div>}
        
        <form onSubmit={handleUpdate}>
          <label>Name:</label>
          <input type="text" value={user?.name || ''} disabled />
          
          <label>Email:</label>
          <input type="email" value={user?.email || ''} disabled />
          
          <label>Age:</label>
          <input type="number" value={user?.age || ''} disabled />
          
          <label>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" />
          
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell something about yourself..."
            rows="4"
          />
          
          <label>Interests (comma separated):</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., Music, Sports, Travel, Coffee"
          />
          <small style={{ color: '#666' }}>Example: Music, Sports, Travel</small>
          
          <button type="submit">💾 Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;