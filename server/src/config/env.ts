import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from root or server directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/civicconnect?schema=public'),
  JWT_SECRET: z.string().default('civicconnect_super_secret_jwt_key_2026_production_grade'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('civicconnect_cookie_secret_key_99218274910247'),
  BCRYPT_SALT_ROUNDS: z.string().transform((val) => parseInt(val, 10)).default('10'),
  UPLOAD_DIRECTORY: z.string().default('uploads'),
  MAX_FILE_SIZE_MB: z.string().transform((val) => parseInt(val, 10)).default('5'),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,image/jpg'),
  AI_PROVIDER: z.enum(['local', 'gemini', 'openai']).default('local'),
  AI_API_KEY: z.string().optional().default(''),
  AI_MODEL: z.string().default('gemini-1.5-flash'),
  ADMIN_DEFAULT_EMAIL: z.string().email().default('admin@civicconnect.gov'),
  ADMIN_DEFAULT_PASSWORD: z.string().default('AdminSecure2026!'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Environment variable configuration error:', parsedEnv.error.format());
}

export const env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});

