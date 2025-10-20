import { ShoppingCart,ChevronLeft,ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useCartStore } from './../stores/useCartStore.js';

export const FeaturedProducts = ({featuredProducts}) => {
    const [currentIndex,setCurrentIndex] = useState(0);
    const [itemsPerPage,setItemPerPage] = useState(4);
    const {AddtoCart} = useCartStore();

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth < 640) setItemPerPage(1);
            else if(window.innerWidth<1024) setItemPerPage(2);
            else if(window.innerWidth<1280) setItemPerPage(3);
            else setItemPerPage(4);
        }

        handleResize();
        window.addEventListener("resize",handleResize);
        return () => window.removeEventListener("resize",handleResize);
    },[]);

    const nextSlide = () => {
        setCurrentIndex((prevState) => prevState + itemsPerPage);
    }  
    const prevSlide = () => {
        setCurrentIndex((prevState) => prevState -itemsPerPage);
    }

    const isStartDisable = currentIndex ===0;
    const isEndDisable = currentIndex >= featuredProducts.length - itemsPerPage;
  return (
    <div className="py-12">
        <div className="container mx-auto px-4">
            <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">Featured</h2>
            <div className="relative">
                <div className="overflow-hidden">
                    <div className="flex transition-transform duration-300 ease-in-out"
                        style={{transform: `translateX(-${currentIndex*(100/itemsPerPage)}%)`}}
                    >
                        {featuredProducts?.map((product) => (
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2" key={product._id}>
                                <div className="bg-gray-800 bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full 
                                    transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
                                    <div className="overflow-hidden">
                                        <img src={product.image} alt="product.name" 
                                         className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
                                        <p className="text-emerald-300 font-medium mb-4">${product.price.toFixed(2)}</p>
                                        <button 
                                            onClick={() => AddtoCart(product)}
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded
                                            transition-colors duration-300 flex items-center justify-center">
                                            <ShoppingCart className='w-5 h-5 mr-2'/>
                                            Add to Cart
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}    
                    </div>
                </div>

                <button 
                    onClick={prevSlide}
                    disabled={isStartDisable}
                    className={`absolute top-1/2 -left-10 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 
                    ${isStartDisable ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"}`}
                >
                    <ChevronLeft className="w-6 h-6"/>
                </button>
                <button 
                    onClick={nextSlide}
                    disabled={isEndDisable}
                    className={`absolute top-1/2 -right-10 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 
                    ${isEndDisable ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"}`}
                >
                    <ChevronRight className="w-6 h-6"/>
                </button>
            </div>
        </div>
    </div>
  )
}
