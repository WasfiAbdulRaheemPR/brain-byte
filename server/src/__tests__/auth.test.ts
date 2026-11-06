import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Authentication & User Management Tests', () => {
  const randomEmail = `citizen_${Date.now()}@example.com`;
  let citizenToken = '';
  let adminToken = '';

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
    // Verifies both top-level and nested response shape
    expect(res.body.data.user.email).toBe(randomEmail);
    expect(res.body.data.user.role).toBe('CITIZEN');
    expect(res.body.user.email).toBe(randomEmail);
    expect(res.body.user.role).toBe('CITIZEN');
    expect(res.body.token).toBeDefined();
    expect(res.body.data.token).toBeDefined();
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

  it('authenticates citizen credentials on login and sets HTTP-only cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'citizen@example.com',
        password: 'CitizenSecure2026!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('citizen@example.com');
    expect(res.body.user.email).toBe('citizen@example.com');
    expect(res.body.user.role).toBe('CITIZEN');
    expect(res.body.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
    citizenToken = res.body.token;
  });

  it('supports case-insensitive email login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'CITIZEN@EXAMPLE.COM',
        password: 'CitizenSecure2026!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('authenticates admin credentials with role ADMIN', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@civicconnect.gov',
        password: 'AdminSecure2026!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('ADMIN');
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
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

  it('verifies session via /api/auth/me using Bearer token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('ADMIN');
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(res.body.user.email).toBe('admin@civicconnect.gov');
  });

  it('enforces RBAC: prevents citizen from accessing admin endpoints (403 Forbidden)', async () => {
    const res = await request(app)
      .get('/api/admin/complaints')
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('enforces RBAC: allows admin access to admin endpoints (200 OK)', async () => {
    const res = await request(app)
      .get('/api/admin/complaints')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('clears session on logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
