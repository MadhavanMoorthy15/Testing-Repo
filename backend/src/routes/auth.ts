import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../data/db';
import { User, AuthResponse } from '../types';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, address, phone } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // BUG #2: Password is not hashed before storing
    // This is a critical security vulnerability
    const user: User = {
      id: uuidv4(),
      email,
      password, // Should be: await bcrypt.hash(password, 10)
      name,
      address,
      phone,
      createdAt: new Date()
    };

    users.push(user);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '24h'
    });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        phone: user.phone,
        createdAt: user.createdAt
      }
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // BUG #3: Password comparison is done with plain text
    // Since passwords aren't hashed, this creates a security issue
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '24h'
    });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        phone: user.phone,
        createdAt: user.createdAt
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
