import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { SignUpPage } from './pages/SignUpPage.jsx'
import { NavBar } from './components/NavBar.jsx'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/useUserStore.js'
import { LoadingSpinner } from './components/LoadingSpinner.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import { CategoryPage } from './pages/CategoryPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { useCartStore } from './stores/useCartStore.js'
import { PurchaseSuccessPage } from './pages/PurchaseSuccessPage.jsx'
import { PurchaseCancelPage } from './pages/PurchaseCancelPage.jsx'

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const {getCartItems} = useCartStore();
  const location = useLocation();

  useEffect(() => {
  checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if(user){
        getCartItems();
    }
  },[getCartItems, user]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>  
      <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute inset-0'>
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
              bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(0,0,0,0.1)_100%)]'/>
          </div>
        </div>

        <div className='relative z-50 pt-20'>
          <NavBar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={!user ? <LoginPage /> : <Navigate to={location.state?.from || "/"} />} 
            />
            <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
            <Route  path="/secret-dashboard" element={
                user 
                  ? (user.role === "admin" ? <AdminPage /> : <Navigate to="/" />)
                  : <Navigate to="/login" state={{ from: location.pathname }} />
              } 
            />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/cart" element={user? <CartPage/> : <Navigate to="/login" state={{ from: location.pathname }}/> }/>
            <Route path="/purchase-success" element={checkingAuth ? (<LoadingSpinner />) : user ? 
              (<PurchaseSuccessPage />) : 
              (<Navigate to="/login" state={{ from: location.pathname + location.search }} />)}
            />
            <Route path="/purchase-cancel" element={checkingAuth ? (<LoadingSpinner />) : user ? 
              (<PurchaseCancelPage />) : 
              (<Navigate to="/login" state={{ from: location.pathname + location.search }} />)}
            />
          </Routes>
        </div>
        <Toaster />
      </div>
    </>
  )
}

export default App
