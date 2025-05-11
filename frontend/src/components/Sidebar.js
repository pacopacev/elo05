import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import DropdownImage from './DropdownImage';  // Assuming you have this component

const Sidebar = () => {
  const [menuData, setMenuData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    fetch('http://localhost:8000/api/menu/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`, // Send the token in the Authorization header
      },
    })
      .then(res => res.json())
      .then(data => {
        setMenuData(data);
      })
      .catch(error => console.error('Error:', error));
  } else {
    console.log('No token found!');
    // Handle the absence of token (e.g., redirect to login page)
  }
}, []);

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const renderMenu = (items) => (
    <ul className="space-y-2">
      {items.map(item => (
        <li key={`menu-${item.id}`}>
          <div className="flex items-center justify-between">
            <Link to={item.route || '#'} className="block text-white hover:text-yellow-300">
              {item.icon && <i className={`${item.icon} mr-2`}></i>}
              {item.title}
            </Link>

            {item.children && item.children.length > 0 && (
              <button
                onClick={() => toggleMenu(item.id)}
                className="text-white text-sm ml-2"
                aria-expanded={openMenu === item.id}
                aria-controls={`submenu-${item.id}`}
              >
                {openMenu === item.id ? '−' : '+'}
              </button>
            )}
          </div>

          {item.children && item.children.length > 0 && openMenu === item.id && (
            <ul id={`submenu-${item.id}`} className="ml-4 mt-1 text-sm text-gray-300">
              {renderMenu(item.children)}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col min-h-screen font-sans border-2 border-gray-500 rounded-sm bg-gray-100 shadow-lg">
      {/* Header */}
      <header className="bg-gray-200 shadow-lg text-black p-1 flex justify-between items-center">
        <h1 className="text-sm font-bold">Flowbit Dashboard</h1>
        <div className="ml-auto">
          <DropdownImage />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-4 border-2 border-gray-500 rounded-sm shadow-lg text-sm">
          <nav>
            {Array.isArray(menuData) && menuData.length > 0 ? (
              renderMenu(menuData)
            ) : (
              <p className="text-white">No menu available</p>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="bg-gray-200 flex-1 p-6 border-2 border-gray-500 rounded-sm shadow-lg">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 p-1 text-sm text-gray-600 border-2 border-gray-500 rounded-sm shadow-lg">
        &copy; {new Date().getFullYear()} <strong>Flowbit.</strong> All rights reserved.
      </footer>
    </div>
  );
};

export default Sidebar;
