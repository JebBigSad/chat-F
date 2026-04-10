import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Chat({ token, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { matchId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [matchId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await axios.post('http://localhost:5000/api/messages', {
        match_id: parseInt(matchId),
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="header">
        <button onClick={() => navigate('/matches')}>← Back to Matches</button>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
            No messages yet. Start the conversation! 💬
          </p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}>
              <div className="message-content">{msg.message}</div>
              <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message... 💬"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;