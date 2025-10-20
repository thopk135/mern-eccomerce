import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const productIds = req.user.cartItems.map(item => item.product);
        // tìm sản phẩm theo id
        const products = await Product.find({ _id: { $in: productIds } });
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(item => item.product.toString() === product._id.toString());
            return { ...product.toJSON(), quantity: item ? item.quantity : 0 };
        } )
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ product: productId });
        }
        await user.save();
        res.status(200).json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeAllFromCart = async(req,res) => {
    try {
        const user = req.user;
        const {productId} = req.body;
        if(!productId)
        {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
        }
        await user.save();
        res.status(200).json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const {id:productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        
        if(existingItem){
            if(quantity===0)
            {
                user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
                await user.save();
                return res.json(user.cartItems);
            }
            existingItem.quantity = quantity;
            await user.save();
            return res.json(user.cartItems);
        } else{
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}