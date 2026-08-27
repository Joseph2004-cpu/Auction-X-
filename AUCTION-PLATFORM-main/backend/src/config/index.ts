import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:4000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/auction_db?schema=public',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecret_auction_jwt_token_key_change_in_production_32chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'supersecret_auction_refresh_token_key_change_in_prod',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  cookieSecret: process.env.COOKIE_SECRET || 'supersecret_cookie_signing_key_for_session_management',
  payment: {
    provider: process.env.PAYMENT_PROVIDER || 'MOCK',
    secretKey: process.env.PAYMENT_SECRET_KEY || 'sk_test_mock_secret',
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_mock_secret',
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    dir: path.join(__dirname, '../../uploads'),
  },
  email: {
    from: process.env.EMAIL_FROM || '"AuctionX Platform" <noreply@auctionx.com>',
  },
};
