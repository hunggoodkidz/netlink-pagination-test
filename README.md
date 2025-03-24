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

### SQL Query
```
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
    WHERE o.user_id = $1
    ORDER BY o.order_date DESC
    LIMIT 10;
```

## Why Use a Raw SQL Query Here?
Efficiency:
When dealing with millions of orders, a well-indexed raw SQL query can be more efficient than an ORM abstraction.

Optimization:
The query leverages filtering, ordering, and limiting to only fetch the most recent orders, reducing load on the database.

Control:
Writing a raw query gives you finer control over joins and performance optimizations, which is critical in a high-traffic e-commerce system.

