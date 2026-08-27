import Redis from 'ioredis';
import { config } from './index';
import { logger } from './logger';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  lazyConnect: true,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    logger.warn(`Redis reconnecting attempt ${times}, delaying ${delay}ms`);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Connected to Redis server successfully');
});

redis.on('error', (err) => {
  logger.error('Redis Client Error', { error: err.message });
});
