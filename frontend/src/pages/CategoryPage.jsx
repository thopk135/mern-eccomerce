import React, { useEffect } from 'react'
import { useProductStore } from '../stores/useProductStrore.js'
import {useParams} from 'react-router-dom'
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard.jsx';

export const CategoryPage = () => {
  const {fetchProductsByCategory, products, loading} = useProductStore();
  const {categoryId} = useParams();
  useEffect(() => {
    fetchProductsByCategory(categoryId);
  }, [fetchProductsByCategory,categoryId]);
  console.log("products:", products);
  return (
    <div className='min-h-screen'>
      <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg-px-8 py-16'>
        <motion.h1
          className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
          initial={{opacity:0, y: -20}}
          animate={{opacity:1, y:0}}
          transition={{duration: 0.8}}>
            {categoryId.charAt(0).toUpperCase()+categoryId.slice(1)}
        </motion.h1>

        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.8,delay:0.2}}>
            {loading ? (
              <h2 className='text-2xl font-semibold text-gray-400 text-center col-span-full'>
                Loading products...
              </h2>
            ) : products?.length === 0 ? (
              <h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
                No products found
              </h2>
            ) : (
              products?.map((p) => <ProductCard key={p._id} product={p} />)
            )}
        </motion.div>
      </div>
    </div>
  )
}
