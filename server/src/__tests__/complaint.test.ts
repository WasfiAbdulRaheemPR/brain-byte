import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Complaint Submission & Public Tracking Workflows', () => {
  let citizenToken: string;
  let adminToken: string;
  let testComplaintId: string;

  beforeAll(async () => {
    // Login citizen
    const citizenRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'citizen@example.com', password: 'CitizenSecure2026!' });
    citizenToken = citizenRes.body.data.token;

    // Login admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@civicconnect.gov', password: 'AdminSecure2026!' });
    adminToken = adminRes.body.data.token;
  });

  it('retrieves pre-seeded public categories', async () => {
    const res = await request(app).get('/api/complaints/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.categories.length).toBeGreaterThanOrEqual(5);
  });

  it('allows citizen to submit a new complaint with unique ID (CC-2026-XXXXXX)', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        title: 'Broken Stormwater Canal Grill near Main Market',
        description:
          'Iron mesh covering stormwater drain is dislodged and presents direct puncture hazard for motor vehicles.',
        categoryId: 'cat-roads',
        latitude: 12.975,
        longitude: 77.601,
        address: 'MG Road, Indiranagar Ward, Bengaluru',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.complaint.complaintNumber).toMatch(/^CC-\d{4}-\d{6}$/);
    expect(res.body.data.complaint.status).toBe('SUBMITTED');
    testComplaintId = res.body.data.complaint.id;
  });

  it('allows public tracking by Complaint Number without exposing citizen PII', async () => {
    const res = await request(app).get('/api/complaints/track/CC-2026-000001');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.complaint.complaintNumber).toBe('CC-2026-000001');
    expect(res.body.data.complaint.user).toBeUndefined(); // PII sanitized
  });

  it('retrieves citizen personal complaints', async () => {
    const res = await request(app)
      .get('/api/complaints/my')
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.complaints)).toBe(true);
  });

  it('prevents non-resolved complaints from receiving feedback', async () => {
    const res = await request(app)
      .post(`/api/complaints/${testComplaintId}/feedback`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        rating: 5,
        comments: 'Premature feedback test',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

