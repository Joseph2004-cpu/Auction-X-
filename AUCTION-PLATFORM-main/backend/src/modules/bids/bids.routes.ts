import { Router, Response, NextFunction } from 'express';
import { BidsService } from './bids.service';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { biddingLimiter } from '../../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.post('/', requireAuth, biddingLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const auctionId = req.params.auctionId || req.body.auctionId;
    const result = await BidsService.placeBid({
      userId: req.user!.userId,
      auctionId,
      amount: parseFloat(req.body.amount),
      maxProxyAmount: req.body.maxProxyAmount ? parseFloat(req.body.maxProxyAmount) : undefined,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Bid placed successfully.',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/history', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const auctionId = req.params.auctionId;
    const history = await BidsService.getBidHistory(auctionId);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
});

export default router;
