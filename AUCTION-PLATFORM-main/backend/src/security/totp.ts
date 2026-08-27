import * as OTPAuth from 'otpauth';
import crypto from 'crypto';

export class TotpService {
  public static generateSecret(userEmail: string): { secret: string; otpauthUrl: string } {
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: 'AuctionX Platform',
      label: userEmail,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    return {
      secret: secret.base32,
      otpauthUrl: totp.toString(),
    };
  }

  public static verifyToken(secretBase32: string, token: string): boolean {
    const totp = new OTPAuth.TOTP({
      issuer: 'AuctionX Platform',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secretBase32),
    });

    const delta = totp.validate({ token, window: 1 });
    return delta !== null;
  }

  public static generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }
}
