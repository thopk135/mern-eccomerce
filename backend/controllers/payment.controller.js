import Coupon from "../models/coupon.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.model.js";
import { mongoose } from 'mongoose';
import { User } from "../models/user.model.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
        const {products,couponCode} = req.body;
        if(!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({message:"No products in the cart"});
        }

        let totalAmount = 0;
        //Create line items for Stripe//
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;
        return {
            price_data: {
                currency: "usd",
                product_data:{
                    name: product.name,
                    description: product.description,
                    images: [product.image]
                },
                unit_amount: amount
            },
            quantity: product.quantity||1
            };
        });
    //Check coupon//
    let coupon = null;
    if(couponCode){
        coupon = await Coupon.findOne({code:couponCode,userId:req.user._id,isActive:true});
        if(coupon){
            totalAmount -= Math.round(totalAmount * coupon.discountPercent / 100);
        }
    }
    //Create Stripe
    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items: lineItems,
        mode:"payment",
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        discounts: coupon
        ? [{
            coupon: await createStripeCoupon(coupon.discountPercent),
        }]
        : [],
        metadata: {
            userId: req.user._id.toString(),
            couponCode: couponCode || "",
            products: JSON.stringify(
                products.map(p => ({
                    id: p._id || p.id,
                    quantity: p.quantity,
                    price: p.price,
                  }))
                )
            }
        });
        if(totalAmount>=20000){
            await createNewCoupon(req.user._id);
        }
        res.status(200).json({id:session.id, totalAmount:totalAmount/100});
    } catch (error) {
        console.log("checkout:",error)
        return res.status(500).json({message:"Internal server error"});
    }
};

async function createStripeCoupon(discount) {
    const coupon = await stripe.coupons.create({
        percent_off: discount,
        duration: 'once',
    });
    return coupon.id;
}

async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId: new mongoose.Types.ObjectId(userId) });
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercent: 10,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        userId
    })
    await newCoupon.save();
    return newCoupon;
}

export const checkoutSuccess = async(req , res) => {
    try {
        //find session
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        //disable coupon
        if(session.payment_status === "paid"){
            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate(
                    { code: session.metadata.couponCode, userId:session.metadata.userId },
                    { isActive: false },
                    { new: true }
                );
            }
        }
        //create order
        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
            user:session.metadata.userId,
            products: products.map(product => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price
            })),
            totalAmount: session.amount_total / 100,
            paymentIntent: session.payment_intent,
            stripeSessionId: session.id
        });
        await newOrder.save();
        await User.findByIdAndUpdate(session.metadata.userId, { cartItems: [] });
        res.status(200).json({message:"Order created successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}