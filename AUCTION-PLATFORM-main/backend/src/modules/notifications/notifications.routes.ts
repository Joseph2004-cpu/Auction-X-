import { Router, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await NotificationsService.getUserNotifications(req.user!.userId);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/read', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await NotificationsService.markAsRead(req.user!.userId, req.params.id);
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    next(error);
  }
});

export default router;
