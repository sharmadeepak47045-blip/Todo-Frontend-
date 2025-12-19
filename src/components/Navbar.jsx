import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate();

  return (
    <div className='w-full fixed top-0 left-0 z-50 bg-white shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='flex justify-between items-center py-4'>
          
          {/* Logo - Clickable for home */}
          <div 
            onClick={() => nav('/')}
            className='cursor-pointer hover:opacity-80 transition-opacity'
          >
            <img 
              src={assets.logo} 
              alt='Logo' 
              className='w-32 sm:w-36 md:w-40 h-auto' 
            />
          </div>

          {/* Login Button */}
          <button
            onClick={() => nav('/login')}
            className='flex items-center gap-2 bg-blue-600 text-white rounded-full px-5 sm:px-6 py-2.5 sm:py-3 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg'
          >
            <span className='text-sm sm:text-base font-medium'>Login</span>
            <img 
              src={assets.arrow_icon} 
              alt='Arrow' 
              className='w-4 h-4 filter invert brightness-0' 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;