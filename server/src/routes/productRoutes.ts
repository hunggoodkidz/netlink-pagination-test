import { Router } from 'express';
import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController
} from '../controllers/productController';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

// Apply cache middleware to the GET routes (cache for 60 seconds, for example)
router.get('/', cacheMiddleware(60), getProductsController);
router.get('/:id', cacheMiddleware(60), getProductByIdController);

router.post('/', createProductController);
router.put('/:id', updateProductController);
router.delete('/:id', deleteProductController);

export default router;
