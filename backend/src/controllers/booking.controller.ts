import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../db/prisma';
import { checkAvailability, calculatePrice } from '../services/booking.service';

export const getAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId, date } = req.query;
    if (!courtId || !date) {
      res.status(400).json({ success: false, message: 'courtId and date are required' });
      return;
    }
    const slots = await checkAvailability(courtId as string, date as string);
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const createBooking = async (req: any, res: Response): Promise<void> => {
  try {
    const { courtId, date, startTime, endTime } = req.body;
    const userId = req.user.id;

    if (!courtId || !date || !startTime || !endTime) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Validation & Concurrency Protection
    // In a highly concurrent environment we'd use transactions or locks, 
    // but here we verify availability right before insertion.
    const parseMins = (t: string) => {
      const parts = t.split(':').map(Number);
      return (parts[0] || 0) * 60 + (parts[1] || 0);
    };

    const reqStart = parseMins(startTime);
    const reqEnd = parseMins(endTime);

    // Verify all 1-hour sub-slots covering the requested time range are available
    const availableSlots = await checkAvailability(courtId, date);
    const isAvailable = availableSlots.every((s: any) => {
      const sStart = parseMins(s.startTime);
      const sEnd = parseMins(s.endTime);
      if (sStart < reqEnd && sEnd > reqStart) {
        return s.isAvailable !== false && s.status !== 'booked' && s.status !== 'blocked';
      }
      return true;
    });

    if (!isAvailable) {
       res.status(409).json({ success: false, message: 'Sebagian atau seluruh slot jam yang dipilih sudah tidak tersedia.' });
       return;
    }

    const subtotal = await calculatePrice(courtId, date, startTime, endTime);
    const total = subtotal; // minus discounts if any

    const startMins = startTime.split(':').reduce((acc: number, curr: string, i: number) => acc + Number(curr) * (i === 0 ? 60 : 1), 0);
    const endMins = endTime.split(':').reduce((acc: number, curr: string, i: number) => acc + Number(curr) * (i === 0 ? 60 : 1), 0);
    const duration = endMins - startMins;

    const uniquePart = uuidv4().split('-')[0] ?? 'ABC123';
    const bookingCode = `BKG-${uniquePart.toUpperCase()}`;
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 15); // 15 mins to pay

    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        userId,
        courtId,
        bookingDate: new Date(date),
        startTime,
        endTime,
        duration,
        subtotal,
        total,
        status: 'waiting_payment',
        expiredAt
      }
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const getMyBookings = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { court: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const cancelBooking = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
       res.status(404).json({ success: false, message: 'Not found' });
       return;
    }
    if (booking.userId !== userId) {
       res.status(403).json({ success: false, message: 'Unauthorized' });
       return;
    }
    if (booking.status !== 'waiting_payment') {
       res.status(400).json({ success: false, message: 'Cannot cancel booking in current state' });
       return;
    }

    await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' }
    });

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const getAllBookingsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { court: true, user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await prisma.booking.count({
      where: {
        bookingDate: { gte: today, lt: tomorrow },
        status: { in: ['paid', 'completed'] }
      }
    });

    const revenueResult = await prisma.booking.aggregate({
      where: {
        status: { in: ['paid', 'completed'] }
      },
      _sum: { total: true }
    });

    const activeCourts = await prisma.court.count({ where: { status: 'active' } });

    res.json({
      success: true,
      data: {
        todayBookings,
        totalRevenue: revenueResult._sum.total || 0,
        activeCourts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const createManualBooking = async (req: any, res: Response): Promise<void> => {
  try {
    const { customerName, customerPhone, courtId, date, startTime, duration } = req.body;
    if (!customerName || !courtId || !date || !startTime || !duration) {
      res.status(400).json({ success: false, message: 'Field tidak lengkap' });
      return;
    }

    const startHour = parseInt(startTime.split(':')[0], 10);
    const durationNum = parseInt(duration, 10);
    const endHour = startHour + durationNum;
    const endTime = `${endHour < 10 ? '0' : ''}${endHour}:00`;
    const durationMins = durationNum * 60;

    const court = await prisma.court.findUnique({ where: { id: courtId } });
    if (!court) {
      res.status(404).json({ success: false, message: 'Court tidak ditemukan' });
      return;
    }

    let user = await prisma.user.findFirst({ where: { phone: customerPhone || 'WALKIN' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: customerName,
          email: `walkin_${Date.now()}@padel.local`,
          password: 'walkin_password',
          phone: customerPhone || '-',
          role: 'customer'
        }
      });
    }

    const uniquePart = uuidv4().split('-')[0] ?? 'WALK123';
    const bookingCode = `WALK-${uniquePart.toUpperCase()}`;
    const subtotal = 150000 * durationNum;

    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        userId: user.id,
        courtId,
        bookingDate: new Date(date),
        startTime,
        endTime,
        duration: durationMins,
        subtotal,
        total: subtotal,
        status: 'confirmed'
      },
      include: { court: true, user: true }
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error creating manual booking:', error);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const updateBookingStatusAdmin = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id: String(id) },
      data: { status: String(status) },
      include: { court: true, user: true }
    });

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};
