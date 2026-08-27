import { Router, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const role = (req.query.role as 'BUYER' | 'SELLER') || 'BUYER';
    const orders = await OrdersService.getUserOrders(req.user!.userId, role);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const order = await OrdersService.getOrderById(req.params.id, req.user!.userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/pay', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await OrdersService.initiateOrderPayment(req.params.id, req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/webhook/mock-confirm', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { transactionRef } = req.body;
    const payment = await OrdersService.processPaymentSuccess(transactionRef);
    res.status(200).json({ success: true, data: payment, message: 'Payment confirmed server-to-server.' });
  } catch (error) {
    next(error);
  }
});

export default router;
