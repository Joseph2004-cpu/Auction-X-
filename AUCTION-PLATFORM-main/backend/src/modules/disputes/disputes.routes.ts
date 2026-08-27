import { Router, Response, NextFunction } from 'express';
import { DisputesService } from './disputes.service';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const disputes = await DisputesService.getDisputesForUser(req.user!.userId);
    res.status(200).json({ success: true, data: disputes });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dispute = await DisputesService.createDispute(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/messages', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const msg = await DisputesService.addDisputeMessage(req.params.id, req.user!.userId, req.body.message);
    res.status(201).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
});

export default router;
