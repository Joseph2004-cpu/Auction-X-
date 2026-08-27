import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler';

export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED'));
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit authentication attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many login/registration attempts. Please wait 15 minutes.', 429, 'AUTH_RATE_LIMIT_EXCEEDED'));
  },
});

export const biddingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit bids to 60 per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Bidding rate limit exceeded. Slow down your bid submissions.', 429, 'BID_RATE_LIMIT_EXCEEDED'));
  },
});
