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
  // Extend with more updatable fields if needed
}

const PAGE_SIZE = 10;

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

export const updateOrder = async (orderId: number, orderData: OrderUpdateInput) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { order_id: orderId },
      data: {
        total_amount: orderData.total_amount,
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
