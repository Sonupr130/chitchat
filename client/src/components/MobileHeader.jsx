import React from 'react';

const MobileHeader = ({ onMenuClick }) => {
  return (
    <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between md:hidden">
      <h1 className="text-xl font-semibold text-gray-800">Chat App</h1>
      <button onClick={onMenuClick} className="text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export default MobileHeader;