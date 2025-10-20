import React, { use } from 'react'
import { ShoppingCart,Lock, LogOut, UserPlus, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore.js'
import { useCartStore } from '../stores/useCartStore.js'

export const NavBar = () => {
  const {user,logout} = useUserStore();
  const isAdmin = user?.role === 'admin';
  const {cart} = useCartStore();
  return (
    <header className='fixed top-0 left-0 w-full bg-gray-800 bg-opacity-75 backdrop-blur-md z-40 shadow-lg 
    transition-all duration-300 border-b border-emerald-800'>
      <div className='container mx-auto px-4 py-5'>
        <div className='flex justify-between items-center'>
          <Link to='/' className='text-2xl font-semibold text-emerald-400 items-center space-x-2 flex'>
            E-commerce Store
          </Link>
          <nav className='flex flex-wrap items-center gap-4'> 
            <Link to='/' className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
            Home</Link>
            {user && (
              <Link to='/cart' className='relative group'>
                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                <span className='hidden sm:inline'>Cart</span>
                <span className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full 
                px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'>{cart.length}</span>
              </Link>
            )}

            {isAdmin && (
              <Link className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
              transition duration-300 ease-in-out flex items-center'
              to={"/secret-dashboard"} >
                <Lock className='inline-block mr-1' size={18} />
                <span className='hidden sm:inline'>Dashboard</span>
              </Link>
            )}

            {user ? (
              <button className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex
              items-center transition duration-300 ease-in-out'
              onClick={logout}>
                <LogOut className='inline-block mr-1' size={18} />
                <span className='hidden sm:inline'>Logout</span>
              </button>
            ) : (
              <>
                <Link to={"/signup"} className='bg-emerald-700 hover:bg-emerald-600 text-white py-2 px-4 rounded-md flex
                items-center transition duration-300 ease-in-out'>
                  <UserPlus className='inline-block mr-1' size={18} />
                  <span className='hidden sm:inline'>Sign Up</span>
                </Link>

                <Link to={"/login"} className='bg-emerald-700 hover:bg-emerald-600 text-white py-2 px-4 rounded-md flex
                items-center transition duration-300 ease-in-out'>
                  <LogIn className='inline-block mr-1' size={18} />
                  <span className='hidden sm:inline'>Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
