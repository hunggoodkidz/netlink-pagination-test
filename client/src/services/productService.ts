import api from '../utils/api';

export interface Product {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  created_at: string;
}

export interface PaginatedProducts {
  data: Product[];
  nextCursor: number | null;
}

// Fetch all products (or use pagination if desired)
export const fetchProducts = async (): Promise<PaginatedProducts> => {
  const response = await api.get<PaginatedProducts>('api/products');
  return response.data;
};

// Fetch a single product by id
export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`api/products/${id}`);
  return response.data;
};

// Create a new product
export const createProduct = async (
  product_name: string,
  price: number,
  stock?: number
): Promise<Product> => {
  const response = await api.post<Product>('api/products', { product_name, price, stock });
  return response.data;
};

// Update an existing product
export const updateProduct = async (
  id: number,
  product_name?: string,
  price?: number,
  stock?: number
): Promise<Product> => {
  const response = await api.put<Product>(`api/products/${id}`, { product_name, price, stock });
  return response.data;
};

// Delete a product
export const deleteProduct = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`api/products/${id}`);
  return response.data;
};
