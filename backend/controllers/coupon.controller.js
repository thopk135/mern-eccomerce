import Coupon from "../models/coupon.model.js";

export const getCoupon = async(req,res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id , isActive:true });
        res.json(coupon||null);
    } catch (error) {
        console.log("Error in getCoupon",error.message);
        res.status(500).json({ message: error.message });
    }
}

export const validateCoupon = async(req,res) => {
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code:code, userId: req.user._id, isActive:true});
        if(!coupon) return res.status(404).json({message:"Coupon not found"});

        if(coupon.expirationDate < new Date()) {
            return res.status(400).json({message:"Coupon has expired"
            });
        }
        res.json({message:"Coupon is valid",
            code:coupon.code,
            discountPercent: coupon.discountPercent,});
    } catch (error) {
        console.log("Error in validateCoupon",error.message);
        res.status(500).json({ message: error.message });
    }
}