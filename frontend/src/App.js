//import logo from './logo.svg';
import './App.css';
import './styles/styles.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

import MainPage from './pages/MainPage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserTable from './pages/UserTable';
import UserLogTable from './pages/UserLogTable';
import YourAccountPage from './pages/YourAccountPage';

import AddProductPage from './pages/flowbit/AddProductPage';
import ProductListPage from './pages/flowbit/ProductListPage';

import NewDocumentPage from './pages/dms/NewDocumentPage';
import AllDocumentPage from './pages/dms/AllDocumentPage';




function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MainPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<UserTable />} />
          <Route path="user_log" element={<UserLogTable />} />
        </Route>

        <Route path="/mims" element={<Dashboard />}>
          <Route index element={<MainPage />} />
          <Route path="add_product" element={<AddProductPage />} />
          <Route path="products" element={<ProductListPage />} />
        </Route>

        <Route path="/dms" element={<Dashboard />}>
          <Route index element={<MainPage />} />
          <Route path="new_document" element={<NewDocumentPage />} />
          <Route path="documents" element={<AllDocumentPage />} />

        </Route>


        <Route path="/account" element={<Dashboard />}>
          <Route index element={<MainPage />} />
          <Route path="your_account" element={<YourAccountPage />} />

        </Route>




      </Routes>
    </Router>
  );
}

export default App;
