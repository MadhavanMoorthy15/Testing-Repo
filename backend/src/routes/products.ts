import express, { Request, Response } from 'express';
import { products } from '../data/db';
import { Review } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all products
router.get('/', (req: Request, res: Response) => {
  const { category, search } = req.query;
  
  let filteredProducts = [...products];
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    const searchTerm = search.toString().toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json(filteredProducts);
});

// Get product by ID
router.get('/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

// Add review to product
router.post('/:id/reviews', authenticateToken, (req: AuthRequest, res: Response) => {
  const { rating, comment, userName } = req.body as { rating: number; comment: string; userName: string };
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const normalizedRating = Number(rating);
  if (!normalizedRating || normalizedRating < 1 || normalizedRating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
  }
  
  const review: Review = {
    id: uuidv4(),
    userId: req.userId!,
    userName,
    rating: normalizedRating,
    comment,
    createdAt: new Date()
  };
  
  product.reviews.push(review);
  
  // Recalculate average rating
  const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = Math.round((total / product.reviews.length) * 10) / 10; // round to 1 decimal
  
  res.status(201).json(review);
});

export default router;
