import React from 'react';
import logo from '../assets/images/flowbit.png';

const MainPage = () => {
  return (
    <div className="w-full flex justify-center items-center bg-gray-200">
      <img className="max-w-[50%] max-h-[50%] object-contain" src={logo} alt="Logo" />
    </div>
  );
};

export default MainPage;

