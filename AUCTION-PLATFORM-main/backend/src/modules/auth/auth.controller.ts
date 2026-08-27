import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../middleware/auth';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      res.status(201).json({
        success: true,
        data: result,
        message: 'Registration successful. Please verify your email address.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      if (result.mfaRequired) {
        return res.status(200).json({
          success: true,
          mfaRequired: true,
          userId: result.user?.id,
          message: 'Multi-factor authentication code required.',
        });
      }

      // Set HttpOnly access token cookie (Section 22 of Master Prompt)
      res.cookie('accessToken', result.tokens?.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          tokens: result.tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
      const result = await AuthService.refreshToken(refreshToken);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.userId) {
        await AuthService.logout(req.user.userId, req.cookies.accessToken);
      }
      res.clearCookie('accessToken');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async setupTotp(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.setupTotp(req.user!.userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async enableTotp(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.enableTotp(req.user!.userId, req.body.code);
      res.status(200).json({
        success: true,
        data: result,
        message: '2FA TOTP successfully enabled.',
      });
    } catch (error) {
      next(error);
    }
  }
}
