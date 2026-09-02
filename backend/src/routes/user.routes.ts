import { Router } from 'express';
import { getCustomersAdmin, getStaffAdmin, createStaffAdmin } from '../controllers/user.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/admin/customers', authenticate, requireRole(['admin']), getCustomersAdmin);
router.get('/admin/staff', authenticate, requireRole(['admin']), getStaffAdmin);
router.post('/admin/staff', authenticate, requireRole(['admin']), createStaffAdmin);

export default router;
