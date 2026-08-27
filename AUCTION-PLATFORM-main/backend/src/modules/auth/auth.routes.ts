import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  verifyTotpSchema,
} from './schemas';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', requireAuth, AuthController.logout);

router.post('/mfa/setup', requireAuth, AuthController.setupTotp);
router.post('/mfa/enable', requireAuth, validateRequest(verifyTotpSchema), AuthController.enableTotp);

export default router;
