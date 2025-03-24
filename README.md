# Introduction

This is a test aim for making pagination with better optimization

### Techstack:

Front-end: React, Typescript, TailwindCSS (v4.0), Axios, Redux, react-paginate, react-window

Back-end: NodeJS, ExpressJS, Typescript, Redis, PostgreSQL, Prisma, Swagger, Middleware


### Project Structure:

```
server (Backend/)
├── .env                      # Environment variables (including DATABASE_URL)
├── package.json              # Project configuration and dependencies
├── tsconfig.json             # TypeScript configuration
├── prisma/
│   └── schema.prisma         # Prisma schema file (database models)
├── src/
│   ├── config/
│   │   └── env.ts            # Environment configuration
│   │
│   ├── controllers/          # HTTP endpoint logic
│   │   ├── userController.ts       # User-related business logic
│   │   ├── orderController.ts      # Order-related business logic
│   │   └── productController.ts    # Product-related business logic
│   │
│   ├── db/
│   │   └── prisma.ts         # Prisma client instance (exported for use in your code)
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── cache.ts          # Redis caching middleware
│   │   └── errorHandler.ts   # Centralized error handling middleware
│   │
│   ├── routes/               # API route definitions
│   │   ├── userRoutes.ts     # Routes for user-related endpoints
│   │   ├── orderRoutes.ts    # Routes for order-related endpoints
│   │   └── productRoutes.ts  # Routes for product-related endpoints
│   │
│   ├── services/             # Business logic, separate from HTTP layer
│   │   ├── userServices.ts   # User-related services
│   │   ├── orderServices.ts  # Order-related services
│   │   └── productServices.ts# Product-related services
│   │
│   ├── utils/                # Utility functions
│   │   ├── pagination.ts     # Support for cursor-based pagination
│   │   └── logger.ts         # System logging utilities
│   │
│   └── index.ts              # Main Express server entry point
└── README.md                 # Project documentation
```

## API Endpoints
Users:
```
GET /api/users?cursor=... — Paginated user list (cursor-based)

GET /api/users/:id — Get a single user

POST /api/users — Create a new user

PUT /api/users/:id — Update a user

DELETE /api/users/:id — Delete a user
```

Products:
```

GET /api/products — List products (with optional caching)

GET /api/products/:id — Get a single product

POST /api/products — Create a product

PUT /api/products/:id — Update a product

DELETE /api/products/:id — Delete a product

```

Orders:
```
GET /api/orders?userId=...&cursor=... — Paginated orders list

GET /api/orders/:id — Get a single order

GET /api/orders/latest?userId=... — Get the latest order for a user (using raw SQL)

POST /api/orders — Create an order

PUT /api/orders/:id — Update an order

DELETE /api/orders/:id — Delete an order

```

### Caching and Pagination

Caching:
Redis is used to cache GET endpoints (e.g., for products and users) to reduce database load. The cache middleware checks if a response is cached; if so, it returns the cached response. For updates, the cache is invalidated.

Pagination:
Cursor-based pagination is implemented for user and order endpoints. The API returns a nextCursor value that can be used to load subsequent pages.

## Why Use Cursor-Based Pagination Over Offset/Limit Method

Cursor-Based Pagination vs. Offset/Limit Pagination

When building APIs that return large lists of data, pagination is critical for performance and user experience. Two common pagination methods are offset/limit and cursor-based pagination.

Pagination is essential for managing large volumes of data in API responses, ensuring efficient performance and a smooth user experience. The two common methods for pagination are:

- **Offset/Limit Pagination:** Uses an offset to skip a number of records and a limit to specify how many records to return.
- **Cursor-Based Pagination:** Uses a cursor (typically a unique identifier or timestamp) to mark the last seen record, then fetches the next set of records.

### How It Works

[![Watch the video](https://img.youtube.com/vi/zwDIN04lIpc/0.jpg)](https://www.youtube.com/watch?v=zwDIN04lIpc)

By watching the video so I conclude Cursor-based Method is a best option.

## Redis Caching Middleware Explanation

### Purpose of the Middleware
A Redis caching middleware intercepts responses for read-heavy endpoints, stores the results in Redis, and serves subsequent identical requests from the cache instead of hitting the database. This significantly reduces database load and improves response times.

### When to Use Caching
- **High-traffic, Read-heavy Endpoints:**  
  If certain endpoints (e.g., product listings, user lists) receive many GET requests but the underlying data changes infrequently, caching can drastically reduce repeated database queries.
- **Performance Improvement Under Load:**  
  In systems that handle millions of requests per day, serving cached data relieves pressure on the database and speeds up responses.
- **Slightly Stale Data is Acceptable:**  
  If your application can tolerate data that’s a few seconds or minutes out of date, caching is a good fit.

### When **Not** to Use Caching
- **Highly Dynamic or Real-time Data:**  
  If the data changes constantly (e.g., live transaction status, chat messages), cached results may become stale almost immediately.
- **Strict Consistency Requirements:**  
  Financial transactions or other mission-critical data might demand real-time accuracy. Even slight staleness could be unacceptable.
- **Frequent Data Updates:**  
  If you must invalidate the cache too often, the overhead might outweigh the benefits.

By carefully choosing which endpoints to cache and setting appropriate TTLs (time to live), you can ensure your system remains responsive and efficient while still providing up-to-date information where it matters.

## Database & Query Optimization Documentation

### Optimization Strategies

To improve query performance in a high-traffic e-commerce system with millions of orders, the following optimizations have been implemented:

- **Indexing:**  
  - Indexes are created on frequently queried columns such as `user_id` and `order_date` in the `orders` table.
  - Foreign key columns (e.g., `order_id` in `order_products` and `product_id` in `products`) are indexed to speed up join operations.

- **Partitioning:**  
  - For very large datasets, partitioning the `orders` table (e.g., by date or user) can reduce the number of rows scanned per query.

- **Efficient Querying:**  
  - Filtering with `WHERE` clauses limits the scanned data.
  - Ordering with `ORDER BY` ensures that the most recent records are returned first.
  - The use of `LIMIT` restricts the number of rows returned.
  - Cursor-based (keyset) pagination is employed for efficient navigation through large datasets, avoiding the pitfalls of OFFSET-based pagination.

- **Caching:**  
  - Redis caching middleware is implemented on read-heavy GET endpoints to reduce database load.
  - Cache invalidation is performed on data modifications (POST, PUT, DELETE) to ensure users always receive up-to-date information.

### Optimized SQL Query for Latest Orders

Below is the optimized SQL query used to fetch the latest 10 orders for a given user, including product details:

```sql
SELECT 
  o.order_id,
  o.order_date,
  o.total_amount,
  p.product_id,
  p.product_name,
  p.price,
  op.quantity
FROM orders o
JOIN order_products op ON o.order_id = op.order_id
JOIN products p ON op.product_id = p.product_id
WHERE o.user_id = ${user_id}
ORDER BY o.order_date DESC
LIMIT 10;
```
Explanation:
- **Filtering by User**  
  The clause `WHERE o.user_id = $1` restricts the query to orders for a specific user, significantly reducing the dataset that the database must scan.

- **Ordering for Recency**  
  The `ORDER BY o.order_date DESC` clause sorts the orders so that the most recent orders are returned first, ensuring that the latest orders are prioritized.

- **Limiting Results**  
  Using `LIMIT 10` ensures that only the 10 most recent orders are returned. This minimizes the amount of data processed and transferred, which is crucial when working with millions of records.

- **Efficient Joins**  
  The query joins `orders`, `order_products`, and `products` to include all necessary product details for each order. With proper indexing on the join columns, these operations remain efficient.

- **Parameterization**  
  The use of the `${user_id}` placeholder allows the query to be parameterized. This not only prevents SQL injection but also enables PostgreSQL to cache the query plan, further optimizing performance for repeated calls.


## Why Use a Raw SQL Query Here?
Efficiency:
When dealing with millions of orders, a well-indexed raw SQL query can be more efficient than an ORM abstraction.

Optimization:
The query leverages filtering, ordering, and limiting to only fetch the most recent orders, reducing load on the database.

Control:
Writing a raw query gives you finer control over joins and performance optimizations, which is critical in a high-traffic e-commerce system.



## Frontend Explanation:

**Requirement:**  
Build a React web application that displays a large list of users (over 100,000) with pagination and optimize it to avoid unnecessary re-renders when the list remains unchanged.

**Solution Approach:**

- **Pagination:**  
  The user list is divided into smaller pages using cursor-based (or offset-based) pagination. This ensures that only a subset of users is rendered at a time, reducing the data processed and improving performance.

- **Optimized Rendering:**  
  - **Memoization:** Use `React.memo` for components that do not change unless their props change.  
  - **Virtualization:** Utilize libraries like `react-window` to render only the visible portion of the list, reducing the number of DOM elements and improving rendering performance.  
  - **Efficient State Management:** Implement state and effect hooks (`useState`, `useEffect`, `useCallback`) so that the component re-renders only when necessary.

**Benefits:**  
- Faster load times and smoother scrolling due to reduced DOM load.
- Lower memory consumption by rendering only a subset of the entire dataset.
- Enhanced user experience through efficient UI updates, especially when dealing with very large datasets.

This combined approach ensures that both the backend and frontend are optimized for performance and scalability in a high-traffic, data-intensive environment.