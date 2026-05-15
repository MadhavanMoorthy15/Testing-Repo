# E-Commerce Full-Stack Application

A complete e-commerce application built with React, TypeScript, Express, and Node.js.

## Features

- User Authentication (Register/Login)
- Product Catalog with Categories
- Product Search and Filtering
- Shopping Cart Management
- Checkout Process
- Order Management
- Product Reviews and Ratings

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express
- TypeScript
- JWT Authentication
- In-memory database

## Setup Instructions

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (root, backend, and frontend)
npm run install-all
```

### Run the Application

```bash
# Run both backend and frontend concurrently
npm run dev

# Or run separately:
# Backend (runs on http://localhost:5000)
npm run server

# Frontend (runs on http://localhost:3000)
npm run client
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── data/          # In-memory database
│   │   ├── middleware/    # Authentication middleware
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── server.ts      # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main App component
│   └── package.json
│
└── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products/:id/reviews` - Add review to product

### Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update` - Update cart item quantity
- DELETE `/api/cart/remove/:productId` - Remove item from cart
- DELETE `/api/cart/clear` - Clear cart

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get order by ID
- PATCH `/api/orders/:id/status` - Update order status

## Known Issues (Intentional Bugs for Testing)

⚠️ **This application contains intentional critical bugs for agent testing purposes**

### Critical Bugs:

1. **JWT Verification Bypass** (`backend/src/middleware/auth.ts`)
   - JWT tokens use hardcoded secret instead of environment variable
   - Token expiry is ignored (`ignoreExpiration: true`)
   - Security vulnerability: expired tokens are still accepted

2. **Password Not Hashed** (`backend/src/routes/auth.ts`)
   - Passwords are stored in plain text
   - Critical security vulnerability
   - Should use bcrypt to hash passwords

3. **Plain Text Password Comparison** (`backend/src/routes/auth.ts`)
   - Login compares passwords as plain text
   - No bcrypt comparison
   - Security vulnerability

4. **Product Rating Not Updated** (`backend/src/routes/products.ts`)
   - When users add reviews, product rating is never recalculated
   - Product rating stays at initial value
   - Should calculate average of all review ratings

5. **Missing Stock Validation** (`backend/src/routes/cart.ts`)
   - Users can add unlimited items to cart
   - No check if quantity exceeds available stock
   - Can lead to overselling

6. **Stock Not Decremented** (`backend/src/routes/orders.ts`)
   - When orders are placed, product stock is never reduced
   - Inventory inconsistency
   - Multiple users can order same items exceeding available stock

## Testing the Application

1. **Register a new user**
   - Navigate to `/register`
   - Fill in the form and submit

2. **Browse products**
   - View products on home page
   - Filter by category
   - Search for products

3. **Add to cart**
   - Click on a product
   - Add items to cart
   - View cart

4. **Place order**
   - Proceed to checkout
   - Fill shipping information
   - Place order

5. **View orders**
   - Check order history
   - View order details

## License

MIT
