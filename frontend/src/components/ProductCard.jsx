import React from 'react'
import toast from 'react-hot-toast'
import { ShoppingCart } from 'lucide-react';
import { useUserStore } from './../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';


export const ProductCard = ({product}) => {
    const {user} = useUserStore();
    const {AddtoCart} = useCartStore();
    const handleAddToCard = () => {
        if(!user){
            toast.error("Please login to add product to cart");
        } else{
            AddtoCart(product);
        }
    }
  return (
    <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
        <div className='relative mx-3 mt-3 flex h-70 overflow-hidden rounded-xl'>
            <img src={product.image} alt={product?.name} className='object-cover w-full' />
            
        </div>

        <div className='mt-4 px-5 pb-5'>
            <h5 className='text-xl font-semibold tracking-tight text-white'>{product?.name} </h5>
            <div className='mt-2 mb-4 flex items-center justify-between'>
                <p>
                    <span className='text-3xl font-bold text-emerald-600 '> ${product?.price}</span>
                </p>
            </div>
            <button className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
            onClick={handleAddToCard}>
                <ShoppingCart size={12} className='mr-2'/>
                Add to cart
            </button>
        </div>
    </div>
  )
}
