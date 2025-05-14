//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FollowUpForm from './components/flowbit/FollowUpForm';

import MainPage from './pages/MainPage'; // Adjust the path based on where your MainPage component is located
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserTable from './pages/UserTable';
import UserLogTable from './pages/UserLogTable';
import FollowUpPage from './pages/flowbit/FollowUpPage';



function App() {
  return (
    <Router>


      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected / Layout Route with nested pages */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MainPage />} /> {/* Default content inside dashboard */}
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<UserTable />} />
          <Route path="user_log" element={<UserLogTable />} />
        </Route>

        <Route path="/mims" element={<Dashboard />}>
//          <Route index element={<MainPage />} /> {/* Default content inside dashboard */}
          <Route path="add" element={<FollowUpPage />} />

        </Route>




      </Routes>





    </Router>
  );
}

export default App;
