# Critical Bugs Documentation

This document provides detailed information about the intentional bugs in the application for agent testing purposes.

## Bug #1: JWT Verification Bypass
**File:** `backend/src/middleware/auth.ts`
**Severity:** Critical (Security Vulnerability)

### Description
The JWT authentication middleware has two critical security flaws:
1. Uses a hardcoded secret `'hardcoded-secret'` instead of the environment variable
2. Token expiry is ignored with `ignoreExpiration: true`

### Impact
- Expired tokens remain valid indefinitely
- Security tokens can be compromised
- Authentication bypass vulnerability

### Current Code (Buggy)
```typescript
const decoded = jwt.verify(token, 'hardcoded-secret', { ignoreExpiration: true }) as any;
```

### Expected Fix
```typescript
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
// Remove ignoreExpiration option to enforce expiry
```

---

## Bug #2: Password Not Hashed
**File:** `backend/src/routes/auth.ts` (Register endpoint)
**Severity:** Critical (Security Vulnerability)

### Description
User passwords are stored in plain text in the database instead of being hashed.

### Impact
- All user passwords are exposed
- Massive security breach
- Violates basic security practices
- Users' credentials can be stolen

### Current Code (Buggy)
```typescript
const user: User = {
  id: uuidv4(),
  email,
  password, // Stored as plain text
  name,
  address,
  phone,
  createdAt: new Date()
};
```

### Expected Fix
```typescript
const hashedPassword = await bcrypt.hash(password, 10);

const user: User = {
  id: uuidv4(),
  email,
  password: hashedPassword, // Store hashed password
  name,
  address,
  phone,
  createdAt: new Date()
};
```

---

## Bug #3: Plain Text Password Comparison
**File:** `backend/src/routes/auth.ts` (Login endpoint)
**Severity:** Critical (Security Vulnerability)

### Description
Login compares passwords using plain text comparison instead of using bcrypt.compare().

### Impact
- Insecure authentication mechanism
- Related to Bug #2
- Passwords should never be compared directly

### Current Code (Buggy)
```typescript
if (user.password !== password) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

### Expected Fix
```typescript
const isValidPassword = await bcrypt.compare(password, user.password);
if (!isValidPassword) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

---

## Bug #4: Product Rating Not Updated
**File:** `backend/src/routes/products.ts`
**Severity:** High (Business Logic)

### Description
When users submit product reviews, the product's overall rating is never recalculated.

### Impact
- Product ratings remain static
- Misleading to customers
- Reviews don't affect displayed rating
- Poor user experience

### Current Code (Buggy)
```typescript
product.reviews.push(review);
// Rating is never updated
res.status(201).json(review);
```

### Expected Fix
```typescript
product.reviews.push(review);

// Calculate new average rating
const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
product.rating = totalRating / product.reviews.length;

res.status(201).json(review);
```

---

## Bug #5: Missing Stock Validation
**File:** `backend/src/routes/cart.ts` (Add to cart endpoint)
**Severity:** High (Business Logic)

### Description
Users can add any quantity of items to their cart without checking if sufficient stock exists.

### Impact
- Users can add more items than available
- Overselling products
- Inventory management issues
- Order fulfillment problems

### Current Code (Buggy)
```typescript
const product = products.find(p => p.id === productId);
if (!product) {
  return res.status(404).json({ message: 'Product not found' });
}

// No stock validation here
const currentQuantity = userCart.get(productId) || 0;
userCart.set(productId, currentQuantity + quantity);
```

### Expected Fix
```typescript
const product = products.find(p => p.id === productId);
if (!product) {
  return res.status(404).json({ message: 'Product not found' });
}

// Add stock validation
const currentQuantity = userCart.get(productId) || 0;
const newQuantity = currentQuantity + quantity;

if (newQuantity > product.stock) {
  return res.status(400).json({ 
    message: 'Insufficient stock', 
    available: product.stock,
    requested: newQuantity
  });
}

userCart.set(productId, newQuantity);
```

---

## Bug #6: Stock Not Decremented on Order
**File:** `backend/src/routes/orders.ts` (Create order endpoint)
**Severity:** Critical (Business Logic)

### Description
When orders are placed, product stock is never reduced, leading to inventory inconsistencies.

### Impact
- Inventory never decreases
- Multiple customers can order same products infinitely
- Complete breakdown of inventory management
- Overselling
- Cannot fulfill orders

### Current Code (Buggy)
```typescript
userCart.forEach((quantity, productId) => {
  const product = products.find(p => p.id === productId);
  if (product) {
    // Stock is never decremented
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

### Expected Fix
```typescript
userCart.forEach((quantity, productId) => {
  const product = products.find(p => p.id === productId);
  if (product) {
    // Validate stock availability
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    
    // Decrement stock
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

## Testing Strategy

To verify these bugs:

1. **JWT Bug**: Create a token, wait for it to expire, and verify it still works
2. **Password Bugs**: Check the users array to see plain text passwords
3. **Rating Bug**: Add reviews to a product and observe the rating stays the same
4. **Stock Validation Bug**: Try adding 1000 items when only 50 are in stock
5. **Stock Decrement Bug**: Place orders and check that product.stock never changes

## Agent Testing Goals

The agent being tested should:
1. Identify all 6 critical bugs
2. Understand the security implications
3. Propose correct fixes
4. Implement the fixes properly
5. Verify fixes work correctly
