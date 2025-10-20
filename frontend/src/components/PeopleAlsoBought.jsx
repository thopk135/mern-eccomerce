import React, { useEffect, useState } from 'react'
import axiosInstance from '../lib/axios.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import { ProductCard } from './ProductCard';

export const PeopleAlsoBought = () => {
  const [recommendations,setRecommendations] = useState([]);
  const [isLoading,setIsLoading] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async() => {
      try {
        const res = await axiosInstance.get("/product/recommended")
        setRecommendations(res.data);
      } catch (error) {
        toast.error(error.response.data.message||"An error occured while fetching recommendations");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  },[])

  if(isLoading)  return <LoadingSpinner/>
  return (
    <div className='mt-8'>
      <h3 className="text-2xl font-semibold text-emerald-400">People also bought</h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product}/>
        ))}
      </div>
    </div>
  )
}
