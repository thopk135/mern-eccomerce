import mongoose from "mongoose"

const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
    },
    discountPercent:{
        type:Number,
        min:0,
        max:100,
        required:true
    },
    expirationDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
        unique:true,
    }
}, {timestamps:true})

const Coupon = new mongoose.model("Coupon", couponSchema)

export default Coupon