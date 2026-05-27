# Comprehensive Bug Report

This document contains a detailed analysis of all bugs found in the E-Commerce Full-Stack Application.

---

## Summary

**Total Bugs Found: 8**
- **Critical Security Issues: 4**
- **High Business Logic Issues: 3**
- **Additional Authorization Issue: 1**

---

## 1. JWT Verification Bypass 🔴 CRITICAL

**Severity:** Critical (Security Vulnerability)  
**Location:** `backend/src/middleware/auth.ts` (Line 20)  
**Category:** Authentication & Authorization

### Problem
The JWT authentication middleware has TWO critical security flaws:

1. **Hardcoded Secret:** Uses a hardcoded string `'hardcoded-secret'` instead of environment variable
2. **Expiry Ignored:** Sets `ignoreExpiration: true`, causing expired tokens to still be valid

### Current Code (Buggy)
```typescript
const decoded = jwt.verify(token, 'hardcoded-secret', { ignoreExpiration: true }) as any;
```

### Impact
- ✅ Expired tokens remain valid indefinitely
- ✅ Security tokens can be compromised
- ✅ Authentication bypass vulnerability
- ✅ Tokens created months ago are still accepted
- ✅ No token rotation/refresh mechanism

### Fix
```typescript
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
// Remove ignoreExpiration option to enforce expiry
```

---

## 2. Password Not Hashed 🔴 CRITICAL

**Severity:** Critical (Security Vulnerability)  
**Location:** `backend/src/routes/auth.ts` (Lines 23-31, Register endpoint)  
**Category:** Authentication & Data Security

### Problem
User passwords are stored in plain text in the in-memory database instead of being hashed.

### Current Code (Buggy)
```typescript
const user: User = {
  id: uuidv4(),
  email,
  password, // ❌ Stored as plain text - CRITICAL SECURITY ISSUE
  name,
  address,
  phone,
  createdAt: new Date()
};

users.push(user);
```

### Impact
- ✅ All user passwords are exposed in memory
- ✅ Massive security breach if database is compromised
- ✅ Violates basic security practices (OWASP)
- ✅ Users' credentials can be stolen
- ✅ No compliance with security standards (GDPR, etc.)

### Fix
```typescript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);

const user: User = {
  id: uuidv4(),
  email,
  password: hashedPassword, // ✅ Store hashed password
  name,
  address,
  phone,
  createdAt: new Date()
};

users.push(user);
```

---

## 3. Plain Text Password Comparison 🔴 CRITICAL

**Severity:** Critical (Security Vulnerability)  
**Location:** `backend/src/routes/auth.ts` (Lines 69-71, Login endpoint)  
**Category:** Authentication

### Problem
Login compares passwords using plain text comparison (`!==`) instead of using bcrypt.compare().

### Current Code (Buggy)
```typescript
if (user.password !== password) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

### Impact
- ✅ Insecure authentication mechanism
- ✅ Related to Bug #2 - passwords aren't hashed
- ✅ Passwords are never securely compared
- ✅ Direct string comparison is vulnerable to timing attacks

### Fix
```typescript
import bcrypt from 'bcryptjs';

const isValidPassword = await bcrypt.compare(password, user.password);
if (!isValidPassword) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

---

## 4. Product Rating Not Updated 🟠 HIGH

**Severity:** High (Business Logic)  
**Location:** `backend/src/routes/products.ts` (Lines 59-65)  
**Category:** Data Consistency

### Problem
When users submit product reviews, the product's overall rating is never recalculated. The product rating remains static at its initial value.

### Current Code (Buggy)
```typescript
product.reviews.push(review);
// ❌ Rating is never updated
res.status(201).json(review);
```

### Impact
- ✅ Product ratings remain static despite new reviews
- ✅ Misleading to customers
- ✅ Reviews don't affect displayed rating
- ✅ Poor user experience and trust
- ✅ Customers make decisions based on inaccurate data

### Example Scenario
- Product starts with 4.5 rating
- User adds review with 1 star
- Product rating still shows 4.5 (should be ~2.75)

### Fix
```typescript
product.reviews.push(review);

// ✅ Calculate new average rating
const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
product.rating = totalRating / product.reviews.length;

res.status(201).json(review);
```

---

## 5. Missing Stock Validation 🟠 HIGH

**Severity:** High (Business Logic)  
**Location:** `backend/src/routes/cart.ts` (Lines 25-48, Add to cart endpoint)  
**Category:** Inventory Management

### Problem
Users can add any quantity of items to their cart without checking if sufficient stock exists.

### Current Code (Buggy)
```typescript
const product = products.find(p => p.id === productId);
if (!product) {
  return res.status(404).json({ message: 'Product not found' });
}

// ❌ No stock validation here
const currentQuantity = userCart.get(productId) || 0;
userCart.set(productId, currentQuantity + quantity);
```

### Impact
- ✅ Users can add more items than available stock
- ✅ Overselling products
- ✅ Inventory management issues
- ✅ Order fulfillment problems
- ✅ Customer dissatisfaction

### Example Scenario
- Product has 10 units in stock
- User A adds 8 units to cart
- User B adds 5 units to cart (should fail!)
- Both proceed to checkout, overselling by 3 units

### Fix
```typescript
const product = products.find(p => p.id === productId);
if (!product) {
  return res.status(404).json({ message: 'Product not found' });
}

// ✅ Add stock validation
const currentQuantity = userCart.get(productId) || 0;
const newQuantity = currentQuantity + quantity;

if (newQuantity > product.stock) {
  return res.status(400).json({ 
    message: 'Insufficient stock', 
    available: product.stock,
    requested: newQuantity,
    currentInCart: currentQuantity
  });
}

userCart.set(productId, newQuantity);
```

---

## 6. Stock Not Decremented on Order 🔴 CRITICAL

**Severity:** Critical (Business Logic)  
**Location:** `backend/src/routes/orders.ts` (Lines 22-38, Create order endpoint)  
**Category:** Inventory Management

### Problem
When orders are placed, product stock is never reduced, leading to inventory inconsistencies and complete inventory breakdown.

### Current Code (Buggy)
```typescript
userCart.forEach((quantity, productId) => {
  const product = products.find(p => p.id === productId);
  if (product) {
    // ❌ Stock is never decremented when order is placed
    // No: product.stock -= quantity;
    
    orderItems.push({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price
    });
    
    totalAmount += product.price * quantity;
  }
});
```

### Impact
- ✅ Inventory never decreases
- ✅ Multiple customers can order same products infinitely
- ✅ Complete breakdown of inventory management
- ✅ Overselling and unfulfillable orders
- ✅ Cannot track actual available stock

### Example Scenario
- Product has 10 units available
- 100 customers each place order for 1 unit
- All orders succeed (should only allow 10!)
- Company only has 10 units but promised 100

### Fix
```typescript
userCart.forEach((quantity, productId) => {
  const product = products.find(p => p.id === productId);
  if (product) {
    // ✅ Decrement stock
    product.stock -= quantity;
    
    orderItems.push({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price
    });
    
    totalAmount += product.price * quantity;
  }
});
```

---

## 7. Unsafe Order Status Update (No Authorization Check) 🟠 HIGH

**Severity:** High (Authorization & Security)  
**Location:** `backend/src/routes/orders.ts` (Lines 78-90, PATCH endpoint)  
**Category:** Authorization & Access Control

### Problem
The order status update endpoint only checks if the order exists, but does NOT verify that the requesting user is the order owner or an admin. Any authenticated user can modify ANY order's status.

### Current Code (Buggy)
```typescript
router.patch('/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  // ❌ Missing authorization check!
  // Should verify: o.userId === req.userId
  
  order.status = status;
  order.updatedAt = new Date();
  
  res.json(order);
});
```

### Impact
- ✅ Any authenticated user can change any order status
- ✅ Users can mark other users' orders as "delivered"
- ✅ Users can cancel other users' orders
- ✅ No proper access control
- ✅ Unauthorized modification of business-critical data

### Example Scenario
- User A places an order
- User B logs in
- User B sends PATCH request to change User A's order status to "shipped"
- Request succeeds (should fail!)

### Fix
```typescript
router.patch('/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  // ✅ Add authorization check
  if (order.userId !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  order.status = status;
  order.updatedAt = new Date();
  
  res.json(order);
});
```

---

## 8. Input Validation Missing (Backend) 🟠 MEDIUM

**Severity:** Medium (Data Validation)  
**Location:** Multiple endpoints across backend routes  
**Category:** Input Validation & Error Handling

### Problem
Most API endpoints lack proper input validation for required fields and data types.

### Example Issues:
1. **Auth Routes** - No validation for email format, password strength, or required fields
2. **Cart Routes** - No validation that `quantity` is positive integer
3. **Orders Routes** - No validation that shipping address is provided
4. **Products Routes** - No validation that rating is between 1-5, comment is not empty

### Current Code (Buggy) - Register endpoint example
```typescript
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, address, phone } = req.body;
    
    // ❌ No validation!
    // What if email is empty?
    // What if password is "123"?
    // What if name is null?
    
    const existingUser = users.find(u => u.email === email);
    // ...
  }
});
```

### Impact
- ✅ Invalid data can be stored
- ✅ User can register with empty email/password
- ✅ Reviews can have invalid ratings (e.g., 0, 100, negative)
- ✅ Poor error handling
- ✅ Security risks from malformed input

### Fix Example
```typescript
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, address, phone } = req.body;
    
    // ✅ Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // ✅ Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    // ...
  }
});
```

---

## Bug Priority & Resolution Order

### Phase 1: Critical Security (Fix Immediately) 🔴
1. **Bug #2:** Password Hashing - Setup bcrypt hashing on registration
2. **Bug #3:** Password Comparison - Use bcrypt.compare on login
3. **Bug #1:** JWT Secret - Use environment variable, remove ignoreExpiration
4. **Bug #6:** Stock Decrement - Decrement stock on order placement

### Phase 2: High Priority (Fix Soon) 🟠
5. **Bug #7:** Order Authorization - Add userId check in PATCH endpoint
6. **Bug #5:** Stock Validation - Validate stock before adding to cart
7. **Bug #4:** Rating Update - Recalculate rating after reviews

### Phase 3: Medium Priority (Fix Next) 🟡
8. **Bug #8:** Input Validation - Add validation to all endpoints

---

## Testing Recommendations

After fixing each bug, test the following:

### Bug #1, #2, #3 Testing
```bash
# Test registration with weak password
POST /api/auth/register
{ "email": "test@test.com", "password": "weak", "name": "Test" }

# Test login with wrong password
POST /api/auth/login
{ "email": "test@test.com", "password": "wrongpassword" }

# Test expired token (after fix)
# Wait for token to expire, then use it
```

### Bug #4 Testing
```bash
# Add review with low rating
POST /api/products/1/reviews
{ "rating": 1, "comment": "Bad product", "userName": "User" }

# Check product rating (should update)
GET /api/products/1
```

### Bug #5 & #6 Testing
```bash
# Try adding more than available stock
POST /api/cart/add
{ "productId": "1", "quantity": 1000 }

# Create order and verify stock decreased
POST /api/orders
{ "shippingAddress": "123 Main St", "paymentMethod": "credit-card" }
```

### Bug #7 Testing
```bash
# Login as User A
POST /api/auth/login
{ "email": "userA@test.com", "password": "password" }

# As User A, create order to get Order ID
# Login as User B (different user)
# Try to modify User A's order
PATCH /api/orders/{userA_orderId}/status
{ "status": "shipped" }
# Should return 403 Unauthorized
```

---

## Files Affected Summary

| File | Bugs |
|------|------|
| `backend/src/middleware/auth.ts` | Bug #1 |
| `backend/src/routes/auth.ts` | Bug #2, #3 |
| `backend/src/routes/products.ts` | Bug #4 |
| `backend/src/routes/cart.ts` | Bug #5 |
| `backend/src/routes/orders.ts` | Bug #6, #7 |
| All route files | Bug #8 |

---

## Conclusion

The application has **8 significant bugs**, with **4 critical security vulnerabilities** that must be fixed immediately. The issues span authentication, authorization, data validation, and business logic. Once these are fixed, the application will be production-ready.

**Estimated Fix Time:** 4-6 hours for an experienced developer

