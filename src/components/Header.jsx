import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] px-4'>
      
      {/* Profile Image */}
      <div className='mb-8'>
        <img 
          src={assets.header_img} 
          alt='Profile' 
          className='w-28 h-28 rounded-full border-4 border-white shadow-md'
        />
      </div>
      
      {/* Greeting */}
      <div className='flex items-center gap-3 mb-4'>
        <h1 className='text-2xl font-semibold text-gray-800'>
          Hello Todo Master
        </h1>
        <img 
          className='w-7 h-7'
          src={assets.hand_wave} 
          alt='👋'
        />
      </div>
      
      {/* Main Title */}
      <h2 className='text-4xl font-bold text-gray-900 mb-6 text-center'>
        Manage Your Daily<br />
        <span className='text-blue-600'>Tasks Easily</span>
      </h2>
      
      {/* Description */}
      <p className='text-gray-600 text-center mb-10 max-w-sm'>
        Add, organize, and complete your tasks with our simple todo app.
      </p>
      
      {/* Quick Stats */}
      <div className='flex gap-8 mb-12'>
        <div className='text-center'>
          <div className='text-3xl font-bold text-blue-600'>+</div>
          <div className='text-sm text-gray-500'>Add Task</div>
        </div>
        <div className='text-center'>
          <div className='text-3xl font-bold text-green-600'>✓</div>
          <div className='text-sm text-gray-500'>Mark Done</div>
        </div>
        <div className='text-center'>
          <div className='text-3xl font-bold text-purple-600'>📋</div>
          <div className='text-sm text-gray-500'>Organize</div>
        </div>
      </div>
      
      {/* Divider */}
      <div className='w-24 h-1 bg-gray-200 rounded-full mb-8'></div>
      
      {/* Tagline */}
      <p className='text-gray-500 text-sm'>
        Start by adding your first task
      </p>
    </div>
  )
}

export default Header