import { Router } from 'express';
import { getPricing, createPricing, updatePricing, deletePricing } from '../controllers/pricing.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/admin/pricing', authenticate, requireRole(['admin', 'staff']), getPricing);
router.post('/admin/pricing', authenticate, requireRole(['admin']), createPricing);
router.put('/admin/pricing/:id', authenticate, requireRole(['admin']), updatePricing);
router.delete('/admin/pricing/:id', authenticate, requireRole(['admin']), deletePricing);

export default router;
