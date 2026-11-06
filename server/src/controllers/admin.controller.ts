import { Response } from 'express';
import { repo } from '../repositories';
import {
  updateStatusSchema,
  updatePrioritySchema,
  assignDepartmentSchema,
  addNoteSchema,
  recordResolutionSchema,
  duplicateReviewSchema,
} from '../validators/admin.validator';
import { AuthenticatedRequest, ComplaintStatus, Priority } from '../types';

export const getAllComplaints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { status, priority, categoryId, departmentId, search, page, limit } = req.query;

  const result = await repo.getAllComplaints({
    status: status as ComplaintStatus | undefined,
    priority: priority as Priority | undefined,
    categoryId: categoryId as string | undefined,
    departmentId: departmentId as string | undefined,
    search: search as string | undefined,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 50,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const getComplaintDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const complaint = await repo.getComplaintById(id);

  if (!complaint) {
    res.status(404).json({ success: false, message: 'Complaint not found' });
    return;
  }

  res.status(200).json({
    success: true,
    data: { complaint },
  });
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const validated = updateStatusSchema.parse(req.body);

  const updated = await repo.updateStatus(id, validated.status, validated.description, req.user.id);

  res.status(200).json({
    success: true,
    message: `Complaint status updated to ${validated.status}`,
    data: { complaint: updated },
  });
};

export const updatePriority = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const validated = updatePrioritySchema.parse(req.body);

  const updated = await repo.updatePriority(id, validated.priority, req.user.id);

  res.status(200).json({
    success: true,
    message: `Priority updated to ${validated.priority}`,
    data: { complaint: updated },
  });
};

export const assignDepartment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const validated = assignDepartmentSchema.parse(req.body);

  const updated = await repo.assignDepartment(id, validated.departmentId, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Department assigned successfully',
    data: { complaint: updated },
  });
};

export const addNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const validated = addNoteSchema.parse(req.body);

  const complaint = await repo.getComplaintById(id);
  if (!complaint) {
    res.status(404).json({ success: false, message: 'Complaint not found' });
    return;
  }

  // Update status history with note
  await repo.updateStatus(id, complaint.status, validated.note, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Administrative note attached to complaint audit trail.',
  });
};

export const recordResolution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const validated = recordResolutionSchema.parse(req.body);

  const files = (req.files as Express.Multer.File[]) || [];
  const images = files.map((f) => ({
    storageKey: f.filename,
    fileName: f.originalname,
  }));

  const resolution = await repo.recordResolution(
    id,
    validated.resolutionDescription,
    req.user.id,
    images
  );

  res.status(200).json({
    success: true,
    message: 'Resolution record confirmed and filed. Complaint marked as Resolved.',
    data: { resolution },
  });
};

export const getDuplicates = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const duplicates = await repo.getDuplicateSuggestions();
  res.status(200).json({
    success: true,
    data: { duplicates },
  });
};

export const reviewDuplicate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const validated = duplicateReviewSchema.parse(req.body);

  const updated = await repo.reviewDuplicate(id, validated.reviewStatus, req.user.id);

  res.status(200).json({
    success: true,
    message: `Duplicate suggestion reviewed as ${validated.reviewStatus}`,
    data: { duplicateSuggestion: updated },
  });
};

export const getAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const analytics = await repo.getAnalytics();
  res.status(200).json({
    success: true,
    data: { analytics },
  });
};

export const getMapComplaints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await repo.getAllComplaints({ limit: 500 });
  const mapped = result.complaints.filter((c) => c.latitude !== null && c.longitude !== null);

  res.status(200).json({
    success: true,
    data: { complaints: mapped },
  });
};

export const getDepartments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const departments = await repo.getDepartments();
  res.status(200).json({
    success: true,
    data: { departments },
  });
};

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
  const auditLogs = await repo.getAuditLogs(limit);
  res.status(200).json({
    success: true,
    data: { auditLogs },
  });
};
