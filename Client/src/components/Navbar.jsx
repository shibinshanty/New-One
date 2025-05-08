import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white shadow-lg animate-gradient-x">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-3xl font-extrabold tracking-wide mb-3 sm:mb-0">
          <Link to="/" className="hover:text-white drop-shadow-lg transition duration-300 ease-in-out">
            🌟 New One
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-8 text-lg font-semibold space-y-2 sm:space-y-0">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300">
                <FaUser /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white hover:text-red-600 transition duration-300"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white hover:text-pink-700 transition duration-300">
                <FaSignInAlt /> Login
              </Link>
              <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white hover:text-yellow-600 transition duration-300">
                <FaUserPlus /> Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


