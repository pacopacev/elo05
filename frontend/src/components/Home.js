import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-[500px] rounded overflow-hidden shadow-lg bg-white p-8 text-center">
      <img className="w-50 h-40 mx-auto object-contain" src={logo} alt="Logo" />
      {/* Horizontal line */}
      <hr className="my-4 border-t-4 border-blue-200" />
      <h1 className="text-2xl font-bold mb-4">You’ve Reached the Home Page</h1>
      <p className="space-x-4">
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        <span>|</span>
        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </div>
  </div>
);

export default Home;
