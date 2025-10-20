import {create} from "zustand"
import axiosInstance from "../lib/axios.js"
import toast from "react-hot-toast"

export const useCartStore = create((set,get) => ({
    cart:[],
    coupon:null,
    total:0,
    subtotal:0,
    loading:false,
    isCouponApplied:false,

    getCartItems : async() => {
        try {
            const res = await axiosInstance.get("/cart");
            set({cart:res.data});
            get().calculateTotals();
        } catch (error) {
            set({cart:[]});
            const status = error.response?.status; 
            if (status !== 401 && status !== 403) {
                toast.error(error.response?.data.message || "An error occurred");
            } 
        }
    },

    AddtoCart : async(product) => {
        try {
            await axiosInstance.post("/cart",{productId:product._id});
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find((item)=> item._id===product._id);
                const newCart = existingItem 
                ? prevState.cart.map((item) => (item._id===product._id ? {...item, quantity: item.quantity+1} : item))
                : [...prevState.cart, {...product, quantity:1}];
                return {cart: newCart};
            })
            get().calculateTotals();
        } catch (error) {
            toast.error(error.res.data.message||"An error occurred");
        }
    },
    removeFromCart : async (productId) => {
        await axiosInstance.delete(`/cart`,{data:{productId}});
        set((prevState) => ({
            cart:prevState.cart.filter((item) => item._id != productId)
        }))
        get().calculateTotals()
    },
    updateQuantity : async (productId,quantity) => {
        if(quantity===0){
            get().removeFromCart(productId);
            return
        }

        await axiosInstance.put(`/cart/${productId}`,{quantity});
        set((prevState) => ({
            cart:prevState.cart.map((item) => item._id===productId ? {...item, quantity} : item),
        }))
        get().calculateTotals();
    },
    calculateTotals : () => {
        const {cart, coupon} = get();
        const subtotal = cart.reduce((sum,item) => sum +item.price*item.quantity,0);
        let total = subtotal;

        if(coupon){
            const discount = subtotal*(coupon.discountPercent/100);
            total = subtotal - discount;
        }
        set({subtotal,total});
    },
    clearCart : async() => {
        set({cart: [], coupon:null , total:0, subtotal:0})
    },

    getMyCoupon : async () => {
        try {
            const res = await axiosInstance.get("/coupon");
            set({coupon:res.data});
        } catch (error) {
            console.error("Error fetching coupon:",error)
        }
    },
    applyCoupon : async (code) => {
        try {
            const res = await axiosInstance.post('/coupon/validate',{code});
            set ({coupon:res.data,isCouponApplied:true});
            get().calculateTotals();
            toast.success("Coupon applied successfully!!!");
        } catch (error) {
            toast.error(error.res?.data?.message||"Failed to apply coupon");
        }
    },
    removeCoupon: () => {
        const currentCoupon = get().coupon; // giữ lại coupon hiện tại
        set({ isCouponApplied: false, coupon: currentCoupon });
        get().calculateTotals();
        toast.success("Coupon removed");
    }

}))