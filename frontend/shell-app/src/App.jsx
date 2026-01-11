import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  // 1. WebSocket Listener (Backend -> Frontend)
  useEffect(() => {
    if (!token) return;
    const socket = io('http://localhost:4003');
    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
    return () => socket.disconnect();
  }, [token]);

  // 2. Broadcast Token to Micro-Frontend (Shell -> Order-App)
  useEffect(() => {
    const iframe = document.querySelector('iframe');
    if (iframe && token) {
      iframe.contentWindow.postMessage({ type: 'SET_TOKEN', token }, 'http://localhost:5174');
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/login');
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
    } catch (err) {
      alert("Login failed - Is Gateway running?");
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:3000/profile/1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      alert("Unauthorized - Try logging in again");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Generic Gaming Laptop Order Placer</h1>
      
      {!token ? (
        <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>Login to System</button>
      ) : (
        <div>
          <p>Status: Logged in</p>
          <button onClick={fetchProfile}>See your Profile</button>
          {user && <pre style={{ background: '#333', padding: '10px' }}>{JSON.stringify(user, null, 2)}</pre>}
        </div>
      )}

      <hr />
      <h3>Live Notifications</h3>
      <div style={{ background: 'white', color: 'black', padding: '10px', minHeight: '100px', borderRadius: '5px' }}>
        {notifications.length === 0 && <p>Waiting for orders...</p>}
        {notifications.map((n, i) => (
          <div key={i} style={{ borderBottom: '1px solid #ccc', padding: '5px' }}>
            <strong>{n.title}</strong>: {n.message}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Order here:</h2>
        <iframe 
          src="http://localhost:5174" 
          style={{ width: '100%', height: '300px', border: '2px dashed #666', borderRadius: '10px' }} 
          title="Order MFE"
        />
      </div>
    </div>
  );
}

export default App;