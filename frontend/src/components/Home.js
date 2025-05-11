import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/flowbit.png';

const Home = () => (
  <div className="max-w-sm mx-auto mt-24 p-6 border-2 border-gray-400 rounded-lg bg-gray-100 shadow-lg font-serif text-center">

      <img className="w-50 h-40 mx-auto object-contain" src={logo} alt="Logo" />

      <hr className="my-4 border-t border-gray-400" />
      <h1 className="text-2xl font-bold mb-4">You’ve Reached the Home Page</h1>
      <p className="space-x-4">
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        <span>|</span>
        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>

  </div>
);

export default Home;
