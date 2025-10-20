import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Loader, Plus, Upload } from 'lucide-react';
import { useProductStore } from '../stores/useProductStrore.js';


export const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',  
  });
  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(newProduct);
      await createProduct(newProduct);
      setNewProduct({name: '',description: '',price: '',category: '',image: "",});
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      }
      reader.readAsDataURL(file);
    }
  };

  return (
      <motion.div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        
          <h2 className=' text-2xl font-bold text-emerald-600 px-0 py-0 pb-4'>Create New Product</h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/** Product Name Field */}
            <div>
              <label htmlFor="name" className='block text-sm font-medium text-gray-300 top-2 '>
                Product Name
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <input
                  type="text"
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className='block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  required
                />
              </div>
            </div>
            {/**Description Field */}
            <div>
              <label htmlFor="description" className='block text-sm font-medium text-gray-300'>
                Description
              </label>
              <div className='mt-1'>
                <textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className='block w-full px-3 py-2  bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  required
                />
              </div>
            </div>
            {/** Price Field */}
            <div>
              <label htmlFor="price" className='block text-sm font-medium text-gray-300'>
                Price
              </label>
              <div className='mt-1'>
                <input
                  type="number"
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className='block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  required
                />
              </div>
            </div>
            {/** Select Category Field */}
            <div>
              <label htmlFor="category" className='block text-sm font-medium text-gray-300'>
                Category
              </label>
              <div className='mt-1'>
                <select
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className='block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  required
                >
                  <option value="">Select a category</option>
                  <option value="shoes">shoes</option>
                  <option value="t-shirts">t-shirt</option>
                  <option value="jeans">jean</option>
                  <option value="jackets">jacket</option>
                  <option value="suits">suit</option>
                  <option value="glasses">glasses</option>
                  <option value="bags">bag</option>
                </select>
              </div>
            </div>
            {/**Upload Image Field */}
            <div>
              <input type="file" id='image' className='sr-only' accept='image/*' 
              onChange={handleImageChange}/>
              <label 
                htmlFor="image" 
                className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm
                text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                required
              >
                <Upload className='h-5 w-5 inline-block mr-2 mb-2' />
                Upload Image
              </label>
              {newProduct.image && <span className='text-sm text-gray-400 ml-2'>Image uploaded</span>}
            </div>
            {/** Submit Button */}
            <button 
              type="submit"
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md
              shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 
              transition duration-150 ease-in-out'
              disabled={false}
            >
              {loading ? (
                <>
                  <Loader className='mr-2 h-5 w-5 animate-spin'
                  aria-hidden='true'></Loader>
                  <span className='text-gray-200'>Loading . . .</span>
                </>
              ) : (
                <>
                  <Plus className='mr-2 h-5 w-5' aria-hidden='true' />
                  <span className='text-gray-200'>Create Product</span>
                </>
              )}
            </button>
          </form>
      </motion.div>
  )
}
