//import logo from './logo.svg';
import './App.css';
import './styles/styles.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
// import YourAccount from './components/YourAccountComponent';


// import FollowUpForm from './components/flowbit/FollowUpForm';



import MainPage from './pages/MainPage'; // Adjust the path based on where your MainPage component is located
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserTable from './pages/UserTable';
import UserLogTable from './pages/UserLogTable';
import YourAccountPage from './pages/YourAccountPage';

import AddProductPage from './pages/flowbit/AddProductPage';




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


          <Route path="add_product" element={<AddProductPage />} />

</Route>
        <Route path="/account" element={<Dashboard />}>
//          <Route index element={<MainPage />} /> {/* Default content inside dashboard */}
          <Route path="your_account" element={<YourAccountPage />} />

        </Route>




      </Routes>
    </Router>
  );
}

export default App;
