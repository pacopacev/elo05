import React from 'react';
import DropdownImage from './DropdownImage';
import { Link, Outlet } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans border-2 border-gray-400 rounded-sm bg-gray-100 shadow-lg">
      {/* Header */}
    <header className="bg-blue-600 text-white p-3 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">MIMS Dashboard</h1>
        <div className="ml-auto"> {/* This ensures the dropdown aligns to the right */}
          <DropdownImage />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-6 space-y-4 border-2 border-gray-400 rounded-sm bg-gray-100 shadow-lg">
          <nav className="space-y-2">

            <Link to="profile" className="block hover:text-yellow-300">Profile</Link>
<Link to="settings" className="block hover:text-yellow-300">Settings</Link>
            <Link to="/" className="block hover:text-yellow-300">Logout</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 border-2 border-gray-400 rounded-sm bg-gray-100 shadow-lg">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 p-1 text-sm text-gray-600 border-2 border-gray-400 rounded-sm bg-gray-100 shadow-lg">
        &copy; {new Date().getFullYear()} <strong>MIMS.</strong> All rights reserved.
      </footer>
    </div>
  );
};

export default Sidebar;
