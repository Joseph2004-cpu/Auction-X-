import { Router, Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoriesService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await CategoriesService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

export default router;
