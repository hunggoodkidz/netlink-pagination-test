import { Router } from 'express';
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController
} from '../controllers/userController';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

// Apply caching to GET endpoints (optional, e.g., cache for 60 seconds)
router.get('/', cacheMiddleware(60), getUsersController);
router.get('/:id', cacheMiddleware(60), getUserByIdController);

router.post('/', createUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
