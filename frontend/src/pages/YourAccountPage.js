import React, { useState } from 'react';
import YourAccountComponent from '../components/YourAccountComponent';

const YourAccountPage = () => {
  const [showForm, setShowForm] = useState(true); // form is visible initially

  const handleOpen = () => setShowForm(true);
  const handleClose = () => setShowForm(false);

  return (
    <div style={{ padding: '2rem' }}>
      {showForm ? (
        <YourAccountComponent onClose={handleClose} />
      ) : (
        <button onClick={handleOpen}>Edit Account</button>
      )}
    </div>
  );
};

export default YourAccountPage;

