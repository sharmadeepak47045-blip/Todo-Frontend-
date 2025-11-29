import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // ✅ Check active page
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="flex flex-col md:flex-row justify-between items-center bg-indigo-900 text-white py-4 px-4 md:px-6 shadow-lg w-full">
        {/* Logo and Navigation Container */}
        <div className="flex justify-between items-center w-full md:w-auto">
          {/* Logo */}
          <div 
            className="logo cursor-pointer flex items-center gap-2" 
            onClick={() => navigate("/home")}
          >
            <span className="font-bold text-xl sm:text-2xl">iTask</span>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex gap-4 lg:gap-8">
              {/* Home Button */}
              <li
                onClick={() => navigate("/home")}
                className={`cursor-pointer transition-all duration-300 relative px-4 py-2 lg:px-6 lg:py-3 rounded-lg ${
                  isActive("/home") 
                    ? "bg-white text-indigo-900 font-bold shadow-lg animate-pulse" 
                    : "text-gray-300 hover:text-white hover:bg-indigo-700"
                }`}
              >
                <span className="font-semibold text-sm lg:text-base">Home</span>
                {isActive("/home") && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                )}
              </li>

              {/* Your Tasks Button */}
              <li
                onClick={() => navigate("/todo")}
                className={`cursor-pointer transition-all duration-300 relative px-4 py-2 lg:px-6 lg:py-3 rounded-lg ${
                  isActive("/todo") 
                    ? "bg-white text-indigo-900 font-bold shadow-lg animate-pulse" 
                    : "text-gray-300 hover:text-white hover:bg-indigo-700"
                }`}
              >
                <span className="font-semibold text-sm lg:text-base">Your Tasks</span>
                {isActive("/todo") && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                )}
              </li>
            </ul>

            {/* Logout Button */}
            <button
              onClick={confirmLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 lg:px-5 lg:py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg text-sm lg:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Stacked layout */}
        <div className="flex flex-col gap-3 w-full mt-4 md:hidden">
          <div className="flex gap-3 w-full">
            {/* Home Button */}
            <div
              onClick={() => navigate("/home")}
              className={`cursor-pointer transition-all duration-300 relative flex-1 text-center py-3 rounded-lg ${
                isActive("/home") 
                  ? "bg-white text-indigo-900 font-bold shadow-lg animate-pulse" 
                  : "text-gray-300 hover:text-white hover:bg-indigo-700"
              }`}
            >
              <span className="font-semibold">Home</span>
              {isActive("/home") && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              )}
            </div>

            {/* Your Tasks Button */}
            <div
              onClick={() => navigate("/todo")}
              className={`cursor-pointer transition-all duration-300 relative flex-1 text-center py-3 rounded-lg ${
                isActive("/todo") 
                  ? "bg-white text-indigo-900 font-bold shadow-lg animate-pulse" 
                  : "text-gray-300 hover:text-white hover:bg-indigo-700"
              }`}
            >
              <span className="font-semibold">Your Tasks</span>
              {isActive("/todo") && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              )}
            </div>
          </div>

          {/* Logout Button - Full width on mobile */}
          <button
            onClick={confirmLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg w-full"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Logout Confirmation Modal - Responsive */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm sm:max-w-md text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Logout</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
            <div className="flex flex-col sm:flex-row justify-around gap-3 sm:gap-4">
              <button
                onClick={cancelLogout}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-bold transition-all flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-bold transition-all flex-1"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;