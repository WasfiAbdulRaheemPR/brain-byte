import { z } from 'zod';

export const createComplaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(150),
  description: z.string().min(15, 'Description must be at least 15 characters long').max(2000),
  categoryId: z.string().min(1, 'Please select an issue category'),
  latitude: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((val) => (val ? parseFloat(val.toString()) : null)),
  longitude: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((val) => (val ? parseFloat(val.toString()) : null)),
  address: z.string().max(255).optional().nullable(),
});

export const feedbackSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5),
  comments: z.string().max(1000).optional().nullable(),
});
