import { Router, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { AuthenticatedRequest, requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

// All routes require authentication and ADMIN role
router.use(requireAuth, requireRole('ADMIN'));

router.get('/dashboard', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await AdminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const result = await AdminService.getUsers(page, limit, search);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/users/:id/status', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, reason } = req.body;
    const user = await AdminService.updateUserStatus(req.params.id, status as 'ACTIVE' | 'SUSPENDED', reason, req.user!.userId);
    res.status(200).json({ success: true, data: user, message: `User status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
});

router.get('/audit-logs', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const result = await AdminService.getAuditLogs(page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/security-events', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const result = await AdminService.getSecurityEvents(page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
