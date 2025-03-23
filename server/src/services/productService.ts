import prisma from '../db/prisma';

export const getProducts = async () => {
  return prisma.product.findMany({
    orderBy: { product_id: 'asc' },
  });
};

export const getProductById = async (productId: number) => {
  return prisma.product.findUnique({
    where: { product_id: productId },
  });
};

export const createProduct = async (product_name: string, price: number, stock?: number) => {
  return prisma.product.create({
    data: { product_name, price, stock: stock ?? 0 },
  });
};

export const updateProduct = async (productId: number, product_name?: string, price?: number, stock?: number) => {
  return prisma.product.update({
    where: { product_id: productId },
    data: { product_name, price, stock },
  });
};

export const deleteProduct = async (productId: number) => {
  return prisma.product.delete({
    where: { product_id: productId },
  });
};
