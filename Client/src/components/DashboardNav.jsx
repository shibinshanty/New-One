import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white shadow-lg animate-gradient-x">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold tracking-wide mb-3 sm:mb-0 drop-shadow-lg">
          Sensor Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row sm:space-x-8 text-lg font-semibold space-y-2 sm:space-y-0">
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300">
            Dashboard
          </button>
          <button onClick={() => navigate('/flowchart')} className="px-4 py-2 rounded-lg hover:bg-white hover:text-pink-700 transition duration-300">
            Edit Flowchart
          </button>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg hover:bg-white hover:text-red-600 transition duration-300">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;


