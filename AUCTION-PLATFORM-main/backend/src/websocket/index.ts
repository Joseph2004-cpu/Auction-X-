import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { TokenService } from '../security/tokens';
import { logger } from '../config/logger';

let io: SocketIOServer | null = null;

export function initWebSocket(server: HttpServer): SocketIOServer {
  const allowedOrigins = (process.env.APP_URL || 'http://localhost:3000').split(',').map((o) => o.trim());

  io = new SocketIOServer(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app') ||
          origin.endsWith('.netlify.app') ||
          origin.startsWith('http://localhost:')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
    },
    maxHttpBufferSize: 1e6, // 1MB payload limit (Section 17 of Master Prompt)
  });

  // Authentication Middleware for WebSocket Connection
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (token) {
        const payload = TokenService.verifyAccessToken(token);
        (socket as any).user = payload;
      }
      next();
    } catch {
      // Allow guest view connection for public auction room watching (Section 90 of Master Prompt)
      (socket as any).user = null;
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    logger.info(`WebSocket client connected: ${socket.id}`, { userId: user?.userId || 'Guest' });

    // Join Auction Channel
    socket.on('join_auction', (auctionId: string) => {
      if (typeof auctionId === 'string' && auctionId.length > 0) {
        socket.join(`auction:${auctionId}`);
        logger.debug(`Socket ${socket.id} joined room auction:${auctionId}`);
      }
    });

    // Leave Auction Channel
    socket.on('leave_auction', (auctionId: string) => {
      if (typeof auctionId === 'string' && auctionId.length > 0) {
        socket.leave(`auction:${auctionId}`);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocketIO(): SocketIOServer | null {
  return io;
}
