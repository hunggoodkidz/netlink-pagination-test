# Pagination Optimization Test

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

## Why Use Cursor-Based Pagination Over Offset/Limit Method

Cursor-Based Pagination vs. Offset/Limit Pagination

When building APIs that return large lists of data, pagination is critical for performance and user experience. Two common pagination methods are offset/limit and cursor-based pagination.

Pagination is essential for managing large volumes of data in API responses, ensuring efficient performance and a smooth user experience. The two common methods for pagination are:

- **Offset/Limit Pagination:** Uses an offset to skip a number of records and a limit to specify how many records to return.
- **Cursor-Based Pagination:** Uses a cursor (typically a unique identifier or timestamp) to mark the last seen record, then fetches the next set of records.

### How It Works

[![Watch the video](https://img.youtube.com/vi/zwDIN04lIpc/0.jpg)](https://www.youtube.com/watch?v=zwDIN04lIpc)