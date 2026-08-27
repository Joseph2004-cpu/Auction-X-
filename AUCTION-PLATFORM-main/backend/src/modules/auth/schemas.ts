import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters.')
      .max(30, 'Username cannot exceed 30 characters.')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores.'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(['BUYER', 'SELLER']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(1, 'Password is required.'),
    totpCode: z.string().optional(),
  }),
});

export const passwordResetRequestSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
  }),
});

export const passwordResetConfirmSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required.'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
  }),
});

export const verifyTotpSchema = z.object({
  body: z.object({
    code: z.string().length(6, 'TOTP code must be 6 digits.'),
  }),
});
