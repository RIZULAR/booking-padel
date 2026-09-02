import { Router } from 'express';
import { getOperatingHours, updateOperatingHours, getBlockedSchedules, createBlockedSchedule, deleteBlockedSchedule } from '../controllers/schedule.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Operating hours
router.get('/operating-hours', getOperatingHours); // public can see
router.put('/admin/operating-hours/:id', authenticate, requireRole(['admin']), updateOperatingHours);

// Blocked schedules
router.get('/admin/blocked-schedules', authenticate, requireRole(['admin', 'staff']), getBlockedSchedules);
router.post('/admin/blocked-schedules', authenticate, requireRole(['admin']), createBlockedSchedule);
router.delete('/admin/blocked-schedules/:id', authenticate, requireRole(['admin']), deleteBlockedSchedule);

export default router;
