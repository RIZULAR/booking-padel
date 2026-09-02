import { Request, Response } from 'express';
import prisma from '../db/prisma';
import bcrypt from 'bcryptjs';

export const getCustomersAdmin = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'customer' },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStaffAdmin = async (req: Request, res: Response) => {
  try {
    const staffMembers = await prisma.user.findMany({
      where: { role: { in: ['staff', 'admin'] } },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: staffMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createStaffAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'staff'
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
    });

    res.status(201).json({ success: true, data: newStaff, message: 'Staff berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat staff baru' });
  }
};
