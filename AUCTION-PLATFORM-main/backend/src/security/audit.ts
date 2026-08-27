import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface AuditLogOptions {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export async function recordAuditLog(options: AuditLogOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId || null,
        action: options.action,
        resource: options.resource,
        resourceId: options.resourceId || null,
        requestId: options.requestId || null,
        ipAddress: options.ipAddress || null,
        userAgent: options.userAgent || null,
        details: options.details ? options.details : undefined,
      },
    });
    logger.info(`[AUDIT LOG] ${options.action} on ${options.resource}`, {
      userId: options.userId,
      resourceId: options.resourceId,
    });
  } catch (error: any) {
    logger.error('Failed to record audit log', { error: error.message, options });
  }
}
