import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    cartItems:[{
        quantity: {
            type: Number,
            default: 1,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    }],
    role:{
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    }
},
{
    timestamps: true,
});

export const User = mongoose.model("User", userSchema);

export default User;
