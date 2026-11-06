import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { z } from 'zod';

const categorizeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const prioritySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional().default('General'),
});

const summarizeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const classifyImage = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, message: 'Please upload an image for classification' });
    return;
  }

  const result = await aiService.classifyImage(file.originalname, file.mimetype);
  res.status(200).json({
    success: true,
    data: result,
  });
};

export const categorize = async (req: Request, res: Response): Promise<void> => {
  const { title, description } = categorizeSchema.parse(req.body);
  const result = await aiService.categorizeComplaint(title, description);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const recommendPriority = async (req: Request, res: Response): Promise<void> => {
  const { title, description, category } = prioritySchema.parse(req.body);
  const result = await aiService.recommendPriority(title, description, category);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const summarize = async (req: Request, res: Response): Promise<void> => {
  const { title, description } = summarizeSchema.parse(req.body);
  const result = await aiService.summarizeComplaint(title, description);

  res.status(200).json({
    success: true,
    data: result,
  });
};

