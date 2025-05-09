
import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <Sidebar>
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <p className="mt-4">This is the main content area.</p>
    </Sidebar>
  );
};

export default Dashboard;
