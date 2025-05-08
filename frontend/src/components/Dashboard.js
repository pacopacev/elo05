import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/dashboard/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '220px', padding: '20px' }}>
        <h1>Dashboard</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}
