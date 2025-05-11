import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/images/flowbit.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);  // To track if the request is in progress

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

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

    setLoading(false); // Stop loading

    if (res.ok && data.token) {
      localStorage.setItem('authToken', data.token);  // Using 'authToken' for consistency
      navigate('/dashboard');
    } else {
      alert('Login failed: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-6 border-2 border-gray-400 rounded-lg bg-gray-100 shadow-lg font-serif">
      <img className="p-2 w-50 h-40 mx-auto object-contain" src={logo} alt="Logo" />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 mb-3 border border-gray-500 rounded"
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-3 border border-gray-500 rounded"
        />
        <div className="mb-4 text-sm">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <label htmlFor="showPassword">Show password</label>
        </div>
        <button
          type="submit"
          className="w-1/2 mx-auto block p-2 bg-gradient-to-b from-white to-gray-300 border border-gray-600 rounded font-bold hover:bg-gray-200"
          disabled={loading}  // Disable button while loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm">
          Do not have an account?
          <Link to="/register" className="text-blue-600 hover:underline ml-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
