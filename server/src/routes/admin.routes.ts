import { Router } from 'express';
import {
  getAllComplaints,
  getComplaintDetails,
  updateStatus,
  updatePriority,
  assignDepartment,
  addNote,
  recordResolution,
  getDuplicates,
  reviewDuplicate,
  getAnalytics,
  getMapComplaints,
  getDepartments,
  getAuditLogs,
} from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { uploadImages } from '../middleware/upload';

const router = Router();

// All administrative routes require authenticated ADMIN role
router.use(authenticate, requireRole(['ADMIN']));

router.get('/complaints', getAllComplaints);
router.get('/complaints/:id', getComplaintDetails);
router.patch('/complaints/:id/status', updateStatus);
router.patch('/complaints/:id/priority', updatePriority);
router.patch('/complaints/:id/department', assignDepartment);
router.post('/complaints/:id/notes', addNote);
router.post('/complaints/:id/resolution', uploadImages.array('resolutionImages', 3), recordResolution);

router.get('/analytics', getAnalytics);
router.get('/map', getMapComplaints);
router.get('/departments', getDepartments);
router.get('/duplicates', getDuplicates);
router.patch('/duplicates/:id/review', reviewDuplicate);
router.get('/audit-logs', getAuditLogs);

export default router;
