import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Loader, Plus, Upload } from 'lucide-react';
import { useProductStore } from '../stores/useProductStrore.js';
import { Star, Trash } from 'lucide-react';


export const ProductsList = () => {
  const {deleteProduct, toggleFeaturedProduct,products,fetchAllProducts} = useProductStore();
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <motion.div
      className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >   
      <table className='min-w-full divide-y divide-gray-700'> 
        <thead className='bg-gray-900'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>PRODUCT</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>PRICE</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>CATEGORY</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>FEATURED</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>ACTIONS</th>
          </tr>
        </thead>
        
        <tbody className='bg-gray-800 divide-y divide-gray-700'>
          {products.map((product) => (
            <tr key={product._id}>

              {/* Product Image and Name */}
              <td className='px-6 py-4 whitespace-nowrap flex items-center space-x-4'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 h-10 w-10 '>
                    <img src={product.image} alt={product.name} className='h-10 w-10 object-cover rounded-full' />
                  </div>
                </div>
                <div>
                  <div className='text-sm font-medium text-white'>{product.name}</div>
                </div>
              </td>

              {/* Product Price */}
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.price.toFixed(2)}$</div>
              </td>

              {/* Product Category */}
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.category}</div>
              </td>

              {/* Featured Toggle */}
              <td className='px-6 py-4 whitespace-nowrap'>
                <button onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-1 rounded ${product.isFeatured ? "bg-yellow-400 text-gray-900": "bg-gray-600 text-gray-300"} 
                  hover:bg-yellow-500 hover:text-white transition-colors duration-200 rounded-full`}>
                    <Star className='h-4 w-4' />
                </button>
              </td>

              {/* Delete Button */}
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <button onClick={() => deleteProduct(product._id)} className='text-red-600 hover:text-red-500'>
                  <Trash className='h-4 w-4' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      

    </motion.div>
  )
}
