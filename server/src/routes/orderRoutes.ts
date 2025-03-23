import { Router } from 'express';
import {
  getOrdersController,
  getOrderByIdController,
  createOrderController,
  updateOrderController,
  deleteOrderController
} from '../controllers/orderController';

const router = Router();

// GET /api/orders?userId=<userId>&cursor=<cursor> - List orders with optional cursor-based pagination
router.get('/', getOrdersController);

// GET /api/orders/:id - Get a single order by ID
router.get('/:id', getOrderByIdController);

// POST /api/orders - Create a new order
router.post('/', createOrderController);

// PUT /api/orders/:id - Update an existing order
router.put('/:id', updateOrderController);

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', deleteOrderController);

export default router;
