import request from 'supertest';
import { app } from '../index';

describe('Auth & User Registration/Login E2E API Suite', () => {
  const testEmail = `user_${Date.now()}@auctionx.com`;
  const testUsername = `user_${Date.now()}`;
  const testPassword = 'P@ssw0rd!Secure2026';

  it('should register a new user successfully (POST /api/v1/auth/register)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        username: testUsername,
        password: testPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'BUYER',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testEmail.toLowerCase());
    expect(res.body.data.username).toBe(testUsername);
    expect(res.body.data.role).toBe('BUYER');
  });

  it('should reject registration with an existing email (POST /api/v1/auth/register)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        username: `different_${Date.now()}`,
        password: testPassword,
        role: 'BUYER',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should log in successfully with valid credentials (POST /api/v1/auth/login)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail.toLowerCase());
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it('should reject login with wrong password (POST /api/v1/auth/login)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should fetch user profile with valid Bearer token (GET /api/v1/users/me)', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    const token = loginRes.body.data.tokens.accessToken;

    const profileRes = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.success).toBe(true);
    expect(profileRes.body.data.email).toBe(testEmail.toLowerCase());
  });

  it('should reject profile request without token (GET /api/v1/users/me)', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });
});
