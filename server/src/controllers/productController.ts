// src/controllers/productController.ts
import { RequestHandler } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/productService';
import { redisClient } from '../middleware/cache';

export const getProductsController: RequestHandler = async (req, res, next) => {
  try {
    const products = await getProducts();
    res.json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
};

export const getProductByIdController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const product = await getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    next(error);
  }
};

export const createProductController: RequestHandler = async (req, res, next) => {
  try {
    const { product_name, price, stock } = req.body;
    const newProduct = await createProduct(product_name, price, stock);
    // Invalidate cache for the products list so the new product appears in subsequent GET requests.
    await redisClient.del(`__express__/api/products`);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
};

export const updateProductController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const { product_name, price, stock } = req.body;
    const updatedProduct = await updateProduct(productId, product_name, price, stock);
    // Invalidate caches for both the products list and the specific product.
    await redisClient.del(`__express__/api/products`);
    await redisClient.del(`__express__/api/products/${productId}`);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    next(error);
  }
};

export const deleteProductController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const deletedProduct = await deleteProduct(productId);
    // Invalidate caches for both the products list and the specific product.
    await redisClient.del(`__express__/api/products`);
    await redisClient.del(`__express__/api/products/${productId}`);
    res.json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    next(error);
  }
};
