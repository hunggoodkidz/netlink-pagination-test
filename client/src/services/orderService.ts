import api from '../utils/api';

export interface OrderProduct {
  order_product_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    product_id: number;
    product_name: string;
    price: number;
    stock: number;
    created_at: string;
  };
}

export interface Order {
  order_id: number;
  user_id: number;
  order_date: string;
  total_amount: number | null;
  orderProducts: OrderProduct[];
}

export interface PaginatedOrders {
  data: Order[];
  nextCursor: number | null;
}

export interface OrderProductCreatePayload {
  product_id: number;
  quantity?: number;
  price: number;
}

export interface OrderCreatePayload {
  user_id: number;
  total_amount?: number;
  orderProducts: OrderProductCreatePayload[];
}

export interface OrderUpdatePayload {
  total_amount?: number;
  // Add more updatable fields if needed.
}

// Fetch orders with optional filtering by userId and cursor-based pagination.
export const fetchOrders = async (userId?: number, cursor?: number): Promise<PaginatedOrders> => {
  const params: { userId?: number; cursor?: number } = {};
  if (userId !== undefined) params.userId = userId;
  if (cursor !== undefined) params.cursor = cursor;
  const response = await api.get<PaginatedOrders>('api/orders', { params });
  return response.data;
};

// Fetch a single order by id.
export const fetchOrderById = async (id: number): Promise<Order> => {
  const response = await api.get<Order>(`api/orders/${id}`);
  return response.data;
};

// Create a new order.
export const createOrder = async (orderData: OrderCreatePayload): Promise<Order> => {
  const response = await api.post<Order>('api/orders', orderData);
  return response.data;
};

// Update an order.
export const updateOrder = async (id: number, orderData: OrderUpdatePayload): Promise<Order> => {
  const response = await api.put<Order>(`api/orders/${id}`, orderData);
  return response.data;
};

// Delete an order.
export const deleteOrder = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`api/orders/${id}`);
  return response.data;
};

// Fetch the latest order (with product details) for a given user.
export const fetchLatestOrder = async (userId: number): Promise<Order> => {
  const response = await api.get<Order>('api/orders/latest', { params: { userId } });
  return response.data;
};
