import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Add this

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: 'Invalid server response' };
    }

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert('Login failed: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <div style={{
      maxWidth: '300px',
      margin: '100px auto',
      padding: '20px',
      border: '2px solid #aaa',
      borderRadius: '5px',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Georgia, serif',
      boxShadow: '2px 2px 8px rgba(0,0,0,0.2)'
    }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: '90%',
            padding: '8px',
            margin: '8px 0',
            border: '1px solid #888',
            borderRadius: '3px'
          }}
        />
        <input
          type={showPassword ? 'text' : 'password'} // 👈 Toggle type
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '90%',
            padding: '8px',
            margin: '8px 0',
            border: '1px solid #888',
            borderRadius: '3px'
          }}
        />
        <div style={{ margin: '8px 0', fontSize: '14px' }}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword" style={{ marginLeft: '5px' }}>Show password</label>
        </div>
        <button
          type="submit"
          style={{
            width: '50%',
            margin: '18px 0',
            padding: '10px',
            background: 'linear-gradient(to bottom, #fff, #ccc)',
            border: '1px solid #666',
            borderRadius: '3px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
