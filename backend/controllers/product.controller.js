import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudianry.js";
import redis from "../lib/redis.js";


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if(featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }
        featuredProducts = await Product.find({ isFeatured: true }).lean();
        if(!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }
        await redis.set("featured_products", JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    let imageUrl = "";
    if (image) {
      // nếu image là base64
      const cloudinaryResponse = await cloudinary.uploader.upload(image);
      if(!cloudinaryResponse.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageUrl = cloudinaryResponse.secure_url;
    }

    const product = await Product.create({
      name,
      price,
      description,
      image: imageUrl,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(204).json();
        if(product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const product = await Product.aggregate([
            {
                $sample: { size: 3 }
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    description: 1,
                    image: 1
                }
            }
        ]);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFeaturedProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else{
            res.status(404).json({ message: "Product not found" });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.error("Error updating featured products cache:", error);
    }
}
