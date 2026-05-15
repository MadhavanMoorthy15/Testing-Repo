# Fix: Critical Security & Inventory Bugs

## Summary
Addresses six critical backend issues in auth, products, cart, and orders.

- auth: use env JWT secret and enforce expiration
- auth: hash passwords on register (bcrypt)
- auth: verify login using bcrypt.compare
- products: recalc rating after new review
- cart: validate stock and positive quantity on add/update
- orders: validate stock and decrement on creation

## Motivation
- Removes hardcoded secrets and enforces JWT expiration.
- Stores passwords securely and validates credentials correctly.
- Prevents overselling by validating cart updates and decrementing stock on order creation.

## Changes
- backend/src/middleware/auth.ts: use `process.env.JWT_SECRET`; respect token expiry.
- backend/src/routes/auth.ts: bcrypt hashing on register; bcrypt.compare on login; require `JWT_SECRET` when signing.
- backend/src/routes/products.ts: recalculate `product.rating` on review add.
- backend/src/routes/cart.ts: validate positive quantity; enforce stock limits on add/update.
- backend/src/routes/orders.ts: validate stock for all cart items; decrement stock on order creation.

## Security Impact
- Eliminates hardcoded JWT secret and expiration bypass.
- Prevents plaintext password storage and comparison.

## Inventory Impact
- Disallows cart quantities beyond stock.
- Ensures inventory decrements on confirmed orders.

## Testing
- Built TypeScript without errors (`npm ci && npm run build` in `backend`).
- Manual checks:
  - Register now stores hashed password.
  - Login rejects wrong password with bcrypt.
  - Adding review updates average rating.
  - Cart add/update errors when exceeding `product.stock`.
  - Order creation decrements `product.stock` accordingly.

## Env/Config
- Set `JWT_SECRET` in environment or `.env` (loaded via `dotenv`).

## Linked Issues
- Security & inventory bugfixes: #security #inventory-bugs
