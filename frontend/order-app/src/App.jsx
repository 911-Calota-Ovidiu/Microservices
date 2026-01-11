import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [status, setStatus] = useState('Waiting for authentication...');

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'http://localhost:5173') return;
      if (event.data.type === 'SET_TOKEN') {
        setToken(event.data.token);
        localStorage.setItem('token', event.data.token);
        setStatus('Ready to order');
      }
      
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const placeOrder = async () => {
    if (!token) {
      alert("Please login in first!");
      return;
    }

    try {
      setStatus('Processing order...');
      await axios.post('http://localhost:3000/api/orders', 
        { 
          item: 'Gaming Laptop', 
          price: 1500,
          userId: "1"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('Order Placed! Check the notifications above.');
    } catch (err) {
      setStatus('Error: ' + (err.response?.data?.error || "Check Gateway/CORS"));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ border: '2px solid orange', padding: '20px', borderRadius: '15px', backgroundColor: '#fffbe6' }}>
        <h3 style={{ color: '#d46b08' }}>Remote MFE: Order Service</h3>
        <p style={{ color: '#666' }}>{status}</p>
        <button onClick={placeOrder} style={{ backgroundColor: 'orange', border: 'none', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '5px' }}>
          Buy Gaming Laptop ($1500)
        </button>
      </div>
    </div>
  );
}

export default App;