import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('error', (e) => {
  // Suppress noisy offline-DB errors in local dev; services fall back to mock data.
});

prisma.$on('warn', (e) => {
  // Suppress noisy warnings
});
