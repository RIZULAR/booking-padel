import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
      res.status(422).json({ success: false, message: 'Validation failed', errors: 'Missing fields' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
       res.status(422).json({ success: false, message: 'Validation failed', errors: 'Email already in use' });
       return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'customer'
      }
    });

    res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Internal error', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
       res.status(401).json({ success: false, message: 'Invalid credentials' });
       return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
       res.status(401).json({ success: false, message: 'Invalid credentials' });
       return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const me = async (req: any, res: Response): Promise<void> => {
  const user = req.user;
  res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out' }); 
};
