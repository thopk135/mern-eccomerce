import React, { useEffect } from 'react'
import { CategoryItem } from '../components/CategoryItem.jsx';
import { useProductStore } from '../stores/useProductStrore.js';
import { FeaturedProducts } from '../components/FeaturedProducts.jsx';

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];


export const HomePage = () => {
  const {fetchFeaturedProduct, products, loading} = useProductStore();
  useEffect(() => {
    fetchFeaturedProduct();
  },[fetchFeaturedProduct]);
  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 container mx-auto px-4 py-16 sm:px-6 lg:px-8'>
        <h1 className='text-center text-5xl sm:text-xl font-bold text-emerald-400 mb-4'>
          Explore Our Categories
        </h1>
        <p className='text-center text-lg sm:text-sm text-gray-300 mb-12'>
          Discover a wide range of products across various categories. Click on any category to start shopping!
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {categories.map((category) => (
            <CategoryItem key={category.name} category={category} />
          ))}
        </div>

        {!loading && products.length >0 && <FeaturedProducts featuredProducts = {products}/>}
      </div>
    </div>
  )
}
