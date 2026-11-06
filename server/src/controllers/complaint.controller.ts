import { Response } from 'express';
import { repo } from '../repositories';
import { aiService } from '../services/ai.service';
import { createComplaintSchema, feedbackSchema } from '../validators/complaint.validator';
import { AuthenticatedRequest } from '../types';

export const createComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  // Parse and validate fields
  const validated = createComplaintSchema.parse(req.body);

  // Process uploaded files if any
  const files = (req.files as Express.Multer.File[]) || [];
  const images = files.map((f) => ({
    storageKey: f.filename,
    fileName: f.originalname,
    mimeType: f.mimetype,
    fileSize: f.size,
  }));

  // Run AI Priority Recommendation (non-blocking)
  let recommendedPriority = undefined;
  try {
    const aiPriority = await aiService.recommendPriority(
      validated.title,
      validated.description,
      validated.categoryId
    );
    recommendedPriority = aiPriority.suggestedPriority;
  } catch (err) {
    // Non-blocking fallback
  }

  // Persist complaint
  const complaint = await repo.createComplaint({
    userId: req.user.id,
    categoryId: validated.categoryId,
    title: validated.title,
    description: validated.description,
    latitude: validated.latitude,
    longitude: validated.longitude,
    address: validated.address,
    priority: recommendedPriority || 'MEDIUM',
    images,
  });

  // Run AI duplicate detection against existing complaints in the background
  try {
    const existing = await repo.getAllComplaints({ limit: 200 });
    const otherComplaints = existing.complaints.filter((c) => c.id !== complaint?.id);

    const matches = aiService.detectDuplicates(
      {
        title: validated.title,
        description: validated.description,
        categoryId: validated.categoryId,
        latitude: validated.latitude,
        longitude: validated.longitude,
      },
      otherComplaints
    );

    // Save top duplicate suggestions for administrator review
    for (const match of matches.slice(0, 3)) {
      if (complaint) {
        await repo.createDuplicateSuggestion(
          complaint.id,
          match.candidateId,
          match.similarityScore,
          match.matchReasons.join('; ')
        );
      }
    }
  } catch (err) {
    // Non-blocking
  }

  res.status(201).json({
    success: true,
    message: 'Complaint submitted successfully and logged in municipal registry.',
    data: { complaint },
  });
};

export const getMyComplaints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const complaints = await repo.getComplaintsByUser(req.user.id);

  res.status(200).json({
    success: true,
    data: { complaints },
  });
};

export const getComplaintById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const { id } = req.params;
  const complaint = await repo.getComplaintById(id);

  if (!complaint) {
    res.status(404).json({ success: false, message: 'Complaint record not found.' });
    return;
  }

  // Citizens can only view their own complaint unless they are an Administrator
  if (req.user.role === 'CITIZEN' && complaint.userId !== req.user.id) {
    res.status(403).json({
      success: false,
      message: 'Access denied: You do not have permission to view other citizens’ complaints.',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { complaint },
  });
};

export const trackPublicComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { idOrNumber } = req.params;
  const complaint = await repo.getComplaintById(idOrNumber);

  if (!complaint) {
    res.status(404).json({
      success: false,
      message: `No complaint found with tracking identifier: ${idOrNumber}`,
    });
    return;
  }

  // Sanitize personal identity for public tracking
  const sanitized = {
    ...complaint,
    user: undefined, // Hide citizen PII
  };

  res.status(200).json({
    success: true,
    data: { complaint: sanitized },
  });
};

export const getCategories = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const categories = await repo.getCategories();
  res.status(200).json({
    success: true,
    data: { categories },
  });
};

export const submitFeedback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const { id } = req.params;
  const validated = feedbackSchema.parse(req.body);

  const complaint = await repo.getComplaintById(id);
  if (!complaint) {
    res.status(404).json({ success: false, message: 'Complaint not found.' });
    return;
  }

  if (complaint.userId !== req.user.id) {
    res.status(403).json({ success: false, message: 'Only the reporting citizen can submit feedback.' });
    return;
  }

  if (complaint.status !== 'RESOLVED') {
    res.status(400).json({
      success: false,
      message: 'Feedback can only be submitted once the complaint is verified as Resolved.',
    });
    return;
  }

  const feedback = await repo.submitFeedback(id, req.user.id, validated.rating, validated.comments);

  res.status(201).json({
    success: true,
    message: 'Thank you for your feedback! It helps improve public municipal services.',
    data: { feedback },
  });
};

