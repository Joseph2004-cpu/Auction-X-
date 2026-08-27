import { Router, Response, NextFunction } from 'express';
import { WatchlistsService } from './watchlists.service';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const list = await WatchlistsService.getUserWatchlist(req.user!.userId);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

router.post('/:auctionId', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const entry = await WatchlistsService.addToWatchlist(req.user!.userId, req.params.auctionId);
    res.status(201).json({ success: true, data: entry, message: 'Added to watchlist.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:auctionId', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await WatchlistsService.removeFromWatchlist(req.user!.userId, req.params.auctionId);
    res.status(200).json({ success: true, message: 'Removed from watchlist.' });
  } catch (error) {
    next(error);
  }
});

export default router;
