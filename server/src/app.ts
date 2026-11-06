import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import complaintRoutes from './routes/complaint.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';

export const createApp = (): Express => {
  const app = express();

  // Security Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allow client maps and fonts
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Request Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // Rate Limiting on API endpoints
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Reasonable request cap
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please slow down.' },
  });
  app.use('/api', limiter);

  // Serve static uploaded images
  const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIRECTORY);
  app.use('/uploads', express.static(uploadDir));

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      platform: 'CivicConnect PS-14',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
