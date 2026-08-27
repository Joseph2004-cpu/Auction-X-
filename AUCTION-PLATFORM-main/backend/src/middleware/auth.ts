import { Request, Response, NextFunction } from 'express';
import { TokenService, TokenPayload } from '../security/tokens';
import { AppError } from './errorHandler';
import { prisma } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
  requestId?: string;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('Authentication required. Missing token.', 401, 'UNAUTHORIZED');
    }

    const payload = TokenService.verifyAccessToken(token);

    // Verify user account is still active (DB check, but tolerant of offline DB)
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { accountStatus: true, lockedUntil: true },
      });

      if (user && user.accountStatus !== 'ACTIVE') {
        throw new AppError('User account is suspended or invalid.', 403, 'ACCOUNT_SUSPENDED');
      }

      if (user && user.lockedUntil && user.lockedUntil > new Date()) {
        throw new AppError('Account is temporarily locked. Try again later.', 403, 'ACCOUNT_LOCKED');
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      // DB offline — trust the JWT payload as a fallback for local demo
    }

    req.user = payload;
    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired authentication token.', 401, 'INVALID_TOKEN'));
    }
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      req.user = TokenService.verifyAccessToken(token);
    } catch {
      // Ignore token failure for optionalAuth
    }
  }
  next();
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return next(new AppError('Insufficient role privileges for this operation.', 403, 'FORBIDDEN'));
    }

    next();
  };
}

export function requirePermission(...permissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    // Admins bypass granular checks if ADMIN role exists
    if (req.user.roles.includes('ADMIN')) {
      return next();
    }

    const hasPermission = permissions.every((p) => req.user?.permissions.includes(p));
    if (!hasPermission) {
      return next(new AppError('Permission denied for this operation.', 403, 'FORBIDDEN'));
    }

    next();
  };
}
