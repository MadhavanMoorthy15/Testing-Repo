import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

// BUG #1: JWT verification doesn't validate token expiry properly
// The JWT secret is hardcoded and verification skips expiry check
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // BUG: Using hardcoded secret instead of environment variable
    const decoded = jwt.verify(token, 'hardcoded-secret', { ignoreExpiration: true }) as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
