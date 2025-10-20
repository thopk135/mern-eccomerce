import React from 'react'
import { motion } from 'framer-motion'
import { Loader, User, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore.js'


export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const {signup,loading} = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    signup(formData.username, formData.email, formData.password, formData.confirmPassword);
  };
  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create your account</h2>
      </motion.div>
      <motion.div
      className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}>
        <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Name */}
            <div>
              <label htmlFor="username" className='block text-sm font-medium text-gray-300'>
                Full Name
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='Full Name'
                  required
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-300'>
                Email Address
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='you@gmail.com'
                  required
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className='block text-sm font-medium text-gray-300'>
                Password
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='••••••••'
                  required
                />
              </div>
            </div>
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className='block text-sm font-medium text-gray-300'>
                Confirm Password
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type="password"
                  id="confirm-password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='••••••••'
                  required
                />
              </div>
            </div>
            {/* Submit Button */}
            <button 
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md
              shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 
              transition duration-150 ease-in-out disabled:opacity-50'
              disabled={loading}>
                {loading ? (
                  <>
                    <Loader className='mr-2 h-5 w-5 animate-spin'
                    aria-hidden='true'></Loader>
                    <span className='text-gray-200'>Loading . . .</span>
                  </>
                ):(
                  <>
                  <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' /> Sign Up
                  </>
                )}
            </button>
          </form> 
          <p className='mt-8 text-center text-sm text-gray-400'>
            Already have an account?{' '}
            <Link to='/login' className='font-medium text-emerald-500 hover:text-emerald-400'>
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
