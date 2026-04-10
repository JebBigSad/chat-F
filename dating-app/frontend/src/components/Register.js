import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [lookingFor, setLookingFor] = useState('female');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Валидация
    if (!email || !username || !password || !name || !age) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Создаем объект с данными пользователя (БЕЗ ГЕОЛОКАЦИИ)
    const userData = {
      email: email,
      username: username,
      password: password,
      name: name,
      age: parseInt(age),
      gender: gender,
      looking_for: lookingFor,
      city: city,
      bio: bio,
      interests: []
    };
    
    console.log('Sending data:', userData);
    
    try {
      const response = await axios.post('http://localhost:5000/api/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      setSuccess('Registration successful! Redirecting to login...');
      
      // Перенаправляем на страницу входа через 2 секунды
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        setError(err.response.data.error || 'Registration failed');
      } else if (err.request) {
        setError('Cannot connect to server. Make sure backend is running on port 5000');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        
        {error && (
          <div className="error" style={{color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '5px'}}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{color: 'green', marginBottom: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px'}}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email *" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          <input 
            type="text" 
            placeholder="Username *" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Password *" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <input 
            type="text" 
            placeholder="Full Name *" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          
          <input 
            type="number" 
            placeholder="Age *" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            required 
          />
          
          <input 
            type="text" 
            placeholder="City" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
          />
          
          <textarea 
            placeholder="Bio (tell something about yourself)" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            rows="3"
            style={{width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit'}}
          />
          
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          
          <select value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} required>
            <option value="male">Looking for Men</option>
            <option value="female">Looking for Women</option>
            <option value="anyone">Looking for Anyone</option>
          </select>
          
          <button type="submit">Register</button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;