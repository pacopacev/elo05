import React, { useState } from 'react';
import logo from '../assets/images/flowbit.png';

const DropdownImage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Toggle Button (Image) */}
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <img
          src={logo}
          alt="Avatar"
          className="w-7 h-7 rounded-full border-2 border-gray-300"



        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
          <a
            href="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Profile
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Settings
          </a>
          <a
            href="/"
            className="block px-4 py-2 text-red-600 hover:bg-red-100"
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default DropdownImage;
