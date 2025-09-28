import { Router } from 'express';
import { getOrders, createOrder } from '../controllers/orders';

const router = Router();

router.post('/order/verify', createOrder);

router.get('/orders', getOrders);

export default router;
