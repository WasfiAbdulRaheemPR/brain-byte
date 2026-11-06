import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { repo } from '../repositories';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { AuthenticatedRequest, UserPayload } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  const validated = registerSchema.parse(req.body);

  const existing = await repo.findUserByEmail(validated.email);
  if (existing) {
    res.status(409).json({
      success: false,
      message: 'An account with this email address is already registered.',
    });
    return;
  }

  const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(validated.password, salt);

  const newUser = await repo.createUser({
    fullName: validated.fullName,
    email: validated.email,
    phone: validated.phone,
    passwordHash,
    role: 'CITIZEN', // Always default to CITIZEN for public registration
  });

  const payload: UserPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    fullName: newUser.fullName,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

  // Set HTTP-only secure cookie
  res.cookie('civic_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'Citizen account registered successfully.',
    data: {
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      token,
    },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const validated = loginSchema.parse(req.body);

  const user = await repo.findUserByEmail(validated.email);
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(validated.password, user.passwordHash);
  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
    return;
  }

  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

  // Set HTTP-only secure cookie
  res.cookie('civic_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Authentication successful.',
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('civic_token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Signed out successfully.',
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const user = await repo.findUserById(req.user.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User profile not found.' });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
  });
};
