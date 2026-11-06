import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Authentication & User Management Tests', () => {
  const randomEmail = `citizen_${Date.now()}@example.com`;

  it('registers a new citizen successfully with default CITIZEN role', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Sneha Patel',
        email: randomEmail,
        password: 'Password123!',
        phone: '+91 91234 56789',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(randomEmail);
    expect(res.body.data.user.role).toBe('CITIZEN');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Sneha Patel Duplicate',
        email: randomEmail,
        password: 'Password123!',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('authenticates valid credentials on login and sets HTTP-only cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'citizen@example.com',
        password: 'CitizenSecure2026!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('citizen@example.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects incorrect password with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'citizen@example.com',
        password: 'WrongPassword999!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects unauthenticated requests to protected /api/auth/me', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
