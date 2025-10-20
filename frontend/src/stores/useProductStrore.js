import {create} from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios.js';
export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/product/create", productData);
            // Add new product to products array
            set((prevState) => ({ 
                products: [...prevState.products, res.data], 
                loading: false 
            }));
            toast.success("Product created successfully");
        } catch (error) {
            set({ loading: false });
            toast.error("Failed to create product");
        }
    },
    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/product");
            set({ products: res.data.products, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
            toast.error("Failed to fetch products");
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true });
        const confirmDelete = window.confirm("Do you want to delete this product?");
        if (!confirmDelete) return;
        try {
            const res = await axiosInstance.delete(`/product/${productId}`);
            // Remove product from products array
            set((prevState) => ({
                products: prevState.products.filter(product => product._id !== productId),
                loading: false
            }));
            toast.success("Product deleted successfully");
        } catch (error) {
            set({ loading: false });
            toast.error("Failed to delete product");
        }
    },
    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.patch(`/product/${productId}/toggle-featured`);
            //update isFeatured in products array
            set((prevState) => ({
                products: prevState.products.map(product =>
                    product._id === productId ? { ...product, isFeatured: res.data.isFeatured } : product
                ),
                loading: false
            }));
            toast.success("Product featured status updated successfully");
        } catch (error) {
            set({ loading: false });
            toast.error("Failed to update product featured status");
        }
    },
    fetchProductsByCategory: async (categoryId) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get(`/product/category/${categoryId}`);
            set({ products: res.data.products, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
         
    },
    getRecommendedProduct : async (req,res) => {
        set({loading:true})
        try {
            const res = await axiosInstance.get('/product/recommended');
            set({products:res.data,loading:false});
        } catch (error) {
            set({ error: error.message, loading: false });
            toast.error("Failed to fetch recommended products");
        }
    },
    fetchFeaturedProduct : async() => {
        set({loading:true});
        try {
            const res = await axiosInstance.get('/product/featured');
            console.log(res.data)
            set({products:res.data,loading:false})
        } catch (error) {
            set({ error: error.message, loading: false });
            toast.error("Failed to fetch featured products");
        }
    }
}));