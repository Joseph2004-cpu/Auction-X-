import { Router, Request, Response, NextFunction } from 'express';
import { ListingsService } from './listings.service';
import { requireAuth, requirePermission, optionalAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { z } from 'zod';

const router = Router();

const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    categoryId: z.string().min(1),
    condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
    startingPrice: z.number().positive(),
    minBidIncrement: z.number().positive().optional(),
    bidIncrement: z.number().positive().optional(),
    reservePrice: z.number().nonnegative().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    durationDays: z.number().int().positive().max(60).optional(),
    itemLocation: z.string().optional(),
    shippingOptions: z.string().optional(),
    returnPolicy: z.string().optional(),
    terms: z.string().optional(),
    images: z.array(z.object({ url: z.string().url(), isPrimary: z.boolean().optional() })).optional(),
  }),
});

const moderateListingSchema = z.object({
  body: z.object({
    action: z.enum(['APPROVE', 'REJECT', 'SUSPEND']),
    reason: z.string().min(3).max(500),
  }),
});

router.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const result = await ListingsService.getListings({
      page,
      limit,
      category: req.query.categoryId as string,
      categoryId: req.query.categoryId as string,
      status: (req.query.status as string) || 'ACTIVE',
      search: req.query.search as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      condition: req.query.condition as string,
      sortBy: req.query.sortBy as string,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await ListingsService.getListingById(req.params.id);
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, validateRequest(createListingSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const listing = await ListingsService.createListing(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/moderate', requireAuth, requirePermission('listings:moderate'), validateRequest(moderateListingSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { action, reason } = req.body;
    const updated = await ListingsService.moderateListing(req.params.id, action, reason, req.user!.userId);
    res.status(200).json({ success: true, data: updated, message: `Listing ${action.toLowerCase()}d successfully.` });
  } catch (error) {
    next(error);
  }
});

export default router;
