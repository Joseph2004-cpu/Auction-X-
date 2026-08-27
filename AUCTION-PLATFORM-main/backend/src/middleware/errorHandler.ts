import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 400, code: string = 'BAD_REQUEST', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = (req as any).requestId || 'N/A';
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  logger.error(`API Error: ${err.message}`, {
    requestId,
    statusCode,
    errorCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Never expose raw database or internal stack trace errors to client (Section 26 of Master Prompt)
  const clientMessage =
    statusCode === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: clientMessage,
      details: err.details || undefined,
    },
    requestId,
  });
}
