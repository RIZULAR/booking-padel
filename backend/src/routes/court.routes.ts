import { Router } from 'express';
import { getPublicCourts, getPublicCourtDetail, getAdminCourts, createCourt, updateCourt, deleteCourt } from '../controllers/court.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getPublicCourts);
router.get('/:id', getPublicCourtDetail);

// Admin routes
router.get('/admin/list', authenticate, requireRole(['admin']), getAdminCourts);
router.post('/admin', authenticate, requireRole(['admin']), createCourt);
router.put('/admin/:id', authenticate, requireRole(['admin']), updateCourt);
router.delete('/admin/:id', authenticate, requireRole(['admin']), deleteCourt);

export default router;
