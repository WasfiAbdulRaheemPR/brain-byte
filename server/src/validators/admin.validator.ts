import { z } from 'zod';

export const updateStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED']),
  description: z.string().min(5, 'Please provide an administrative note detailing this status change').max(500),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});

export const assignDepartmentSchema = z.object({
  departmentId: z.string().min(1, 'Department ID is required'),
});

export const addNoteSchema = z.object({
  note: z.string().min(3, 'Administrative note must be at least 3 characters').max(1000),
});

export const recordResolutionSchema = z.object({
  resolutionDescription: z.string().min(10, 'Resolution details must be at least 10 characters').max(2000),
});

export const duplicateReviewSchema = z.object({
  reviewStatus: z.enum(['CONFIRMED_DUPLICATE', 'NOT_A_DUPLICATE']),
});

