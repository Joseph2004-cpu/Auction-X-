import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { globalApiLimiter } from './middleware/rateLimiter';
import { initWebSocket } from './websocket';
import { AuctionsService } from './modules/auctions/auctions.service';

// Import Route Modules
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import categoryRoutes from './modules/categories/categories.routes';
import listingRoutes from './modules/listings/listings.routes';
import bidRoutes from './modules/bids/bids.routes';
import orderRoutes from './modules/orders/orders.routes';
import disputeRoutes from './modules/disputes/disputes.routes';
import watchlistRoutes from './modules/watchlists/watchlists.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();
const server = http.createServer(app);

// Security Headers (Section 48 of Master Prompt)
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS Configuration supporting multi-origin deployments (Vercel, Netlify, custom domains, local dev)
const allowedOrigins = config.appUrl.split(',').map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin / curl / mobile clients with no Origin header
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app') ||
      origin.startsWith('http://localhost:')
    ) {
      return callback(null, true);
    }
    // Reject unknown origins explicitly (Section 26 of Master Prompt)
    return callback(new Error('Origin not allowed by CORS policy.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
}));

app.use(cookieParser(config.cookieSecret));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiter (Section 31 of Master Prompt)
app.use('/api/', globalApiLimiter);

// Request correlation ID tracking (Section 88 of Master Prompt)
app.use((req: any, res, next) => {
  req.requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// Health & Readiness Check Endpoints (Section 86 of Master Prompt)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'AuctionX Platform API', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'AuctionX Platform API', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'READY' });
});

// API v1 Router Registration (Section 25 of Master Prompt)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/auctions/:auctionId/bids', bidRoutes);
app.use('/api/v1/bids', bidRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/disputes', disputeRoutes);
app.use('/api/v1/watchlists', watchlistRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

// Centralized Error Handling Middleware (Section 59 of Master Prompt)
app.use(errorHandler);

// Initialize Socket.IO WebSocket Server (Section 16 & 17 of Master Prompt)
initWebSocket(server);

// Background Worker Timer for Auction Expiration Finalization (Section 13 & 53 of Master Prompt)
setInterval(async () => {
  try {
    await AuctionsService.finalizeExpiredAuctions();
  } catch (err: any) {
    logger.error('Background auction expiration check failed', { error: err.message });
  }
}, 10000);

server.listen(config.port, '0.0.0.0', () => {
  logger.info(`=======================================================`);
  logger.info(`  AuctionX Secure Platform API Server Running`);
  logger.info(`  Environment: ${config.nodeEnv}`);
  logger.info(`  Port       : ${config.port}`);
  logger.info(`  Health     : http://0.0.0.0:${config.port}/health`);
  logger.info(`=======================================================`);
});

export { app, server };
