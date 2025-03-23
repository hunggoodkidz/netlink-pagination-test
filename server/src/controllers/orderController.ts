import { RequestHandler } from 'express';
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    OrderCreateInput,
    OrderUpdateInput
} from '../services/orderService';

export const getOrdersController: RequestHandler = async (req, res, next) => {
    try {
        const { userId, cursor } = req.query;
        const parsedUserId = userId ? Number(userId) : undefined;
        const parsedCursor = cursor ? Number(cursor) : undefined;
        const ordersResult = await getOrders(parsedUserId, parsedCursor);
        res.json(ordersResult);
    } catch (error) {
        console.error('Error fetching orders:', error);
        next(error);
    }
};

export const getOrderByIdController: RequestHandler = async (req, res, next) => {
    try {
        const orderId = Number(req.params.id);
        const order = await getOrderById(orderId);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        next(error);
    }
};

export const createOrderController: RequestHandler = async (req, res, next) => {
    try {
        const orderData = req.body as OrderCreateInput;
        const newOrder = await createOrder(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        next(error);
    }
};

export const updateOrderController: RequestHandler = async (req, res, next) => {
    try {
        const orderId = Number(req.params.id);
        const orderData = req.body as OrderUpdateInput;
        const updatedOrder = await updateOrder(orderId, orderData);
        if (!updatedOrder) {
            res.status(404).json({ error: 'Order not found or update failed' });
            return;
        }
        res.json(updatedOrder); // Don't "return" this value
    } catch (error) {
        console.error('Error updating order:', error);
        next(error);
    }
};
export const deleteOrderController: RequestHandler = async (req, res, next) => {
    try {
        const orderId = Number(req.params.id);
        const deletedOrder = await deleteOrder(orderId);
        if (!deletedOrder) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        next(error);
    }
};
