import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Administrative Triage, Accountability & Analytics Tests', () => {
  let adminToken: string;
  let citizenToken: string;
  const targetComplaintId = 'comp-001';

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@civicconnect.gov', password: 'AdminSecure2026!' });
    adminToken = adminRes.body.data.token;

    const citizenRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'citizen@example.com', password: 'CitizenSecure2026!' });
    citizenToken = citizenRes.body.data.token;
  });

  it('strictly blocks citizens from accessing administrative complaints registry', async () => {
    const res = await request(app)
      .get('/api/admin/complaints')
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('allows administrator to access full complaints registry', async () => {
    const res = await request(app)
      .get('/api/admin/complaints')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.complaints.length).toBeGreaterThan(0);
  });

  it('allows administrator to update status with recorded explanation', async () => {
    const res = await request(app)
      .patch(`/api/admin/complaints/${targetComplaintId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'IN_PROGRESS',
        description: 'Excavation team on-site with asphalt paving vehicles.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.complaint.status).toBe('IN_PROGRESS');
  });

  it('allows administrator to adjust priority level', async () => {
    const res = await request(app)
      .patch(`/api/admin/complaints/${targetComplaintId}/priority`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ priority: 'URGENT' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.complaint.priority).toBe('URGENT');
  });

  it('allows administrator to assign municipal department', async () => {
    const res = await request(app)
      .patch(`/api/admin/complaints/${targetComplaintId}/department`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ departmentId: 'dept-roads' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('allows administrator to record verified resolution', async () => {
    const res = await request(app)
      .post(`/api/admin/complaints/${targetComplaintId}/resolution`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        resolutionDescription:
          'Road excavation completed, base stone compacted, and hot-mix asphalt surface paved smoothly.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns dynamic analytics matching database records for Recharts', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.analytics.metrics).toBeDefined();
    expect(res.body.data.analytics.categoryDistribution.length).toBeGreaterThan(0);
    expect(res.body.data.analytics.statusDistribution.length).toBe(4);
  });

  it('returns geocoded complaints for Leaflet GIS map', async () => {
    const res = await request(app)
      .get('/api/admin/map')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.complaints)).toBe(true);
  });
});

