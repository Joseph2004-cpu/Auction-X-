import { Router, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await UsersService.getUserProfile(req.user!.userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.put('/me', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await UsersService.updateProfile(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: updated, message: 'Profile updated successfully.' });
  } catch (error) {
    next(error);
  }
});

router.post('/me/security/password', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await UsersService.updatePassword(req.user!.userId, currentPassword, newPassword);
    res.status(200).json({ success: true, data: result, message: 'Password updated successfully. All active sessions revoked.' });
  } catch (error) {
    next(error);
  }
});

export default router;
