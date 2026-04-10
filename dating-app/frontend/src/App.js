import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Swipe from './components/Swipe';
import Matches from './components/Matches';
import Chat from './components/Chat';
import Profile from './components/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={
            token ? <Navigate to="/swipe" /> : <Login setToken={setToken} setUser={setUser} />
          } />
          <Route path="/register" element={
            token ? <Navigate to="/swipe" /> : <Register />
          } />
          <Route path="/swipe" element={
            token ? <Swipe token={token} user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/matches" element={
            token ? <Matches token={token} /> : <Navigate to="/login" />
          } />
          <Route path="/chat/:matchId" element={
            token ? <Chat token={token} user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            token ? <Profile token={token} user={user} setUser={setUser} /> : <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to="/swipe" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;