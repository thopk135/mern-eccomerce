import Coupon from "../models/coupon.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.model.js";
import mongoose  from 'mongoose';
import { User } from "../models/user.model.js";
import Product from "../models/product.model.js";


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products in the cart" });
    }

    let totalAmount = 0;
    const lineItems = [];

    // 🔥 CHECK STOCK TRƯỚC
    for (const item of products) {
      const dbProduct = await Product.findById(item._id || item.id);

      if (!dbProduct) {
        return res.status(400).json({
          message: "Sản phẩm không tồn tại"
        });
      }

      if (dbProduct.quantity < item.quantity) {
        return res.status(400).json({
          message: `${dbProduct.name} không đủ hàng`
        });
      }

      const amount = Math.round(dbProduct.price * 100);
      totalAmount += amount * item.quantity;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: dbProduct.name,
            description: dbProduct.description,
            images: [dbProduct.image]
          },
          unit_amount: amount
        },
        quantity: item.quantity
      });
    }

    // 🔥 COUPON
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true
      });

      if (coupon) {
        totalAmount -= Math.round(totalAmount * coupon.discountPercent / 100);
      }
    }

    // 🔥 TẠO STRIPE (CHỈ KHI ĐỦ HÀNG)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercent) }]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map(p => ({
            id: p._id || p.id,
            quantity: p.quantity
          }))
        )
      }
    });

    res.status(200).json({
      id: session.id,
      totalAmount: totalAmount / 100
    });

  } catch (error) {
    console.log("checkout:", error);
    res.status(500).json({ message: "Internal server error" });
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

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Missing sessionId" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // ✅ tránh xử lý 2 lần
    const existingOrder = await Order.findOne({
      stripeSessionId: session.id
    });

    if (existingOrder) {
      return res.status(200).json({
        message: "Already processed"
      });
    }

    // ✅ parse an toàn
    let products = [];
    try {
      products = JSON.parse(session.metadata.products);
    } catch (err) {
      console.error("Parse metadata error:", err);
      return res.status(400).json({
        message: "Invalid product data"
      });
    }

    // ✅ TRỪ STOCK (KHÔNG BAO GIỜ THROW ERROR)
    for (const item of products) {
      try {
        await Product.findOneAndUpdate(
          {
            _id: item.id,
            quantity: { $gte: item.quantity }
          },
          {
            $inc: { quantity: -item.quantity }
          }
        );
      } catch (err) {
        console.log("Stock update skipped:", item.id);
      }
    }

    // ✅ disable coupon
    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: session.metadata.couponCode,
          userId: session.metadata.userId
        },
        { isActive: false }
      );
    }

    // ✅ tạo order (THÊM price để tránh lỗi schema)
    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map(p => ({
        product: p.id,
        quantity: p.quantity,
        price: p.price || 0
      })),
      totalAmount: session.amount_total / 100,
      paymentIntent: session.payment_intent,
      stripeSessionId: session.id
    });

    await newOrder.save();

    await User.findByIdAndUpdate(session.metadata.userId, {
      cartItems: []
    });

    res.status(200).json({
      message: "Order created successfully"
    });

  } catch (error) {
    console.error("checkoutSuccess error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};