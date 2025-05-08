import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div style={{ padding: '20px' }}>
    <h1>Welcome to the Home Page</h1>
    <p>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </p>
  </div>
);

export default Home;
