import { Router } from 'express';
import { 
  getAvailability, 
  createBooking, 
  getMyBookings, 
  cancelBooking, 
  getAllBookingsAdmin, 
  getDashboardStats,
  createManualBooking,
  updateBookingStatusAdmin
} from '../controllers/booking.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/availability', getAvailability);
router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);
router.put('/:id/cancel', authenticate, cancelBooking);

// Admin & Staff
router.get('/admin/all', authenticate, requireRole(['admin', 'staff']), getAllBookingsAdmin);
router.get('/admin/stats', authenticate, requireRole(['admin', 'staff']), getDashboardStats);
router.post('/admin/manual', authenticate, requireRole(['admin', 'staff']), createManualBooking);
router.put('/admin/:id/status', authenticate, requireRole(['admin', 'staff']), updateBookingStatusAdmin);

export default router;
