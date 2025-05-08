import React from 'react';

export default function Sidebar() {
  return (
    <div style={{ width: '200px', float: 'left', background: '#eee', height: '100vh', padding: '10px' }}>
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/">Home</a></li>
      </ul>
    </div>
  );
}
