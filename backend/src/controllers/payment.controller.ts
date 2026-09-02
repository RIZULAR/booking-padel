import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../db/prisma';

export const createPayment = async (req: any, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.userId !== userId) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (booking.status !== 'waiting_payment') {
      res.status(400).json({ success: false, message: `Booking status is ${booking.status}` });
      return;
    }

    if (booking.expiredAt && new Date() > booking.expiredAt) {
      await prisma.booking.update({ where: { id: bookingId }, data: { status: 'expired' } });
      res.status(400).json({ success: false, message: 'Booking has expired' });
      return;
    }

    // Check if payment already exists
    let payment = await prisma.payment.findUnique({
      where: { bookingId }
    });

    if (!payment) {
      // Create new payment record (Simulation of creating Midtrans transaction)
      payment = await prisma.payment.create({
        data: {
          bookingId: booking.id,
          paymentGateway: 'midtrans_mock',
          transactionId: `TRX-${(uuidv4().split('-')[0] ?? 'ABC123').toUpperCase()}`,
          amount: booking.total,
          status: 'pending'
        }
      });
    }

    res.json({
      success: true,
      data: {
        payment,
        paymentUrl: `/payment/${booking.id}` // Frontend mock payment page
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

// Webhook to handle Midtrans notifications (Simulated)
export const midtransWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id, transaction_status } = req.body;
    
    // In our mock, order_id is bookingId
    const bookingId = order_id;

    const payment = await prisma.payment.findUnique({
      where: { bookingId }
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    let newStatus = payment.status;
    let bookingStatus = 'waiting_payment';

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      newStatus = 'settled';
      bookingStatus = 'paid';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newStatus = 'failed';
      bookingStatus = 'cancelled'; // or expired
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        paidAt: newStatus === 'settled' ? new Date() : null
      }
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: bookingStatus }
    });

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};
