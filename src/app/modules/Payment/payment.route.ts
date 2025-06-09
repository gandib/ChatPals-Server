import express from 'express';
import { paymentControolers } from './payment.controller';

const router = express.Router();

router.post('/initiate', paymentControolers.initiatePayment);
router.post('/confirmation', paymentControolers.paymentConfirmation);

export const paymentRoutes = router;
