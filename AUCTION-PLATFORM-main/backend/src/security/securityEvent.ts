import { SecurityEventSeverity } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface SecurityEventOptions {
  userId?: string | null;
  eventType: string;
  severity: SecurityEventSeverity;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function recordSecurityEvent(options: SecurityEventOptions): Promise<void> {
  try {
    await prisma.securityEvent.create({
      data: {
        userId: options.userId || null,
        eventType: options.eventType,
        severity: options.severity,
        details: options.details ? options.details : undefined,
        ipAddress: options.ipAddress || null,
        userAgent: options.userAgent || null,
      },
    });

    if (options.userId && (options.severity === 'HIGH' || options.severity === 'CRITICAL')) {
      const deltaRisk = options.severity === 'CRITICAL' ? 25 : 10;
      await prisma.user.update({
        where: { id: options.userId },
        data: { riskScore: { increment: deltaRisk } },
      });
    }

    logger.warn(`[SECURITY EVENT] [${options.severity}] ${options.eventType}`, {
      userId: options.userId,
      ipAddress: options.ipAddress,
    });
  } catch (error: any) {
    logger.error('Failed to record security event', { error: error.message, options });
  }
}
