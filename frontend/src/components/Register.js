import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/images/flowbit.png';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registration successful!');
      navigate('/login');  // Redirect to login page after successful registration
    } else {
      setError(data.error || 'An error occurred during registration');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-6 border-2 border-gray-400 rounded-lg bg-gray-100 shadow-lg font-serif">
      {/*<h2 className="text-2xl font-bold text-center mb-4">Register to MIMS</h2>*/}
      <img className="p-2 w-50 h-40 mx-auto object-contain" src={logo} alt="Logo" />
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-1/2 mx-auto block p-2 bg-gradient-to-b from-white to-gray-300 border border-gray-600 rounded font-bold hover:bg-gray-200"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">
          Already have an account?
          <Link to="/login" className="text-blue-600 hover:underline ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
