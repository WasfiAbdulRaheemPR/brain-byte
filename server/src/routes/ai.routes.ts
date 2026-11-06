import { Router } from 'express';
import { classifyImage, categorize, recommendPriority, summarize } from '../controllers/ai.controller';
import { uploadImages } from '../middleware/upload';

const router = Router();

router.post('/classify-image', uploadImages.single('image'), classifyImage);
router.post('/categorize', categorize);
router.post('/recommend-priority', recommendPriority);
router.post('/summarize', summarize);

export default router;

