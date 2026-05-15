import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

// Secure JWT authentication middleware
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Server misconfiguration - do not proceed without a proper secret
    return res.status(500).json({ message: 'Server configuration error: JWT secret not set' });
  }

  try {
    // Verify token and ensure expiration is enforced (default behavior)
    const decoded = jwt.verify(token, secret) as any;
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    if (error && error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};
