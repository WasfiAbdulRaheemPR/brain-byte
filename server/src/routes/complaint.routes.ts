import { Router } from 'express';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  trackPublicComplaint,
  getCategories,
  submitFeedback,
} from '../controllers/complaint.controller';
import { authenticate } from '../middleware/auth';
import { uploadImages } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/categories', getCategories);
router.get('/track/:idOrNumber', trackPublicComplaint);

// Protected Citizen routes
router.post('/', authenticate, uploadImages.array('images', 5), createComplaint);
router.get('/my', authenticate, getMyComplaints);
router.get('/:id', authenticate, getComplaintById);
router.post('/:id/feedback', authenticate, submitFeedback);

export default router;
