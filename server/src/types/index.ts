import { Request } from 'express';

export type Role = 'CITIZEN' | 'ADMIN';
export type ComplaintStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type DuplicateReviewStatus = 'PENDING' | 'CONFIRMED_DUPLICATE' | 'NOT_A_DUPLICATE';

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
  fullName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

