import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaTasks, FaSignOutAlt } from "react-icons/fa";

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

  // Check active page
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="sticky top-0 z-40 flex justify-between items-center bg-gradient-to-r from-gray-800 via-teal-900 to-cyan-900 text-white py-3 px-4 md:px-8 shadow-xl backdrop-blur-sm">
        <div 
          className="logo cursor-pointer flex items-center gap-3 group" 
          onClick={() => navigate("/home")}
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 group-hover:from-teal-400 group-hover:to-cyan-400 transition-all">
            <FaTasks className="text-xl" />
          </div>
          <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
            TaskMaster
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <ul className="flex gap-1 md:gap-3">
            {/* Home Button */}
            <li
              onClick={() => navigate("/home")}
              className={`cursor-pointer transition-all duration-300 relative flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg ${
                isActive("/home") 
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-teal-800/50"
              }`}
            >
              <FaHome className="text-sm md:text-base" />
              <span className="font-semibold text-sm md:text-base hidden sm:inline">Home</span>
              {isActive("/home") && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </li>

            {/* Your Tasks Button */}
            <li
              onClick={() => navigate("/todo")}
              className={`cursor-pointer transition-all duration-300 relative flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg ${
                isActive("/todo") 
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-teal-800/50"
              }`}
            >
              <FaTasks className="text-sm md:text-base" />
              <span className="font-semibold text-sm md:text-base hidden sm:inline">Your Tasks</span>
              {isActive("/todo") && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </li>
          </ul>

          {/* Logout Button */}
          <div className="h-6 w-px bg-teal-400/30 mx-1 hidden md:block"></div>
          <button
            onClick={confirmLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg text-sm md:text-base"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-sm mx-4 text-center border border-teal-500/30 shadow-2xl animate-slideUp">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <FaSignOutAlt className="text-2xl text-red-400" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-white">Confirm Logout</h2>
            <p className="mb-6 text-gray-300">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 text-white px-4 py-3 rounded-lg font-semibold transition-all"
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