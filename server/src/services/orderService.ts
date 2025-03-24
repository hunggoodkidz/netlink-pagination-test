import prisma from '../db/prisma';

export interface OrderProductCreateInput {
  product_id: number;
  quantity?: number; // defaults to 1 if not provided
  price: number;
}

export interface OrderCreateInput {
  user_id: number;
  total_amount?: number;
  orderProducts: OrderProductCreateInput[];
}

export interface OrderUpdateInput {
  total_amount?: number;
  // Extend with additional updatable fields if needed
}

export interface LatestOrderWithProduct {
  order_id: number;
  order_date: Date;
  total_amount: number | null;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

const PAGE_SIZE = 10;

// Fetch orders with optional filtering by user and cursor-based pagination.
export const getOrders = async (userId?: number, cursor?: number) => {
  const whereClause = userId ? { user_id: userId } : undefined;
  
  const orders = await prisma.order.findMany({
    where: whereClause,
    take: PAGE_SIZE,
    ...(cursor ? { skip: 1, cursor: { order_id: cursor } } : {}),
    orderBy: { order_date: 'desc' },
    include: {
      orderProducts: {
        include: { product: true },
      },
    },
  });
  
  const nextCursor = orders.length > 0 ? orders[orders.length - 1].order_id : null;
  return { data: orders, nextCursor };
};

// Fetch a single order by its ID, including its product details.
export const getOrderById = async (orderId: number) => {
  return prisma.order.findUnique({
    where: { order_id: orderId },
    include: {
      orderProducts: {
        include: { product: true },
      },
    },
  });
};

// Create a new order along with its associated orderProducts.
export const createOrder = async (orderData: OrderCreateInput) => {
  return prisma.order.create({
    data: {
      user_id: orderData.user_id,
      total_amount: orderData.total_amount,
      orderProducts: {
        create: orderData.orderProducts.map(op => ({
          product_id: op.product_id,
          quantity: op.quantity ?? 1,
          price: op.price,
        })),
      },
    },
    include: {
      orderProducts: {
        include: { product: true },
      },
    },
  });
};

// Update an existing order's top-level fields.
export const updateOrder = async (orderId: number, orderData: OrderUpdateInput) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { order_id: orderId },
      data: {
        total_amount: orderData.total_amount,
        // Add additional fields to update if needed.
      },
      include: {
        orderProducts: {
          include: { product: true },
        },
      },
    });
    return updatedOrder;
  } catch (error) {
    console.error('Error in updateOrder:', error);
    return null;
  }
};

// Delete an order by its ID.
export const deleteOrder = async (orderId: number) => {
  try {
    return await prisma.order.delete({
      where: { order_id: orderId },
    });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    return null;
  }
};


// Existing functions (getOrders, getOrderById, etc.) go here...

/**
 * Fetches the latest order (with product details) for a given user using a raw SQL query.
 * Note: Since the Prisma model is "Order", the actual table name in PostgreSQL is "Order".
 *       Because "Order" is a reserved word, we need to quote it.
 */

export const getLatestOrderRaw = async (userId: number): Promise<LatestOrderWithProduct | null> => {
  const result = await prisma.$queryRaw<LatestOrderWithProduct[]>`
    SELECT 
      o.order_id,
      o.order_date,
      o.total_amount,
      p.product_id,
      p.product_name,
      p.price,
      op.quantity
    FROM "Order" o
    JOIN "OrderProduct" op ON o.order_id = op.order_id
    JOIN "Product" p ON op.product_id = p.product_id
    WHERE o.user_id = ${userId}
    ORDER BY o.order_date DESC
    LIMIT 1;
  `;
  return result.length > 0 ? result[0] : null;
};