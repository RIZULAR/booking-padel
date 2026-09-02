import { Router } from 'express';
import { createPayment, midtransWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/create', authenticate, createPayment);
router.post('/webhook', midtransWebhook); // Public for gateway callbacks

export default router;
