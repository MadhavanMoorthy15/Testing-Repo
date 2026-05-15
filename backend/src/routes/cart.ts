import express, { Response } from 'express';
import { carts, products } from '../data/db';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get cart
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const userCart = carts.get(userId) || new Map();
  
  const cartItems = Array.from(userCart.entries()).map(([productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    return {
      productId,
      product,
      quantity
    };
  });
  
  res.json(cartItems);
});

// Add to cart
router.post('/add', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { productId, quantity } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  // BUG #5: Stock validation is missing
  // Users can add unlimited items to cart even if stock is insufficient
  // Should check: if (quantity > product.stock) return error
  
  let userCart = carts.get(userId);
  if (!userCart) {
    userCart = new Map();
    carts.set(userId, userCart);
  }
  
  const currentQuantity = userCart.get(productId) || 0;
  userCart.set(productId, currentQuantity + quantity);
  
  res.json({ message: 'Item added to cart' });
});

// Update cart item
router.put('/update', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { productId, quantity } = req.body;
  
  const userCart = carts.get(userId);
  if (!userCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  if (quantity <= 0) {
    userCart.delete(productId);
  } else {
    userCart.set(productId, quantity);
  }
  
  res.json({ message: 'Cart updated' });
});

// Remove from cart
router.delete('/remove/:productId', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { productId } = req.params;
  
  const userCart = carts.get(userId);
  if (!userCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  userCart.delete(productId);
  res.json({ message: 'Item removed from cart' });
});

// Clear cart
router.delete('/clear', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  carts.delete(userId);
  res.json({ message: 'Cart cleared' });
});

export default router;
