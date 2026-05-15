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
  const { productId, quantity } = req.body as { productId: string; quantity: number };
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }
  
  let userCart = carts.get(userId);
  if (!userCart) {
    userCart = new Map();
    carts.set(userId, userCart);
  }
  
  const currentQuantity = userCart.get(productId) || 0;
  const newTotal = currentQuantity + qty;
  if (newTotal > product.stock) {
    return res.status(400).json({ message: `Insufficient stock. Available: ${product.stock}` });
  }

  userCart.set(productId, newTotal);
  
  res.json({ message: 'Item added to cart' });
});

// Update cart item
router.put('/update', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { productId, quantity } = req.body as { productId: string; quantity: number };
  
  const userCart = carts.get(userId);
  if (!userCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  const qty = Number(quantity);
  if (!Number.isInteger(qty)) {
    return res.status(400).json({ message: 'Quantity must be an integer' });
  }

  if (qty <= 0) {
    userCart.delete(productId);
  } else {
    if (qty > product.stock) {
      return res.status(400).json({ message: `Insufficient stock. Available: ${product.stock}` });
    }
    userCart.set(productId, qty);
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
