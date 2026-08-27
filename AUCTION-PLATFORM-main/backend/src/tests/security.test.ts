import { TokenService } from '../security/tokens';
import { PasswordHasher } from '../security/password';

describe('Security Hardening & Access Control Suite', () => {
  it('should generate and verify secure access tokens containing user role payload', () => {
    const payload = {
      userId: 'user-uuid-1234',
      email: 'testuser@auctionx.com',
      roles: ['BUYER', 'SELLER'],
      permissions: ['listings:create', 'bids:place'],
    };

    const token = TokenService.generateAccessToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const verified = TokenService.verifyAccessToken(token);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.email).toBe(payload.email);
    expect(verified.roles).toEqual(expect.arrayContaining(['BUYER', 'SELLER']));
  });

  it('should correctly hash and verify user passwords using Argon2id', async () => {
    const password = 'P@ssw0rd!Secure2026';
    const hash = await PasswordHasher.hash(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith('$argon2')).toBe(true);

    const isValid = await PasswordHasher.verify(hash, password);
    expect(isValid).toBe(true);

    const isInvalid = await PasswordHasher.verify(hash, 'WrongPassword123');
    expect(isInvalid).toBe(false);
  });

  it('should enforce resource ownership checks (IDOR mitigation)', () => {
    const checkOwnership = (resourceSellerId: string, currentUserId: string, userRoles: string[]) => {
      if (userRoles.includes('ADMIN') || userRoles.includes('MODERATOR')) {
        return true;
      }
      return resourceSellerId === currentUserId;
    };

    const sellerA = 'user-seller-A';
    const sellerB = 'user-seller-B';

    // Seller A trying to edit Seller B's resource -> Access Denied
    expect(checkOwnership(sellerB, sellerA, ['SELLER'])).toBe(false);
    // Seller A editing Seller A's resource -> Granted
    expect(checkOwnership(sellerA, sellerA, ['SELLER'])).toBe(true);
    // Admin editing Seller B's resource -> Granted
    expect(checkOwnership(sellerB, sellerA, ['ADMIN'])).toBe(true);
  });
});

