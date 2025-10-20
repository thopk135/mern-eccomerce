import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, ShoppingBasket, ChartBar } from 'lucide-react'
import { CreateProductForm } from '../components/CreateProductForm.jsx'
import { ProductsList } from '../components/ProductsList.jsx'
import { AnalyticsTab } from '../components/AnalyticsTab.jsx'
import { useState } from 'react'
import { useProductStore } from '../stores/useProductStrore.js';

const tabs = [
  {id:"create", label:"Create Product",icon: PlusCircle},
  {id:"products", label:"Products",icon: ShoppingBasket},
  {id:"analytics", label:"Analytics",icon: ChartBar},  
];


export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('create');

  const {fetchAllProducts} = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);
  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      <div className='relative z-10 container mx-auto px-4 py-16'>
        <motion.h1 className="text-4xl font-bold mb-8 text-emerald-400 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.8 }}>
          Admin Dashboard
        </motion.h1>

        <div className='flex justify-center mb-8'>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 
             ${activeTab === tab.id ? 'bg-emerald-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 '}`}>
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'create' && <CreateProductForm />}
        {activeTab === 'products' && <ProductsList />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  )
}
