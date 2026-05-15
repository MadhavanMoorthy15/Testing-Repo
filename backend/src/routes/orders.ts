import express, { Response } from 'express';
import { orders, carts, products } from '../data/db';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { Order, OrderItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create order
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { shippingAddress, paymentMethod } = req.body;
  
  const userCart = carts.get(userId);
  if (!userCart || userCart.size === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  
  const orderItems: OrderItem[] = [];
  let totalAmount = 0;
  
  userCart.forEach((quantity, productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // FIX #6: Decrement stock when an order is placed to prevent overselling
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
  
  const order: Order = {
    id: uuidv4(),
    userId,
    items: orderItems,
    totalAmount,
    status: 'pending',
    shippingAddress,
    paymentMethod,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  orders.push(order);
  carts.delete(userId); // Clear cart after order
  
  res.status(201).json(order);
});

// Get user orders
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const userOrders = orders.filter(o => o.userId === userId);
  res.json(userOrders);
});

// Get order by ID
router.get('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const order = orders.find(o => o.id === req.params.id && o.userId === userId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

// Update order status (admin functionality - no proper auth check)
router.patch('/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  order.status = status;
  order.updatedAt = new Date();
  
  res.json(order);
});

export default router;
