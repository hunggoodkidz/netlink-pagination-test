-- Create Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Order_Products table to handle many-to-many relationship between orders and products
CREATE TABLE order_products (
    order_product_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Create indexes to optimize query performance

-- Index on orders table for filtering by user_id
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Index on orders table for sorting by order_date
CREATE INDEX idx_orders_order_date ON orders(order_date);

-- Indexes on order_products table for efficient joins
CREATE INDEX idx_order_products_order_id ON order_products(order_id);
CREATE INDEX idx_order_products_product_id ON order_products(product_id);


-- Composite index cho truy vấn lấy đơn hàng theo user và sắp xếp theo thời gian
CREATE INDEX idx_orders_user_order_date ON orders(user_id, order_date DESC);

-- Index cho total_amount (nếu cần thống kê)
CREATE INDEX idx_orders_total_amount ON orders(total_amount);

-- Index cho order_items để tối ưu JOIN
CREATE INDEX idx_order_items_product ON order_items(product_id);