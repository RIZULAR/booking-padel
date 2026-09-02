import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import courtRoutes from './routes/court.routes';
import scheduleRoutes from './routes/schedule.routes';
import pricingRoutes from './routes/pricing.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';
import prisma from './db/prisma';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Simple Background Job for Booking Expiration (Runs every minute)
setInterval(async () => {
  try {
    const expiredCount = await prisma.booking.updateMany({
      where: {
        status: 'waiting_payment',
        expiredAt: { lt: new Date() }
      },
      data: { status: 'expired' }
    });
    if (expiredCount.count > 0) {
      console.log(`[Expiration] Cancelled ${expiredCount.count} expired bookings.`);
    }
  } catch (error) {
    console.error('[Expiration] Error checking expirations:', error);
  }
}, 60 * 1000);
