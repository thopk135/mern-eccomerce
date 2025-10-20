import express from 'express';
import { getAllProducts,getFeaturedProducts,createProduct,deleteProduct,getRecommendedProducts,getFeaturedProductsByCategory,toggleFeaturedProduct} from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getFeaturedProductsByCategory);
router.get('/recommended', getRecommendedProducts);
router.post('/create', protectRoute, adminRoute, createProduct);
router.patch('/:id/toggle-featured', protectRoute, adminRoute, toggleFeaturedProduct);
router.delete('/:id', protectRoute, adminRoute, deleteProduct);


export default router;
